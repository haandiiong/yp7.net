import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

const root = process.cwd()
const docsDir = join(root, 'docs')
const publicDir = join(root, 'docs/.vuepress/public')
const distDir = join(root, 'docs/.vuepress/dist')

const errors = []
const toProjectPath = (filePath) => relative(root, filePath).replace(/\\/g, '/')

const walkFiles = (dir, shouldSkip = () => false) => {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(dir, entry.name)

    if (shouldSkip(filePath, entry)) return []
    if (entry.isDirectory()) return walkFiles(filePath, shouldSkip)
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

const normalizeRoute = (path) => {
  if (path === '/') return '/'
  return path.endsWith('/') ? path : `${path}/`
}

const countMatches = (content, pattern) => content.match(pattern)?.length || 0

const redirectSourcePaths = new Set()
const redirectsPath = join(publicDir, '_redirects')
if (existsSync(redirectsPath)) {
  const redirectLines = readFileSync(redirectsPath, 'utf8').split('\n')

  redirectLines.forEach((line, index) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) return

    const [source, target] = trimmedLine.split(/\s+/)
    if (!source || !target) return
    if (source.startsWith('/') && !source.includes('*')) {
      redirectSourcePaths.add(source)
      redirectSourcePaths.add(normalizeRoute(source))
    }

    if (!extname(source) && target.endsWith('.html')) {
      errors.push(`${toProjectPath(redirectsPath)}:${index + 1}: extensionless redirect to .html can loop on clean-url hosts`)
    }
  })
}

const getSitemapHtmlPath = (pathname) => {
  const decodedPathname = decodeURIComponent(pathname)

  if (decodedPathname === '/') return join(distDir, 'index.html')
  if (decodedPathname.endsWith('/')) return join(distDir, decodedPathname.slice(1), 'index.html')
  if (extname(decodedPathname)) return join(distDir, decodedPathname.slice(1))

  return join(distDir, `${decodedPathname.slice(1)}.html`)
}

const getDisplayDate = (value = '') => {
  const [year, month, day] = value.replace(/\//g, '-').split('-').map((part) => Number(part))
  if (!year || !month || !day) return undefined

  return {
    full: `${year}年${month}月${day}日`,
    month: `${year}年${month}月`,
  }
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

const booleanText = (value) => (value ? '支持' : '不支持')

const clientSummary = (airport) => {
  if (airport.dedicatedClient && airport.universalSubscription) return '专属客户端、通用订阅'
  if (airport.dedicatedClient) return '专属客户端'
  if (airport.universalSubscription) return '通用订阅'

  return '无专属客户端'
}

const dedicatedClientSummary = (airport) => (
  airport.dedicatedClient ? '专属客户端' : '无专属客户端'
)

const getMarkdownTableAfterHeading = (filePath, heading) => {
  const content = readFileSync(join(root, filePath), 'utf8')
  const lines = content.split('\n')
  const headingIndex = lines.findIndex((line) => line.trim() === heading)

  if (headingIndex === -1) {
    errors.push(`${filePath}: missing heading ${heading}`)
    return undefined
  }

  const tableStart = lines.findIndex((line, index) => (
    index > headingIndex && line.trim().startsWith('|')
  ))

  if (tableStart === -1) {
    errors.push(`${filePath}: missing table after ${heading}`)
    return undefined
  }

  const tableLines = []

  for (let index = tableStart; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line.startsWith('|')) break
    tableLines.push(line)
  }

  return tableLines
}

const parseMarkdownTable = (filePath, heading) => {
  const tableLines = getMarkdownTableAfterHeading(filePath, heading)
  if (!tableLines || tableLines.length < 2) return undefined

  const parseLine = (line) => line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())

  const headers = parseLine(tableLines[0])
  const rows = tableLines.slice(2).map((line) => {
    const cells = parseLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']))
  })

  return { headers, rows }
}

const parseAirportCell = (value = '') => {
  const match = value.match(/^\[([^\]]+)]\(([^)]+)\)$/)
  if (!match) return undefined

  return {
    name: match[1],
    path: normalizeRoute(match[2]),
  }
}

const assertCell = (filePath, heading, rowName, column, actual, expected) => {
  if (actual !== expected) {
    errors.push(`${filePath} ${heading}: ${rowName} ${column} is "${actual}", expected "${expected}"`)
  }
}

