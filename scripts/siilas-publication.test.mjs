import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { applySiilasPublication } from './lib/siilas-publication.mjs'
import { renderSiilasSummary } from './lib/siilas-article-summary.mjs'

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const sourceFilesSha256 = { 'src/data/airports.json': hash('source version') }
const imageHash = (path) => hash(`accepted image: ${path}`)
const sample = (overrides = {}) => ({
  id: 'recent-hk', testedAt: '2026-10-08', time: '21:00', node: '香港',
  downloadMbps: 100, uploadMbps: 30, latencyMs: 40,
  chatgpt: '流畅', streaming: '流畅', client: null, measurementTool: 'Speedtest Desktop',
  resultUrl: 'https://www.speedtest.net/result/123', evidenceImage: '/evidence/speedtest.png',
  ...overrides,
})
const airport = (slug, records) => ({
  slug, name: slug, sourcePage: `https://yp7.net/posts/${slug}/`, sourceUrl: `https://siilas.com/airport/${slug}/`,
  score: 6, verifiedTestCount: records.length, testDateCount: new Set(records.map((record) => record.testedAt)).size,
  latestTestAt: records.map((record) => record.testedAt).sort().at(-1), tests: records,
  latestRegionTests: records.map((record) => ({ region: record.node, test: record })),
})
const accept = (airports, previous, options = {}) => {
  const received = applySiilasPublication(airports, previous, { evidenceSha256: imageHash, sourceFilesSha256, ...options })
  return {
    schemaVersion: 2, receivedAt: '2026-10-09',
    source: { ...received, origin: 'https://siilas.com', methodologyUrl: 'https://siilas.com/methodology/', sourceFilesSha256: options.sourceFilesSha256 ?? sourceFilesSha256 },
    methodology: { minimumDaysPerRegion: 3 }, airports: received.airports,
  }
}
const recordStatus = (snapshot, slug, id) => snapshot.airports.find((item) => item.slug === slug)
  .tests.find((record) => record.id === id).publication.status

test('unknown first receipt marks every record and every image pending', () => {
  const record = sample({ evidenceImages: [{ label: 'ChatGPT 状态截图', path: '/evidence/chatgpt.png' }] })
  const accepted = accept([airport('a', [record])])
  const tracked = accepted.airports[0].tests[0]
  assert.equal(tracked.publication.status, 'pending')
  assert.equal(accepted.source.publicationStatus, 'local-unpublished')
  assert.deepEqual(tracked.evidenceUrls, ['https://siilas.com/evidence/speedtest.png', 'https://siilas.com/evidence/chatgpt.png'])
  assert.deepEqual(tracked.publication.evidenceVersions.map((image) => [image.label, image.status]),
    [['测速截图', 'pending'], ['ChatGPT 状态截图', 'pending']])
  const article = renderSiilasSummary(accepted.airports[0], accepted)
  assert.ok(article.includes('[ChatGPT 状态截图（待发布）](https://siilas.com/evidence/chatgpt.png)'))
  assert.ok(article.includes('2026-10-08 21:00（待发布）'))
  assert.ok(article.includes('代理客户端：未记录；测速工具：Speedtest Desktop'))
})

test('a historical backfill after publication is pending despite a newer existing sample', () => {
  const initial = [airport('a', [sample()])]
  const published = accept(initial, undefined, { sourcePublished: true })
  const backfill = sample({ id: 'older-sg', testedAt: '2026-07-01', node: '新加坡', evidenceImage: '/evidence/older.png' })
  const received = accept([airport('a', [sample(), backfill])], published)
  assert.equal(recordStatus(received, 'a', 'recent-hk'), 'published')
  assert.equal(recordStatus(received, 'a', 'older-sg'), 'pending')
  assert.equal(received.source.publicationStatus, 'local-unpublished')
  const article = renderSiilasSummary(received.airports[0], received)
  assert.ok(article.includes('2026-07-01 21:00（待发布）'))
  assert.ok(article.includes('[测速截图（待发布）](https://siilas.com/evidence/older.png)'))
  assert.ok(article.includes('[测速截图](https://siilas.com/evidence/speedtest.png)'))
})

test('older supplementary application evidence remains linked with its own date and meaning', () => {
  const current = sample()
  const older = sample({ id: 'older-application', testedAt: '2026-07-01', evidenceImage: undefined,
    evidenceImages: [{ label: 'ChatGPT 状态截图', path: '/evidence/older-chatgpt.png' }] })
  const input = airport('a', [current, older])
  input.latestRegionTests = [{ region: '香港', test: current }]
  const accepted = accept([input])
  const article = renderSiilasSummary(accepted.airports[0], accepted)
  assert.ok(article.includes('附加应用证据保留原采样日期，不作为测速截图'))
  assert.ok(article.includes('- 2026-07-01 21:00 香港：[ChatGPT 状态截图（待发布）](https://siilas.com/evidence/older-chatgpt.png)'))
})

