import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { htmlTableAfterHeading, markdownTableAfterHeading, htmlTables, markdownTables, validateAirportRows, validateServiceSchema } from './lib/airport-data-validation.mjs'

const { airportCollections } = loadConfig('airport-collections.ts')
const { getNoExpiryPackage, noExpiryPackages, noExpiryColumns } = loadConfig('no-expiry-packages.ts')
const { generateAirportDataFiles } = loadConfig('generated.ts')
const { getPageSchema } = loadConfig('schema.ts')
const { airportData, airportMetrics, airportDataLastModified, airportDataLastReviewed } = loadConfig('airports.ts')

test('no-expiry comparison keeps one-off facts consistent without relabelling monthly prices', (t) => {
  const dest = mkdtempSync(join(tmpdir(), 'yp7-no-expiry-'))
  t.after(() => rmSync(dest, { recursive: true, force: true }))
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const read = (file) => readFileSync(join(dest, 'data', file), 'utf8')
  const collection = airportCollections.noExpiry
  const source = readFileSync(collection.sourceFile, 'utf8')
  const rows = markdownTableAfterHeading(source, collection.heading)
  const mdRows = markdownTableAfterHeading(read('rankings.md'), `## ${collection.dataTitle}`)
  const htmlRows = htmlTableAfterHeading(read('rankings.html'), `## ${collection.dataTitle}`)
  const json = JSON.parse(read('rankings.json')).rankings.noExpiry
  const airports = JSON.parse(read('airports.json')).airports

  assert.deepEqual(rows.map(row => row.cells['机场']), collection.items.map(airport => airport.name))
  assert.deepEqual(mdRows.map(row => row.cells), rows.map(row => row.cells))
  assert.deepEqual(htmlRows.map(row => row.cells), rows.map(row => row.cells))
  assert.deepEqual(Object.keys(rows[0].cells), noExpiryColumns)
  assert.ok(!('最低价格' in rows[0].cells))
  assert.ok(!('月流量' in rows[0].cells))

  for (const [index, airport] of collection.items.entries()) {
    const record = getNoExpiryPackage(airport.path)
    assert.deepEqual(json[index].noExpiryPackage, record)
    assert.deepEqual(airports.find(item => item.path === airport.path).noExpiryPackage, record)
    assert.equal(json[index].priceText, airport.priceText)
    assert.equal(json[index].traffic, airport.traffic)
    if (record.status === 'listed') {
      assert.equal(rows[index].cells['每GB成本'], `${(record.priceCny / record.trafficGb).toFixed(3)}元/GB`)
    } else {
      assert.equal(record.unitPriceCnyPerGb, null)
      assert.equal(rows[index].cells['每GB成本'], '待核实，不计算')
    }
  }

  assert.equal(getNoExpiryPackage('/posts/flybit-review-2026/').priceCny, 36)
  assert.equal(getNoExpiryPackage('/posts/flybit-review-2026/').trafficGb, 128)
  assert.equal(getNoExpiryPackage('/posts/flybit-review-2026/').unitPriceCnyPerGb, 0.281)
  assert.equal(getNoExpiryPackage('/posts/kuajieyun-review-2026/').priceCny, 200)
  assert.equal(getNoExpiryPackage('/posts/yifanyun-review-2026/').priceCny, 100)
  assert.equal(getNoExpiryPackage('/posts/jilianyun-review-2026/').priceCny, 399)
  assert.equal(getNoExpiryPackage('/posts/jilianyun-review-2026/').trafficGb, 600)
  assert.equal(getNoExpiryPackage('/posts/jilianyun-review-2026/').unitPriceCnyPerGb, 0.665)
  for (const path of ['/posts/xxyun-review-2026/', '/posts/sogo-review-2026/', '/posts/shanyue-review-2026/']) {
    assert.equal(getNoExpiryPackage(path).unitPriceCnyPerGb, null)
  }

  const schema = getPageSchema({ path: collection.pagePath, title: collection.name, frontmatter: {}, data: {}, content: source })
  assert.ok(!JSON.stringify(schema).includes('"offers"'))
  const list = schema['@graph'].find(item => item['@type'] === 'ItemList')
  assert.deepEqual(list.itemListElement.map(item => item.item.name), collection.items.map(airport => airport.name))
})

