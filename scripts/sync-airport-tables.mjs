import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from './lib/load-config.mjs'

const root = process.cwd()
const airportsPath = join(root, 'docs/.vuepress/config/airports.ts')
const checkOnly = process.argv.includes('--check')
const { splitMarkdownTableRow, escapeMarkdownTableCell } = loadConfig('markdown-table.ts')
const {
  comparisonNoticeColumn, getAirportComparisonNotice,
  getRecommendationPackagePrimary, getRecommendationPackageSecondary,
} = loadConfig('airport-comparison.ts')

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const normalizeRoute = (path) => {
  if (path === '/') return '/'
  return path.endsWith('/') ? path : `${path}/`
}

export const parseMarkdownTable = (lines, tableStart) => {
  const tableLines = []

  for (let index = tableStart; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line.startsWith('|')) break
    tableLines.push(lines[index])
  }

  const headers = splitMarkdownTableRow(tableLines[0] || '')
  const dividerCells = splitMarkdownTableRow(tableLines[1] || '')
  if (!headers.length || dividerCells.length !== headers.length || dividerCells.some((cell) => !/^:?-+:?$/.test(cell))) {
    throw new Error('Markdown table headers and divider must have matching columns')
  }
  const divider = tableLines[1] || `| ${headers.map(() => '---').join(' | ')} |`
  const rows = tableLines.slice(2).map((line) => {
    const cells = splitMarkdownTableRow(line)
    if (cells.length !== headers.length) {
      throw new Error(`Markdown table has ${cells.length} cells; expected ${headers.length}: ${line}`)
    }
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
  const firstLine = String(value).replace(/\r\n|\r|\n/g, ' ')
  return separator ? `${firstLine}${previous.slice(separator.index)}` : firstLine
}

const recommendationPackageCell = (airport, previous = '') => {
  const notes = previous.split(/<br\s*\/?\s*>/i).slice(1)
  const secondary = getRecommendationPackageSecondary(airport)
  return [getRecommendationPackagePrimary(airport), ...(secondary ? [secondary] : []),
    ...notes.filter((note) => !secondary || !note.startsWith('日享备选：'))].join('<br>')
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
  if (config.capabilityStyle !== 'checkmark') return booleanText(airport[field])
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
  最低价格: (airport, _index, row) => withEditorialNotes(airport.priceText, row['最低价格']),
  价格与试用: (airport) => `${airport.priceText}，${airport.trial === null ? '试用待核实' : airport.trial ? '支持试用' : '无试用'}`,
  套餐与试用: (airport, _index, row) => recommendationPackageCell(airport, row['套餐与试用']),
  客户端与限制: (airport, _index, row) => withEditorialNotes(clientSummary(airport), row['客户端与限制']),
  月流量: (airport, _index, _row, config) => config.sectionLinks ? airport.traffic.replace(/\/月$/, '') : airport.traffic,
  流量额度: (airport) => airport.traffic,
  流量: (airport) => airport.traffic,
  试用: capabilityCell('trial', '试用'),
  免费试用: capabilityCell('trial', '免费试用'),
  试用内容: (_airport, _index, row) => row['试用内容'] || '支持试用，领取条件与额度见资料页',
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
  [comparisonNoticeColumn]: (airport) => {
    const notice = getAirportComparisonNotice(airport.path)
    return notice ? `${notice.text}；[查看资料](${notice.sourcePath})` : '—'
  },
}

const { visibleAirportData, airportMetrics, airportDataLastReviewed } = loadConfig('airports.ts')
const { airportCollections } = loadConfig('airport-collections.ts')
const { noExpiryColumns, getNoExpiryCells } = loadConfig('no-expiry-packages.ts')
const tableConfigs = [
  ...Object.entries(airportCollections).filter(([, collection]) => collection.sourceFile).map(([key, collection]) => ({
    key,
    filePath: collection.sourceFile,
    heading: collection.heading,
    sectionLinks: collection.sectionLinks,
    capabilityStyle: collection.capabilityStyle,
    notice: key === 'all',
    noExpiryComparison: key === 'noExpiry',
    items: collection.items,
  })),
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
  const coverage = recordedCount === recommendations.length
    ? `${recordedCount}/${recommendations.length}款均有[Siilas带日期测试记录](#测试证据摘要)，不代表同条件对照或持续可用。`
    : `${recordedCount}/${recommendations.length}款有[Siilas带日期测试记录](#测试证据摘要)，${recommendations.length - recordedCount}款暂无已接收测速。`
  const scope = `本站已整理[${visibleAirportData.length}家机场资料](#机场价格总表)，本页按客户端、预算与套餐周期精选${recommendations.length}款。**证据覆盖：${coverage}**`
  const pattern = /<!-- recommendation-scope:start -->[\s\S]*?<!-- recommendation-scope:end -->/
  if (!pattern.test(content)) fail('docs/机场推荐/机场推荐.md: missing recommendation scope markers')

  // Counts describe source records and editorial selections, not continuous monitoring.
  return content.replace(pattern, `<!-- recommendation-scope:start -->\n\n${scope}\n\n<!-- recommendation-scope:end -->`)
}

export const syncAirportStatistics = (content, metrics = airportMetrics, reviewedAt = airportDataLastReviewed) => {
  const pattern = /<!-- airport-statistics:start -->[\s\S]*?<!-- airport-statistics:end -->/
  if (!pattern.test(content)) return content
  const percentage = (count) => metrics.count ? Math.round(count / metrics.count * 100) : 0
  const lines = [
    `当前收录机场数量：${metrics.count}`,
    '',
    `资料口径：本站已收录资料；最近一次全量资料复核为${reviewedAt}，统计同步不代表重新核价或测试。`,
    '',
    `- 支持试用：${metrics.trialCount}家`,
    `- 支持不限时套餐：${metrics.noExpiryCount}家`,
    `- 不限时有效期待核实：${metrics.noExpiryUnverifiedCount}家`,
    `- 支持专属客户端：${metrics.dedicatedClientCount}家`,
    `- 支持通用订阅：${metrics.universalSubscriptionCount}家`,
    `- 首次入门参考价低于10元：${metrics.cheapUnderTenCount}家`,
    `- 平均首次入门参考价：${metrics.averagePrice}元`,
    `- 常规持续套餐参考价低于10元：${metrics.regularCheapUnderTenCount}家`,
    `- 平均常规持续套餐参考价：${metrics.regularAveragePrice}元`,
    '',
    `- 支持试用比例：${percentage(metrics.trialCount)}%`,
    `- 支持不限时比例：${percentage(metrics.noExpiryCount)}%`,
    `- 支持专属客户端比例：${percentage(metrics.dedicatedClientCount)}%`,
    `- 支持通用订阅比例：${percentage(metrics.universalSubscriptionCount)}%`,
    `- 首次入门参考价低于10元比例：${percentage(metrics.cheapUnderTenCount)}%`,
    `- 常规持续套餐参考价低于10元比例：${percentage(metrics.regularCheapUnderTenCount)}%`,
    '',
    '价格区分首次优惠与常规持续套餐；折合月价不等于可按月购买。支持状态不代表所有套餐、平台或长期可用性已验证。',
  ]
  return content.replace(pattern, `<!-- airport-statistics:start -->\n\n${lines.join('\n')}\n\n<!-- airport-statistics:end -->`)
}

export const renderTable = ({ headers, divider, rows }, airports, config) => {
  if (config.notice && !headers.includes(comparisonNoticeColumn)) {
    headers = [...headers, comparisonNoticeColumn]
    divider = `| ${headers.map(() => '---').join(' | ')} |`
  }
  return config.noExpiryComparison ? [
  `| ${noExpiryColumns.map(escapeMarkdownTableCell).join(' | ')} |`,
  `| ${noExpiryColumns.map(() => '---').join(' | ')} |`,
  ...airports.map((airport) => `| ${[`[${airport.name}](${airport.path})`, ...getNoExpiryCells(airport.path)].map(escapeMarkdownTableCell).join(' | ')} |`),
].join('\n') : [
  `| ${headers.map(escapeMarkdownTableCell).join(' | ')} |`,
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

    return `| ${cells.map(escapeMarkdownTableCell).join(' | ')} |`
  }),
].join('\n')
}

const syncTable = (config) => {
  const absolutePath = join(root, config.filePath)
  if (!existsSync(absolutePath)) fail(`Missing ${config.filePath}`)

  const original = readFileSync(absolutePath, 'utf8')
  const source = config.filePath === 'docs/风险监测/机场风险监测.md'
    ? syncRiskOverview(original)
    : config.key === 'mainRecommendation'
      ? syncAirportStatistics(syncRecommendationScope(original))
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

const syncAirportTables = () => {
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
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) syncAirportTables()
