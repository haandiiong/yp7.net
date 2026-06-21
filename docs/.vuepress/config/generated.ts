import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { airportData, airportMetrics, airportSalesSampleMeta, visibleAirportData } from './airports'
import { defaultImage, defaultRobots, hostname, siteDescription, siteKeywords, siteLastReviewed, siteName } from './site'

interface LlmsOptions {
  shouldIncludeInLlms: (page: any) => boolean
  getLlmsSection: (page: any) => string
  truncateText: (value?: string, maxLength?: number) => string
}

const getCanonicalUrl = (path: string) => `${hostname}${path}`
const getDataCanonicalUrl = (slug: string) => `${hostname}/data/${slug}`

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const stripMarkdown = (content = '') => content
  .replace(/==([^=]+)==\{[^}]+\}/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_`>#{}]/g, '')
  .replace(/\s+/g, ' ')
  .trim()

const truncateMetaDescription = (description = '') => (
  description.length <= 158 ? description : `${description.slice(0, 157)}…`
)

const getDataPageDescription = (description = '') => {
  const normalizedDescription = stripMarkdown(description || siteDescription)
  if (normalizedDescription.length >= 120) return truncateMetaDescription(normalizedDescription)

  const suffix = '数据页提供机器可读 JSON、Markdown 和 HTML 表格，覆盖价格、流量、试用、客户端、订阅兼容和风险状态，方便搜索引擎与读者引用。'
  const separator = /[。.!！？?]$/.test(normalizedDescription) ? '' : '。'

  return truncateMetaDescription(`${normalizedDescription}${separator}${suffix}`)
}

export const isSponsoredLink = (href = '') => {
  if (!/^https?:\/\//.test(href)) return false

  return /(\?|&|#)(code|aff|r|c|from)=/i.test(href)
    || /\/\/haandiiong\./i.test(href)
    || /vipaff|aff\.cc|kuailicloudt|sogoyunaff|gsyaff|2maoyunaff|jlcvipaff/i.test(href)
}

export const qualifySponsoredAnchors = (html = '') => html.replace(/<a\b([^>]*?)>/gi, (anchor, attrs) => {
  const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i)
  if (!hrefMatch || !isSponsoredLink(hrefMatch[2])) return anchor

  const withoutRel = attrs.replace(/\srel=(["']).*?\1/i, '')
  const withTarget = /\starget=/i.test(withoutRel)
    ? withoutRel.replace(/\starget=(["']).*?\1/i, ' target="_blank"')
    : `${withoutRel} target="_blank"`

  return `<a${withTarget} rel="sponsored nofollow noopener noreferrer">`
})

const injectGeneratedH1 = (html = '', title = '') => {
  if (/<h1\b/i.test(html)) return html

  return html.replace(/(<div id="VPContent"[^>]*>)/, `$1<h1 class="visually-hidden">${escapeHtml(title)}</h1>`)
}

const replaceGeneratedTitle = (html = '', title = '') => (
  html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
)

const replaceRobotsMeta = (html = '', content = defaultRobots) => {
  if (/<meta name="robots"/i.test(html)) {
    return html.replace(/<meta name="robots"[^>]*>/i, `<meta name="robots" content="${escapeHtml(content)}">`)
  }

  return html.replace(/(<head[^>]*>)/i, `$1<meta name="robots" content="${escapeHtml(content)}">`)
}

const mergeRel = (current = '', additions: string[]) => Array.from(new Set([
  ...current.split(/\s+/).filter(Boolean),
  ...additions,
])).join(' ')

const patchGeneratedExternalLinks = (html = '') => html.replace(/<a\b([^>]*?)>/gi, (anchor, attrs) => {
  const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i)
  if (!hrefMatch || !/^https?:\/\//.test(hrefMatch[2])) return anchor

  const relMatch = attrs.match(/\srel=(["'])(.*?)\1/i)
  const additions = isSponsoredLink(hrefMatch[2])
    ? ['sponsored', 'nofollow', 'noopener', 'noreferrer']
    : ['noopener', 'noreferrer']
  const rel = mergeRel(relMatch?.[2] || '', additions)

  if (relMatch) return `<a${attrs.replace(/\srel=(["']).*?\1/i, ` rel="${rel}"`)}>`

  return `<a${attrs} rel="${rel}">`
})

const walkGeneratedHtml = (dir: string, visit: (file: string) => void) => {
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const file = `${dir}/${entry.name}`
    if (entry.isDirectory()) walkGeneratedHtml(file, visit)
    else if (entry.name.endsWith('.html')) visit(file)
  })
}

