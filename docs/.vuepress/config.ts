import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
import { airportData } from './config/airports'
import {
  generateAirportDataFiles,
  generateLlmsTxt,
  isSponsoredLink,
  patchGeneratedHtml,
  qualifySponsoredAnchors,
} from './config/generated'
import { defaultImage, defaultRobots, hostname, pageImages, siteDescription, siteKeywords, siteName } from './config/site'
// import  mediumZoomPlugin from '@vuepress/plugin-medium-zoom'

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

const getPageDescription = (page: any) => getExpandedDescription(
  page.frontmatter.description || siteDescription,
  getMetaDescriptionSuffix(page),
)

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
  const description = getPageDescription(page)
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
    ['meta', { name: 'description', content: getPageDescription(page) }],
    ...(keywords ? [['meta', { name: 'keywords', content: keywords }]] : []),
  ]
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
        generateLlmsTxt(app, {
          shouldIncludeInLlms,
          getLlmsSection,
          truncateText,
        })
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
          { text: '免费试用', link: '/rankings/trial/', icon: 'material-symbols:redeem-outline' },
          { text: '不限时套餐', link: '/rankings/no-expiry/', icon: 'material-symbols:all-inclusive' },
          { text: '专属客户端', link: '/rankings/dedicated-client/', icon: 'material-symbols:app-shortcut-outline' },
          { text: '优惠码', link: '/rankings/coupons/', icon: 'material-symbols:confirmation-number-outline' },
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
      sitemap: {
        modifyTimeGetter: (page: any) => {
          const explicitDate = normalizeDate(page.frontmatter.dateModified || page.frontmatter.updateTime || page.frontmatter.lastUpdated || page.frontmatter.createTime || page.frontmatter.date)
          if (explicitDate) return explicitDate

          return page.data.git?.updatedTime ? new Date(page.data.git.updatedTime).toISOString() : ''
        },
        extraUrls: [
          '/data/airports.html',
          '/data/rankings.html',
          '/data/risk-monitor.html',
        ],
      },
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
