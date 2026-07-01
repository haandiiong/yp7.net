import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = process.cwd()
const airportReviewDir = join(root, 'docs/机场评测')
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

const toProjectPath = (filePath) => relative(root, filePath).replace(/\\/g, '/')

const walkFiles = (dir) => {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(dir, entry.name)

    if (entry.isDirectory()) return walkFiles(filePath)
    if (entry.isFile()) return [filePath]

    return []
  })
}

const parseFrontmatter = (content = '') => {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  return match?.[1] || ''
}

const getFrontmatterValue = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '')
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
    airportDataLastReviewed: context.exports.airportDataLastReviewed || '2026-07-01',
    hiddenAirportStatuses: context.exports.hiddenAirportStatuses || new Set(['已淘汰', '停止推荐', '下架']),
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

const scenarioRankingLinks = {
  stable: { label: '稳定机场榜', link: '/rankings/stable/' },
  cheap: { label: '低价机场榜', link: '/rankings/cheap/' },
  clash: { label: 'Clash机场榜', link: '/rankings/clash/' },
  chatgpt: { label: 'ChatGPT机场榜', link: '/rankings/chatgpt/' },
  streaming: { label: '流媒体机场榜', link: '/rankings/streaming/' },
  trial: { label: '免费试用机场榜', link: '/rankings/trial/' },
}

