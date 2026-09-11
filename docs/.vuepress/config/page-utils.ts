import { defaultImage, hostname, pageImages, siteDescription, siteKeywords } from './site'

const maxMetaDescriptionLength = 158

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

const collectionPagePaths = new Set([
  '/posts/jichang-tuijian/',
  '/posts/jichang-heji/',
  '/risk-monitor/',
])

export const isCollectionPage = (page: any) => (
  collectionPagePaths.has(page.path)
  || page.path.startsWith('/rankings/')
)

export const isArticlePage = (page: any) => Boolean(
  page.filePathRelative
  && page.path.startsWith('/posts/')
  && !isCollectionPage(page)
  && !page.frontmatter.home,
)

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
  if (filePath.includes('机场评测')) return '机场推荐资料'
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

export const getPageDescription = (page: any) => truncateMetaDescription(
  stripMarkdown(page.frontmatter.description || siteDescription),
)