const generatedHtmlPatches = [
  ['index.html', '2026机场推荐与科学上网教程：稳定机场榜单、Clash配置与风险监测', defaultRobots],
  ['blog/index.html', 'yp7.net 全部文章索引：2026机场推荐、机场评测、科学上网教程、Clash配置与风险监测合集导航', defaultRobots],
  ['blog/tags/index.html', 'yp7.net 标签索引：机场推荐、VPN教程、Clash节点、ChatGPT机场与流媒体解锁主题分类导航', defaultRobots],
  ['blog/categories/index.html', 'yp7.net 分类索引：2026机场榜单、机场评测、工具教程、科学上网指南、风险监测与购买避坑导航', defaultRobots],
  ['blog/archives/index.html', 'yp7.net 时间归档：2026机场测评、VPN教程、Clash配置、科学上网文章更新记录与站内入口', defaultRobots],
  ['friends/index.html', 'yp7.net 友情链接：科学上网、机场测评、VPN教程、网络工具、内容合作、友情链接交换与资源站点导航', defaultRobots],
  ['404.html', '页面未找到：yp7.net 机场推荐与科学上网教程', 'noindex, follow'],
] as const

export const patchGeneratedHtml = (app: any) => {
  generatedHtmlPatches.forEach(([file, title, robots]) => {
    const htmlPath = app.dir.dest(file)
    if (!existsSync(htmlPath)) return

    const html = readFileSync(htmlPath, 'utf-8')
    const patched = replaceRobotsMeta(injectGeneratedH1(replaceGeneratedTitle(html, title), title), robots)
    if (patched !== html) writeFileSync(htmlPath, patched)
  })

  walkGeneratedHtml(app.dir.dest(), (htmlPath) => {
    const html = readFileSync(htmlPath, 'utf-8')
    const patched = patchGeneratedExternalLinks(html)
    if (patched !== html) writeFileSync(htmlPath, patched)
  })
}

const getAirportDataFiles = () => {
  const serializeAirport = (airport: typeof airportData[number]) => ({
    ...airport,
    url: getCanonicalUrl(airport.path),
  })
  const serializeSalesAirport = (airport: typeof airportData[number]) => ({
    ...serializeAirport(airport),
    salesSample: airport.salesSample,
  })
  const hasSalesSample = (airport: typeof airportData[number]) => typeof airport.salesSample === 'number'
  const byScenario = (scenario: string) => visibleAirportData.filter((airport) => airport.scenarios.includes(scenario))
  const salesRanking = visibleAirportData
    .filter(hasSalesSample)
    .sort((a, b) => b.salesSample! - a.salesSample!)

  return {
    airports: visibleAirportData.map(serializeAirport),
    rankings: {
      all: visibleAirportData.map(serializeAirport),
      sales: salesRanking.map(serializeSalesAirport),
      stable: byScenario('stable').map(serializeAirport),
      cheap: visibleAirportData.filter((airport) => airport.price <= 10 || airport.scenarios.includes('cheap')).map(serializeAirport),
      clash: visibleAirportData.filter((airport) => airport.universalSubscription || airport.scenarios.includes('clash')).map(serializeAirport),
      chatgpt: byScenario('chatgpt').map(serializeAirport),
      streaming: byScenario('streaming').map(serializeAirport),
      trial: visibleAirportData.filter((airport) => airport.trial).map(serializeAirport),
      noExpiry: visibleAirportData.filter((airport) => airport.noExpiry).map(serializeAirport),
      dedicatedClient: visibleAirportData.filter((airport) => airport.dedicatedClient).map(serializeAirport),
    },
    riskMonitor: [
      {
        name: 'echo',
        status: '已淘汰',
        risk: '客服失联，谨慎使用',
        source: `${hostname}/posts/jichang-heji/`,
      },
      ...airportData.map((airport) => ({
        name: airport.name,
        status: airport.status,
        risk: airport.risk,
        url: getCanonicalUrl(airport.path),
      })),
    ],
  }
}

