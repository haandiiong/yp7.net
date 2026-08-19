import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = process.cwd()
const airportReviewDir = join(root, 'docs/机场评测')
const airportsPath = join(root, 'docs/.vuepress/config/airports.ts')
const checkOnly = process.argv.includes('--check')
const testingPolicyEffectiveDate = '2026-08-18'
const currentTestingSourceName = 'Siilas 测速中心'
const currentTestingSourceUrl = 'https://siilas.com/test/'

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
  stable: { label: '机场推荐', link: '/posts/jichang-tuijian/' },
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
      ['当前测试数据来源', `[${currentTestingSourceName}](${currentTestingSourceUrl})（yp7.net 不再自行测试）`],
      ['当前状态', airport.status],
      ['购买建议', '不建议新购或续费'],
      ['历史套餐价格', `${airport.priceText}，${airport.traffic}`],
      ['客户端与订阅', '历史资料仅供识别，当前不建议注册、导入订阅或加购套餐'],
      ['稳定性判断', airport.status],
      ['风险记录', airport.risk],
      ['证据摘要', airport.summary],
    ]

    return [
      `## ${displayName}推荐依据与历史测试记录`,
      '',
      '| 项目 | 当前记录 |',
      '|---|---|',
      ...rows.map(([label, value]) => `| ${escapeTableCell(label)} | ${escapeTableCell(value)} |`),
    ].join('\n')
  }

  const performance = airport.performance
  const hasPerformance = Boolean(performance)
  const rows = [
    ['当前测试数据来源', `[${currentTestingSourceName}](${currentTestingSourceUrl})；${testingPolicyEffectiveDate} 起 yp7.net 不再自行测试`],
    ['历史记录状态', hasPerformance ? 'yp7.net 历史资料，不代表当前表现' : '无 yp7.net 历史测试记录'],
    ['历史测试时间', hasPerformance ? formatDate(performance.lastTestedAt) : '无历史记录'],
    ['历史测试时段', performance?.testWindow || '无历史记录'],
    ['历史测试地区', performance?.testRegion || '无历史记录'],
    ['历史测试网络', performance?.testNetwork || '无历史记录'],
    ['历史测试设备', performance?.testDevice || '无历史记录'],
    ['客户端资料', clientSummary(airport)],
    ['套餐价格', `${airport.priceText}，${airport.traffic}`],
    ['免费试用', booleanText(airport.trial)],
    ['不限时套餐', booleanText(airport.noExpiry)],
    ['通用订阅', booleanText(airport.universalSubscription)],
    ['适合场景', scenarioSummary(airport)],
    ['历史 ChatGPT 表现', performance?.chatgptResult || '无历史记录；请查看 Siilas 最新记录'],
    ['历史 YouTube 4K 表现', performance?.youtube4kResult || '无历史记录；请查看 Siilas 最新记录'],
    ['历史下载速度', performance?.downloadMbpsRange || '无历史记录；请查看 Siilas 最新记录'],
    ['历史稳定性判断', performance?.stability || '无历史测试判断'],
    ['历史证据等级', performance?.evidenceLevel ? `${performance.evidenceLevel}级` : '无历史测试证据'],
    ['风险记录', airport.risk],
    ['历史证据摘要', performance?.evidenceSummary || '无 yp7.net 历史测试记录；当前页面只整理推荐资料与风险提示'],
  ]

  return [
    `## ${displayName}推荐依据与历史测试记录`,
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
    { label: '机场大全', link: '/posts/jichang-heji/' },
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
        { label: '机场推荐方法与测试数据来源', link: '/methodology/' },
        { label: '机场推荐：2026场景筛选与风险提示', link: '/posts/jichang-tuijian/' },
        { label: '机场大全：价格、流量、试用与风险状态', link: '/posts/jichang-heji/' },
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
    { label: '机场推荐：2026场景筛选与风险提示', link: '/posts/jichang-tuijian/' },
    primaryScenarioLink,
    { label: '机场大全：价格、流量、试用与风险状态', link: '/posts/jichang-heji/' },
    { label: '机场风险监测', link: '/risk-monitor/' },
    { label: '机场推荐方法与测试数据来源', link: '/methodology/' },
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
  const existingEvidencePattern = /\n## [^\n]*(?:测评证据区|推荐依据与历史测试记录)\n[\s\S]*?(?=\n## |\n$)/

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
