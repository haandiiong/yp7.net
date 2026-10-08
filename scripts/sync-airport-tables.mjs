import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadConfig } from './lib/load-config.mjs'

const root = process.cwd()
const airportsPath = join(root, 'docs/.vuepress/config/airports.ts')
const checkOnly = process.argv.includes('--check')

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const normalizeRoute = (path) => {
  if (path === '/') return '/'
  return path.endsWith('/') ? path : `${path}/`
}

const parseMarkdownTable = (lines, tableStart) => {
  const tableLines = []

  for (let index = tableStart; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line.startsWith('|')) break
    tableLines.push(lines[index])
  }

  const parseLine = (line) => line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

  const headers = parseLine(tableLines[0] || '')
  const divider = tableLines[1] || `| ${headers.map(() => '---').join(' | ')} |`
  const rows = tableLines.slice(2).map((line) => {
    const cells = parseLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']))
  })

  return { headers, divider, rows, length: tableLines.length }
}

const parseAirportCell = (value = '') => {
  const match = value.match(/^\[([^\]]+)]\(([^)]+)\)$/)
  if (!match) return undefined

  return {
    name: match[1],
    path: match[2].startsWith('#') ? match[2] : normalizeRoute(match[2]),
  }
}

const booleanText = (value) => (value === null ? '待核实' : value ? '支持' : '不支持')

const clientSummary = (airport) => {
  if (airport.dedicatedClient && airport.universalSubscription) return '专属客户端、通用订阅'
  if (airport.dedicatedClient) return '专属客户端'
  if (airport.universalSubscription) return '通用订阅'

  return '无专属客户端'
}

// The first line is shared data; subsequent lines remain editorial notes.
const withEditorialNotes = (value, previous = '') => {
  const separator = previous.match(/<br\s*\/?\s*>/i)
  return separator ? `${value}${previous.slice(separator.index)}` : value
}

const scenarioLabels = {
  stable: '稳定',
  cheap: '低价',
  clash: 'Clash',
  chatgpt: 'ChatGPT',
  streaming: '流媒体',
  trial: '试用',
  newbie: '新手',
}

const scenarioSummary = (airport) => airport.scenarios
  .map((scenario) => scenarioLabels[scenario] || scenario)
  .join('、')

const airportLink = (airport, _index, row, config) => {
  const existingLink = parseAirportCell(row['机场'])
  const link = config.sectionLinks && existingLink?.path.startsWith('#') ? existingLink.path : airport.path
  return `[${airport.name}](${link})`
}

const capabilityCell = (field, header) => (airport, _index, row, config) => {
  if (!config.sectionLinks) return booleanText(airport[field])
  if (airport[field] === null) return '待核实'
  // The catalogue keeps its existing trial/temporary-subscription qualifications.
  // Only the boolean comes from the shared record; false must clear a stale checkmark.
  if (!airport[field]) return '❌'
  return row[header]?.startsWith('✔') ? row[header] : '✔'
}

const columnGetters = {
  机场: airportLink,
  当前状态: (airport) => airport.status,
  客户端: clientSummary,
  价格: (airport) => airport.priceText,
  最低价格: (airport) => airport.priceText,
  价格与试用: (airport) => `${airport.priceText}，${airport.trial === null ? '试用待核实' : airport.trial ? '支持试用' : '无试用'}`,
  套餐与试用: (airport, _index, row) => withEditorialNotes(
    `${airport.priceText}，${airport.traffic}；${airport.trial === null ? '试用待核实' : airport.trial ? '支持试用' : '无试用'}`,
    row['套餐与试用'],
  ),
  客户端与限制: (airport, _index, row) => withEditorialNotes(clientSummary(airport), row['客户端与限制']),
  月流量: (airport, _index, _row, config) => config.sectionLinks ? airport.traffic.replace(/\/月$/, '') : airport.traffic,
  流量额度: (airport) => airport.traffic,
  流量: (airport) => airport.traffic,
  试用: capabilityCell('trial', '试用'),
  免费试用: capabilityCell('trial', '免费试用'),
  不限时: capabilityCell('noExpiry', '不限时'),
  不限时套餐: capabilityCell('noExpiry', '不限时套餐'),
  不限时状态: capabilityCell('noExpiry', '不限时状态'),
  专属客户端: capabilityCell('dedicatedClient', '专属客户端'),
  通用订阅: capabilityCell('universalSubscription', '通用订阅'),
  '订阅/客户端': clientSummary,
  风险提示: (airport) => airport.risk,
  状态: (airport) => airport.status,
  排名: (_airport, index) => String(index + 1),
  销量样本: (airport) => String(airport.salesSample),
}

const { visibleAirportData } = loadConfig('airports.ts')
const { airportCollections } = loadConfig('airport-collections.ts')
const { noExpiryColumns, getNoExpiryCells } = loadConfig('no-expiry-packages.ts')
const tableConfigs = [
  ...Object.values(airportCollections).filter((collection) => collection.sourceFile).map((collection) => ({
    filePath: collection.sourceFile,
    heading: collection.heading,
    sectionLinks: collection.sectionLinks,
    noExpiryComparison: collection.pagePath === '/rankings/no-expiry/',
    items: collection.items,
  })),
  {
    filePath: airportCollections.all.sourceFile,
    heading: '## 便宜的机场汇总',
    sectionLinks: true,
    items: airportCollections.cheap.items,
  },
  {
    filePath: 'docs/风险监测/机场风险监测.md',
    heading: '## 站内观察状态',
    items: visibleAirportData,
  },
]