test('changing a record with the same ID, or the bytes at the same image URL, creates a pending version', () => {
  const published = accept([airport('a', [sample()])], undefined, { sourcePublished: true })
  const corrected = accept([airport('a', [sample({ downloadMbps: 90 })])], published)
  assert.equal(recordStatus(corrected, 'a', 'recent-hk'), 'pending')
  assert.notEqual(corrected.airports[0].tests[0].publication.versionSha256, published.airports[0].tests[0].publication.versionSha256)
  const replacedImage = accept([airport('a', [sample()])], published, { evidenceSha256: (path) => hash(`replacement image: ${path}`) })
  assert.equal(recordStatus(replacedImage, 'a', 'recent-hk'), 'pending')
  assert.equal(replacedImage.airports[0].tests[0].publication.evidenceVersions[0].status, 'pending')
})

test('the same record ID in another airport cannot inherit its publication state', () => {
  const published = accept([airport('a', [sample()])], undefined, { sourcePublished: true })
  const received = accept([airport('a', [sample()]), airport('b', [sample()])], published)
  assert.equal(recordStatus(received, 'a', 'recent-hk'), 'published')
  assert.equal(recordStatus(received, 'b', 'recent-hk'), 'pending')
  assert.deepEqual(received.source.pendingRecords.map(({ airportSlug, recordId }) => [airportSlug, recordId]), [['b', 'recent-hk']])
})

test('repeated receipts preserve pending versions and only an explicit publication assertion clears them', () => {
  const raw = [airport('a', [sample()])]
  const first = accept(raw)
  assert.deepEqual(accept(raw, first), first)
  assert.deepEqual(accept(raw, accept(raw, first)), first)
  const published = accept(raw, first, { sourcePublished: true })
  assert.equal(recordStatus(published, 'a', 'recent-hk'), 'published')
  assert.deepEqual(accept(raw, published), published)
  const changedRules = accept(raw, published, { sourceFilesSha256: { 'src/data/airports.json': hash('new source rule') } })
  assert.equal(changedRules.source.publicationStatus, 'local-unpublished')
  assert.equal(recordStatus(changedRules, 'a', 'recent-hk'), 'published')
})

test('legacy date migration retains all 17 pending samples and does not trust unknown image versions', () => {
  const pending = Array.from({ length: 17 }, (_, index) => sample({ id: `oct8-${index}`, evidenceImage: undefined }))
  const old = sample({ id: 'known-old', testedAt: '2026-08-01', evidenceImage: undefined })
  const unknownImage = sample({ id: 'old-image', testedAt: '2026-08-01' })
  const raw = [airport('a', [...pending, old, unknownImage])]
  const legacy = { source: { publicationStatus: 'local-unpublished', unpublishedTestDates: ['2026-10-08'] }, airports: raw }
  const migrated = accept(raw, legacy)
  for (const record of pending) assert.equal(recordStatus(migrated, 'a', record.id), 'pending')
  assert.equal(recordStatus(migrated, 'a', old.id), 'published')
  assert.equal(recordStatus(migrated, 'a', unknownImage.id), 'pending')
  assert.deepEqual(accept(raw, migrated), migrated)
})

test('duplicate airport/record identities and missing evidence hashes are rejected', () => {
  assert.throws(() => accept([airport('a', [sample(), sample()])]), /重复/)
  assert.throws(() => accept([airport('a', [sample()])], undefined, { evidenceSha256: () => null }), /无法记录证据版本/)
})

