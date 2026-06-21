import { airportData, visibleAirportData } from './airports'
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
      subjectOf: { '@id': `${canonicalUrl}#webpage` },
      areaServed: [
        { '@type': 'Country', name: '中国' },
        { '@type': 'Country', name: '台湾' },
        { '@type': 'Country', name: '香港' },
        { '@type': 'Country', name: '新加坡' },
        { '@type': 'Country', name: '日本' },
        { '@type': 'Country', name: '美国' },
        { '@type': 'Country', name: '韩国' },
      ],
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
        ...(airport.performance ? [
          { '@type': 'PropertyValue', name: '证据等级', value: airport.performance.evidenceLevel },
          { '@type': 'PropertyValue', name: '最后测试时间', value: airport.performance.lastTestedAt },
          { '@type': 'PropertyValue', name: '测试时段', value: airport.performance.testWindow },
          { '@type': 'PropertyValue', name: '测试地区', value: airport.performance.testRegion },
          { '@type': 'PropertyValue', name: '测试网络', value: airport.performance.testNetwork },
          { '@type': 'PropertyValue', name: '测试设备', value: airport.performance.testDevice },
          { '@type': 'PropertyValue', name: '晚高峰延迟', value: `${airport.performance.latencyMs}ms` },
          { '@type': 'PropertyValue', name: '晚高峰速度区间', value: airport.performance.downloadMbpsRange },
          { '@type': 'PropertyValue', name: 'ChatGPT表现', value: airport.performance.chatgptResult },
          { '@type': 'PropertyValue', name: 'YouTube 4K表现', value: airport.performance.youtube4kResult },
          { '@type': 'PropertyValue', name: '稳定性判断', value: airport.performance.stability },
        ] : []),
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
      itemListOrder: normalized.itemListOrder || 'https://schema.org/ItemListOrderAscending',
    }
  }

  return normalized
}

const getPageExtraSchemas = (page: any) => {
  const schema = page.frontmatter.schema || page.frontmatter.schemas || page.frontmatter.jsonLd

  if (!schema) return []
  const schemas = Array.isArray(schema) ? schema : [schema]
  const generatedItemList = getGeneratedItemListSchema(page)

  return schemas
    .map(normalizeExtraSchema)
    .filter((item) => !(generatedItemList && isSchemaObject(item) && hasSchemaType(item['@type'], 'ItemList')))
}

const getAirportListItem = (airport: typeof airportData[number], index: number) => ({
  '@type': 'ListItem',
  position: index + 1,
  item: {
    '@type': 'Thing',
    name: airport.name,
    url: getCanonicalUrl(airport.path),
  },
})

const getGeneratedItemListSchema = (page: any) => {
  const hasSalesSample = (airport: typeof airportData[number]) => typeof airport.salesSample === 'number'
  const byScenario = (scenario: string) => visibleAirportData.filter((airport) => airport.scenarios.includes(scenario))
  const rankingMap: Record<string, { name: string, items: typeof airportData }> = {
    '/rankings/all/': { name: '2026全量机场榜单', items: visibleAirportData },
    '/rankings/sales/': {
      name: '2026机场销量榜',
      items: visibleAirportData.filter(hasSalesSample).sort((a, b) => b.salesSample! - a.salesSample!),
    },
    '/rankings/stable/': { name: '2026稳定机场榜', items: byScenario('stable') },
    '/rankings/cheap/': {
      name: '2026低价机场榜',
      items: visibleAirportData.filter((airport) => airport.price <= 10 || airport.scenarios.includes('cheap')),
    },
    '/rankings/trial/': { name: '2026免费试用机场榜', items: visibleAirportData.filter((airport) => airport.trial) },
    '/rankings/no-expiry/': { name: '2026不限时机场榜', items: visibleAirportData.filter((airport) => airport.noExpiry) },
    '/rankings/dedicated-client/': { name: '2026专属客户端机场榜', items: visibleAirportData.filter((airport) => airport.dedicatedClient) },
    '/rankings/clash/': {
      name: '2026 Clash机场榜',
      items: visibleAirportData.filter((airport) => airport.universalSubscription || airport.scenarios.includes('clash')),
    },
    '/rankings/chatgpt/': { name: '2026 ChatGPT机场榜', items: byScenario('chatgpt') },
    '/rankings/streaming/': { name: '2026流媒体机场榜', items: byScenario('streaming') },
  }
  const ranking = rankingMap[page.path]

  if (!ranking) return undefined

  return {
    '@type': 'ItemList',
    '@id': `${getCanonicalUrl(page.path)}#ranking`,
    name: ranking.name,
    numberOfItems: ranking.items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: ranking.items.map(getAirportListItem),
  }
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
  const generatedItemListSchema = getGeneratedItemListSchema(page)
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
      ...(generatedItemListSchema ? [generatedItemListSchema] : []),
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
