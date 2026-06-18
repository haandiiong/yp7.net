import { getArticleSection, stripMarkdown } from './page-utils'

export const getLlmsSection = (page: any) => {
  if (page.path === '/') return '站点入口'
  if (page.path === '/blog/' || page.path === '/blog/tags/' || page.path === '/blog/categories/' || page.path === '/blog/archives/') return '聚合索引'
  if (page.path === '/about/') return '站点说明'
  if (page.path.startsWith('/rankings/')) return '机场榜单'
  if (page.path === '/risk-monitor/') return '风险监测'
  if (page.path === '/methodology/') return '测评方法'

  return getArticleSection(page)
}

export const shouldIncludeInLlms = (page: any) => {
  if (!page.path || page.path.includes('404')) return false
  if (page.frontmatter?.draft || page.frontmatter?.noindex) return false

  return Boolean(page.title || page.frontmatter?.title || page.frontmatter?.description)
}

export const truncateText = (value = '', maxLength = 180) => {
  const text = stripMarkdown(value)

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}