const validateAirportTable = ({
  filePath,
  heading,
  airports,
  airportByPath,
  requiredAirports,
  rowFilter,
  exactRows = false,
  exactOrder = false,
  fields,
}) => {
  const table = parseMarkdownTable(filePath, heading)
  if (!table) return

  const rowAirports = []

  table.rows.forEach((row) => {
    const airportLink = parseAirportCell(row['机场'])
    if (!airportLink) {
      errors.push(`${filePath} ${heading}: invalid airport cell "${row['机场']}"`)
      return
    }

    const airport = airportByPath.get(airportLink.path)
    if (!airport) {
      errors.push(`${filePath} ${heading}: unknown airport path ${airportLink.path}`)
      return
    }

    if (airport.name !== airportLink.name) {
      errors.push(`${filePath} ${heading}: ${airportLink.path} label is "${airportLink.name}", expected "${airport.name}"`)
    }

    if (rowFilter && !rowFilter(airport)) {
      errors.push(`${filePath} ${heading}: ${airport.name} does not match the table filter`)
    }

    rowAirports.push(airport)

    fields.forEach(([column, getter]) => {
      if (!(column in row)) {
        errors.push(`${filePath} ${heading}: missing column ${column}`)
        return
      }

      assertCell(filePath, heading, airport.name, column, row[column], getter(airport))
    })
  })

  if (!exactRows) return

  const actualPaths = rowAirports.map((airport) => airport.path)
  const expectedPaths = requiredAirports.map((airport) => airport.path)
  const missing = expectedPaths.filter((path) => !actualPaths.includes(path))
  const extra = actualPaths.filter((path) => !expectedPaths.includes(path))

  if (missing.length || extra.length || (exactOrder && actualPaths.join('|') !== expectedPaths.join('|'))) {
    errors.push(`${filePath} ${heading}: row set${exactOrder ? '/order' : ''} differs from airports.ts`)
    missing.forEach((path) => errors.push(`${filePath} ${heading}: missing ${path}`))
    extra.forEach((path) => errors.push(`${filePath} ${heading}: unexpected ${path}`))
  }
}

const markdownFiles = walkFiles(docsDir, (filePath, entry) => (
  entry.isDirectory() && filePath.includes('/docs/.vuepress')
)).filter((filePath) => filePath.endsWith('.md'))

const generatedRoutes = new Set([
  '/blog/',
  '/blog/tags/',
  '/blog/categories/',
  '/blog/archives/',
])
const routeMap = new Map([['/', 'docs/index.md']])
const pages = []

for (const filePath of markdownFiles) {
  const content = readFileSync(filePath, 'utf8')
  const frontmatter = parseFrontmatter(content)
  const permalink = getFrontmatterValue(frontmatter, 'permalink')
  const projectPath = toProjectPath(filePath)

  if (permalink) routeMap.set(normalizeRoute(permalink), projectPath)

  pages.push({
    filePath,
    projectPath,
    content,
    frontmatter,
    permalink,
    title: getFrontmatterValue(frontmatter, 'title'),
    description: getFrontmatterValue(frontmatter, 'description'),
    dateModified: getFrontmatterValue(frontmatter, 'dateModified'),
  })
}

