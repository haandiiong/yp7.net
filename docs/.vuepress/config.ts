import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
// import  mediumZoomPlugin from '@vuepress/plugin-medium-zoom'

const hostname = 'https://yp7.net'
const siteName = 'yp7.net'
const siteDescription = 'yp7.net 提供2026机场推荐、VPN推荐、Clash节点使用教程、科学上网问题解决和机场测评数据，帮助用户按速度、稳定性、价格、客户端兼容性和购买风险选择合适工具。'
const siteKeywords = '机场推荐,VPN推荐,Clash节点,Clash教程,Shadowrocket,科学上网,翻墙机场,ChatGPT机场,TikTok节点,流媒体解锁'
const siteLastReviewed = '2026-06-04'
const defaultImage = `${hostname}/shouye.png`
const defaultRobots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
const pageImages: Record<string, string> = {
  '/': '/shouye.png',
  '/blog/': '/shouye.png',
  '/posts/jichang-tuijian/': '/shouye.png',
  '/posts/jichang-heji/': '/shouye.png',
  '/posts/99ba-review-2026/': '/99ba.png',
  '/posts/adaxi-review-2026/': '/adaxi.png',
  '/posts/ccyz-review-2026/': '/ccyz.png',
  '/posts/cocoduck-review/': '/cocoduck.png',
  '/posts/flybit-review-2026/': '/flybit.jpg',
  '/posts/runway-review-2026/': '/runway.png',
  '/posts/sogo-review-2026/': '/sogo.png',
  '/posts/ssone/': '/ssone.png',
  '/posts/u1s1-review-2026/': '/u1s1.png',
  '/posts/uuone-review-2026/': '/uuone.png',
  '/posts/xsus-review-2026/': '/xsus.png',
  '/posts/xxyun-review-2026/': '/xxyun.png',
  '/posts/ermiao-vpn-review/': '/ermaoyun.png',
  '/posts/guangnianti-review-2026/': '/gnt.png',
  '/posts/guangsuyun/': '/guangsuyun.png',
  '/posts/quanqiuyun/': '/qqy.png',
  '/posts/chongshangyunxiao/': '/csyx.png',
  '/posts/kexinyun-review-2026/': '/kexinyun.png',
  '/posts/weituyun/': '/weituyun.png',
  '/posts/tank-review-2026/': '/tankejiasu.png',
  '/posts/naiyun-review-2026/': '/naiyun.png',
  '/posts/yuzhoucloud-review-2026/': '/yuzhouyun.png',
  '/posts/huanyuyun-review-2026/': '/huanyuyun.png',
  '/posts/kuaili-review-2026/': '/kuaili.png',
  '/posts/xingdaomeng-review-2026/': '/xingdaomeng.png',
  '/posts/jilianyun-review-2026/': '/jilianyun.png',
  '/posts/shunyun-review-2026/': '/shunyun.png',
  '/posts/wangji-kuaiche-review/': '/kuaiche.png',
  '/posts/xunda-review-2026/': '/xunda.png',
  '/posts/yinyun-review-2026/': '/yinyun.png',
  '/posts/clash-verge-guide-2026/': '/clashVerge4.png',
  '/posts/clash-for-android-guide-2026/': '/clashMeta1.png',
  '/posts/speedtest-vpn/': '/speedtest.png',
  '/rankings/all/': '/shouye.png',
  '/rankings/stable/': '/shouye.png',
  '/rankings/cheap/': '/shouye.png',
  '/rankings/clash/': '/clashVerge4.png',
  '/rankings/chatgpt/': '/shouye.png',
  '/rankings/streaming/': '/youtubecesu.png',
  '/risk-monitor/': '/shouye.png',
  '/methodology/': '/speedtest.png',
}

