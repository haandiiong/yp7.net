import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import {
  htmlTables, markdownTables, markdownTableAfterHeading,
  validateAirportRows, validateItemList, validateServiceSchema, validateReviewEvidence,
} from './lib/airport-data-validation.mjs'

const { airportData } = loadConfig('airports.ts')
const { airportCollections, createAirportCollections } = loadConfig('airport-collections.ts')
const { generateAirportDataFiles } = loadConfig('generated.ts')
const { getPageSchema } = loadConfig('schema.ts')

test('page candidates, public collections and Schema preserve the editorial names and order', () => {
  for (const collection of Object.values(airportCollections).filter((item) => item.sourceFile)) {
    const source = readFileSync(collection.sourceFile, 'utf8')
    const rows = markdownTableAfterHeading(source, collection.heading)
    const page = { path: collection.pagePath, title: collection.name, frontmatter: {}, data: {}, content: source }
    const schema = getPageSchema(page)['@graph'].find((item) => item['@type'] === 'ItemList')
    assert.deepEqual(rows.map((row) => row.cells['机场']), collection.items.map((airport) => airport.name))
    assert.deepEqual(validateItemList(schema, collection.items, collection.pagePath, undefined, collection.ordered), [])
  }
})

test('price changes use the same record and hidden services disappear from all collections', () => {
  const updated = structuredClone(airportData)
  const airport = updated.find((item) => item.name === '99吧')
  airport.price = 8.5
  airport.priceText = '8.5元/月'
  airport.traffic = '80GB/月'
  for (const key of ['all', 'cheap', 'clash', 'trial', 'noExpiry']) {
    assert.equal(createAirportCollections(updated)[key].items.find((item) => item.name === '99吧'), airport)
  }
  airport.status = '停止推荐'
  assert.ok(Object.values(createAirportCollections(updated)).every((collection) => !collection.items.includes(airport)))
})

test('capability changes remove an editorial candidate only from affected collections', () => {
  const updated = structuredClone(airportData)
  const airport = updated.find((item) => item.name === '99吧')
  airport.universalSubscription = false
  airport.trial = false
  const collections = createAirportCollections(updated)
  assert.ok(!collections.clash.items.includes(airport))
  assert.ok(!collections.trial.items.includes(airport))
  assert.ok(collections.cheap.items.includes(airport))
  assert.ok(collections.all.items.includes(airport))
})

test('unverified trials stay unknown in public tables and Service schema and leave the trial collection', (t) => {
  const airport = airportData.find((item) => item.name === '99吧')
  const originalTrial = airport.trial
  const originalTrialItems = airportCollections.trial.items
  const dest = mkdtempSync(join(tmpdir(), 'yp7-unverified-trial-'))
  t.after(() => {
    airport.trial = originalTrial
    airportCollections.trial.items = originalTrialItems
    rmSync(dest, { recursive: true, force: true })
  })
  assert.ok(createAirportCollections(airportData).trial.items.includes(airport))
  airport.trial = null
  const collections = createAirportCollections(airportData)
  assert.ok(!collections.trial.items.includes(airport))
  assert.ok(collections.all.items.includes(airport))
  // A build loads these derived collections after reading the source data.
  airportCollections.trial.items = collections.trial.items

  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const read = (file) => readFileSync(join(dest, 'data', file), 'utf8')
  const publicAirport = JSON.parse(read('airports.json')).airports.find((item) => item.path === airport.path)
  assert.equal(publicAirport.trial, null)
  assert.ok(!JSON.parse(read('rankings.json')).rankings.trial.some((item) => item.path === airport.path))
  for (const rows of [htmlTables(read('airports.html'))[0], markdownTables(read('airports.md'))[0]]) {
    const row = rows.find((item) => item.cells['机场'] === airport.name)
    assert.equal(row.cells['试用'], '待核实')
    assert.equal(row.cells['流量额度'], airport.traffic)
    assert.deepEqual(validateAirportRows([row], [airport], 'unknown trial'), [])
    row.cells['试用'] = '不支持'
    assert.ok(validateAirportRows([row], [airport], 'stale trial').some((error) => error.includes('试用')))
  }
  const recommendation = markdownTables(`| 机场 | 价格与试用 | 免费试用 |\n|---|---|---|\n| [${airport.name}](${airport.path}) | ${airport.priceText}，试用待核实 | 待核实 |\n`)[0]
  assert.deepEqual(validateAirportRows(recommendation, [airport], 'recommendation'), [])
  const evidence = markdownTables(`| 项目 | 当前记录 |\n|---|---|\n| 套餐价格 | ${airport.priceText}，${airport.traffic} |\n| 免费试用 | 待核实 |\n`)[0]
  assert.deepEqual(validateReviewEvidence(evidence, airport, 'review'), [])
  evidence.find((row) => row.cells['项目'] === '免费试用').cells['当前记录'] = '不支持'
  assert.ok(validateReviewEvidence(evidence, airport, 'stale review').some((error) => error.includes('免费试用')))
  const service = getPageSchema({ path: airport.path, frontmatter: {}, data: {}, content: '' })['@graph']
    .find((item) => item['@type'] === 'Service')
  const trialProperty = service.additionalProperty.find((item) => item.name === '免费试用')
  assert.equal(trialProperty.value, '待核实')
  assert.equal(service.additionalProperty.find((item) => item.name === '流量额度').value, airport.traffic)
  assert.deepEqual(validateServiceSchema(service, airport, 'unknown trial'), [])
  trialProperty.value = '不支持'
  assert.ok(validateServiceSchema(service, airport, 'stale Service').some((error) => error.includes('免费试用')))
})