for (const page of pages) {
  if (!page.title) errors.push(`${page.projectPath}: missing frontmatter title`)
  if (!page.description) errors.push(`${page.projectPath}: missing frontmatter description`)

  const displayDate = getDisplayDate(page.dateModified)
  if (displayDate) {
    const updateLinePattern = /^更新时间：(?:\*\*)?(\d{4}年\d{1,2}月(?:\d{1,2}日)?)/gm
    let updateLineMatch

    while ((updateLineMatch = updateLinePattern.exec(page.content))) {
      const actualDate = updateLineMatch[1]
      const expectedDate = actualDate.endsWith('日') ? displayDate.full : displayDate.month

      if (actualDate !== expectedDate) {
        errors.push(`${page.projectPath}: visible update date is ${actualDate}, expected ${expectedDate}`)
      }
    }
  }

  const linkPattern = /\[[^\]]*]\(([^)\s]+)(?:\s+[^)]*)?\)|<(?:img|a)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi
  let match

  while ((match = linkPattern.exec(page.content))) {
    const href = match[1] || match[2]
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
    if (/^https?:\/\//.test(href)) continue
    if (!href.startsWith('/')) continue

    const path = href.split(/[?#]/)[0]
    if (extname(path)) {
      if (!existsSync(join(publicDir, path))) {
        errors.push(`${page.projectPath}: missing public asset ${href}`)
      }
      continue
    }

    const route = normalizeRoute(path)
    if (!routeMap.has(route) && !generatedRoutes.has(route)) {
      errors.push(`${page.projectPath}: missing internal route ${href}`)
    }
  }
}

const airportsPath = join(root, 'docs/.vuepress/config/airports.ts')
let airportData = []
let visibleAirportData = []
let airportByPath = new Map()

if (existsSync(airportsPath)) {
  const airportConfig = loadAirportConfig(airportsPath)
  airportData = airportConfig.airportData
  visibleAirportData = airportConfig.visibleAirportData
  airportByPath = new Map(airportData.map((airport) => [normalizeRoute(airport.path), airport]))
  const missingAirportPages = airportData
    .map((airport) => normalizeRoute(airport.path))
    .filter((route) => !routeMap.has(route))

  if (missingAirportPages.length) {
    missingAirportPages.forEach((route) => errors.push(`airports.ts: missing page for ${route}`))
  }

  airportData.forEach((airport) => {
    if (!airport.image) {
      errors.push(`airports.ts: ${airport.name} missing image`)
    } else if (!existsSync(join(publicDir, airport.image))) {
      errors.push(`airports.ts: ${airport.name} image asset missing ${airport.image}`)
    }

    if (
      airport.salesSample !== undefined
      && (!Number.isFinite(airport.salesSample) || airport.salesSample < 0)
    ) {
      errors.push(`airports.ts: ${airport.name} salesSample must be a non-negative number`)
    }
  })
} else {
  errors.push('docs/.vuepress/config/airports.ts: missing airport data config')
}

const siteConfigPath = join(root, 'docs/.vuepress/config/site.ts')
if (existsSync(siteConfigPath)) {
  const siteConfig = readFileSync(siteConfigPath, 'utf8')
  const pageImages = [...siteConfig.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)]

  for (const [, route, image] of pageImages) {
    const normalizedRoute = normalizeRoute(route)
    if (!routeMap.has(normalizedRoute) && !generatedRoutes.has(normalizedRoute)) {
      errors.push(`site.ts: page image route has no page ${route}`)
    }

    if (!existsSync(join(publicDir, image))) {
      errors.push(`site.ts: page image asset missing ${image}`)
    }
  }
}

if (airportData.length) {
  const allAirports = visibleAirportData
  const stableAirports = visibleAirportData.filter((airport) => airport.scenarios.includes('stable'))
  const cheapAirports = visibleAirportData.filter((airport) => airport.price <= 10 || airport.scenarios.includes('cheap'))
  const clashAirports = visibleAirportData.filter((airport) => airport.universalSubscription || airport.scenarios.includes('clash'))
  const chatgptAirports = visibleAirportData.filter((airport) => airport.scenarios.includes('chatgpt'))
  const streamingAirports = visibleAirportData.filter((airport) => airport.scenarios.includes('streaming'))
  const trialAirports = visibleAirportData.filter((airport) => airport.trial)
  const noExpiryAirports = visibleAirportData.filter((airport) => airport.noExpiry)
  const dedicatedClientAirports = visibleAirportData.filter((airport) => airport.dedicatedClient)

  validateAirportTable({
    filePath: 'docs/机场榜单/全量机场榜单.md',
    heading: '## 全量机场数据',
    airports: airportData,
    airportByPath,
    requiredAirports: allAirports,
    exactRows: true,
    exactOrder: true,
    fields: [
      ['最低价格', (airport) => airport.priceText],
      ['月流量', (airport) => airport.traffic],
      ['试用', (airport) => booleanText(airport.trial)],
      ['不限时', (airport) => booleanText(airport.noExpiry)],
      ['专属客户端', (airport) => booleanText(airport.dedicatedClient)],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
      ['状态', (airport) => airport.status],
    ],
  })

  validateAirportTable({
    filePath: 'docs/风险监测/机场风险监测.md',
    heading: '## 站内观察状态',
    airports: airportData,
    airportByPath,
    requiredAirports: allAirports,
    exactRows: true,
    exactOrder: true,
    fields: [
      ['当前状态', (airport) => airport.status],
      ['风险提示', (airport) => airport.risk],
      ['试用', (airport) => booleanText(airport.trial)],
      ['最低价格', (airport) => airport.priceText],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/稳定机场榜.md',
    heading: '## 稳定机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: stableAirports,
    rowFilter: (airport) => stableAirports.includes(airport),
    fields: [
      ['价格', (airport) => airport.priceText],
      ['流量', (airport) => airport.traffic],
      ['客户端', clientSummary],
      ['风险提示', (airport) => airport.risk],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/低价机场榜.md',
    heading: '## 低价机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: cheapAirports,
    rowFilter: (airport) => cheapAirports.includes(airport),
    fields: [
      ['最低价格', (airport) => airport.priceText],
      ['月流量', (airport) => airport.traffic],
      ['试用', (airport) => booleanText(airport.trial)],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/Clash机场榜.md',
    heading: '## Clash机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: clashAirports,
    rowFilter: (airport) => clashAirports.includes(airport),
    fields: [
      ['价格', (airport) => airport.priceText],
      ['流量', (airport) => airport.traffic],
      ['试用', (airport) => booleanText(airport.trial)],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/ChatGPT机场榜.md',
    heading: '## ChatGPT机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: chatgptAirports,
    exactRows: true,
    fields: [
      ['价格', (airport) => airport.priceText],
      ['流量', (airport) => airport.traffic],
      ['客户端', clientSummary],
      ['风险提示', (airport) => airport.risk],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/流媒体机场榜.md',
    heading: '## 流媒体机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: streamingAirports,
    rowFilter: (airport) => streamingAirports.includes(airport),
    fields: [
      ['价格', (airport) => airport.priceText],
      ['流量', (airport) => airport.traffic],
      ['订阅/客户端', clientSummary],
      ['风险提示', (airport) => airport.risk],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/免费试用机场榜.md',
    heading: '## 免费试用机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: trialAirports,
    exactRows: true,
    fields: [
      ['最低价格', (airport) => airport.priceText],
      ['月流量', (airport) => airport.traffic],
      ['客户端', dedicatedClientSummary],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/不限时机场榜.md',
    heading: '## 不限时与按量套餐候选',
    airports: airportData,
    airportByPath,
    requiredAirports: noExpiryAirports,
    exactRows: true,
    fields: [
      ['不限时状态', (airport) => booleanText(airport.noExpiry)],
      ['最低价格', (airport) => airport.priceText],
      ['月流量', (airport) => airport.traffic],
      ['客户端', dedicatedClientSummary],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
    ],
  })

  validateAirportTable({
    filePath: 'docs/机场榜单/专属客户端机场榜.md',
    heading: '## 专属客户端机场候选',
    airports: airportData,
    airportByPath,
    requiredAirports: dedicatedClientAirports,
    exactRows: true,
    fields: [
      ['最低价格', (airport) => airport.priceText],
      ['月流量', (airport) => airport.traffic],
      ['试用', (airport) => booleanText(airport.trial)],
      ['通用订阅', (airport) => booleanText(airport.universalSubscription)],
      ['风险提示', (airport) => airport.risk],
    ],
  })
}

if (!existsSync(distDir)) {
  errors.push('docs/.vuepress/dist: missing build output. Run pnpm run docs:build first.')
} else {
  const htmlFiles = walkFiles(distDir).filter((filePath) => filePath.endsWith('.html'))
  const sitemapPath = join(distDir, 'sitemap.xml')

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8')
    const projectPath = toProjectPath(filePath)
    const htmlIssues = []

    if (countMatches(html, /<title>/g) !== 1) htmlIssues.push('expected exactly one <title>')
    if (countMatches(html, /<link rel="canonical"/g) !== 1) htmlIssues.push('expected exactly one canonical link')
    if (countMatches(html, /<meta name="description"/g) !== 1) htmlIssues.push('expected exactly one meta description')
    if (countMatches(html, /<meta name="robots"/g) !== 1) htmlIssues.push('expected exactly one robots meta')
    if (countMatches(html, /application\/ld\+json/g) < 1) htmlIssues.push('missing JSON-LD')
    if (countMatches(html, /<h1\b/g) < 1) htmlIssues.push('missing H1')

    htmlIssues.forEach((issue) => errors.push(`${projectPath}: ${issue}`))
  }

  if (!existsSync(sitemapPath)) {
    errors.push('docs/.vuepress/dist/sitemap.xml: missing generated sitemap')
  } else {
    const sitemap = readFileSync(sitemapPath, 'utf8')
    const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])

    sitemapUrls.forEach((loc) => {
      let url

      try {
        url = new URL(loc)
      } catch {
        errors.push(`docs/.vuepress/dist/sitemap.xml: invalid sitemap URL ${loc}`)
        return
      }

      const pathname = url.pathname
      if (pathname.endsWith('.html')) {
        errors.push(`docs/.vuepress/dist/sitemap.xml: ${loc} should use clean URL instead of .html`)
      }

      if (redirectSourcePaths.has(pathname) || redirectSourcePaths.has(normalizeRoute(pathname))) {
        errors.push(`docs/.vuepress/dist/sitemap.xml: ${loc} points to a redirect source`)
      }

      const htmlPath = getSitemapHtmlPath(pathname)
      if (!existsSync(htmlPath)) {
        errors.push(`docs/.vuepress/dist/sitemap.xml: ${loc} has no generated HTML file`)
        return
      }

      const html = readFileSync(htmlPath, 'utf8')
      if (/<meta name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
        errors.push(`docs/.vuepress/dist/sitemap.xml: ${loc} points to a noindex page`)
      }
    })
  }
}

const missingDateModified = pages.filter((page) => (
  page.permalink
  && !page.dateModified
  && !page.frontmatter.includes('home: true')
))

if (missingDateModified.length) {
  missingDateModified.forEach((page) => errors.push(`${page.projectPath}: missing frontmatter dateModified`))
}

if (errors.length) {
  console.error('Content health check failed:')
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Content health check passed for ${pages.length} markdown files.`)