const getAirportMarkdownTable = (airports: typeof airportData, columns: string[] = ['机场', '最低价格', '月流量', '试用', '不限时', '专属客户端', '通用订阅', '证据', '最后测试', '延迟', '速度区间', '状态']) => {
  const header = `| ${columns.join(' | ')} |`
  const divider = `| ${columns.map(() => '---').join(' | ')} |`
  const rows = airports.map((airport) => [
    `[${airport.name}](${getCanonicalUrl(airport.path)})`,
    airport.priceText,
    airport.traffic,
    airport.trial ? '支持' : '不支持',
    airport.noExpiry ? '支持' : '不支持',
    airport.dedicatedClient ? '支持' : '不支持',
    airport.universalSubscription ? '支持' : '不支持',
    airport.performance?.evidenceLevel || 'C',
    airport.performance?.lastTestedAt || '待复测',
    airport.performance ? `${airport.performance.latencyMs}ms` : '待复测',
    airport.performance?.downloadMbpsRange || '待复测',
    airport.status,
  ])

  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n')
}

const getSalesMarkdownTable = (airports: Array<any>) => {
  const header = '| 机场 | 销量样本 | 最低价格 | 月流量 | 试用 | 专属客户端 | 通用订阅 | 状态 |'
  const divider = '| --- | ---: | --- | --- | --- | --- | --- | --- |'
  const rows = airports.map((airport) => [
    `[${airport.name}](${getCanonicalUrl(airport.path)})`,
    airport.salesSample,
    airport.priceText,
    airport.traffic,
    airport.trial ? '支持' : '不支持',
    airport.dedicatedClient ? '支持' : '不支持',
    airport.universalSubscription ? '支持' : '不支持',
    airport.status,
  ])

  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n')
}