const syncRiskOverview = (content) => {
  const count = visibleAirportData.length
  const replacements = [
    [/^\| 站内观察状态 \| 查看 \d+ 个当前可见候选机场的状态和主要风险提示 \|$/m, `| 站内观察状态 | 查看 ${count} 个当前可见候选机场的状态和主要风险提示 |`],
    [/^\| 站内观察机场 \| \d+个 \|$/m, `| 站内观察机场 | ${count}个 |`],
    [/^\| (?:重点观察状态|观察状态记录) \| \d+条 \|$/m, `| 观察状态记录 | ${count}条 |`],
  ]

  return replacements.reduce((current, [pattern, value]) => {
    if (!pattern.test(current)) fail('docs/风险监测/机场风险监测.md: missing risk overview row')
    return current.replace(pattern, value)
  }, content)
}

const syncRecommendationScope = (content) => {
  const recordedNames = new Set(airportCollections.chatgpt.items.map((airport) => airport.name))
  const recommendations = airportCollections.mainRecommendation.items
  const recordedCount = recommendations.filter((airport) => recordedNames.has(airport.name)).length
  const scope = `本站已整理[${visibleAirportData.length}家机场资料](/posts/jichang-heji/)，本页按客户端、预算与套餐周期精选${recommendations.length}款，其中${recordedCount}款附[Siilas带日期测试记录](#测试证据摘要)。`
  const pattern = /<!-- recommendation-scope:start -->[\s\S]*?<!-- recommendation-scope:end -->/
  if (!pattern.test(content)) fail('docs/机场推荐/机场推荐.md: missing recommendation scope markers')

  // Counts describe source records and editorial selections, not continuous monitoring.
  return content.replace(pattern, `<!-- recommendation-scope:start -->\n\n${scope}\n\n<!-- recommendation-scope:end -->`)
}

const renderTable = ({ headers, divider, rows }, airports, config) => config.noExpiryComparison ? [
  `| ${noExpiryColumns.join(' | ')} |`,
  `| ${noExpiryColumns.map(() => '---').join(' | ')} |`,
  ...airports.map((airport) => `| [${airport.name}](${airport.path}) | ${getNoExpiryCells(airport.path).join(' | ')} |`),
].join('\n') : [
  `| ${headers.join(' | ')} |`,
  divider,
  ...airports.map((airport, index) => {
    const existingRow = rows.find((row) => {
      const link = parseAirportCell(row['机场'])
      return config.sectionLinks
        ? link?.name.toLowerCase() === airport.name.toLowerCase()
        : link?.path === normalizeRoute(airport.path)
    }) || {}
    const cells = headers.map((header) => {
      const getter = columnGetters[header]
      if (getter) return getter(airport, index, existingRow, config)
      if (existingRow[header]) return existingRow[header]
      if (header === '适合场景') return scenarioSummary(airport)

      fail(`${config.filePath}: missing manual value for ${airport.name} ${header}`)
    })

    return `| ${cells.join(' | ')} |`
  }),
].join('\n')

const syncTable = (config) => {
  const absolutePath = join(root, config.filePath)
  if (!existsSync(absolutePath)) fail(`Missing ${config.filePath}`)

  const original = readFileSync(absolutePath, 'utf8')
  const source = config.filePath === 'docs/风险监测/机场风险监测.md'
    ? syncRiskOverview(original)
    : config.filePath === airportCollections.mainRecommendation.sourceFile
      ? syncRecommendationScope(original)
      : original
  const lines = source.split('\n')
  const headingIndex = lines.findIndex((line) => line.trim() === config.heading)
  if (headingIndex === -1) fail(`${config.filePath}: missing heading ${config.heading}`)

  const tableStart = lines.findIndex((line, index) => (
    index > headingIndex && line.trim().startsWith('|')
  ))
  if (tableStart === -1) fail(`${config.filePath}: missing table after ${config.heading}`)

  const table = parseMarkdownTable(lines, tableStart)
  const renderedTable = renderTable(table, config.items, config)
  const next = [
    ...lines.slice(0, tableStart),
    ...renderedTable.split('\n'),
    ...lines.slice(tableStart + table.length),
  ].join('\n')

  if (next !== original && !checkOnly) {
    writeFileSync(absolutePath, next)
  }

  return next !== original
}

if (!existsSync(airportsPath)) fail(`Missing ${airportsPath}`)

const changedFiles = [...new Set(tableConfigs
  .filter((config) => syncTable(config))
  .map((config) => config.filePath))]

if (checkOnly && changedFiles.length) {
  console.error('Airport tables are out of sync:')
  changedFiles.forEach((filePath) => console.error(`- ${filePath}`))
  console.error('Run node scripts/sync-airport-tables.mjs.')
  process.exit(1)
}

if (changedFiles.length) {
  console.log(`Synced ${changedFiles.length} airport table files.`)
  changedFiles.forEach((filePath) => console.log(`- ${filePath}`))
} else {
  console.log('Airport tables are in sync.')
}
