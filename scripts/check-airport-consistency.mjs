import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { loadConfig } from './lib/load-config.mjs'
import {
  htmlTables, markdownTables, htmlTableAfterHeading, markdownTableAfterHeading,
  jsonLdGraph, validateAirportRows, validateItemList, validateServiceSchema, validateReviewEvidence,
} from './lib/airport-data-validation.mjs'

const root = process.cwd()
const dist = join(root, 'docs/.vuepress/dist')
const read = (path) => readFileSync(path, 'utf8')
const { airportData, visibleAirportData } = loadConfig('airports.ts')
const { airportCollections, airportRankingKeys } = loadConfig('airport-collections.ts')
const { hostname } = loadConfig('site.ts')
const errors = []
const dataColumns = ['机场', '最低价格', '流量额度', '试用', '不限时', '专属客户端', '通用订阅', '历史证据', '历史测试日期', '历史延迟', '历史速度区间', '状态']
const salesColumns = ['机场', '销量样本', '最低价格', '流量额度', '试用', '专属客户端', '通用订阅', '状态']

try {
  const airportJson = JSON.parse(read(join(dist, 'data/airports.json')))
  const rankingJson = JSON.parse(read(join(dist, 'data/rankings.json')))
  const publicByPath = new Map(airportJson.airports.map((airport) => [airport.path, airport]))
  const sourceByName = new Map(airportData.map((airport) => [airport.name, airport]))
  const paths = (items) => items.map((airport) => airport.path)
  if (!isDeepStrictEqual(paths(airportJson.airports), paths(airportCollections.all.items))) {
    errors.push('airports.json: catalogue names/order differ')
  }
  for (const airport of visibleAirportData) {
    const record = publicByPath.get(airport.path)
    if (!record) { errors.push(`airports.json: missing ${airport.name}`); continue }
    for (const field of Object.keys(airport).filter((key) => key !== 'performance')) {
      if (!isDeepStrictEqual(record[field], airport[field])) errors.push(`airports.json: ${airport.name} ${field} differs`)
    }
    if (record.url !== `${hostname}${airport.path}` || 'performance' in record) errors.push(`airports.json: ${airport.name} invalid public record`)
    if (airport.performance) {
      if (record.historicalEvidence?.recordStatus !== 'historical') errors.push(`airports.json: ${airport.name} missing historical status`)
      for (const field of ['evidenceLevel', 'lastTestedAt', 'testWindow', 'testRegion', 'testNetwork', 'testDevice', 'latencyMs', 'downloadMbpsRange', 'evidenceSummary']) {
        if (record.historicalEvidence?.[field] !== airport.performance[field]) errors.push(`airports.json: ${airport.name} historical ${field} differs`)
      }
    } else if (record.historicalEvidence) errors.push(`airports.json: ${airport.name} unexpected historical evidence`)

    const reviewHtml = read(join(dist, airport.path, 'index.html'))
    const service = jsonLdGraph(reviewHtml).find((schema) => schema['@type'] === 'Service')
    errors.push(...validateServiceSchema(service, record, airport.path))
    const evidenceTable = htmlTables(reviewHtml).find((table) => table.some((row) => row.cells['项目'] === '套餐价格'))
    errors.push(...validateReviewEvidence(evidenceTable, record, airport.path))
  }

  const airportHtml = read(join(dist, 'data/airports.html'))
  const airportMd = read(join(dist, 'data/airports.md'))
  errors.push(...validateAirportRows(htmlTables(airportHtml)[0], airportCollections.all.items, 'airports.html', { requiredColumns: dataColumns }))
  errors.push(...validateAirportRows(markdownTables(airportMd)[0], airportCollections.all.items, 'airports.md', { requiredColumns: dataColumns }))

  const rankingHtml = read(join(dist, 'data/rankings.html'))
  const rankingMd = read(join(dist, 'data/rankings.md'))
  for (const [key, collection] of Object.entries(airportCollections)) {
    const records = rankingJson.rankings[key]
    const expectedRecords = collection.items.map((airport) => publicByPath.get(airport.path))
    if (!isDeepStrictEqual(records, expectedRecords)) errors.push(`rankings.json ${key}: records/order differ from shared airport data`)
    if (airportRankingKeys.includes(key)) {
      const heading = `## ${collection.dataTitle}`
      const options = { requiredColumns: key === 'sales' ? salesColumns : dataColumns }
      errors.push(...validateAirportRows(htmlTableAfterHeading(rankingHtml, heading), collection.items, `rankings.html ${key}`, options))
      errors.push(...validateAirportRows(markdownTableAfterHeading(rankingMd, heading), collection.items, `rankings.md ${key}`, options))
    }
    if (!collection.pagePath) continue
    const context = collection.pagePath
    const source = read(join(root, collection.sourceFile))
    const pageHtml = read(join(dist, collection.pagePath, 'index.html'))
    const options = { sectionLinks: collection.sectionLinks, hostname }
    errors.push(...validateAirportRows(markdownTableAfterHeading(source, collection.heading), collection.items, `${context} Markdown`, options))
    errors.push(...validateAirportRows(htmlTableAfterHeading(pageHtml, collection.heading), collection.items, `${context} HTML`, options))
    const lists = jsonLdGraph(pageHtml).filter((schema) => schema['@type'] === 'ItemList')
    if (lists.length !== 1) errors.push(`${context}: expected exactly one ItemList`)
    errors.push(...validateItemList(lists[0], records || [], context, hostname, collection.ordered))
  }

  const riskJson = JSON.parse(read(join(dist, 'data/risk-monitor.json')))
  if (!isDeepStrictEqual(riskJson.risks.map((risk) => risk.name), ['echo', ...airportData.map((airport) => airport.name)])) {
    errors.push('risk-monitor.json: risk names/order differ from source data')
  }
  const riskHtmlRows = htmlTables(read(join(dist, 'data/risk-monitor.html')))[0]
  const riskMdRows = markdownTables(read(join(dist, 'data/risk-monitor.md')))[0]
  const expectedRiskNames = riskJson.risks.map((risk) => risk.name)
  if (![riskHtmlRows, riskMdRows].every((rows) => isDeepStrictEqual(rows.map((row) => row.cells['机场']), expectedRiskNames))) {
    errors.push('risk-monitor: JSON/Markdown/HTML names/order differ')
  }
  const riskRows = [...riskHtmlRows, ...riskMdRows]
  for (const risk of riskJson.risks) {
    const source = sourceByName.get(risk.name)
    if (source && (risk.status !== source.status || risk.risk !== source.risk || risk.url !== `${hostname}${source.path}`)) errors.push(`risk-monitor.json: ${risk.name} differs`)
    const rows = riskRows.filter((row) => row.cells['机场'] === risk.name)
    if (rows.length !== 2 || rows.some((row) => row.cells['状态'] !== risk.status || row.cells['风险提示'] !== risk.risk)) {
      errors.push(`risk-monitor: ${risk.name} JSON/Markdown/HTML differ`)
    }
  }
} catch (error) {
  errors.push(error.message)
}

if (errors.length) {
  console.error('Airport data consistency check failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}
console.log(`Airport data consistency passed: ${Object.values(airportCollections).filter((item) => item.pagePath).length} collection pages, ${visibleAirportData.length} services, JSON/Markdown/HTML and Schema.`)
