import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { renderSiilasSummary, syncSiilasArticleSummary } from './lib/siilas-article-summary.mjs'
import { syncSiilasArticleDateModified } from './lib/siilas-article-date.mjs'

const { siilasTestingSnapshot: snapshot } = loadConfig('siilas-evidence.ts')
const { airportData, airportDataLastReviewed } = loadConfig('airports.ts')
const { airportCollections } = loadConfig('airport-collections.ts')
const { generateAirportDataFiles } = loadConfig('generated.ts')

test('existing and newly inserted airport summaries preserve literal replacement tokens', () => {
  const accepted = { ...snapshot, receivedAt: '2026-10-09' }
  const header = '---\ntitle: 测试文章\ndateModified: 2026/10/08\n---'
  const before = '\n\n人工前文保持一次。\n\n'
  const after = '\n\n## 官网\n\n人工正文保持一次。\ndateModified: 2099/01/01\n'
  for (const literal of ['$&', "$'", '$`', '$$']) {
    const airport = structuredClone(snapshot.airports[0])
    const client = `客户端 ${literal} 原样`
    airport.latestRegionTests.find(({ test: record }) => record).test.client = client
    const summary = renderSiilasSummary(airport, accepted)
    const expected = `${header.replace('2026/10/08', '2026/10/09')}${before}${summary}${after}`
    for (const oldSummary of ['', '<!-- siilas-testing:start -->\n旧摘要\n<!-- siilas-testing:end -->\n\n']) {
      const original = `${header}${before}${oldSummary}${after.trimStart()}`
      const current = syncSiilasArticleSummary(original, airport, accepted)
      assert.equal(current, expected, `${literal}: ${oldSummary ? 'replace' : 'insert'}`)
      assert.ok(current.includes(client), 'source text must remain literal')
      assert.equal((current.match(/<!-- siilas-testing:start -->/g) ?? []).length, 1)
      assert.equal(syncSiilasArticleSummary(current, airport, accepted), current, 'receipt must remain idempotent')
    }
  }
})

test('unchanged airport evidence still corrects an article date older than the receipt', () => {
  const accepted = { ...snapshot, receivedAt: '2026-10-09' }
  const airport = snapshot.airports[0]
  const summary = renderSiilasSummary(airport, accepted)
  const body = `\n\n${summary}\n\n## 官网\n\ndateModified: 2099/01/01\n`
  const stale = `---\ntitle: 测试文章\ndateModified: 2026/10/08\n---${body}`
  const current = syncSiilasArticleSummary(stale, airport, accepted)
  assert.equal(current, `---\ntitle: 测试文章\ndateModified: 2026/10/09\n---${body}`)
  assert.equal(syncSiilasArticleSummary(current, airport, accepted), current)
  const laterEdit = current.replace('dateModified: 2026/10/09', 'dateModified: 2026/10/12')
  assert.equal(syncSiilasArticleSummary(laterEdit, airport, accepted), laterEdit, 'later manual edits must be preserved')
})

test('date writes remain inside the opening frontmatter and preserve line endings', () => {
  const original = "---\r\ntitle: 测试文章\r\ndateModified: '2026-10-08'\r\n---\r\n\r\ndateModified: 2099/01/01\r\n"
  const current = syncSiilasArticleDateModified(original, '2026-10-09')
  assert.equal(current, original.replace("dateModified: '2026-10-08'", 'dateModified: 2026/10/09'))
  for (const invalid of [
    '---\ntitle: 测试文章\n---\n\ndateModified: 2026/10/08\n',
    '正文\n---\ndateModified: 2026/10/08\n---\n',
  ]) assert.throws(() => syncSiilasArticleDateModified(invalid, '2026-10-09'), /frontmatter 缺少 dateModified/)
})

