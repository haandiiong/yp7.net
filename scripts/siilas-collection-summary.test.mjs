import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { syncSiilasCollectionArticle } from './lib/siilas-collection-summary.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const snapshot = JSON.parse(readFileSync(`${root}docs/.vuepress/config/data/siilas-tests.json`, 'utf8'))
const { airportCollections } = loadConfig('airport-collections.ts')
const pages = ['mainRecommendation', 'chatgpt', 'streaming'].map((key) => airportCollections[key])
const read = (collection) => readFileSync(`${root}${collection.sourceFile}`, 'utf8')
const candidateRows = (markdown, collection) => {
  const section = markdown.slice(markdown.indexOf(collection.heading) + collection.heading.length)
  return section.match(/^\|.*$/gm).slice(2, 2 + collection.items.length).map((line) => line.split(/(?<!\\)\|/))
}
const observedRow = (markdown, collection, name) => collection.pagePath === '/posts/jichang-tuijian/'
  ? markdown.match(/<!-- siilas-collection-evidence:start -->[\s\S]*?<!-- siilas-collection-evidence:end -->/)[0]
    .split('\n').filter((line) => line.startsWith(`| [${name}](`)).join('\n')
  : candidateRows(markdown, collection).find((cells) => cells[1].includes(`[${name}](`)).join('|')
const outsideGeneratedBlocks = (markdown) => markdown
  .replace(/<!-- siilas-[a-z-]+:start -->[\s\S]*?<!-- siilas-[a-z-]+:end -->/g, '')
  .replace(/^dateModified:.*$/m, '')

const coverageRows = (markdown) => markdown.split('### 本页候选的证据覆盖与缺口')[1]
  .match(/^\|.*(?:\n\|.*)*/m)[0].split('\n').slice(2)
  .map((line) => line.split(/(?<!\\)\|/).slice(1, -1).map((part) => part.trim()))

const coverageFixture = () => {
  const record = (id, testedAt, node) => ({
    id, testedAt, node, time: '21:00', downloadMbps: 100, uploadMbps: 20, latencyMs: 40,
    resultUrl: `https://www.speedtest.net/result/${id}`,
    chatgpt: '流畅', streaming: '流畅', packetLossPercent: null, jitterMs: null,
    publication: { status: 'published', evidenceVersions: [] },
  })
  const hongkong = record('hk', '2026-10-08', '香港')
  const japan = record('jp', '2026-09-23', '日本')
  const historical = record('historical', '2026-07-13', '香港')
  const airport = {
    name: '候选甲', slug: 'a', yp7Path: '/posts/a/', sourceUrl: 'https://siilas.com/airport/a/',
    // Deliberately stale metadata must not become evidence-coverage counts.
    verifiedTestCount: 999, testDateCount: 999, latestTestAt: '2099-12-31',
    rankingEligible: true, score: 6, tests: [hongkong, japan, historical],
    latestRegionTests: [
      { region: '新加坡', test: null }, { region: '香港', test: hongkong },
      { region: '日本', test: japan }, { region: '美国', test: null },
    ],
  }
  const second = {
    ...structuredClone(airport), name: '候选乙', slug: 'b', yp7Path: '/posts/b/', sourceUrl: 'https://siilas.com/airport/b/',
  }
  const accepted = {
    receivedAt: '2026-10-14', latestTestAt: '2026-10-08',
    source: { archiveUrl: 'https://siilas.com/test/', methodologyUrl: 'https://siilas.com/methodology/',
      publicationStatus: 'local-unpublished', publicationNotice: '来源更新仍待发布。' },
    methodology: { minimumDaysPerRegion: 3 },
    airports: [airport, second, { ...airport, name: '不在编辑名单', yp7Path: '/posts/excluded/' }],
  }
  const collection = {
    pagePath: '/posts/jichang-tuijian/', heading: '## 编辑候选', sourceFile: 'fixture.md',
    items: [{ name: '候选乙', path: '/posts/b/' }, { name: '候选甲', path: '/posts/a/' }, { name: '未接收候选', path: '/posts/c/' }],
  }
  const markdown = [
    '---', 'title: 证据覆盖测试', 'dateModified: 2026/10/15', '---', '',
    '<!-- siilas-page-updated:start -->', '旧更新时间', '<!-- siilas-page-updated:end -->', '',
    collection.heading, '', '| 机场 | 适用场景 | 套餐与试用 | 客户端与限制 | 测试依据 |',
    '| --- | --- | --- | --- | --- |',
    ...collection.items.map((item, index) => `| [${item.name}](${item.path}) | 人工场景${index} | 人工价格${index} | 人工客户端${index} | 旧证据 |`), '',
    '人工解读：保持候选顺序与风险说明，不据一次测速排名。', '',
    '<!-- siilas-collection-evidence:start -->', '旧证据摘要', '<!-- siilas-collection-evidence:end -->', '',
    '<!-- siilas-score-comparison:start -->', '旧评分比较', '<!-- siilas-score-comparison:end -->', '',
    '人工结尾与商业说明保持。',
  ].join('\n')
  return { accepted, collection, markdown, airport, record }
}

