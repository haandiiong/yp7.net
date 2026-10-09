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
const outsideGeneratedBlocks = (markdown) => markdown
  .replace(/<!-- siilas-[a-z-]+:start -->[\s\S]*?<!-- siilas-[a-z-]+:end -->/g, '')
  .replace(/^dateModified:.*$/m, '')

test('all three published collection summaries match the accepted Siilas snapshot', () => {
  for (const collection of pages) {
    const markdown = read(collection)
    assert.equal(syncSiilasCollectionArticle(markdown, collection, snapshot), markdown, collection.sourceFile)
    for (const item of collection.items) {
      const airport = snapshot.airports.find((record) => record.yp7Path === item.path)
      if (!airport) continue
      const row = candidateRows(markdown, collection).find((cells) => cells[1].includes(`[${item.name}](`)).join('|')
      assert.ok(row.includes(`综合分 ${airport.score}/10`) || airport.score === null, item.name)
      for (const { test: record } of airport.latestRegionTests) if (record) assert.ok(row.includes(record.testedAt), `${item.name}/${record.id}`)
    }
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
    const original = read(collection)
    const markdown = syncSiilasCollectionArticle(original, collection, updated)
    const before = candidateRows(original, collection)
    const after = candidateRows(markdown, collection)
    const evidenceIndex = 5
    assert.deepEqual(after.map((row) => row.filter((_, index) => index !== evidenceIndex)),
      before.map((row) => row.filter((_, index) => index !== evidenceIndex)), `${collection.sourceFile}: commercial rows or order changed`)
    const row = after.find((cells) => cells[1].includes('[xxyun](')).join('|')
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
    const row = candidateRows(markdown, collection).find((cells) => cells[1].includes('[xxyun](')).join('|')
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
    const oldRow = candidateRows(oldPage, collection).find((cells) => cells[1].includes('[xxyun](')).join('|')
    assert.match(oldRow, /未参评；暂无综合评分/)
    const currentPage = syncSiilasCollectionArticle(oldPage, collection, eligible)
    const currentRow = candidateRows(currentPage, collection).find((cells) => cells[1].includes('[xxyun](')).join('|')
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