test('accepted Siilas evidence has traceable dates, records and rule versions', () => {
  assert.equal(snapshot.airportCount, snapshot.airports.length)
  assert.equal(snapshot.rawTestCount, snapshot.airports.reduce((count, airport) => count + airport.tests.length, 0))
  assert.equal(snapshot.verifiedTestCount, snapshot.airports.reduce((count, airport) => count + airport.verifiedTestCount, 0))
  assert.ok(Object.keys(snapshot.source.sourceFilesSha256).includes('src/data/airports.json'))
  for (const hash of Object.values(snapshot.source.sourceFilesSha256)) assert.match(hash, /^[a-f0-9]{64}$/)
  for (const airport of snapshot.airports) {
    assert.ok(airportData.some((item) => item.path === airport.yp7Path), `${airport.name}: unmapped review`)
    assert.equal(new URL(airport.sourceUrl).origin, 'https://siilas.com')
    assert.equal(new Set(airport.tests.map((record) => record.id)).size, airport.tests.length)
    assert.ok(airport.verifiedTestCount <= airport.tests.length)
    assert.ok(airport.score === null || (airport.score >= 0 && airport.score <= 10))
    if (snapshot.schemaVersion >= 2) for (const record of airport.tests) {
      assert.ok(['pending', 'published'].includes(record.publication?.status))
      assert.match(record.publication.versionSha256, /^[a-f0-9]{64}$/)
      assert.deepEqual(record.evidenceUrls ?? [], record.publication.evidenceVersions.map((image) => image.url))
      for (const image of record.publication.evidenceVersions) {
        assert.ok(image.label, `${airport.name}/${record.id}: missing evidence meaning`)
        assert.equal(new URL(image.url).origin, snapshot.source.origin)
        assert.match(image.sha256, /^[a-f0-9]{64}$/)
        assert.equal(image.status, record.publication.status)
      }
    }
    for (const { test: record } of airport.latestRegionTests.filter(({ test: record }) => record)) {
      const raw = airport.tests.find((candidate) => candidate.id === record.id)
      assert.deepEqual(record, raw, `${airport.name}: latest summary changed a raw record`)
      assert.match(record.testedAt, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(record.testedAt <= snapshot.receivedAt, `${airport.name}: receipt predates sample`)
      assert.ok(record.resultUrl || record.evidenceUrl, `${airport.name}: missing original evidence`)
      if (record.evidenceImage) assert.equal(record.evidenceUrl, new URL(record.evidenceImage, snapshot.source.origin).href)
    }
  }
})

test('production generation preserves every raw record without the adjacent Siilas checkout', (t) => {
  const dest = mkdtempSync(join(tmpdir(), 'yp7-siilas-export-'))
  t.after(() => rmSync(dest, { recursive: true, force: true }))
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const readJson = (file) => JSON.parse(readFileSync(join(dest, 'data', file), 'utf8'))
  assert.deepEqual(readJson('siilas-tests.json'), snapshot)
  const publicData = readJson('airports.json')
  assert.equal(publicData.lastReviewed, airportDataLastReviewed, 'test ingestion must not refresh commercial review date')
  assert.equal(publicData.testingPolicy.yp7ConductsCurrentTests, false)
  for (const airport of snapshot.airports) {
    const evidence = publicData.airports.find((item) => item.path === airport.yp7Path).siilasEvidence
    assert.equal(evidence.score, airport.score)
    assert.deepEqual(evidence.scoreBreakdown, airport.scoreBreakdown)
    assert.deepEqual(evidence.latestRegionTests, airport.latestRegionTests)
    assert.equal(evidence.receivedAt, snapshot.receivedAt)
    assert.equal(evidence.sourcePublicationStatus, snapshot.source.publicationStatus)
    assert.equal(evidence.rawRecordsUrl, 'https://yp7.net/data/siilas-tests.json')
    assert.ok(!('tests' in evidence), 'full records are published once and referenced from recommendation datasets')
  }
  assert.ok(!('historicalEvidence' in publicData.airports.find((item) => item.name === 'Flybit')),
    'Siilas evidence must not revive unsupported historical yp7 claims')
  const rankings = readJson('rankings.json').rankings
  for (const [key, collection] of Object.entries(airportCollections)) {
    assert.deepEqual(rankings[key].map((airport) => airport.name), collection.items.map((airport) => airport.name),
      `${key}: source score must not reorder editorial recommendations`)
  }
})