test('unverified universal subscriptions stay unknown and are excluded from Clash candidates', (t) => {
  const airport = airportData.find((item) => item.name === '99吧')
  const originalValue = airport.universalSubscription
  const originalClashItems = airportCollections.clash.items
  const dest = mkdtempSync(join(tmpdir(), 'yp7-unverified-subscription-'))
  t.after(() => {
    airport.universalSubscription = originalValue
    airportCollections.clash.items = originalClashItems
    rmSync(dest, { recursive: true, force: true })
  })
  airport.universalSubscription = null
  const collections = createAirportCollections(airportData)
  assert.ok(!collections.clash.items.includes(airport))
  assert.ok(collections.all.items.includes(airport))
  airportCollections.clash.items = collections.clash.items
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const read = (file) => readFileSync(join(dest, 'data', file), 'utf8')
  assert.equal(JSON.parse(read('airports.json')).airports.find((item) => item.path === airport.path).universalSubscription, null)
  assert.ok(!JSON.parse(read('rankings.json')).rankings.clash.some((item) => item.path === airport.path))
  for (const rows of [htmlTables(read('airports.html'))[0], markdownTables(read('airports.md'))[0]]) {
    const row = rows.find((item) => item.cells['机场'] === airport.name)
    assert.equal(row.cells['通用订阅'], '待核实')
    assert.deepEqual(validateAirportRows([row], [airport], 'unverified subscription'), [])
    row.cells['通用订阅'] = '不支持'
    assert.ok(validateAirportRows([row], [airport], 'incorrect negative').some((error) => error.includes('通用订阅')))
  }
  const service = getPageSchema({ path: airport.path, frontmatter: {}, data: {}, content: '' })['@graph']
    .find((item) => item['@type'] === 'Service')
  const property = service.additionalProperty.find((item) => item.name === '通用订阅')
  assert.equal(property.value, '待核实')
  assert.deepEqual(validateServiceSchema(service, airport, 'unverified subscription'), [])
  property.value = '支持'
  assert.ok(validateServiceSchema(service, airport, 'unverified subscription').some((error) => error.includes('通用订阅')))
})

test('rendered HTML and Markdown retain the historical evidence exported to JSON', (t) => {
  const dest = mkdtempSync(join(tmpdir(), 'yp7-airport-data-'))
  t.after(() => rmSync(dest, { recursive: true, force: true }))
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  const read = (file) => readFileSync(join(dest, 'data', file), 'utf8')
  const json = JSON.parse(read('airports.json'))
  const html = htmlTables(read('airports.html'))[0]
  const markdown = markdownTables(read('airports.md'))[0]
  const flybit = airportData.find((airport) => airport.name === 'Flybit')
  const publicFlybit = json.airports.find((airport) => airport.path === flybit.path)
  assert.deepEqual(publicFlybit.subscriptionClients, flybit.subscriptionClients)
  assert.deepEqual(publicFlybit.informationSources, flybit.informationSources)
  assert.ok(!('historicalEvidence' in publicFlybit), 'Flybit has no traceable historical performance record')
  assert.deepEqual(validateAirportRows(html, airportCollections.all.items, 'HTML'), [])
  assert.deepEqual(validateAirportRows(markdown, airportCollections.all.items, 'Markdown'), [])
  for (const source of airportData.filter((airport) => airport.performance)) {
    const record = json.airports.find((airport) => airport.path === source.path)
    assert.equal(record.historicalEvidence.lastTestedAt, source.performance.lastTestedAt)
    assert.equal(record.historicalEvidence.recordStatus, 'historical')
    assert.ok(!('performance' in record))
    const row = html.find((item) => item.cells['机场'] === source.name)
    row.cells['历史测试日期'] = '无历史记录'
  }
  assert.equal(validateAirportRows(html, airportCollections.all.items, 'broken HTML').length,
    airportData.filter((airport) => airport.performance).length)
  const rankings = JSON.parse(read('rankings.json')).rankings
  const table = markdownTableAfterHeading(read('rankings.md'), '## Clash 机场')
  assert.deepEqual(validateAirportRows(table, rankings.clash, 'Clash Markdown'), [])
})