const airportData = [
  { name: '全球云', path: '/posts/quanqiuyun/', price: 20, priceText: '20元/月', traffic: '120GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'chatgpt', 'streaming', 'newbie'], status: '主推观察', risk: '先月付测试', summary: '新手友好，专属客户端上手成本低，适合先测试日常网页、ChatGPT 和流媒体。' },
  { name: '光年梯', path: '/posts/guangnianti-review-2026/', price: 18, priceText: '18元/月', traffic: '110GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'streaming', 'newbie'], status: '主推观察', risk: '先月付测试', summary: '偏长期主力测试，适合重视稳定性和专属客户端体验的用户。' },
  { name: '网际快车', path: '/posts/wangji-kuaiche-review/', price: 16, priceText: '16元/月', traffic: '100GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'clash', 'chatgpt', 'trial'], status: '重点观察', risk: '需复核官网与试用', summary: '支持试用和通用订阅，适合 Clash 用户和想先短期测试的人。' },
  { name: '光速云', path: '/posts/guangsuyun/', price: 17, priceText: '17元/月', traffic: '110GB/月', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['stable', 'clash', 'streaming'], status: '备用观察', risk: '晚高峰复测', summary: '适合作为备用机场或 Clash 通用订阅测试，需关注晚高峰表现。' },
  { name: 'xxyun', path: '/posts/xxyun-review-2026/', price: 9.99, priceText: '9.99元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'streaming', 'clash'], status: '流媒体观察', risk: '解锁能力会变化', summary: '低价且偏流媒体场景，适合 Netflix、Disney+、YouTube 用户短期测试。' },
  { name: 'Flybit', path: '/posts/flybit-review-2026/', price: 15, priceText: '15元/月', traffic: '128GB/月', trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['clash', 'trial'], status: 'Clash观察', risk: '长期稳定需复测', summary: '通用订阅兼容性更突出，适合 Clash Verge、Clash Meta、Shadowrocket 用户。' },
  { name: '阿达西', path: '/posts/adaxi-review-2026/', price: 3, priceText: '3元/月', traffic: '20GB/月', trial: false, noExpiry: false, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'clash'], status: '低价观察', risk: '不建议直接长期付费', summary: '价格门槛低，更适合轻量测试和备用，不适合高强度主力依赖。' },
  { name: 'runway', path: '/posts/runway-review-2026/', price: 9.9, priceText: '9.9元/月', traffic: '80GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['cheap', 'trial', 'newbie'], status: '新手观察', risk: '先试用再续费', summary: '支持免费试用和专属客户端，适合新手先体验连接流程。' },
  { name: '唯兔云', path: '/posts/weituyun/', price: 14.9, priceText: '14.9元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming'], status: '流媒体观察', risk: '解锁能力会变化', summary: '偏流媒体体验，适合短期测试视频平台和节点稳定性。' },
  { name: '99吧', path: '/posts/99ba-review-2026/', price: 12.99, priceText: '12.99元/月', traffic: '99GB/月', trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['trial', 'clash'], status: '试用观察', risk: '先测试订阅可用性', summary: '支持试用与通用订阅，适合购买前验证 Clash 导入和节点延迟。' },
  { name: '迅达', path: '/posts/xunda-review-2026/', price: 15, priceText: '15元/月', traffic: '150GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['chatgpt', 'trial', 'clash'], status: '办公观察', risk: 'ChatGPT可用性需复测', summary: '偏 ChatGPT 办公场景，支持试用和通用订阅，适合先做工作流测试。' },
  { name: 'ccyz', path: '/posts/ccyz-review-2026/', price: 19.9, priceText: '19.9元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming'], status: '流媒体观察', risk: '节点状态需复核', summary: '偏流媒体和节点体验，购买前应确认常用地区节点可用。' },
  { name: 'uuone', path: '/posts/uuone-review-2026/', price: 12, priceText: '12元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming', 'cheap'], status: '性价比观察', risk: '长期稳定需复测', summary: '价格与流量较均衡，可作为性价比和流媒体方向的备选。' },
  { name: '冲上云霄', path: '/posts/chongshangyunxiao/', price: 5, priceText: '5元/月', traffic: '80GB/月', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'clash', 'streaming'], status: '低价观察', risk: '晚高峰复测', summary: '低价且支持通用订阅，适合作为轻量备用或短期测试。' },
  { name: 'SSONE', path: '/posts/ssone/', price: 15, priceText: '15元/月', traffic: '70GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['clash'], status: '订阅观察', risk: '套餐变化需复核', summary: '支持专属客户端与通用订阅，适合对比客户端配置成本。' },
  { name: 'U1S1', path: '/posts/u1s1-review-2026/', price: 20, priceText: '20元/月', traffic: '120GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'chatgpt', 'clash'], status: '办公观察', risk: '晚高峰复测', summary: '偏办公与稳定场景，适合重视 ChatGPT、网页访问和视频体验的用户。' },
  { name: '奈云', path: '/posts/naiyun-review-2026/', price: 28, priceText: '28元/月', traffic: '388GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'trial', 'clash'], status: '老牌观察', risk: '价格较高需试用', summary: '老牌机场定位，流量较高，适合愿意先试用再判断长期稳定性的用户。' },
  { name: '隐云', path: '/posts/yinyun-review-2026/', price: 29, priceText: '29元/月', traffic: '不限流量', trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'trial', 'clash'], status: '备用观察', risk: '不限流量需实测', summary: '不限流量套餐需要结合晚高峰和公平使用规则测试。' },
  { name: 'cocoduck', path: '/posts/cocoduck-review/', price: 15, priceText: '15元/月', traffic: '100GB/月', trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['streaming', 'trial', 'clash'], status: '小众观察', risk: '小众服务需谨慎', summary: '小众机场定位，适合短期测试流媒体和通用订阅体验。' },
  { name: 'XSUS', path: '/posts/xsus-review-2026/', price: 10, priceText: '10元/月', traffic: '168GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'streaming', 'clash'], status: '性价比观察', risk: '需复核稳定性', summary: '低价大流量方向，适合预算敏感用户先短期测试。' },
  { name: '坦克加速', path: '/posts/tank-review-2026/', price: 8.8, priceText: '8.8元/月', traffic: '80GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'trial', 'clash'], status: '新手观察', risk: '先试用再购买', summary: '价格较低且支持试用，适合新手验证客户端和节点可用性。' },
  { name: '瞬云', path: '/posts/shunyun-review-2026/', price: 20, priceText: '20元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['stable', 'clash'], status: '备用观察', risk: '晚高峰复测', summary: '轻量备用定位，适合 Clash 通用订阅用户持续观察。' },
  { name: '极连云', path: '/posts/jilianyun-review-2026/', price: 15.5, priceText: '15.5元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['stable'], status: '稳定观察', risk: '节点维护需复核', summary: '偏连接速度和稳定性观察，适合作为备选测试。' },
  { name: '二猫云', path: '/posts/ermiao-vpn-review/', price: 20, priceText: '20元/月', traffic: '100GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['newbie'], status: '性价比观察', risk: '长期稳定需复测', summary: '偏专属客户端和性价比方向，适合轻中度用户短期测试。' },
  { name: '寰宇云', path: '/posts/huanyuyun-review-2026/', price: 18, priceText: '18元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['stable', 'clash'], status: '备用观察', risk: '售后需复核', summary: '通用订阅备选，适合结合晚高峰稳定性做横向对比。' },
  { name: 'sogo', path: '/posts/sogo-review-2026/', price: 25, priceText: '25元/月', traffic: '120GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['newbie'], status: '新手观察', risk: '价格较高需复测', summary: '专属客户端新手体验较好，适合不想折腾配置的人短期测试。' },
  { name: '宇宙云', path: '/posts/yuzhoucloud-review-2026/', price: 12.5, priceText: '12.5元/月', traffic: '50GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['cheap'], status: '低价观察', risk: '流量较小', summary: '价格较低但流量较小，适合轻量使用或备用。' },
  { name: '快狸', path: '/posts/kuaili-review-2026/', price: 15, priceText: '15元/月', traffic: '50GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['newbie', 'chatgpt'], status: '客户端观察', risk: '流量较小', summary: '专属客户端体验清晰，适合轻量办公和新手连接测试。' },
  { name: '可信云', path: '/posts/kexinyun-review-2026/', price: 15, priceText: '15元/月', traffic: '60GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['stable'], status: '稳定备用', risk: '流量较小', summary: '稳定备用定位，适合轻量使用和风险分散。' },
  { name: '星岛梦', path: '/posts/xingdaomeng-review-2026/', price: 16, priceText: '16元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming'], status: '视频观察', risk: '晚高峰复测', summary: '偏视频体验和专属客户端，适合流媒体场景短期测试。' },
]

const getCanonicalUrl = (path: string) => `${hostname}${path}`
const isArticlePage = (page: any) => Boolean(page.filePathRelative && page.path !== '/' && page.path !== '/friends/' && !page.frontmatter.home)

const normalizeDate = (value?: string) => {
  if (!value) return undefined

  const normalizedValue = value.replace(/\//g, '-')
  const date = new Date(normalizedValue)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const getPageDatePublished = (page: any) => normalizeDate(page.frontmatter.createTime || page.frontmatter.date)

const getPageDateModified = (page: any) => {
  const explicitDate = normalizeDate(page.frontmatter.dateModified || page.frontmatter.updateTime || page.frontmatter.lastUpdated)
  if (explicitDate) return explicitDate

  if (page.data.git?.updatedTime) return new Date(page.data.git.updatedTime).toISOString()

  return getPageDatePublished(page)
}

const getPageImage = (page: any) => {
  const image = page.frontmatter.image || page.frontmatter.cover || pageImages[page.path]

  if (!image) return defaultImage
  if (/^https?:\/\//.test(image)) return image

  return `${hostname}${image.startsWith('/') ? image : `/${image}`}`
}

const getPageKeywords = (page: any) => {
  const tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags : []
  const keywords = tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)

  return keywords.length ? Array.from(new Set(keywords)).join(', ') : undefined
}

const getPageMetaKeywords = (page: any) => getPageKeywords(page) || siteKeywords

const getPageTopics = (page: any) => {
  const tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags : []
  const topics = tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)

  return Array.from(new Set(topics)).map((name) => ({
    '@type': 'Thing',
    name,
  }))
}

const getWordCount = (content = '') => {
  const text = stripMarkdown(content)
  const words = text.match(/[\p{Script=Han}]|[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/gu)

  return words?.length || undefined
}

const getArticleSection = (page: any) => {
  const filePath = page.filePathRelative || ''

  if (filePath.includes('机场榜单')) return '机场榜单'
  if (filePath.includes('风险监测')) return '风险监测'
  if (filePath.includes('机场评测')) return '机场评测'
  if (filePath.includes('机场推荐')) return '机场推荐'
  if (filePath.includes('工具')) return '工具教程'
  if (filePath.includes('科学上网专区')) return '科学上网教程'
  if (filePath.includes('tiktok专区')) return 'TikTok教程'
  if (filePath.includes('chatgpt专区')) return 'ChatGPT教程'
  if (filePath.includes('telegram专区')) return 'Telegram教程'
  if (filePath.includes('usdt虚拟币专区')) return 'USDT与交易所教程'

  return '文章'
}

const getAirportPageData = (page: any) => airportData.find((airport) => airport.path === page.path)

const getAirportServiceSchemas = (page: any) => {
  const airport = getAirportPageData(page)
  if (!airport) return []

  const canonicalUrl = getCanonicalUrl(page.path)
  const datePublished = getPageDatePublished(page)
  const dateModified = getPageDateModified(page)

  return [
    {
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: `${airport.name}机场`,
      serviceType: '机场 VPN 服务',
      category: '机场 VPN 服务',
      description: airport.summary,
      url: canonicalUrl,
      image: getPageImage(page),
      provider: { '@id': `${hostname}/#organization` },
      areaServed: '全球',
      audience: {
        '@type': 'Audience',
        audienceType: airport.scenarios.join(', '),
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: '最低价格', value: airport.priceText },
        { '@type': 'PropertyValue', name: '月流量', value: airport.traffic },
        { '@type': 'PropertyValue', name: '免费试用', value: airport.trial ? '支持' : '不支持' },
        { '@type': 'PropertyValue', name: '不限时套餐', value: airport.noExpiry ? '支持' : '不支持' },
        { '@type': 'PropertyValue', name: '专属客户端', value: airport.dedicatedClient ? '支持' : '不支持' },
        { '@type': 'PropertyValue', name: '通用订阅', value: airport.universalSubscription ? '支持' : '不支持' },
        { '@type': 'PropertyValue', name: '观察状态', value: airport.status },
        { '@type': 'PropertyValue', name: '风险提示', value: airport.risk },
      ],
    },
    {
      '@type': 'Review',
      '@id': `${canonicalUrl}#review`,
      name: `${airport.name}机场测评`,
      itemReviewed: { '@id': `${canonicalUrl}#service` },
      author: { '@id': `${hostname}/#author` },
      publisher: { '@id': `${hostname}/#organization` },
      reviewBody: airport.summary,
      ...(datePublished ? { datePublished } : {}),
      ...(dateModified ? { dateModified } : {}),
    },
  ]
}

const stripMarkdown = (content: string) => content
  .replace(/==([^=]+)==\{[^}]+\}/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_`>#{}]/g, '')
  .replace(/\s+/g, ' ')
  .trim()

const getFaqItems = (content = '') => {
  const lines = content.split('\n')
  const faqItems = []
  let inFaqSection = false

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()

    if (line.startsWith('## ')) {
      inFaqSection = /FAQ|常见问题/.test(line)
      continue
    }

    if (!inFaqSection || !line.startsWith('### ')) continue

    const question = stripMarkdown(line.replace(/^###\s+/, ''))
    const answerLines = []

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex].trim()
      if (nextLine.startsWith('## ') || nextLine.startsWith('### ')) break
      if (nextLine && !nextLine.startsWith('---')) answerLines.push(nextLine)
    }

    const answer = stripMarkdown(answerLines.join(' '))
    if (question && answer) {
      faqItems.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })
    }
  }

  return faqItems.slice(0, 8)
}

const hasJsonLdHead = (head: unknown) => Array.isArray(head) && head.some((item) => {
  if (!Array.isArray(item)) return false

  const [tag, attrs] = item
  return tag === 'script'
    && typeof attrs === 'object'
    && attrs !== null
    && (attrs as { type?: string }).type === 'application/ld+json'
})

const getPageExtraSchemas = (page: any) => {
  const schema = page.frontmatter.schema || page.frontmatter.schemas || page.frontmatter.jsonLd

  if (!schema) return []
  return Array.isArray(schema) ? schema : [schema]
}

const getBreadcrumbItems = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const items = [{
    '@type': 'ListItem',
    position: 1,
    name: '首页',
    item: hostname,
  }]

  if (page.path === '/') return items

  if (isArticlePage(page)) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: '全部文章',
      item: `${hostname}/blog/`,
    })
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: title,
    item: canonicalUrl,
  })

  return items
}

const getPageSchema = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const description = page.frontmatter.description || siteDescription
  const faqItems = getFaqItems(page.content)
  const extraSchemas = getPageExtraSchemas(page)
  const image = getPageImage(page)
  const datePublished = getPageDatePublished(page)
  const dateModified = getPageDateModified(page)
  const articlePage = isArticlePage(page)
  const keywords = getPageKeywords(page)
  const articleSection = getArticleSection(page)
  const topics = getPageTopics(page)
  const wordCount = getWordCount(page.content)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${hostname}/#organization`,
        name: siteName,
        url: hostname,
        logo: `${hostname}/logo.png`,
        sameAs: [
          'https://github.com/haandiiong',
          'https://t.me/yp7net',
        ],
      },
      {
        '@type': 'Person',
        '@id': `${hostname}/#author`,
        name: 'yp7',
        url: hostname,
      },
      {
        '@type': 'WebSite',
        '@id': `${hostname}/#website`,
        url: hostname,
        name: siteName,
        description: siteDescription,
        inLanguage: 'zh-CN',
        publisher: { '@id': `${hostname}/#organization` },
      },
      {
        '@type': articlePage ? 'BlogPosting' : 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'zh-CN',
        isPartOf: { '@id': `${hostname}/#website` },
        publisher: { '@id': `${hostname}/#organization` },
        mainEntityOfPage: canonicalUrl,
        image,
        ...(articlePage
          ? {
              headline: title,
              author: { '@id': `${hostname}/#author` },
              datePublished,
              dateModified,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': canonicalUrl,
              },
              ...(keywords ? { keywords } : {}),
              articleSection,
              ...(wordCount ? { wordCount } : {}),
              ...(topics.length ? { about: topics } : {}),
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: getBreadcrumbItems(page),
      },
      ...getAirportServiceSchemas(page),
      ...extraSchemas,
      ...(faqItems.length
        ? [{
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            mainEntity: faqItems,
          }]
        : []),
    ],
  }
}

const getSocialHead = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const description = page.frontmatter.description || siteDescription
  const image = getPageImage(page)
  const articlePage = isArticlePage(page)
  const datePublished = getPageDatePublished(page)
  const dateModified = getPageDateModified(page)

  return [
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: articlePage ? 'article' : 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:alt', content: title }],
    ...(articlePage && datePublished
      ? [['meta', { property: 'article:published_time', content: datePublished }]]
      : []),
    ...(articlePage && dateModified
      ? [['meta', { property: 'article:modified_time', content: dateModified }]]
      : []),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
    ['meta', { name: 'twitter:image:alt', content: title }],
  ]
}

const getBasicPageHead = (page: any) => {
  const keywords = getPageMetaKeywords(page)

  return [
    ['meta', { name: 'description', content: page.frontmatter.description || siteDescription }],
    ...(keywords ? [['meta', { name: 'keywords', content: keywords }]] : []),
  ]
}

const isSponsoredLink = (href = '') => {
  if (!/^https?:\/\//.test(href)) return false

  return /(\?|&|#)(code|aff|r|c|from)=/i.test(href) || /vipaff|aff\.cc|kuailicloudt|sogoyunaff|gsyaff|2maoyunaff|jlcvipaff/i.test(href)
}

const qualifySponsoredAnchors = (html = '') => html.replace(/<a\b([^>]*?)>/gi, (anchor, attrs) => {
  const hrefMatch = attrs.match(/\bhref=(["'])(.*?)\1/i)
  if (!hrefMatch || !isSponsoredLink(hrefMatch[2])) return anchor

  const withoutRel = attrs.replace(/\srel=(["']).*?\1/i, '')
  const withTarget = /\starget=/i.test(withoutRel)
    ? withoutRel.replace(/\starget=(["']).*?\1/i, ' target="_blank"')
    : `${withoutRel} target="_blank"`

  return `<a${withTarget} rel="sponsored nofollow noopener noreferrer">`
})

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const injectGeneratedH1 = (html = '', title = '') => {
  if (/<h1\b/i.test(html)) return html

  return html.replace(/(<div id="VPContent"[^>]*>)/, `$1<h1 class="visually-hidden">${escapeHtml(title)}</h1>`)
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

const patchGeneratedHtml = (app: any) => {
  const pages = [
    ['index.html', '2026机场推荐与科学上网教程'],
    ['blog/index.html', '全部文章'],
    ['friends/index.html', '友链'],
  ]

  pages.forEach(([file, title]) => {
    const htmlPath = app.dir.dest(file)
    if (!existsSync(htmlPath)) return

    const html = readFileSync(htmlPath, 'utf-8')
    const patched = injectGeneratedH1(html, title)
    if (patched !== html) writeFileSync(htmlPath, patched)
  })

  walkGeneratedHtml(app.dir.dest(), (htmlPath) => {
    const html = readFileSync(htmlPath, 'utf-8')
    const patched = patchGeneratedExternalLinks(html)
    if (patched !== html) writeFileSync(htmlPath, patched)
  })
}

const getLlmsSection = (page: any) => {
  if (page.path === '/') return '站点入口'
  if (page.path === '/blog/' || page.path === '/blog/tags/' || page.path === '/blog/categories/' || page.path === '/blog/archives/') return '聚合索引'
  if (page.path.startsWith('/rankings/')) return '机场榜单'
  if (page.path === '/risk-monitor/') return '风险监测'
  if (page.path === '/methodology/') return '测评方法'

  return getArticleSection(page)
}

const shouldIncludeInLlms = (page: any) => {
  if (!page.path || page.path.includes('404')) return false
  if (page.frontmatter?.draft || page.frontmatter?.noindex) return false

  return Boolean(page.title || page.frontmatter?.title || page.frontmatter?.description)
}

const truncateText = (value = '', maxLength = 180) => {
  const text = stripMarkdown(value)

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}

const getAirportDataFiles = () => {
  const serializeAirport = (airport: typeof airportData[number]) => ({
    ...airport,
    url: getCanonicalUrl(airport.path),
  })
  const byScenario = (scenario: string) => airportData.filter((airport) => airport.scenarios.includes(scenario))

  return {
    airports: airportData.map(serializeAirport),
    rankings: {
      all: airportData.map(serializeAirport),
      stable: byScenario('stable').map(serializeAirport),
      cheap: airportData.filter((airport) => airport.price <= 10 || airport.scenarios.includes('cheap')).map(serializeAirport),
      clash: airportData.filter((airport) => airport.universalSubscription || airport.scenarios.includes('clash')).map(serializeAirport),
      chatgpt: byScenario('chatgpt').map(serializeAirport),
      streaming: byScenario('streaming').map(serializeAirport),
      trial: airportData.filter((airport) => airport.trial).map(serializeAirport),
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

const getAirportMarkdownTable = (airports: typeof airportData, columns: string[] = ['机场', '最低价格', '月流量', '试用', '不限时', '专属客户端', '通用订阅', '状态']) => {
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
}) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="${defaultRobots}">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${siteName}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${defaultImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
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

const getAirportHtmlTable = (airports = airportData) => {
  const rows = airports.map((airport) => `<tr>
        <td><a href="${airport.path}">${escapeHtml(airport.name)}</a></td>
        <td>${escapeHtml(airport.priceText)}</td>
        <td>${escapeHtml(airport.traffic)}</td>
        <td>${airport.trial ? '支持' : '不支持'}</td>
        <td>${airport.noExpiry ? '支持' : '不支持'}</td>
        <td>${airport.dedicatedClient ? '支持' : '不支持'}</td>
        <td>${airport.universalSubscription ? '支持' : '不支持'}</td>
        <td>${escapeHtml(airport.status)}</td>
      </tr>`).join('\n')

  return `<table>
        <thead>
          <tr><th>机场</th><th>最低价格</th><th>月流量</th><th>试用</th><th>不限时</th><th>专属客户端</th><th>通用订阅</th><th>状态</th></tr>
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

const generateAirportDataFiles = (app: any) => {
  const dataDir = app.dir.dest('data')
  const data = getAirportDataFiles()

  mkdirSync(dataDir, { recursive: true })
  writeFileSync(`${dataDir}/airports.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    airports: data.airports,
  }, null, 2))
  writeFileSync(`${dataDir}/rankings.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    rankings: data.rankings,
  }, null, 2))
  writeFileSync(`${dataDir}/risk-monitor.json`, JSON.stringify({
    site: siteName,
    url: hostname,
    lastReviewed: siteLastReviewed,
    risks: data.riskMonitor,
  }, null, 2))
  writeFileSync(`${dataDir}/airports.md`, [
    '# yp7.net 机场数据',
    '',
    `Last reviewed: ${siteLastReviewed}`,
    '',
    getAirportMarkdownTable(airportData),
    '',
  ].join('\n'))
  writeFileSync(`${dataDir}/rankings.md`, [
    '# yp7.net 机场榜单数据',
    '',
    `Last reviewed: ${siteLastReviewed}`,
    '',
    '## 稳定机场',
    '',
    getAirportMarkdownTable(data.rankings.stable),
    '',
    '## 低价机场',
    '',
    getAirportMarkdownTable(data.rankings.cheap),
    '',
    '## Clash 机场',
    '',
    getAirportMarkdownTable(data.rankings.clash),
    '',
    '## ChatGPT 机场',
    '',
    getAirportMarkdownTable(data.rankings.chatgpt),
    '',
    '## 流媒体机场',
    '',
    getAirportMarkdownTable(data.rankings.streaming),
    '',
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
  writeFileSync(`${dataDir}/airports.html`, renderDataHtmlPage({
    title: 'yp7.net 全量机场数据',
    description: 'yp7.net 全量机场数据 HTML 页面，汇总机场价格、流量、试用、不限时套餐、专属客户端、通用订阅和状态。',
    keywords: '机场数据,机场榜单,机场价格,机场推荐,机场风险',
    canonical: `${hostname}/data/airports.html`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'yp7.net 全量机场数据',
      description: '机场价格、流量、试用、客户端、订阅和状态数据。',
      url: `${hostname}/data/airports.html`,
      dateModified: siteLastReviewed,
      license: `${hostname}/methodology/`,
      creator: { '@id': `${hostname}/#organization` },
    },
    body: `<h1>yp7.net 全量机场数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场数据 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/airports.json">airports.json</a>
        <a href="/data/airports.md">airports.md</a>
        <a href="/data/rankings.html">rankings.html</a>
        <a href="/rankings/all/">全量机场榜单</a>
        <a href="/methodology/">测评方法</a>
      </div>
      <div class="card">${getAirportHtmlTable()}</div>`,
  }))
  writeFileSync(`${dataDir}/rankings.html`, renderDataHtmlPage({
    title: 'yp7.net 机场榜单数据',
    description: 'yp7.net 机场榜单 HTML 页面，按稳定、低价、Clash、ChatGPT、流媒体和试用场景整理机场数据。',
    keywords: '机场榜单,机场排行榜,稳定机场,低价机场,Clash机场,ChatGPT机场,流媒体机场',
    canonical: `${hostname}/data/rankings.html`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'yp7.net 机场榜单数据',
      description: '按稳定、低价、Clash、ChatGPT、流媒体和试用场景整理的机场榜单数据。',
      url: `${hostname}/data/rankings.html`,
      dateModified: siteLastReviewed,
      license: `${hostname}/methodology/`,
      creator: { '@id': `${hostname}/#organization` },
    },
    body: `<h1>yp7.net 机场榜单数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场榜单 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/rankings.json">rankings.json</a>
        <a href="/data/rankings.md">rankings.md</a>
        <a href="/rankings/all/">全量榜单</a>
        <a href="/rankings/stable/">稳定机场</a>
        <a href="/rankings/cheap/">低价机场</a>
        <a href="/rankings/clash/">Clash机场</a>
        <a href="/rankings/chatgpt/">ChatGPT机场</a>
        <a href="/rankings/streaming/">流媒体机场</a>
      </div>
      <h2>稳定机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.stable)}</div>
      <h2>低价机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.cheap)}</div>
      <h2>Clash机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.clash)}</div>
      <h2>ChatGPT机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.chatgpt)}</div>
      <h2>流媒体机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.streaming)}</div>
      <h2>试用机场</h2>
      <div class="card">${getAirportHtmlTable(data.rankings.trial)}</div>`,
  }))
  writeFileSync(`${dataDir}/risk-monitor.html`, renderDataHtmlPage({
    title: 'yp7.net 机场风险监测数据',
    description: 'yp7.net 机场风险监测 HTML 页面，整理已淘汰机场、客服失联、官网异常、节点波动和购买前风险提示。',
    keywords: '机场风险,跑路机场,机场跑路,机场监测,机场避坑',
    canonical: `${hostname}/data/risk-monitor.html`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'yp7.net 机场风险监测数据',
      description: '机场淘汰记录、观察状态和购买前风险提示数据。',
      url: `${hostname}/data/risk-monitor.html`,
      dateModified: siteLastReviewed,
      license: `${hostname}/methodology/`,
      creator: { '@id': `${hostname}/#organization` },
    },
    body: `<h1>yp7.net 机场风险监测数据</h1>
      <p>Last reviewed: ${siteLastReviewed}</p>
      <p>本页是人类可读的机场风险监测 HTML 入口。机器读取可使用 JSON 或 Markdown 文件。</p>
      <div class="links">
        <a href="/data/risk-monitor.json">risk-monitor.json</a>
        <a href="/data/risk-monitor.md">risk-monitor.md</a>
        <a href="/data/rankings.html">rankings.html</a>
        <a href="/risk-monitor/">风险监测页</a>
        <a href="/methodology/">测评方法</a>
      </div>
      <div class="card">${getRiskMonitorHtmlTable()}</div>`,
  }))
}

const generateLlmsTxt = (app: any) => {
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
    `- [机场榜单 JSON](${hostname}/data/rankings.json): 稳定、低价、Clash、ChatGPT、流媒体和试用榜单数据。`,
    `- [风险监测 JSON](${hostname}/data/risk-monitor.json): 已淘汰和观察中机场风险提示。`,
    `- [全量机场 HTML](${hostname}/data/airports.html): 人类可读的机场数据表。`,
    `- [机场榜单 HTML](${hostname}/data/rankings.html): 人类可读的场景榜单数据表。`,
    `- [风险监测 HTML](${hostname}/data/risk-monitor.html): 人类可读的风险监测表。`,
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

export default defineUserConfig({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  head: [
    ['meta', { name: 'robots', content: defaultRobots }],
    ['meta', { name: 'author', content: 'yp7' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
  ],
  plugins: [
    {
      name: 'yp7-link-rel',
      extendsMarkdownOptions: (options: any) => {
        options.links ||= {}
        options.links.externalAttrs = {
          ...(options.links.externalAttrs || {}),
          target: '_blank',
          rel: 'nofollow noopener noreferrer',
        }
      },
    },
    {
      name: 'yp7-generated-html-cleanup',
      onGenerated: (app: any) => {
        patchGeneratedHtml(app)
        generateAirportDataFiles(app)
        generateLlmsTxt(app)
      },
    },
  ],
  extendsPage: (page) => {
    const knownPageImage = pageImages[page.path]
    if (knownPageImage) {
      page.frontmatter.image ||= knownPageImage
      page.frontmatter.cover ||= knownPageImage
    }

    page.contentRendered = qualifySponsoredAnchors(page.contentRendered)

    page.frontmatter.head = [
      ...(page.frontmatter.head || []),
      ['link', { rel: 'canonical', href: getCanonicalUrl(page.path) }],
      ...getBasicPageHead(page),
      ...getSocialHead(page),
      ...(hasJsonLdHead(page.frontmatter.head)
        ? []
        : [['script', { type: 'application/ld+json' }, JSON.stringify(getPageSchema(page))]]),
    ]
  },
  extendsMarkdown: (md) => {
    const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
    const defaultHtmlBlock = md.renderer.rules.html_block || ((tokens, idx) => tokens[idx].content)
    const defaultHtmlInline = md.renderer.rules.html_inline || ((tokens, idx) => tokens[idx].content)

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const href = token.attrGet('href') || ''
      const rendered = defaultLinkOpen(tokens, idx, options, env, self)

      if (!isSponsoredLink(href)) return rendered

      token.attrSet('rel', 'sponsored nofollow noopener noreferrer')
      token.attrSet('target', '_blank')

      return self.renderToken(tokens, idx, options)
    }

    md.renderer.rules.html_block = (tokens, idx, options, env, self) => qualifySponsoredAnchors(defaultHtmlBlock(tokens, idx, options, env, self))
    md.renderer.rules.html_inline = (tokens, idx, options, env, self) => qualifySponsoredAnchors(defaultHtmlInline(tokens, idx, options, env, self))
  },
  shouldPrefetch: false,
  theme: plumeTheme({
    hostname,
    footer: { message: "yp7.net © 2026 CFF 版权所有" },
    navbar: [
      { text: '首页', link: '/', icon: 'material-symbols:home-rounded' },
      { text: '机场推荐', link: '/posts/jichang-tuijian/', icon: 'material-symbols:flight-takeoff' },
      {
        text: '机场榜单',
        icon: 'material-symbols:leaderboard',
        items: [
          { text: '全量榜单', link: '/rankings/all/', icon: 'material-symbols:format-list-numbered' },
          { text: '稳定机场', link: '/rankings/stable/', icon: 'material-symbols:verified-rounded' },
          { text: '低价机场', link: '/rankings/cheap/', icon: 'material-symbols:sell-outline' },
          { text: 'Clash机场', link: '/rankings/clash/', icon: 'material-symbols:hive-outline' },
          { text: 'ChatGPT机场', link: '/rankings/chatgpt/', icon: 'material-symbols:smart-toy-outline' },
          { text: '流媒体机场', link: '/rankings/streaming/', icon: 'material-symbols:live-tv-outline' },
        ],
      },
      { text: '风险监测', link: '/risk-monitor/', icon: 'material-symbols:warning-outline' },
      { text: '测评方法', link: '/methodology/', icon: 'material-symbols:science-outline' },
      {
        text: '翻墙工具',
        icon: 'ic:baseline-construction',
        items: [
          { text: 'Windows/Linux/MacOS', link: '/posts/clash-verge-guide-2026/', icon: 'ic:baseline-personal-video' },
          { text: 'Android手机', link: '/posts/clash-for-android-guide-2026/', icon: 'ic:baseline-android' },
          { text: 'iOS苹果手机', link: '/posts/shadowrocket-guide-2026/', icon: 'ic:baseline-rocket-launch' },
        ],
      },
      {
        text: '文章索引',
        icon: 'material-symbols:article-outline',
        items: [
          { text: '全部文章', link: '/blog/', icon: 'material-symbols:subject' },
          { text: '标签索引', link: '/blog/tags/', icon: 'material-symbols:local-offer-outline' },
          { text: '分类索引', link: '/blog/categories/', icon: 'material-symbols:category-outline' },
          { text: '时间归档', link: '/blog/archives/', icon: 'material-symbols:calendar-month-outline' },
        ],
      },
      { text: '友链', link: '/friends/' },
    ],
    profile: {
      name: 'yp7.net',
      description: 'yp7.net 专注于机场推荐、VPN推荐、Clash节点使用教程和科学上网问题解决，帮助用户选择稳定高速的网络加速方案。',
    },
    social: [
      { icon: 'github', link: 'https://github.com/haandiiong' },
      {
        icon: { svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"></path> </g></svg>' },
        link: 'https://t.me/yp7net'
      },
    ],
    markdown: {
      collapse: true,
    },
    blog: {
      tags: true,
      categories: true,
      archives: true,
      tagsLink: '/blog/tags/',
      categoriesLink: '/blog/categories/',
      archivesLink: '/blog/archives/',
      postCover: 'right',
    },
    plugins: {
      seo: false,
    },
  }),
  bundler: viteBundler({
    viteOptions: {
      build: {
        modulePreload: false,
      },
    }
  })
})
