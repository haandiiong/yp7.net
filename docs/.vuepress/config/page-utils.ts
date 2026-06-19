import { defaultImage, hostname, pageImages, siteDescription, siteKeywords } from './site'

const minMetaDescriptionLength = 120
const maxMetaDescriptionLength = 158
const defaultMetaDescriptionSuffix = '页面补充核心结论、适合人群、配置步骤、常见问题、相关阅读和风险提示，帮助读者结合设备、地区、网络环境与常用场景做判断。'
const metaDescriptionSuffixes: Record<string, string> = {
  机场榜单: '按价格、稳定性、试用、客户端兼容、通用订阅和风险状态筛选适合的机场服务。',
  风险监测: '持续记录官网异常、客服失联、套餐变化、节点波动和购买风险，帮助降低机场服务时效性风险。',
  机场评测: '基于晚高峰实测、长期连接表现、客户端兼容性和风险提示，帮助选择合适机场。',
  机场推荐: '按晚高峰体验、长期稳定性、适合人群和购买风险，推荐适合的机场服务。',
  工具教程: '包含安装步骤、订阅导入、节点选择和常见问题，帮助完成客户端配置。',
  科学上网教程: '解释核心概念、工具选择、配置方法和常见误区，帮助按需求选择方案。',
  TikTok教程: '补充节点地区、设备环境、账号风控和网络排查，帮助稳定处理访问问题。',
  ChatGPT教程: '补充账号注册、使用技巧、网络访问和常见问题，帮助稳定使用 AI 工具。',
  Telegram教程: '补充下载安装、注册登录、账号安全和代理设置，帮助完成基础配置。',
  USDT与交易所教程: '补充注册流程、链类型、手续费、充值提现和资金风险，帮助安全操作。',
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
  return truncateMetaDescription(expandedDescription)
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