test('the receipt CLI handles published historical additions and repeated --check without mutating files', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'yp7-publication-cli-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const projectDir = join(dir, 'yp7')
  const sourceDir = join(dir, 'siilas')
  const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  for (const target of ['scripts/lib', 'docs/.vuepress/config', 'docs/机场评测', 'docs/机场推荐', 'docs/机场榜单']) mkdirSync(join(projectDir, target), { recursive: true })
  for (const target of ['src/data', 'public/evidence']) mkdirSync(join(sourceDir, target), { recursive: true })
  symlinkSync(join(repoDir, 'node_modules'), join(projectDir, 'node_modules'), 'dir')
  for (const script of ['sync-siilas-tests.mjs', 'lib/siilas-publication.mjs', 'lib/siilas-article-summary.mjs', 'lib/siilas-collection-summary.mjs', 'lib/load-config.mjs']) {
    copyFileSync(join(repoDir, 'scripts', script), join(projectDir, 'scripts', script))
  }
  writeFileSync(join(sourceDir, 'package.json'), '{"type":"module"}')
  writeFileSync(join(sourceDir, 'src/data/airport-data.ts'), 'import data from "./airports.json"; export const airports = data.airports; export const MIN_RANKING_REGION_DAYS = 3;')
  writeFileSync(join(sourceDir, 'src/data/test-record-presentation.ts'), 'export const getLatestRegionTests = (tests) => tests.map(test => ({region:test.node,test})); export const getLatestExperienceSummary = () => "fixture";')
  writeFileSync(join(projectDir, 'docs/.vuepress/config/airports.ts'), "export const airportDataLastModified = '2026-10-07'\n")
  writeFileSync(join(projectDir, 'docs/机场评测/a.md'), '---\npermalink: /posts/a/\ndateModified: 2026/10/07\n---\n\n## 官网\n')
  const collections = {
    mainRecommendation: { pagePath: '/posts/jichang-tuijian/', sourceFile: 'docs/机场推荐/机场推荐.md', heading: '## 2026机场推荐对比' },
    chatgpt: { pagePath: '/rankings/chatgpt/', sourceFile: 'docs/机场榜单/ChatGPT机场榜.md', heading: '## ChatGPT机场候选' },
    streaming: { pagePath: '/rankings/streaming/', sourceFile: 'docs/机场榜单/流媒体机场榜.md', heading: '## 流媒体机场候选' },
  }
  for (const collection of Object.values(collections)) collection.items = [{ name: 'a', path: '/posts/a/' }]
  writeFileSync(join(projectDir, 'docs/.vuepress/config/airport-collections.ts'), `export const airportCollections = ${JSON.stringify(collections)}\n`)
  for (const [key, collection] of Object.entries(collections)) {
    const header = key === 'mainRecommendation'
      ? '| 机场 | 适用场景 | 套餐与试用 | 客户端与限制 | 测试依据 |'
      : `| 机场 | 价格 | 流量 | ${key === 'chatgpt' ? '客户端 | ChatGPT观察' : '订阅/客户端 | 视频观察'} | 风险提示 |`
    const row = key === 'mainRecommendation'
      ? '| [a](#a) | fixture | 10元/月，100GB/月 | 通用订阅 | 待接收 |'
      : '| [a](/posts/a/) | 10元/月 | 100GB/月 | 通用订阅 | 待接收 | fixture |'
    writeFileSync(join(projectDir, collection.sourceFile), [
      '---', `permalink: ${collection.pagePath}`, 'dateModified: 2026/10/07', '---', '',
      '<!-- siilas-page-updated:start -->', '待接收', '<!-- siilas-page-updated:end -->', '',
      collection.heading, '', header,
      key === 'mainRecommendation' ? '| --- | --- | --- | --- | --- |' : '| --- | --- | --- | --- | --- | --- |', row, '',
      '<!-- siilas-collection-evidence:start -->', '待接收', '<!-- siilas-collection-evidence:end -->', '',
      ...(key === 'mainRecommendation' ? ['<!-- siilas-score-comparison:start -->', '待接收', '<!-- siilas-score-comparison:end -->', ''] : []),
    ].join('\n'))
  }
  writeFileSync(join(sourceDir, 'public/evidence/speedtest.png'), 'original screenshot bytes')
  const writeSource = (records) => writeFileSync(join(sourceDir, 'src/data/airports.json'), JSON.stringify({ airports: [airport('a', records)] }))
  const run = (...args) => {
    const result = spawnSync(process.execPath, [join(projectDir, 'scripts/sync-siilas-tests.mjs'), ...args],
      { cwd: projectDir, env: { ...process.env, SIILAS_PROJECT_DIR: sourceDir }, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
  }
  const snapshotPath = join(projectDir, 'docs/.vuepress/config/data/siilas-tests.json')
  const sourceSnapshot = () => JSON.parse(readFileSync(snapshotPath, 'utf8'))
  writeSource([sample()])
  run()
  run('--source-published')
  assert.equal(sourceSnapshot().source.publicationStatus, 'published')
  const historical = sample({ id: 'historical-sg', testedAt: '2026-07-01', node: '新加坡',
    evidenceImages: [{ label: 'ChatGPT 状态截图', path: '/evidence/chatgpt.png' }] })
  writeFileSync(join(sourceDir, 'public/evidence/chatgpt.png'), 'chatgpt screenshot bytes')
  writeSource([sample(), historical])
  run()
  const pending = sourceSnapshot()
  assert.equal(recordStatus(pending, 'a', 'recent-hk'), 'published')
  assert.equal(recordStatus(pending, 'a', 'historical-sg'), 'pending')
  const files = [snapshotPath, join(projectDir, 'docs/机场评测/a.md'), join(projectDir, 'docs/.vuepress/config/airports.ts'),
    ...Object.values(collections).map((collection) => join(projectDir, collection.sourceFile))]
  const before = files.map((path) => readFileSync(path, 'utf8'))
  run('--check')
  run('--check')
  assert.deepEqual(files.map((path) => readFileSync(path, 'utf8')), before)
  assert.ok(before[1].includes('[ChatGPT 状态截图（待发布）](https://siilas.com/evidence/chatgpt.png)'))
  for (const markdown of before.slice(3)) {
    assert.ok(markdown.includes('2026-07-01'), 'historical regional date must reach collection pages')
    assert.ok(markdown.includes('待发布'), 'pending record status must reach collection pages')
  }
  for (const markdown of before.slice(4)) assert.ok(markdown.includes('[ChatGPT 状态截图（待发布）](https://siilas.com/evidence/chatgpt.png)'))
})
