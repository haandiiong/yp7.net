import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

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

const loadAirportConfig = (filePath) => {
  const source = readFileSync(filePath, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  const context = { exports: {} }

  vm.runInNewContext(output, context)

  return {
    airportData: context.exports.airportData || [],
    visibleAirportData: context.exports.visibleAirportData || context.exports.airportData || [],
  }
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
    path: normalizeRoute(match[2]),
  }
}

const booleanText = (value) => (value ? '支持' : '不支持')

const clientSummary = (airport) => {
  if (airport.dedicatedClient && airport.universalSubscription) return '专属客户端、通用订阅'
  if (airport.dedicatedClient) return '专属客户端'
  if (airport.universalSubscription) return '通用订阅'

  return '无专属客户端'
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

const airportLink = (airport) => `[${airport.name}](${airport.path})`

const hasSalesSample = (airport) => typeof airport.salesSample === 'number'
const byScenario = (scenario) => (airport) => airport.scenarios.includes(scenario)
const cheapFilter = (airport) => airport.price <= 10 || airport.scenarios.includes('cheap')
const clashFilter = (airport) => airport.universalSubscription || airport.scenarios.includes('clash')

const columnGetters = {
  机场: airportLink,
  当前状态: (airport) => airport.status,
  客户端: clientSummary,
  价格: (airport) => airport.priceText,
  最低价格: (airport) => airport.priceText,
  月流量: (airport) => airport.traffic,
  流量: (airport) => airport.traffic,
  试用: (airport) => booleanText(airport.trial),
  不限时: (airport) => booleanText(airport.noExpiry),
  不限时状态: (airport) => booleanText(airport.noExpiry),
  专属客户端: (airport) => booleanText(airport.dedicatedClient),
  通用订阅: (airport) => booleanText(airport.universalSubscription),
  '订阅/客户端': clientSummary,
  风险提示: (airport) => airport.risk,
  状态: (airport) => airport.status,
  排名: (_airport, index) => String(index + 1),
  销量样本: (airport) => String(airport.salesSample),
}

const tableConfigs = [
  {
    filePath: 'docs/机场榜单/全量机场榜单.md',
    heading: '## 全量机场数据',
    getAirports: ({ visibleAirportData }) => visibleAirportData,
  },
  {
    filePath: 'docs/风险监测/机场风险监测.md',
    heading: '## 站内观察状态',
    getAirports: ({ visibleAirportData }) => visibleAirportData,
  },
  {
    filePath: 'docs/机场榜单/销量机场榜.md',
    heading: '## 销量榜单',
    getAirports: ({ visibleAirportData }) => visibleAirportData
      .filter(hasSalesSample)
      .sort((a, b) => b.salesSample - a.salesSample),
  },
  {
    filePath: 'docs/机场榜单/稳定机场榜.md',
    heading: '## 稳定机场候选',
    rowFilter: byScenario('stable'),
  },
  {
    filePath: 'docs/机场榜单/低价机场榜.md',
    heading: '## 低价机场候选',
    rowFilter: cheapFilter,
  },
  {
    filePath: 'docs/机场榜单/Clash机场榜.md',
    heading: '## Clash机场候选',
    rowFilter: clashFilter,
  },
  {
    filePath: 'docs/机场榜单/ChatGPT机场榜.md',
    heading: '## ChatGPT机场候选',
    getAirports: ({ visibleAirportData }) => visibleAirportData.filter(byScenario('chatgpt')),
  },
  {
    filePath: 'docs/机场榜单/流媒体机场榜.md',
    heading: '## 流媒体机场候选',
    rowFilter: byScenario('streaming'),
  },
  {
    filePath: 'docs/机场榜单/免费试用机场榜.md',
    heading: '## 免费试用机场候选',
    getAirports: ({ visibleAirportData }) => visibleAirportData.filter((airport) => airport.trial),
  },
  {
    filePath: 'docs/机场榜单/不限时机场榜.md',
    heading: '## 不限时与按量套餐候选',
    getAirports: ({ visibleAirportData }) => visibleAirportData.filter((airport) => airport.noExpiry),
  },
  {
    filePath: 'docs/机场榜单/专属客户端机场榜.md',
    heading: '## 专属客户端机场候选',
    getAirports: ({ visibleAirportData }) => visibleAirportData.filter((airport) => airport.dedicatedClient),
  },
]

const renderTable = ({ headers, divider, rows }, airports, filePath) => [
  `| ${headers.join(' | ')} |`,
  divider,
  ...airports.map((airport, index) => {
    const existingRow = rows.find((row) => parseAirportCell(row['机场'])?.path === normalizeRoute(airport.path)) || {}
    const cells = headers.map((header) => {
      const getter = columnGetters[header]
      if (getter) return getter(airport, index)
      if (existingRow[header]) return existingRow[header]
      if (header === '适合场景') return scenarioSummary(airport)

      fail(`${filePath}: missing manual value for ${airport.name} ${header}`)
    })

    return `| ${cells.join(' | ')} |`
  }),
].join('\n')

const syncTable = (config, airportContext, airportByPath) => {
  const absolutePath = join(root, config.filePath)
  if (!existsSync(absolutePath)) fail(`Missing ${config.filePath}`)

  const original = readFileSync(absolutePath, 'utf8')
  const lines = original.split('\n')
  const headingIndex = lines.findIndex((line) => line.trim() === config.heading)
  if (headingIndex === -1) fail(`${config.filePath}: missing heading ${config.heading}`)

  const tableStart = lines.findIndex((line, index) => (
    index > headingIndex && line.trim().startsWith('|')
  ))
  if (tableStart === -1) fail(`${config.filePath}: missing table after ${config.heading}`)

  const table = parseMarkdownTable(lines, tableStart)
  const airports = config.getAirports
    ? config.getAirports(airportContext)
    : table.rows.map((row) => {
        const airportCell = parseAirportCell(row['机场'])
        if (!airportCell) fail(`${config.filePath}: invalid airport cell "${row['机场']}"`)

        const airport = airportByPath.get(airportCell.path)
        if (!airport) fail(`${config.filePath}: unknown airport path ${airportCell.path}`)
        if (config.rowFilter && !config.rowFilter(airport)) {
          fail(`${config.filePath}: ${airport.name} does not match ${config.heading}`)
        }

        return airport
      })

  const renderedTable = renderTable(table, airports, config.filePath)
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

const airportContext = loadAirportConfig(airportsPath)
const airportByPath = new Map(airportContext.airportData.map((airport) => [
  normalizeRoute(airport.path),
  airport,
]))
const changedFiles = tableConfigs
  .filter((config) => syncTable(config, airportContext, airportByPath))
  .map((config) => config.filePath)

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
