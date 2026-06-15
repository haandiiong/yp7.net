import { defaultImage, hostname, pageImages, siteDescription, siteKeywords } from './site'

const minMetaDescriptionLength = 120
const maxMetaDescriptionLength = 158
const defaultMetaDescriptionSuffix = '页面补充核心结论、适合人群、配置步骤、常见问题、相关阅读和风险提示，帮助读者结合设备、地区、网络环境与常用场景做判断。'
const metaDescriptionSuffixes: Record<string, string> = {
  机场榜单: '页面补充价格、流量、试用、客户端兼容、通用订阅和风险状态，便于按预算、稳定性、ChatGPT、Clash 与流媒体需求筛选。',
  风险监测: '页面补充官网异常、客服失联、套餐变化、节点波动、续费风险和购买前检查清单，帮助读者降低机场服务的时效性风险。',
  机场评测: '页面补充官网入口、套餐价格、节点体验、晚高峰表现、适合人群、优缺点和购买前风险提示，建议先短期测试再续费。',
  机场推荐: '页面补充推荐理由、价格流量、测试场景、客户端兼容、适合人群和购买风险，帮助新手先筛选再短期测试。',
  工具教程: '页面包含安装步骤、订阅导入、节点选择、常见问题、适合设备和使用风险，帮助新手完成配置并排查连接异常。',
  科学上网教程: '页面解释核心概念、工具选择、配置方法、适合场景、常见误区和安全风险，帮助新手按设备与网络环境选择方案。',
  TikTok教程: '页面补充节点地区、设备环境、账号风控、网络排查和长期运营注意事项，帮助读者稳定处理 TikTok 访问问题。',
  ChatGPT教程: '页面补充账号注册、正版入口、使用技巧、网络访问、常见问题和风险提示，帮助新手更稳定地使用 AI 工具。',
  Telegram教程: '页面补充下载安装、注册登录、账号安全、代理设置、群组频道和常见问题，帮助新手完成 Telegram 基础配置。',
  USDT与交易所教程: '页面补充注册流程、链类型、手续费、充值提现、平台规则和资金风险提示，帮助新手在操作前核对关键信息。',
}

export const getCanonicalUrl = (path: string) => `${hostname}${path}`

export const normalizeDate = (value?: string) => {
  if (!value) return undefined

  const normalizedValue = value.replace(/\//g, '-')
  const date = new Date(normalizedValue)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export const stripMarkdown = (content = '') => content
  .replace(/==([^=]+)==\{[^}]+\}/g, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/[*_`>#{}]/g, '')
  .replace(/\s+/g, ' ')
  .trim()

export const isArticlePage = (page: any) => Boolean(page.filePathRelative && page.path !== '/' && page.path !== '/friends/' && !page.frontmatter.home)

export const getPageDatePublished = (page: any) => normalizeDate(page.frontmatter.createTime || page.frontmatter.date)

export const getPageDateModified = (page: any) => {
  const explicitDate = normalizeDate(page.frontmatter.dateModified || page.frontmatter.updateTime || page.frontmatter.lastUpdated)
  if (explicitDate) return explicitDate

  if (page.data.git?.updatedTime) return new Date(page.data.git.updatedTime).toISOString()

  return getPageDatePublished(page)
}

export const getPageImage = (page: any) => {
  const image = page.frontmatter.image || page.frontmatter.cover || pageImages[page.path]

  if (!image) return defaultImage
  if (/^https?:\/\//.test(image)) return image

  return `${hostname}${image.startsWith('/') ? image : `/${image}`}`
}

export const getPageKeywords = (page: any) => {
  const tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags : []
  const keywords = tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)

  return keywords.length ? Array.from(new Set(keywords)).join(', ') : undefined
}

export const getPageMetaKeywords = (page: any) => getPageKeywords(page) || siteKeywords

export const getPageTopics = (page: any) => {
  const tags = Array.isArray(page.frontmatter.tags) ? page.frontmatter.tags : []
  const topics = tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)

  return Array.from(new Set(topics)).map((name) => ({
    '@type': 'Thing',
    name,
  }))
}

export const getWordCount = (content = '') => {
  const text = stripMarkdown(content)
  const words = text.match(/[\p{Script=Han}]|[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/gu)

  return words?.length || undefined
}

export const getArticleSection = (page: any) => {
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

const truncateMetaDescription = (description = '') => {
  if (description.length <= maxMetaDescriptionLength) return description

  return `${description.slice(0, maxMetaDescriptionLength - 1)}…`
}

const getExpandedDescription = (description = '', suffix = defaultMetaDescriptionSuffix) => {
  const normalizedDescription = stripMarkdown(description || siteDescription)
  if (normalizedDescription.length >= minMetaDescriptionLength) return truncateMetaDescription(normalizedDescription)

  const separator = /[。.!！？?]$/.test(normalizedDescription) ? '' : '。'
  const expandedDescription = `${normalizedDescription}${separator}${suffix}`
  if (expandedDescription.length >= minMetaDescriptionLength) return truncateMetaDescription(expandedDescription)

  return truncateMetaDescription(`${expandedDescription}本站同时强调更新时间、官网规则、实际测试差异和购买前风险提示。`)
}

const getMetaDescriptionSuffix = (page: any) => {
  if (page.path === '/') {
    return '同时提供机场榜单、风险监测、测评方法、Clash 与 Shadowrocket 教程，帮助新手按预算、设备和使用场景快速筛选。'
  }

  if (page.path === '/friends/') {
    return '页面说明友链交换方向、联系入口和相关站点类型，方便科学上网、机场测评、VPN 教程和网络工具站点互相发现与长期维护。'
  }

  return metaDescriptionSuffixes[getArticleSection(page)] || defaultMetaDescriptionSuffix
}

export const getPageDescription = (page: any) => getExpandedDescription(
  page.frontmatter.description || siteDescription,
  getMetaDescriptionSuffix(page),
)
