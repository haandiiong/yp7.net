// Optional maintenance command. PNGs and their SVG sources are checked in;
// production builds need neither Sharp nor the local font/rendering runtime.
// Install Sharp locally, or set YP7_SHARP_MODULE to an existing Sharp module.
import { createRequire } from 'node:module'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadConfig } from './lib/load-config.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const docs = join(root, 'docs')
const output = join(docs, '.vuepress/public/covers')
const require = createRequire(import.meta.url)
const sharp = require(process.env.YP7_SHARP_MODULE || 'sharp')
const { airportData } = loadConfig('airports.ts')
const airports = new Map(airportData.map((airport) => [airport.path, airport.name]))
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[char]))
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name.startsWith('.')) return []
  const path = join(dir, entry.name)
  return entry.isDirectory() ? walk(path) : entry.name.endsWith('.md') ? [path] : []
})
const value = (frontmatter, key) => frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
  .trim().replace(/^['"]|['"]$/g, '')
const special = {
  '/': ['科学上网工具与机场推荐', '按设备选择客户端，再获取订阅', '入门指南', 'devices'],
  '/posts/jichang-tuijian/': ['机场推荐怎么选', '价格 · 客户端 · 购买限制', '机场选择', 'compare'],
  '/posts/jichang-heji/': ['机场大全', '横向比较套餐与订阅方式', '机场资料', 'compare'],
  '/rankings/cheap/': ['低价机场选择', '付款周期 · 流量 · 使用限制', '场景筛选', 'compare'],
  '/rankings/no-expiry/': ['不限时与总量套餐', '有效期 · 总流量 · 计费倍率', '场景筛选', 'compare'],
  '/rankings/trial/': ['免费试用机场', '领取条件 · 额度 · 期限', '场景筛选', 'compare'],
  '/rankings/dedicated-client/': ['专属客户端机场', '按设备与操作系统选择', '场景筛选', 'devices'],
  '/rankings/clash/': ['Clash订阅机场', '订阅格式与客户端兼容性', '场景筛选', 'devices'],
  '/rankings/chatgpt/': ['ChatGPT节点记录', '按日期与原始记录比较', '应用资料', 'records'],
  '/rankings/streaming/': ['流媒体节点记录', 'YouTube与播放状态资料', '应用资料', 'records'],
  '/rankings/coupons/': ['机场优惠码', '适用条件与结算金额', '购买资料', 'compare'],
  '/risk-monitor/': ['机场风险监测', '服务状态 · 套餐变化 · 购买风险', '风险资料', 'records'],
  '/methodology/': ['推荐方法与资料来源', '区分套餐核验、测试与历史记录', '编辑原则', 'records'],
  '/about/': ['关于yp7.net', '内容范围 · 商业披露 · 纠错', '关于本站', 'records'],
  '/posts/ai-tools-node-guide-2026/': ['AI工具节点选择', 'ChatGPT · Claude · Gemini', '使用指南', 'devices'],
  '/posts/ai-tools-not-working/': ['AI工具连接排查', 'ChatGPT · Claude · Gemini', '故障排查', 'records'],
  '/posts/google-youtube-github-gmail-not-working/': ['海外网站连接排查', 'Google · YouTube · GitHub · Gmail', '故障排查', 'records'],
  '/posts/router-vpn-setup-2026/': ['路由器网络配置', 'OpenWrt · 订阅 · 连接排查', '使用指南', 'devices'],
  '/posts/vpn-alternatives-risk-guide/': ['VPN替代方案怎么选', '客户端 · 订阅 · 购买限制', '使用指南', 'compare'],
}
const colors = [
  ['#155e59', '#e5f4ef', '#2f8976'], ['#245a83', '#e7f1fa', '#548cbc'],
  ['#505087', '#eeedf9', '#7974b7'], ['#765527', '#faf1e3', '#b08b4f'],
]
const font = 'Hiragino Sans GB, Noto Sans CJK SC, Microsoft YaHei, Arial, sans-serif'
const text = (x, y, content, size, color, weight = 400) => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" font-family="${font}">${escape(content)}</text>`
const wrap = (content) => {
  const lines = ['']
  let units = 0
  for (const token of content.match(/[A-Za-z0-9]+|[^A-Za-z0-9]/g) || []) {
    const width = [...token].reduce((sum, char) => sum + (/[\u0000-\u007f]/.test(char) ? 0.74 : 1), 0)
    if (units + width > 11.5) { lines.push(''); units = 0 }
    lines[lines.length - 1] += token
    units += width
  }
  return lines
}
const line = (x1, y1, x2, y2, color, width = 3) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${width}" fill="none"/>`
const round = (x, y, w, h, radius, fill, stroke = 'none', width = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`
const laptop = (x, y, ink, accent) => round(x, y, 112, 72, 8, 'white', ink, 3)
  + round(x + 12, y + 12, 88, 46, 3, '#f2f7f8') + line(x - 10, y + 83, x + 122, y + 83, ink, 4)
  + line(x + 42, y + 35, x + 70, y + 35, accent, 4)
const phone = (x, y, ink, accent) => round(x, y, 58, 96, 11, 'white', ink, 3)
  + round(x + 8, y + 15, 42, 64, 4, '#f2f7f8') + line(x + 20, y + 7, x + 38, y + 7, accent, 3)
const globe = (x, y, ink, accent) => `<circle cx="${x}" cy="${y}" r="65" fill="white" stroke="${ink}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="28" ry="65" fill="none" stroke="${accent}" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="65" ry="24" fill="none" stroke="${accent}" stroke-width="2"/>`
  + line(x - 65, y, x + 65, y, accent, 2) + line(x, y - 65, x, y + 65, accent, 2)

const illustration = (kind, ink, accent) => {
  const panel = round(745, 170, 447, 380, 34, '#ffffffcc')
  if (kind === 'compare' || kind === 'records') {
    let cards = ''
    for (let i = 0; i < 3; i++) {
      const y = 238 + i * 88
      cards += round(794 + i * 9, y, 343 - i * 9, 68, 13, 'white', '#dce5e6')
        + `<circle cx="827" cy="${y + 34}" r="13" fill="${accent}" opacity="${0.9 - i * 0.15}"/>`
        + line(859, y + 25, 1019 - i * 15, y + 25, ink, 5)
        + line(859, y + 43, 969 + i * 18, y + 43, '#c1d0d2', 4)
        + `<path d="M1071 ${y + 32}l7 7 14-16" stroke="${accent}" stroke-width="3" fill="none"/>`
    }
    return panel + cards
  }
  return panel + `<path d="M824 259Q970 172 1111 306M832 427Q940 533 1110 425M805 330L903 349M1031 349L1091 369" stroke="${accent}" opacity=".4" stroke-width="3" fill="none" stroke-dasharray="7 8"/>`
    + globe(967, 354, ink, accent) + laptop(790, 227, ink, accent) + phone(1098, 337, ink, accent)
    + `<circle cx="830" cy="443" r="15" fill="${accent}"/><circle cx="1087" cy="253" r="10" fill="${accent}" opacity=".5"/>`
}

const pages = walk(docs).map((file) => {
  const source = readFileSync(file, 'utf8')
  const fm = source.match(/^---\n([\s\S]*?)\n---/)?.[1] || ''
  const route = value(fm, 'permalink') || (relative(docs, file) === 'index.md' ? '/' : undefined)
  if (!route || route === '/friends/' || /robots:[^\n]*noindex|draft:\s*true/.test(fm)) return undefined
  const name = airports.get(route)
  const title = value(fm, 'title') || 'yp7.net'
  const shortTitle = title.split(/[：:？?｜|]/)[0].replace(/^2026\s*/, '')
  const [heading, subtitle, label, kind] = special[route] || (name
    ? [name, '套餐 · 客户端 · 订阅规则', '机场资料', 'network']
    : [shortTitle, file.includes('工具') ? '安装 · 配置 · 使用排查' : '概念 · 方法 · 使用说明', '使用指南', /排查|风险|公告/.test(title) ? 'records' : 'devices'])
  const slug = route === '/' ? 'home' : route.slice(1, -1).replaceAll('/', '-')
  return { route, slug, heading, subtitle, label, kind }
}).filter(Boolean).sort((a, b) => a.route.localeCompare(b.route, 'en'))
if (new Set(pages.map((page) => page.route)).size !== pages.length) throw new Error('Duplicate cover route')
mkdirSync(join(output, 'sources'), { recursive: true })
for (const page of pages) {
  const seed = [...page.route].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const [ink, tint, accent] = colors[seed % colors.length]
  // Short, readable labels; illustrations carry the rest of the topic.
  const lines = wrap(page.heading)
  const size = lines.length > 2 ? 46 : 54
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><title>${escape(page.heading)}</title><desc>${escape(page.subtitle)}</desc><rect width="1280" height="720" fill="#f7fafb"/><circle cx="1166" cy="72" r="294" fill="${tint}"/><circle cx="48" cy="720" r="235" fill="${tint}" opacity=".6"/>${text(76, 86, 'yp7.net', 28, ink, 700)}${text(76, 219, page.label, 22, accent, 500)}${lines.map((part, i) => text(72, 320 + i * 72, part, size, '#192e3b', 700)).join('')}${text(76, 355 + lines.length * 72, page.subtitle, 25, '#586b75')}${line(76, 573, 181, 573, accent, 5)}${text(76, 624, '资料整理与使用指南', 19, '#75848a')}${illustration(page.kind, ink, accent)}</svg>`
  writeFileSync(join(output, 'sources', `${page.slug}.svg`), `${svg}\n`)
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(join(output, `${page.slug}.png`))
}
const mapping = pages.map((page) => `  '${page.route}': '/covers/${page.slug}.png',`).join('\n')
writeFileSync(join(docs, '.vuepress/config/page-covers.ts'), `// Generated by scripts/generate-page-covers.mjs. Covers are separate from article evidence and logos.\nexport const pageCovers: Record<string, string> = {\n${mapping}\n}\n`)
console.log(`Generated ${pages.length} individual 1280×720 page covers and SVG sources.`)
