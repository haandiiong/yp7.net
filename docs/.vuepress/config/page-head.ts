import { qualifySponsoredAnchors } from './generated'
import {
  getCanonicalUrl,
  getPageDateModified,
  getPageDatePublished,
  getPageDescription,
  getPageImage,
  getPageMetaKeywords,
  isArticlePage,
} from './page-utils'
import { getPageSchema, hasJsonLdHead } from './schema'
import { defaultRobots, pageImages, siteName } from './site'

const getSocialHead = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const description = getPageDescription(page)
  const image = getPageImage(page)
  const articlePage = isArticlePage(page)
  const datePublished = getPageDatePublished(page)
  const dateModified = getPageDateModified(page)

  return [
    ['meta', { name: 'geo.position', content: '22.3193;114.1694' }],
    ['meta', { name: 'ICBM', content: '22.3193, 114.1694' }],
    ['meta', { name: 'geo.placename', content: 'Hong Kong' }],
    ['meta', { name: 'geo.region', content: 'HK' }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:type', content: articlePage ? 'article' : 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:locale:alternate', content: 'zh_TW' }],
    ['meta', { property: 'og:locale:alternate', content: 'zh_HK' }],
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
  const robots = page.path.startsWith('/rankings/')
    ? 'index, follow, max-snippet:320, max-image-preview:large'
    : page.path.startsWith('/posts/') && page.path.includes('-review')
    ? 'index, follow, max-snippet:320, max-image-preview:large'
    : defaultRobots

  return [
    ['meta', { name: 'robots', content: robots }],
    ['meta', { name: 'description', content: getPageDescription(page) }],
    ...(keywords ? [['meta', { name: 'keywords', content: keywords }]] : []),
  ]
}

export const extendPageWithSeo = (page: any) => {
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
}