test('a conflicting package must never acquire a computed unit price', () => {
  const path = '/posts/sogo-review-2026/'
  const original = noExpiryPackages[path].priceCny
  try {
    // Even if a card amount is later recorded, its conflict must be resolved first.
    noExpiryPackages[path].priceCny = 120
    assert.equal(getNoExpiryPackage(path).unitPriceCnyPerGb, null)
  } finally {
    noExpiryPackages[path].priceCny = original
  }
})

test('one-year validity and unresolved no-expiry claims stay consistent across summaries and exports', (t) => {
  const dest = mkdtempSync(join(tmpdir(), 'yp7-conflicting-validity-'))
  t.after(() => rmSync(dest, { recursive: true, force: true }))
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const read = (file) => readFileSync(join(dest, 'data', file), 'utf8')
  const data = JSON.parse(read('airports.json'))
  const rankings = JSON.parse(read('rankings.json'))
  const source = readFileSync(airportCollections.all.sourceFile, 'utf8')
  const tables = [
    markdownTableAfterHeading(source, airportCollections.all.heading),
    markdownTables(read('airports.md'))[0],
    htmlTables(read('airports.html'))[0],
  ]
  assert.equal(airportMetrics.noExpiryCount, 36)
  assert.equal(airportMetrics.noExpiryUnverifiedCount, 1)
  assert.equal(airportCollections.noExpiry.items.length, 37)
  for (const name of ['鲤云', '熊猫cloud']) {
    const airport = airportData.find((item) => item.name === name)
    assert.equal(airport.noExpiry, false)
    assert.equal(noExpiryPackages[airport.path], undefined)
    assert.equal(data.airports.find((item) => item.name === name).noExpiry, false)
    assert.equal(rankings.rankings.noExpiry.some((item) => item.name === name), false)
    for (const rows of tables) {
      const row = rows.find((item) => item.cells['机场'] === name)
      const column = '不限时' in row.cells ? '不限时' : '不限时套餐'
      assert.ok(['❌', '不支持'].includes(row.cells[column]))
      assert.deepEqual(validateAirportRows([row], [airport], 'validity', { sectionLinks: true }), [])
      const stale = structuredClone(row)
      stale.cells[column] = '支持'
      assert.ok(validateAirportRows([stale], [airport], 'stale validity', { sectionLinks: true }).some((error) => error.includes('不限时')))
    }
    const schema = getPageSchema({ path: airport.path, title: name, frontmatter: {}, data: {}, content: '' })
    const service = schema['@graph'].find((item) => item['@type'] === 'Service')
    assert.match(service.description, /不限时套餐：不支持/)
    assert.deepEqual(validateServiceSchema(service, airport, 'validity'), [])
  }
  const yunTu = airportData.find((item) => item.name === '云图')
  assert.equal(yunTu.noExpiry, null)
  assert.equal(getNoExpiryPackage(yunTu.path).status, 'conflicting')
  assert.equal(getNoExpiryPackage(yunTu.path).unitPriceCnyPerGb, null)
  assert.equal(data.airports.find((item) => item.name === '云图').noExpiry, null)
  assert.equal(rankings.rankings.noExpiry.find((item) => item.name === '云图').noExpiry, null)
  for (const rows of tables) {
    const row = rows.find((item) => item.cells['机场'] === '云图')
    const column = '不限时' in row.cells ? '不限时' : '不限时套餐'
    assert.equal(row.cells[column], '待核实')
    assert.deepEqual(validateAirportRows([row], [yunTu], 'validity', { sectionLinks: true }), [])
  }
  const yunTuSchema = getPageSchema({ path: yunTu.path, title: '云图', frontmatter: {}, data: {}, content: '' })
  const yunTuService = yunTuSchema['@graph'].find((item) => item['@type'] === 'Service')
  assert.match(yunTuService.description, /不限时套餐：待核实/)
  assert.deepEqual(validateServiceSchema(yunTuService, yunTu, 'validity'), [])
  assert.equal(data.lastModified, airportDataLastModified)
  assert.equal(data.lastReviewed, airportDataLastReviewed)
  assert.equal(airportDataLastModified, '2026-10-05')
  assert.equal(airportDataLastReviewed, '2026-08-19')
  const dataset = JSON.parse(read('airports.html').match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1])
  assert.equal(dataset.dateModified, airportDataLastModified)
})

test('10x billing converts the regular no-expiry package to its actual transfer allowance', () => {
  const record = getNoExpiryPackage('/posts/jisucloud-review-2026/')
  assert.equal(record.priceCny, 329)
  assert.equal(record.trafficGb, 100)
  assert.equal(record.unitPriceCnyPerGb, 3.29)
})