const renderDataHtmlPage = ({
  title,
  description,
  keywords,
  canonical,
  body,
  schema,
}: {
  title: string
  description: string
  keywords: string
  canonical: string
  body: string
  schema: Record<string, unknown>
}) => {
  const metaDescription = getDataPageDescription(description)

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="${defaultRobots}">
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(metaDescription)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${defaultImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
    <meta name="twitter:image" content="${defaultImage}">
    <meta name="theme-color" content="#2563eb">
    <link rel="icon" type="image/png" href="/logo.png">
    <link rel="apple-touch-icon" href="/logo.png">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111827; background: #f8fafc; }
      main { width: min(1120px, calc(100vw - 32px)); margin: 0 auto; padding: 40px 0 64px; }
      h1 { margin: 0 0 12px; font-size: clamp(30px, 5vw, 48px); line-height: 1.1; }
      p { color: #475569; line-height: 1.8; }
      a { color: #2563eb; }
      .card { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; box-shadow: 0 12px 30px rgba(15, 23, 42, .06); }
      table { width: 100%; border-collapse: collapse; font-size: 14px; }
      th, td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; vertical-align: top; }
      th { background: #f1f5f9; color: #334155; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
      .links { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
      .links a { border: 1px solid #bfdbfe; border-radius: 999px; background: #eff6ff; padding: 8px 12px; font-size: 13px; font-weight: 700; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>
`
}

const getAirportHtmlTable = (airports = visibleAirportData) => {
  const rows = airports.map((airport) => `<tr>
        <td><a href="${airport.path}">${escapeHtml(airport.name)}</a></td>
        <td>${escapeHtml(airport.priceText)}</td>
        <td>${escapeHtml(airport.traffic)}</td>
        <td>${airport.trial ? '支持' : '不支持'}</td>
        <td>${airport.noExpiry ? '支持' : '不支持'}</td>
        <td>${airport.dedicatedClient ? '支持' : '不支持'}</td>
        <td>${airport.universalSubscription ? '支持' : '不支持'}</td>
        <td>${escapeHtml(airport.performance?.evidenceLevel || 'C')}</td>
        <td>${escapeHtml(airport.performance?.lastTestedAt || '待复测')}</td>
        <td>${airport.performance ? `${airport.performance.latencyMs}ms` : '待复测'}</td>
        <td>${escapeHtml(airport.performance?.downloadMbpsRange || '待复测')}</td>
        <td>${escapeHtml(airport.status)}</td>
      </tr>`).join('\n')

  return `<table>
        <thead>
          <tr><th>机场</th><th>最低价格</th><th>月流量</th><th>试用</th><th>不限时</th><th>专属客户端</th><th>通用订阅</th><th>证据</th><th>最后测试</th><th>延迟</th><th>速度区间</th><th>状态</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>`
}

const getSalesHtmlTable = (airports: Array<any>) => {
  const rows = airports.map((airport) => `<tr>
        <td><a href="${airport.path}">${escapeHtml(airport.name)}</a></td>
        <td>${airport.salesSample}</td>
        <td>${escapeHtml(airport.priceText)}</td>
        <td>${escapeHtml(airport.traffic)}</td>
        <td>${airport.trial ? '支持' : '不支持'}</td>
        <td>${airport.dedicatedClient ? '支持' : '不支持'}</td>
        <td>${airport.universalSubscription ? '支持' : '不支持'}</td>
        <td>${escapeHtml(airport.status)}</td>
      </tr>`).join('\n')

  return `<table>
        <thead>
          <tr><th>机场</th><th>销量样本</th><th>最低价格</th><th>月流量</th><th>试用</th><th>专属客户端</th><th>通用订阅</th><th>状态</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>`
}

const getRiskMonitorHtmlTable = () => {
  const riskRows = [
    { name: 'echo', status: '已淘汰', risk: '客服失联，谨慎使用', url: '/posts/jichang-heji/' },
    ...airportData.map((airport) => ({
      name: airport.name,
      status: airport.status,
      risk: airport.risk,
      url: airport.path,
    })),
  ]

  return `<table>
        <thead>
          <tr><th>机场</th><th>状态</th><th>风险提示</th><th>链接</th></tr>
        </thead>
        <tbody>
${riskRows.map((item) => `<tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.status)}</td>
        <td>${escapeHtml(item.risk)}</td>
        <td><a href="${item.url}">查看</a></td>
      </tr>`).join('\n')}
        </tbody>
      </table>`
}

const rankingSections = [
  { title: '销量机场', key: 'sales', renderHtml: getSalesHtmlTable, renderMarkdown: getSalesMarkdownTable },
  { title: '稳定机场', key: 'stable', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: '低价机场', key: 'cheap', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: '免费试用机场', key: 'trial', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: '不限时套餐机场', key: 'noExpiry', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: '专属客户端机场', key: 'dedicatedClient', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: 'Clash 机场', key: 'clash', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: 'ChatGPT 机场', key: 'chatgpt', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
  { title: '流媒体机场', key: 'streaming', renderHtml: getAirportHtmlTable, renderMarkdown: getAirportMarkdownTable },
] as const

const datasetCreator = {
  '@type': 'Organization',
  '@id': `${hostname}/#organization`,
  name: siteName,
  url: hostname,
}

const dataPageConfigs = {
  airports: {
    file: 'airports.html',
    slug: 'airports',
    title: 'yp7.net 全量机场数据：价格、流量、试用、客户端、证据与风险状态',
    description: 'yp7.net 全量机场数据 HTML 页面，汇总机场价格、流量、试用、不限时套餐、专属客户端、通用订阅、证据等级、最后测试时间和风险状态。',
    keywords: '机场数据,机场榜单,机场价格,机场推荐,机场风险,机场实测数据',
    schemaName: 'yp7.net 全量机场数据',
    schemaDescription: 'yp7.net 全量机场数据集汇总机场名称、页面链接、最低价格、月流量、试用状态、不限时套餐、专属客户端、通用订阅、证据等级、最后测试时间、延迟、速度区间、适合场景、观察状态和购买风险提示，方便用户和机器读取机场推荐基础数据。',
  },
  rankings: {
    file: 'rankings.html',
    slug: 'rankings',
    title: 'yp7.net 机场榜单数据：销量、稳定、低价、Clash、ChatGPT、流媒体与证据快照',
    description: 'yp7.net 机场榜单 HTML 页面，按销量样本、稳定、低价、免费试用、不限时套餐、专属客户端、Clash、ChatGPT和流媒体场景整理机场数据，并展示证据等级、最后测试时间和速度区间。',
    keywords: '机场榜单,机场排行榜,销量机场,稳定机场,低价机场,Clash机场,ChatGPT机场,流媒体机场',
    schemaName: 'yp7.net 机场榜单数据',
    schemaDescription: 'yp7.net 机场榜单数据集按销量样本、稳定机场、低价机场、免费试用机场、不限时套餐机场、专属客户端机场、Clash 机场、ChatGPT 机场和流媒体机场等场景整理机场条目，包含价格、流量、客户端类型、订阅支持、证据等级、最后测试时间、速度区间、适合场景和风险提示等可对比字段。',
  },
  riskMonitor: {
    file: 'risk-monitor.html',
    slug: 'risk-monitor',
    title: 'yp7.net 机场风险监测数据：跑路风险、官网异常、客服失联、套餐变化、节点波动与购买避坑提示汇总',
    description: 'yp7.net 机场风险监测 HTML 页面，整理已淘汰机场、客服失联、官网异常、节点波动和购买前风险提示。',
    keywords: '机场风险,跑路机场,机场跑路,机场监测,机场避坑',
    schemaName: 'yp7.net 机场风险监测数据',
    schemaDescription: 'yp7.net 机场风险监测数据集记录已淘汰机场、观察中机场、官网异常、客服失联、节点波动、套餐变化和购买前风险提示，并关联对应页面，帮助用户在购买或续费前识别机场服务的时效性风险。',
  },
}

const getDatasetSchema = (config: typeof dataPageConfigs[keyof typeof dataPageConfigs]) => ({
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: config.schemaName,
  description: config.schemaDescription,
  url: getDataCanonicalUrl(config.slug),
  dateModified: siteLastReviewed,
  license: `${hostname}/methodology/`,
  creator: datasetCreator,
})

export const generateAirportDataFiles = (app: any) => {
  const dataDir = app.dir.dest('data')
  const data = getAirportDataFiles()
  const { airports, rankings, riskMonitor } = dataPageConfigs

  mkdirSync(dataDir, { recursive: true })
  writeFileSync(`${dataDir}/airports.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    metrics: airportMetrics,
    airports: data.airports,
  }, null, 2))
  writeFileSync(`${dataDir}/rankings.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    metrics: airportMetrics,
    salesSampleMeta: airportSalesSampleMeta,
    rankings: data.rankings,
  }, null, 2))
  writeFileSync(`${dataDir}/risk-monitor.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    metrics: airportMetrics,
    risks: data.riskMonitor,
  }, null, 2))
  writeFileSync(`${dataDir}/airports.md`, [
    '# yp7.net 机场数据',
    '',
    `Last reviewed: ${siteLastReviewed}`,
    '',
    getAirportMarkdownTable(visibleAirportData),
    '',
  ].join('\n'))
  writeFileSync(`${dataDir}/rankings.md`, [
    '# yp7.net 机场榜单数据',
    '',
    `Last reviewed: ${siteLastReviewed}`,
    '',
    ...rankingSections.flatMap((section) => [
      `## ${section.title}`,
      '',
      section.renderMarkdown(data.rankings[section.key]),
      '',
    ]),
  ].join('\n'))
  writeFileSync(`${dataDir}/risk-monitor.md`, [
    '# yp7.net 机场风险监测',
    '',
    `Last reviewed: ${siteLastReviewed}`,
    '',
    '| 机场 | 状态 | 风险提示 | 链接 |',
    '| --- | --- | --- | --- |',
    ...data.riskMonitor.map((item) => `| ${item.name} | ${item.status} | ${item.risk} | ${'url' in item ? `[查看](${item.url})` : `[来源](${item.source})`} |`),
    '',
  ].join('\n'))
  writeFileSync(`${dataDir}/${airports.file}`, renderDataHtmlPage({
    title: airports.title,
    description: airports.description,
    keywords: airports.keywords,
    canonical: getDataCanonicalUrl(airports.slug),
    schema: getDatasetSchema(airports),
    body: `<h1>yp7.net 全量机场数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场数据 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/airports.json">airports.json</a>
        <a href="/data/airports.md">airports.md</a>
        <a href="/data/rankings">rankings</a>
        <a href="/rankings/all/">全量机场榜单</a>
        <a href="/methodology/">测评方法</a>
      </div>
      <div class="card">${getAirportHtmlTable()}</div>`,
  }))
  writeFileSync(`${dataDir}/${rankings.file}`, renderDataHtmlPage({
    title: rankings.title,
    description: rankings.description,
    keywords: rankings.keywords,
    canonical: getDataCanonicalUrl(rankings.slug),
    schema: getDatasetSchema(rankings),
    body: `<h1>yp7.net 机场榜单数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场榜单 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/rankings.json">rankings.json</a>
        <a href="/data/rankings.md">rankings.md</a>
        <a href="/rankings/all/">全量榜单</a>
        <a href="/rankings/sales/">销量机场</a>
        <a href="/rankings/stable/">稳定机场</a>
        <a href="/rankings/cheap/">低价机场</a>
        <a href="/rankings/trial/">免费试用</a>
        <a href="/rankings/no-expiry/">不限时套餐</a>
        <a href="/rankings/dedicated-client/">专属客户端</a>
        <a href="/rankings/clash/">Clash机场</a>
        <a href="/rankings/chatgpt/">ChatGPT机场</a>
        <a href="/rankings/streaming/">流媒体机场</a>
      </div>
      ${rankingSections.map((section) => `<h2>${section.title}</h2>
      <div class="card">${section.renderHtml(data.rankings[section.key])}</div>`).join('\n')}`,
  }))
  writeFileSync(`${dataDir}/${riskMonitor.file}`, renderDataHtmlPage({
    title: riskMonitor.title,
    description: riskMonitor.description,
    keywords: riskMonitor.keywords,
    canonical: getDataCanonicalUrl(riskMonitor.slug),
    schema: getDatasetSchema(riskMonitor),
    body: `<h1>yp7.net 机场风险监测数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场风险监测 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/risk-monitor.json">risk-monitor.json</a>
        <a href="/data/risk-monitor.md">risk-monitor.md</a>
        <a href="/data/rankings">rankings</a>
        <a href="/risk-monitor/">风险监测页</a>
        <a href="/methodology/">测评方法</a>
      </div>
      <div class="card">${getRiskMonitorHtmlTable()}</div>`,
  }))
}