const formatDate = (value = '') => {
  const [year, month, day] = value.replace(/\//g, '-').split('-').map((part) => Number(part))
  if (!year || !month || !day) return value

  return `${year}年${month}月${day}日`
}

const escapeTableCell = (value) => String(value ?? '')
  .replace(/\|/g, '\\|')
  .replace(/\n+/g, '<br>')

const uniqueLinks = (links) => {
  const seen = new Set()

  return links.filter((item) => {
    if (!item?.link || seen.has(item.link)) return false
    seen.add(item.link)
    return true
  })
}

const renderMarkdownLinks = (links) => links
  .map((item) => `- [${item.label}](${item.link})`)
  .join('\n')

const scenarioSummary = (airport) => airport.scenarios
  .map((scenario) => scenarioLabels[scenario] || scenario)
  .join('、') || '待补充'

const getDisplayNameFromTitle = (title, fallback) => {
  const match = title?.match(/^(.+?)机场/)

  return match?.[1] || fallback
}

const renderEvidenceSection = (airport, airportDataLastReviewed, displayName, hiddenAirportStatuses) => {
  if (hiddenAirportStatuses.has(airport.status)) {
    const rows = [
      ['风险复核时间', formatDate(airportDataLastReviewed)],
      ['当前状态', airport.status],
      ['购买建议', '不建议新购或续费'],
      ['历史套餐价格', `${airport.priceText}，${airport.traffic}`],
      ['客户端与订阅', '历史资料仅供识别，当前不建议注册、导入订阅或加购套餐'],
      ['稳定性判断', airport.status],
      ['风险记录', airport.risk],
      ['证据摘要', airport.summary],
    ]

    return [
      `## ${displayName}测评证据区`,
      '',
      '| 项目 | 当前记录 |',
      '|---|---|',
      ...rows.map(([label, value]) => `| ${escapeTableCell(label)} | ${escapeTableCell(value)} |`),
    ].join('\n')
  }

  const performance = airport.performance
  const hasPerformance = Boolean(performance)
  const rows = [
    ['测试时间', hasPerformance ? formatDate(performance.lastTestedAt) : `待补充连续实测；结构化资料最后复核：${formatDate(airportDataLastReviewed)}`],
    ['测试时段', performance?.testWindow || '20:00-23:00 晚高峰待连续复测'],
    ['测试地区', performance?.testRegion || '待补充常用节点地区'],
    ['测试网络', performance?.testNetwork || '待补充家庭宽带 / 移动网络环境'],
    ['测试设备', performance?.testDevice || '待补充 Mac / Windows / Android / iOS'],
    ['测试客户端', clientSummary(airport)],
    ['套餐价格', `${airport.priceText}，${airport.traffic}`],
    ['免费试用', booleanText(airport.trial)],
    ['不限时套餐', booleanText(airport.noExpiry)],
    ['通用订阅', booleanText(airport.universalSubscription)],
    ['适合场景', scenarioSummary(airport)],
    ['ChatGPT 表现', performance?.chatgptResult || '待复测，不直接承诺长期可用'],
    ['YouTube 4K 表现', performance?.youtube4kResult || '待复测，需结合晚高峰连续播放观察'],
    ['下载速度参考', performance?.downloadMbpsRange || '待补充 Speedtest / 实际下载样本'],
    ['稳定性判断', performance?.stability || airport.status],
    ['证据等级', performance?.evidenceLevel ? `${performance.evidenceLevel}级` : 'C级，当前以资料整理和后续复测计划为主'],
    ['风险记录', airport.risk],
    ['证据摘要', performance?.evidenceSummary || airport.summary],
  ]

  return [
    `## ${displayName}测评证据区`,
    '',
    '| 项目 | 当前记录 |',
    '|---|---|',
    ...rows.map(([label, value]) => `| ${escapeTableCell(label)} | ${escapeTableCell(value)} |`),
  ].join('\n')
}

const renderMembershipSection = (airport, hiddenAirportStatuses) => {
  if (hiddenAirportStatuses.has(airport.status)) {
    return [
      '## 本文属于',
      '',
      '- [机场风险监测](/risk-monitor/)',
    ].join('\n')
  }

  const links = [
    { label: '机场推荐', link: '/posts/jichang-tuijian/' },
    { label: '全量机场榜单', link: '/rankings/all/' },
    ...airport.scenarios.map((scenario) => scenarioRankingLinks[scenario]).filter(Boolean),
    airport.noExpiry ? { label: '不限时套餐榜', link: '/rankings/no-expiry/' } : undefined,
    airport.dedicatedClient ? { label: '专属客户端机场榜', link: '/rankings/dedicated-client/' } : undefined,
    { label: '机场风险监测', link: '/risk-monitor/' },
  ]

  return [
    '## 本文属于',
    '',
    renderMarkdownLinks(uniqueLinks(links)),
  ].join('\n')
}

const renderRelatedSection = (airport, visibleAirportData, displayNameByPath, hiddenAirportStatuses) => {
  if (hiddenAirportStatuses.has(airport.status)) {
    return [
      '## 相关阅读',
      '',
      renderMarkdownLinks([
        { label: '机场风险监测', link: '/risk-monitor/' },
        { label: '机场测评方法', link: '/methodology/' },
        { label: '机场推荐：2026稳定机场节点排行与晚高峰实测', link: '/posts/jichang-tuijian/' },
        { label: '全量机场榜单：价格、流量、试用与风险状态', link: '/rankings/all/' },
      ]),
    ].join('\n')
  }

  const peerAirports = visibleAirportData
    .filter((item) => item.path !== airport.path)
    .filter((item) => item.scenarios.some((scenario) => airport.scenarios.includes(scenario)))
    .slice(0, 3)

  const primaryScenarioLink = airport.scenarios
    .map((scenario) => scenarioRankingLinks[scenario])
    .find(Boolean)

  const links = uniqueLinks([
    { label: '机场推荐：2026稳定机场节点排行与晚高峰实测', link: '/posts/jichang-tuijian/' },
    primaryScenarioLink,
    { label: '全量机场榜单：价格、流量、试用与风险状态', link: '/rankings/all/' },
    { label: '机场风险监测', link: '/risk-monitor/' },
    { label: '机场测评方法', link: '/methodology/' },
    ...peerAirports.map((item) => ({
      label: `${displayNameByPath.get(normalizeRoute(item.path)) || item.name}机场怎么样？`,
      link: item.path,
    })),
  ])

  return [
    '## 相关阅读',
    '',
    renderMarkdownLinks(links),
  ].join('\n')
}

const stripManagedBottomSections = (content) => {
  const sectionStarts = ['\n## 本文属于\n', '\n## 相关阅读\n']
    .map((marker) => content.indexOf(marker))
    .filter((index) => index !== -1)

  if (!sectionStarts.length) return content.trimEnd()

  return content.slice(0, Math.min(...sectionStarts)).trimEnd()
}

const upsertEvidenceSection = (content, evidenceSection) => {
  const existingEvidencePattern = /\n## [^\n]*测评证据区\n[\s\S]*?(?=\n## |\n$)/

  if (existingEvidencePattern.test(content)) {
    return content.replace(existingEvidencePattern, `\n${evidenceSection}\n`)
  }

  const insertBeforePattern = /\n## (FAQ|.*常见问题|总结)\b/
  const insertBeforeMatch = content.match(insertBeforePattern)

  if (insertBeforeMatch?.index !== undefined) {
    return `${content.slice(0, insertBeforeMatch.index).trimEnd()}\n\n${evidenceSection}\n${content.slice(insertBeforeMatch.index)}`
  }

  return `${content.trimEnd()}\n\n${evidenceSection}`
}

if (!existsSync(airportsPath)) fail('Missing docs/.vuepress/config/airports.ts')

const { airportData, visibleAirportData, airportDataLastReviewed, hiddenAirportStatuses } = loadAirportConfig(airportsPath)
const airportReviewFiles = walkFiles(airportReviewDir).filter((filePath) => filePath.endsWith('.md'))
const pageByRoute = new Map()

airportReviewFiles.forEach((filePath) => {
  const content = readFileSync(filePath, 'utf8')
  const frontmatter = parseFrontmatter(content)
  const permalink = getFrontmatterValue(frontmatter, 'permalink')
  const title = getFrontmatterValue(frontmatter, 'title')

  if (permalink) {
    pageByRoute.set(normalizeRoute(permalink), {
      filePath,
      content,
      displayName: getDisplayNameFromTitle(title, undefined),
    })
  }
})

const changedFiles = []
const errors = []
const displayNameByPath = new Map(airportData.map((airport) => {
  const page = pageByRoute.get(normalizeRoute(airport.path))

  return [normalizeRoute(airport.path), page?.displayName || airport.name]
}))

airportData.forEach((airport) => {
  const page = pageByRoute.get(normalizeRoute(airport.path))

  if (!page) {
    errors.push(`Missing review page for ${airport.name} ${airport.path}`)
    return
  }

  const displayName = displayNameByPath.get(normalizeRoute(airport.path)) || airport.name
  const evidenceSection = renderEvidenceSection(airport, airportDataLastReviewed, displayName, hiddenAirportStatuses)
  const membershipSection = renderMembershipSection(airport, hiddenAirportStatuses)
  const relatedSection = renderRelatedSection(airport, visibleAirportData, displayNameByPath, hiddenAirportStatuses)
  const withoutManagedBottom = stripManagedBottomSections(page.content)
  const withEvidence = upsertEvidenceSection(withoutManagedBottom, evidenceSection)
  const next = `${withEvidence.trimEnd()}\n\n${membershipSection}\n\n${relatedSection}\n`

  if (next !== page.content) {
    if (!checkOnly) writeFileSync(page.filePath, next)
    changedFiles.push(toProjectPath(page.filePath))
  }
})

if (errors.length) {
  console.error('Airport review section sync failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

if (changedFiles.length && checkOnly) {
  console.error('Airport review sections are out of sync:')
  changedFiles.forEach((filePath) => console.error(`- ${filePath}`))
  process.exit(1)
}

if (changedFiles.length) {
  console.log(`Synced airport review sections in ${changedFiles.length} files.`)
} else {
  console.log('Airport review sections are in sync.')
}
