import { airportData } from './airports'
import {
  getArticleSection,
  getCanonicalUrl,
  getPageDateModified,
  getPageDatePublished,
  getPageDescription,
  getPageImage,
  getPageKeywords,
  getPageTopics,
  getWordCount,
  isArticlePage,
  stripMarkdown,
} from './page-utils'
import {
  hostname,
  siteAuthorDescription,
  siteAuthorName,
  siteAuthorUrl,
  siteContactUrl,
  siteDescription,
  siteName,
  sitePublishingPrinciplesUrl,
} from './site'

export const hasJsonLdHead = (head: unknown) => Array.isArray(head) && head.some((item) => {
  if (!Array.isArray(item)) return false

  const [tag, attrs] = item
  return tag === 'script'
    && typeof attrs === 'object'
    && attrs !== null
    && (attrs as { type?: string }).type === 'application/ld+json'
})

const getAirportPageData = (page: any) => airportData.find((airport) => airport.path === page.path)

const getAirportServiceSchemas = (page: any) => {
  const airport = getAirportPageData(page)
  if (!airport) return []

  const canonicalUrl = getCanonicalUrl(page.path)

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
  ]
}

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

const isSchemaObject = (value: unknown): value is Record<string, any> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

const hasSchemaType = (value: unknown, type: string) => (
  Array.isArray(value) ? value.includes(type) : value === type
)

const normalizeExtraSchemaValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(normalizeExtraSchemaValue)
  if (isSchemaObject(value)) return normalizeExtraSchema(value)

  return value
}

const normalizeItemListElement = (element: unknown) => {
  if (!isSchemaObject(element)) return normalizeExtraSchemaValue(element)

  const normalized = normalizeExtraSchema(element)
  if (
    !hasSchemaType(normalized['@type'], 'ListItem')
    || normalized.item
    || (normalized.name === undefined && normalized.url === undefined)
  ) {
    return normalized
  }

  const { name, url, ...listItem } = normalized

  return {
    ...listItem,
    item: {
      '@type': 'Thing',
      ...(name !== undefined ? { name } : {}),
      ...(url !== undefined ? { url } : {}),
    },
  }
}

function normalizeExtraSchema(schema: Record<string, any>) {
  const normalized = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, normalizeExtraSchemaValue(value)]),
  ) as Record<string, any>

  if (hasSchemaType(normalized['@type'], 'ItemList') && Array.isArray(normalized.itemListElement)) {
    return {
      ...normalized,
      itemListElement: normalized.itemListElement.map(normalizeItemListElement),
    }
  }

  return normalized
}

const getPageExtraSchemas = (page: any) => {
  const schema = page.frontmatter.schema || page.frontmatter.schemas || page.frontmatter.jsonLd

  if (!schema) return []
  const schemas = Array.isArray(schema) ? schema : [schema]

  return schemas.map(normalizeExtraSchema)
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

export const getPageSchema = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const description = getPageDescription(page)
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
        description: siteDescription,
        publishingPrinciples: sitePublishingPrinciplesUrl,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'editorial',
          url: siteContactUrl,
        },
        sameAs: [
          'https://github.com/haandiiong',
          siteContactUrl,
        ],
      },
      {
        '@type': 'Person',
        '@id': `${hostname}/#author`,
        name: siteAuthorName,
        description: siteAuthorDescription,
        url: siteAuthorUrl,
        sameAs: [
          'https://github.com/haandiiong',
          siteContactUrl,
        ],
        knowsAbout: [
          '机场推荐',
          '机场测评',
          'Clash',
          'Shadowrocket',
          '科学上网',
          'ChatGPT 访问',
          '流媒体解锁',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${hostname}/#website`,
        url: hostname,
        name: siteName,
        description: siteDescription,
        inLanguage: 'zh-CN',
        publisher: { '@id': `${hostname}/#organization` },
        publishingPrinciples: sitePublishingPrinciplesUrl,
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