test('coverage counts raw historical additions without turning same-day records or date spans into extra test days', () => {
  const { accepted, collection, markdown, airport, record } = coverageFixture()
  const summarize = () => syncSiilasCollectionArticle(markdown, collection, accepted)
  let current = summarize()
  const rowFor = (text) => coverageRows(text).find(([name]) => name.includes('[候选甲]('))
  assert.equal(rowFor(current)[1], '3条原始记录；3个不同测试日')
  assert.equal(rowFor(current)[2], '2026-10-08')
  airport.tests.push(record('same-historical-date', '2026-07-13', '日本'))
  current = summarize()
  assert.equal(rowFor(current)[1], '4条原始记录；3个不同测试日')
  airport.tests.push(record('new-historical-date', '2026-07-12', '美国'))
  current = summarize()
  assert.equal(rowFor(current)[1], '5条原始记录；4个不同测试日')
  assert.equal(rowFor(current)[2], '2026-10-08', 'a historical backfill must not move the most recent record date')
  assert.match(current, /日期跨度不代表连续观测或连续稳定天数/)
  assert.match(current, /<div class="recommendation-evidence">\n\n\| 机场 \| 原始记录与测试日 \|[\s\S]*?\n\n<\/div>/)
  assert.match(current, /不是长期可用率或连续稳定天数，也不是跨机场同条件的公平速度名次/)
  assert.ok(!current.includes('999'), 'stale metadata counts must not appear')
  assert.ok(!current.includes('2099-12-31'), 'the coverage and latest-day tables must use raw dates')
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('coverage retains mixed and missing regions, pending evidence, unknown states and missing measurements', () => {
  const { accepted, collection, markdown, airport } = coverageFixture()
  const [hongkong, japan, historical] = airport.tests
  hongkong.packetLossPercent = 0
  hongkong.jitterMs = 0
  hongkong.chatgptTest = { firstResponseSeconds: 0 }
  hongkong.streamingTest = { seekBufferingSeconds: [0, 0, 0] }
  hongkong.publication.evidenceVersions = [{ status: 'pending' }]
  japan.chatgpt = null
  japan.streaming = null
  japan.publication.status = 'pending'
  japan.chatgptTest = { firstResponseSeconds: null }
  japan.streamingTest = { seekBufferingSeconds: [null, null, null] }
  historical.streamingTest = { seekBufferingSeconds: [0, null, 2] }
  airport.score = null
  airport.rankingEligible = false
  const current = syncSiilasCollectionArticle(markdown, collection, accepted)
  const row = coverageRows(current).find(([name]) => name.includes('[候选甲]('))
  assert.equal(row[1], '3条原始记录；3个不同测试日；2条待发布')
  assert.match(row[3], /2\/4个所列地区有最近样本/)
  assert.match(row[3], /最近日期混合，不能视为同一轮对照/)
  assert.match(row[3], /新加坡、美国未测试/)
  assert.equal(row[4], '丢包：2/3条未记录<br>抖动：2/3条未记录<br>首答秒数：2/3条未记录<br>三次缓冲秒数：2/3条未完整记录（含1条部分计时）')
  assert.match(current, /2026-10-08（待发布） 香港/)
  assert.match(current, /2026-09-23（待发布） 日本/)
  assert.match(current, /日本未记录（待发布）/)
  assert.match(current, /未参评；暂无综合评分/)
  assert.ok(!current.includes('综合分 null/10'))
  assert.match(current, /来源更新仍待发布/)
  const unknown = coverageRows(current).find(([name]) => name === '未接收候选')
  assert.deepEqual(unknown.slice(1), ['未接收', '未接收', '暂无已接收地区记录', '暂无已接收原始记录，不统计指标缺口'])
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('coverage preserves candidate order, commercial columns and manual explanations while handling same-day or absent summaries', () => {
  const { accepted, collection, markdown, airport } = coverageFixture()
  airport.latestRegionTests.find(({ region }) => region === '日本').test = airport.tests[0]
  const other = accepted.airports.find(({ name }) => name === '候选乙')
  other.tests = []
  other.latestRegionTests = []
  const current = syncSiilasCollectionArticle(markdown, collection, accepted)
  const rows = coverageRows(current)
  assert.deepEqual(rows.map(([name]) => name.match(/^\[([^\]]+)\]/)?.[1] ?? name), collection.items.map(({ name }) => name))
  assert.match(rows[0][1], /0条原始记录；0个不同测试日/)
  assert.equal(rows[0][2], '未记录')
  assert.equal(rows[0][3], '地区摘要未记录')
  assert.equal(rows[0][4], '暂无原始记录，不统计指标缺口')
  assert.match(rows[1][3], /有日期的最近样本同日，未确认同条件/)
  assert.ok(!rows.some(([name]) => name.includes('不在编辑名单')))
  assert.deepEqual(candidateRows(current, collection).map((row) => row.filter((_, index) => index !== 5)),
    candidateRows(markdown, collection).map((row) => row.filter((_, index) => index !== 5)))
  const withoutEvidenceCells = (text) => text.split('\n').map((line) => {
    if (!line.startsWith('| [')) return line
    const cells = line.split(/(?<!\\)\|/)
    cells[5] = ''
    return cells.join('|')
  }).join('\n')
  assert.equal(withoutEvidenceCells(outsideGeneratedBlocks(current)), withoutEvidenceCells(outsideGeneratedBlocks(markdown)))
  assert.match(current, /^dateModified: 2026\/10\/15$/m)
  assert.ok(current.includes('2026-10-14 接收'))
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('recommendation freshness uses raw test dates and counts without turning later receipts into tests', () => {
  const { accepted, collection, markdown, airport, record } = coverageFixture()
  const row = () => candidateRows(syncSiilasCollectionArticle(markdown, collection, accepted), collection)
    .find((cells) => cells[1].includes('[候选甲]('))[5]
  assert.match(row(), /最近实际测试：2026-10-08/)
  assert.match(row(), /3条原始记录；3个不同测试日/)
  assert.ok(!row().includes('2099-12-31'))
  assert.ok(!row().includes(accepted.receivedAt))
  airport.tests.push(record('older-backfill', '2026-07-12', '日本'))
  airport.tests[0].publication.status = 'pending'
  assert.match(row(), /最近实际测试：2026-10-08/)
  assert.match(row(), /4条原始记录；4个不同测试日；1条待发布/)
})

test('new raw records without primary test evidence do not advance freshness or inflate latest-day coverage', () => {
  const { accepted, collection, markdown, airport, record } = coverageFixture()
  const unconfirmed = record('unconfirmed-new-date', '2026-10-17', '香港')
  delete unconfirmed.resultUrl
  unconfirmed.evidenceImages = [{ label: '补充截图', path: '/unconfirmed.png' }]
  unconfirmed.publication = { status: 'pending', evidenceVersions: [{ status: 'pending', url: '/unconfirmed.png' }] }
  const sameDay = { ...record('unconfirmed-same-date', '2026-10-08', '香港'), resultUrl: null }
  airport.tests.push(unconfirmed, sameDay)
  const current = syncSiilasCollectionArticle(markdown, collection, accepted)
  const short = candidateRows(current, collection).find((cells) => cells[1].includes('[候选甲]('))[5]
  assert.match(short, /最近实际测试：2026-10-08/)
  assert.match(short, /5条原始记录；4个不同测试日；1条待发布/)
  assert.ok(!short.includes('2026-10-17'))
  const row = coverageRows(current).find(([name]) => name.includes('[候选甲]('))
  assert.equal(row[2], '2026-10-08')
  assert.match(row[4], /丢包：5\/5条未记录/)
  const evidence = observedRow(current, collection, '候选甲').split('\n')[0]
  assert.match(evidence, /\| 2026-10-08 \| 香港，1条 \|/)
  assert.ok(!evidence.includes('含待发布'), 'unconfirmed records must not affect the current-day publication label')
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('a primary screenshot supports a pending test date while records without test evidence keep no verified date', () => {
  const { accepted, collection, markdown, airport, record } = coverageFixture()
  const screenshot = { ...record('screenshot-only', '2026-10-09', '香港'), resultUrl: null, evidenceImage: '/speedtest.png' }
  screenshot.publication.status = 'pending'
  airport.tests.push(screenshot)
  airport.latestRegionTests.find(({ region }) => region === '香港').test = screenshot
  let current = syncSiilasCollectionArticle(markdown, collection, accepted)
  let evidence = observedRow(current, collection, '候选甲').split('\n')[0]
  assert.match(evidence, /\| 2026-10-09 \| 香港，1条（含待发布） \|/)
  airport.tests = [{ ...record('no-evidence', '2026-10-17', '香港'), resultUrl: '' }]
  airport.latestRegionTests = airport.latestRegionTests.map(({ region }) => ({ region, test: null }))
  current = syncSiilasCollectionArticle(markdown, collection, accepted)
  const short = candidateRows(current, collection).find((cells) => cells[1].includes('[候选甲]('))[5]
  assert.match(short, /最近实际测试：暂无测速证据日期/)
  assert.match(short, /1条原始记录；1个不同测试日/)
  assert.equal(coverageRows(current).find(([name]) => name.includes('[候选甲]('))[2], '未记录')
  evidence = observedRow(current, collection, '候选甲').split('\n')[0]
  assert.match(evidence, /\| 未记录 \| 地区未记录，0条 \|/)
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('evidence synchronization preserves escaped pipes in manual candidate cells and rejects malformed columns', () => {
  const { accepted, collection, markdown } = coverageFixture()
  const source = markdown.replace('人工场景1', '办公\\|备用').replace('人工客户端1', 'Windows|macOS')
  // An unescaped pipe adds a real column; the renderer keeps escaped pipes
  // inside the cell even when there are multiple preceding backslashes.
  assert.throws(() => syncSiilasCollectionArticle(source, collection, accepted), /合集候选表列数不一致/)
  const valid = markdown.replace('人工场景1', '办公\\|备用').replace('人工客户端1', 'Windows\\\\|macOS')
  const current = syncSiilasCollectionArticle(valid, collection, accepted)
  assert.ok(current.includes('| [候选甲](/posts/a/) | 办公\\|备用 | 人工价格1 | Windows\\\\|macOS | [最近实际测试：2026-10-08]('))
  assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
})

test('all three published collection summaries match the accepted Siilas snapshot', () => {
  for (const collection of pages) {
    const markdown = read(collection)
    assert.equal(syncSiilasCollectionArticle(markdown, collection, snapshot), markdown, collection.sourceFile)
    for (const item of collection.items) {
      const airport = snapshot.airports.find((record) => record.yp7Path === item.path)
      if (!airport) continue
      const row = observedRow(markdown, collection, item.name)
      assert.ok(row.includes(`综合分 ${airport.score}/10`) || airport.score === null, item.name)
      for (const { test: record } of airport.latestRegionTests) if (record) assert.ok(row.includes(record.testedAt), `${item.name}/${record.id}`)
    }
  }
})

for (const { name, articleDate, receivedAt } of [
  { name: 'a later manual edit keeps its date when the accepted snapshot is older', articleDate: '2026/10/12', receivedAt: '2026-10-09' },
  { name: 'a newer receipt advances the article date', articleDate: '2026/10/08', receivedAt: '2026-10-12' },
]) test(name, () => {
  const accepted = { ...snapshot, receivedAt }
  for (const collection of pages) {
    const original = read(collection).replace(/^dateModified:.*$/m, `dateModified: ${articleDate}`)
    const markdown = syncSiilasCollectionArticle(original, collection, accepted)
    assert.match(markdown, /^dateModified: 2026\/10\/12$/m)
    const pageUpdated = markdown.match(/<!-- siilas-page-updated:start -->[\s\S]*?<!-- siilas-page-updated:end -->/)[0]
    assert.match(pageUpdated, /2026年10月12日/)
    const evidence = markdown.match(/<!-- siilas-collection-evidence:start -->[\s\S]*?<!-- siilas-collection-evidence:end -->/)[0]
    assert.ok(evidence.includes(`${receivedAt} 接收 [Siilas 原始记录]`), 'receipt date must remain independent of editorial date')
    assert.ok(evidence.includes(`最新实际测试日为 ${snapshot.latestTestAt}`), 'test date must not become the editorial date')
    assert.equal(syncSiilasCollectionArticle(markdown, collection, accepted), markdown, 'date synchronization must be idempotent')
  }
})

test('unchanged collection evidence still corrects an older frontmatter date without touching body fields', () => {
  const accepted = { ...snapshot, receivedAt: '2026-10-09' }
  for (const collection of pages) {
    const original = `${read(collection).replace(/^dateModified:.*$/m, 'dateModified: 2026/10/08')}\n\ndateModified: 2099/01/01\n`
    const current = syncSiilasCollectionArticle(original, collection, accepted)
    // Keep the generated page-update label current while making only the
    // frontmatter stale, so the next receipt must detect a date-only change.
    const stale = current.replace(/^dateModified:.*$/m, 'dateModified: 2026/10/08')
    assert.equal(syncSiilasCollectionArticle(stale, collection, accepted), current)
    assert.ok(current.endsWith('\n\ndateModified: 2099/01/01\n'))
    assert.equal(syncSiilasCollectionArticle(current, collection, accepted), current)
  }
})

test('new mixed-region observations replace stale summaries without changing commercial fields or editorial order', () => {
  const updated = structuredClone(snapshot)
  updated.receivedAt = '2026-10-10'
  updated.latestTestAt = '2026-10-09'
  const airport = updated.airports.find((record) => record.slug === 'xxyun')
  for (const { region, test: record } of airport.latestRegionTests) if (record) {
    record.testedAt = region === '美国' ? '2026-08-08' : '2026-10-08'
  }
  const hongkong = airport.latestRegionTests.find(({ region }) => region === '香港').test
  hongkong.testedAt = '2026-10-09'
  hongkong.chatgpt = '响应较慢'
  hongkong.streaming = '缓冲明显'
  airport.latestTestAt = hongkong.testedAt
  for (const collection of pages) {
    // Pin the fixture date; later real article edits are covered separately.
    const original = read(collection).replace(/^dateModified:.*$/m, 'dateModified: 2026/10/09')
    const markdown = syncSiilasCollectionArticle(original, collection, updated)
    const before = candidateRows(original, collection)
    const after = candidateRows(markdown, collection)
    const evidenceIndex = 5
    assert.deepEqual(after.map((row) => row.filter((_, index) => index !== evidenceIndex)),
      before.map((row) => row.filter((_, index) => index !== evidenceIndex)), `${collection.sourceFile}: commercial rows or order changed`)
    const row = observedRow(markdown, collection, 'xxyun')
    assert.match(row, /2026-10-09：香港(?:响应较慢|缓冲明显)/)
    assert.match(row, /2026-08-08：美国/)
    assert.match(markdown, /^dateModified: 2026\/10\/10$/m)
    assert.equal(syncSiilasCollectionArticle(markdown, collection, updated), markdown, 'receipt must be idempotent')
    // History and prose remain intact; only the evidence cells and owned blocks change.
    const withoutEvidence = (text) => text.split('\n').map((line) => {
      if (!line.startsWith('|') || !/\[xxyun]\(/.test(line)) return line
      const parts = line.split(/(?<!\\)\|/)
      parts[evidenceIndex] = ''
      return parts.join('|')
    }).join('\n')
    assert.equal(withoutEvidence(outsideGeneratedBlocks(markdown)), withoutEvidence(outsideGeneratedBlocks(original)))
  }
})

test('pending evidence, missing regions, unknown experiences and null scores stay explicit', () => {
  const updated = structuredClone(snapshot)
  updated.source.publicationStatus = 'local-unpublished'
  updated.source.publicationNotice = '本次接收有记录或证据版本仍待发布，来源页面与截图可能还是旧版。'
  const airport = updated.airports.find((record) => record.slug === 'xxyun')
  airport.rankingEligible = false
  airport.score = null
  const hongkong = airport.latestRegionTests.find(({ region }) => region === '香港').test
  hongkong.chatgpt = '不可用'
  hongkong.streaming = '轻微缓冲'
  hongkong.publication.status = 'pending'
  hongkong.publication.evidenceVersions.forEach((image) => { image.status = 'pending' })
  const japan = airport.latestRegionTests.find(({ region }) => region === '日本').test
  japan.chatgpt = null
  japan.streaming = null
  airport.latestRegionTests.find(({ region }) => region === '美国').test = null
  for (const collection of pages) {
    const markdown = syncSiilasCollectionArticle(read(collection), collection, updated)
    const row = observedRow(markdown, collection, 'xxyun')
    assert.match(row, /未参评；暂无综合评分/)
    assert.match(row, /香港(?:不可用|轻微缓冲)（待发布）/)
    assert.match(row, /日本未记录/)
    assert.match(row, /美国未测试/)
    assert.match(markdown, /来源页面与截图可能还是旧版/)
    assert.ok(!markdown.includes('综合分 null/10'))
    if (collection.pagePath !== '/posts/jichang-tuijian/') {
      const currentEvidence = markdown.match(/<!-- siilas-collection-evidence:start -->[\s\S]*?<!-- siilas-collection-evidence:end -->/)[0]
      assert.match(currentEvidence, /测速截图（待发布）/)
      assert.ok(!currentEvidence.includes('来源明确为YouTube 4K'), 'generic observations must not inherit historical platform claims')
    }
  }
})

test('a newly eligible airport clears the former missing-score status on every collection page', () => {
  const earlier = structuredClone(snapshot)
  const airport = earlier.airports.find((record) => record.slug === 'xxyun')
  airport.rankingEligible = false
  airport.score = null
  const eligible = structuredClone(earlier)
  const scoredAirport = eligible.airports.find((record) => record.slug === 'xxyun')
  scoredAirport.rankingEligible = true
  scoredAirport.score = 6.1
  for (const collection of pages) {
    const oldPage = syncSiilasCollectionArticle(read(collection), collection, earlier)
    const oldRow = observedRow(oldPage, collection, 'xxyun')
    assert.match(oldRow, /未参评；暂无综合评分/)
    const currentPage = syncSiilasCollectionArticle(oldPage, collection, eligible)
    const currentRow = observedRow(currentPage, collection, 'xxyun')
    assert.match(currentRow, /已参评；综合分 6\.1\/10/)
    assert.ok(!currentRow.includes('暂无综合评分'))
  }
})

test('unreceived services have no invented scores or performance claims', () => {
  const updated = structuredClone(snapshot)
  updated.airports = updated.airports.filter((record) => record.slug !== 'xxyun')
  for (const collection of pages) {
    const markdown = syncSiilasCollectionArticle(read(collection), collection, updated)
    const row = candidateRows(markdown, collection).find((cells) => cells[1].includes('[xxyun](')).join('|')
    assert.match(row, /暂无已接收/)
    assert.ok(!row.includes('综合分'))
    assert.ok(!row.includes('流畅'))
  }
})