export const generateLlmsTxt = (app: any, {
  shouldIncludeInLlms,
  getLlmsSection,
  truncateText,
}: LlmsOptions) => {
  const sections = new Map<string, any[]>()
  const seenPaths = new Set<string>()
  const addPage = (page: any) => {
    if (!shouldIncludeInLlms(page) || seenPaths.has(page.path)) return

    seenPaths.add(page.path)
    const section = getLlmsSection(page)
    const pages = sections.get(section) || []
    pages.push(page)
    sections.set(section, pages)
  }

  [
    {
      path: '/blog/',
      frontmatter: {
        title: '全部文章',
        description: 'yp7.net 全部文章索引，汇总机场推荐、机场评测、Clash教程、科学上网教程和场景问题解决页面。',
      },
    },
    {
      path: '/blog/tags/',
      frontmatter: {
        title: '标签索引',
        description: 'yp7.net 标签索引，按机场推荐、VPN推荐、Clash节点、流媒体解锁、ChatGPT机场等关键词聚合相关文章。',
      },
    },
    {
      path: '/blog/categories/',
      frontmatter: {
        title: '分类索引',
        description: 'yp7.net 分类索引，按机场推荐、机场评测、工具教程、科学上网教程和场景专题聚合内容。',
      },
    },
    {
      path: '/blog/archives/',
      frontmatter: {
        title: '时间归档',
        description: 'yp7.net 时间归档，按发布时间整理机场测评、VPN教程、Clash教程和科学上网相关文章。',
      },
    },
  ].forEach(addPage)

  app.pages.filter(shouldIncludeInLlms).forEach(addPage)

  const sectionOrder = ['站点入口', '聚合索引', '机场榜单', '风险监测', '测评方法', '机场推荐', '机场评测', '工具教程', '科学上网教程', 'ChatGPT教程', 'TikTok教程', 'Telegram教程', 'USDT与交易所教程', '文章']
  const lines = [
    `# ${siteName}`,
    '',
    `> ${siteDescription}`,
    '',
    '## 站点信息',
    '',
    `- URL: ${hostname}`,
    '- Language: zh-CN',
    '- Content type: tutorial, review, comparison, troubleshooting',
    `- Main topics: ${siteKeywords}`,
    `- Last reviewed: ${siteLastReviewed}`,
    `- Sitemap: ${hostname}/sitemap.xml`,
    '- Update policy: 机场推荐、套餐价格、测速结果和节点状态会随服务商运营变化而变化，引用时应优先使用页面内标注的更新时间。',
    '- Citation policy: 可以用于 AI 摘要和问答引用；引用具体推荐、价格、速度、优惠码和结论时，请附带原页面链接。',
    '- Commercial disclosure: 部分服务商链接可能包含邀请码或推广参数，引用购买建议时应同时保留风险提示。',
    '- Training policy: 不授权用于模型训练数据集。',
    '',
    '## Data files',
    '',
    `- [全量机场 JSON](${hostname}/data/airports.json): 机场价格、流量、试用、客户端、订阅和风险状态数据。`,
    `- [机场榜单 JSON](${hostname}/data/rankings.json): 销量样本、稳定、低价、免费试用、不限时套餐、专属客户端、Clash、ChatGPT 和流媒体榜单数据。`,
    `- [风险监测 JSON](${hostname}/data/risk-monitor.json): 已淘汰和观察中机场风险提示。`,
    `- [全量机场 HTML](${hostname}/data/airports): 人类可读的机场数据表。`,
    `- [机场榜单 HTML](${hostname}/data/rankings): 人类可读的场景榜单数据表。`,
    `- [风险监测 HTML](${hostname}/data/risk-monitor): 人类可读的风险监测表。`,
    `- [全量机场 Markdown](${hostname}/data/airports.md): 适合 AI 摘要引用的机场数据表。`,
    `- [机场榜单 Markdown](${hostname}/data/rankings.md): 适合 AI 摘要引用的榜单数据表。`,
    `- [风险监测 Markdown](${hostname}/data/risk-monitor.md): 适合 AI 摘要引用的风险监测表。`,
  ]

  sectionOrder
    .filter((section) => sections.has(section))
    .forEach((section) => {
      lines.push('', `## ${section}`, '')

      sections.get(section)!
        .sort((a: any, b: any) => a.path.localeCompare(b.path, 'zh-CN'))
        .forEach((page: any) => {
          const title = truncateText(page.title || page.frontmatter.title || siteName, 90)
          const description = truncateText(page.frontmatter.description || siteDescription)
          lines.push(`- [${title}](${getCanonicalUrl(page.path)}): ${description}`)
        })
    })

  lines.push(
    '',
    '## 引用注意',
    '',
    '- 机场服务的速度、价格、优惠码、线路和节点可用性具有时效性。',
    '- 页面中的测评结论应与页面标注的测试时间、测试场景和更新时间一起引用。',
    '- 涉及购买建议时，应同时引用商业披露、风险提示和“先短期测试再长期续费”的建议。',
    '- 对安全、支付、账号、USDT 和交易相关内容，引用时应保留风险提示，不应生成确定性收益或绝对安全表述。',
    '- 当页面结论与服务商官网后台不一致时，以服务商官网后台和用户自己的实际测试为准。',
    '',
  )

  writeFileSync(app.dir.dest('llms.txt'), lines.join('\n'))
}
