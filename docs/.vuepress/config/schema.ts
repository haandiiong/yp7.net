import { airportData } from './airports'
import { getAirportCollectionForPage } from './airport-collections'
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
  isCollectionPage,
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

const supportText = (value: boolean | null) => value === null ? '待核实' : value ? '支持' : '不支持'

const getAirportServiceDescription = (airport: typeof airportData[number]) => [
  airport.summary,
  `最低价格：${airport.priceText}`,
  `流量额度：${airport.traffic}`,
  `免费试用：${supportText(airport.trial)}`,
  `不限时套餐：${supportText(airport.noExpiry)}`,
  `专属客户端：${supportText(airport.dedicatedClient)}`,
  `通用订阅：${supportText(airport.universalSubscription)}`,
  ...(airport.subscriptionClients?.length ? [`一键订阅客户端：${airport.subscriptionClients.join('、')}`] : []),
  `观察状态：${airport.status}`,
  `风险提示：${airport.risk}`,
].join('\n')

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
      // Service does not support additionalProperty. Keep these source facts as
      // text without guessing a numeric Offer price, currency or billing period.
      description: getAirportServiceDescription(airport),
      url: canonicalUrl,
      image: getPageImage(page),
      subjectOf: [
        { '@id': `${canonicalUrl}#webpage` },
        ...(airport.informationSources || []).map((source) => ({
          '@type': 'CreativeWork',
          name: source.name,
          ...(source.link !== false ? { url: source.url } : {}),
          // A fact-check date is not the source document's publication date.
          description: `资料复核日期：${source.checkedAt}`,
        })),
      ],
    },
  ]
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

const getPrimaryPageSchemaType = (page: any) => {
  if (isCollectionPage(page)) return 'CollectionPage'
  if (isArticlePage(page)) return 'BlogPosting'
  if (page.path === '/about/') return 'AboutPage'

  return 'WebPage'
}

const getPageExtraSchemas = (page: any, primaryPageSchemaType: string) => {
  const schema = page.frontmatter.schema || page.frontmatter.schemas || page.frontmatter.jsonLd

  if (!schema) return []
  const schemas = Array.isArray(schema) ? schema : [schema]
  const generatedItemList = getGeneratedItemListSchema(page)

  return schemas
    .map(normalizeExtraSchema)
    .filter((item) => !(generatedItemList && isSchemaObject(item) && hasSchemaType(item['@type'], 'ItemList')))
    .filter((item) => !(isSchemaObject(item) && hasSchemaType(item['@type'], primaryPageSchemaType)))
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
  const ranking = getAirportCollectionForPage(page.path)

  if (!ranking) return undefined

  return {
    '@type': 'ItemList',
    '@id': `${getCanonicalUrl(page.path)}#ranking`,
    name: ranking.name,
    numberOfItems: ranking.items.length,
    itemListOrder: ranking.ordered
      ? 'https://schema.org/ItemListOrderAscending'
      : 'https://schema.org/ItemListUnordered',
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

  const filePath = page.filePathRelative || ''
  const parent = filePath.includes('机场评测')
    ? { name: '机场大全', item: `${hostname}/posts/jichang-heji/` }
    : filePath.includes('机场榜单')
      ? { name: '机场推荐', item: `${hostname}/posts/jichang-tuijian/` }
      : filePath.includes('机场推荐') && page.path !== '/posts/jichang-tuijian/'
        ? { name: '机场推荐', item: `${hostname}/posts/jichang-tuijian/` }
        : undefined

  if (parent && parent.item !== canonicalUrl) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      ...parent,
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
  const primaryPageSchemaType = getPrimaryPageSchemaType(page)
  const extraSchemas = getPageExtraSchemas(page, primaryPageSchemaType)
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
        '@type': primaryPageSchemaType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'zh-CN',
        isPartOf: { '@id': `${hostname}/#website` },
        publisher: { '@id': `${hostname}/#organization` },
        mainEntityOfPage: canonicalUrl,
        image,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(articlePage
          ? {
              headline: title,
              author: { '@id': `${hostname}/#author` },
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
    ],
  }
}