test('consistency checks reject stale prices, wrong capabilities, extra names and reordered Schema', () => {
  const collection = airportCollections.clash
  const source = readFileSync(collection.sourceFile, 'utf8')
  const rows = markdownTableAfterHeading(source, collection.heading)
  const changed = structuredClone(rows)
  changed[0].cells['价格'] = '1元/月'
  changed[0].cells['通用订阅'] = '不支持'
  assert.equal(validateAirportRows(changed, collection.items, 'fixture').length, 2)
  changed.push(changed[0])
  assert.ok(validateAirportRows(changed, collection.items, 'fixture').some((error) => error.includes('names/order')))
  const page = { path: collection.pagePath, frontmatter: {}, data: {}, content: source }
  const list = getPageSchema(page)['@graph'].find((item) => item['@type'] === 'ItemList')
  list.itemListElement.reverse()
  assert.ok(validateItemList(list, collection.items, 'fixture').some((error) => error.includes('names/URLs/order')))
})

test('Service validation detects a capability or price contradiction', () => {
  const airport = airportData.find((item) => item.name === '99吧')
  const service = getPageSchema({ path: airport.path, frontmatter: {}, data: {}, content: '' })['@graph']
    .find((item) => item['@type'] === 'Service')
  assert.deepEqual(validateServiceSchema(service, airport, 'fixture'), [])
  service.additionalProperty.find((item) => item.name === '最低价格').value = '12.99元/月'
  service.additionalProperty.find((item) => item.name === '专属客户端').value = '支持'
  assert.equal(validateServiceSchema(service, airport, 'fixture').length, 2)
})

test('Service validation detects missing clients and stale information source URLs or dates', () => {
  const airport = airportData.find((item) => item.name === 'Flybit')
  const service = getPageSchema({ path: airport.path, frontmatter: {}, data: {}, content: '' })['@graph']
    .find((item) => item['@type'] === 'Service')
  assert.deepEqual(validateServiceSchema(service, airport, 'fixture'), [])
  service.additionalProperty.find((item) => item.name === '一键订阅客户端').value = 'Clash Meta'
  assert.ok(validateServiceSchema(service, airport, 'fixture').some((error) => error.includes('一键订阅客户端')))
  const source = service.additionalProperty.find((item) => item.name === '资料来源')
  source.url = 'https://example.com/stale'
  assert.ok(validateServiceSchema(service, airport, 'fixture').some((error) => error.includes('sources/URLs/review dates')))
  source.url = airport.informationSources[0].url
  source.description = '复核日期：2020-01-01'
  assert.ok(validateServiceSchema(service, airport, 'fixture').some((error) => error.includes('sources/URLs/review dates')))
})

test('review evidence checks verify every source link, review date and client in Markdown and HTML', () => {
  const airport = {
    priceText: '15元/月', traffic: '128GB/月', subscriptionClients: ['Clash Meta', 'Hiddify'],
    informationSources: [
      { name: '官方导航', url: 'https://example.com/', checkedAt: '2026-09-09' },
      { name: '套餐页面', url: 'https://example.com/#/plan', checkedAt: '2026-09-08' },
    ],
  }
  const markdown = '| 项目 | 当前记录 |\n|---|---|\n| 套餐价格 | 15元/月，128GB/月 |\n| 一键订阅客户端 | Clash Meta、Hiddify |\n| 资料来源 | [官方导航](https://example.com/)；[套餐页面](https://example.com/#/plan) |\n| 资料复核日期 | 官方导航：2026-09-09；套餐页面：2026-09-08 |\n'
  const html = '<table><tr><th>项目</th><th>当前记录</th></tr><tr><td>套餐价格</td><td>15元/月，128GB/月</td></tr><tr><td>一键订阅客户端</td><td>Clash Meta、Hiddify</td></tr><tr><td>资料来源</td><td><a href="https://example.com/">官方导航</a>；<a href="https://example.com/#/plan">套餐页面</a></td></tr><tr><td>资料复核日期</td><td>官方导航：2026-09-09；套餐页面：2026-09-08</td></tr></table>'
  for (const rows of [markdownTables(markdown)[0], htmlTables(html)[0]]) {
    assert.deepEqual(validateReviewEvidence(rows, airport, 'fixture'), [])
    rows.find((row) => row.cells['项目'] === '资料来源').hrefs[1] = 'https://example.com/stale'
    rows.find((row) => row.cells['项目'] === '资料复核日期').cells['当前记录'] = '官方导航：2026-09-09；套餐页面：2026-09-09'
    rows.find((row) => row.cells['项目'] === '一键订阅客户端').cells['当前记录'] = 'Clash Meta'
    assert.equal(validateReviewEvidence(rows, airport, 'fixture').length, 3)
  }
  assert.deepEqual(validateReviewEvidence(markdownTables('| 项目 | 当前记录 |\n|---|---|\n| 套餐价格 | 15元/月，128GB/月 |\n')[0], { priceText: '15元/月', traffic: '128GB/月' }, 'optional fields'), [])
})
