import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
// import  mediumZoomPlugin from '@vuepress/plugin-medium-zoom'

const hostname = 'https://yp7.net'
const siteName = 'yp7.net'
const siteDescription = 'yp7.net 提供2026机场推荐、VPN推荐、Clash节点使用教程与科学上网问题解决方案，帮助用户选择稳定高速的网络加速工具。'

const getCanonicalUrl = (path: string) => `${hostname}${path}`

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

const getPageSchema = (page: any) => {
  const canonicalUrl = getCanonicalUrl(page.path)
  const title = page.title || siteName
  const description = page.frontmatter.description || siteDescription
  const faqItems = getFaqItems(page.content)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${hostname}/#organization`,
        name: siteName,
        url: hostname,
        sameAs: [
          'https://github.com/haandiiong',
          'https://t.me/yp7net',
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
      },
      {
        '@type': page.path === '/' ? 'WebPage' : 'Article',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        headline: title,
        description,
        inLanguage: 'zh-CN',
        isPartOf: { '@id': `${hostname}/#website` },
        author: { '@id': `${hostname}/#organization` },
        publisher: { '@id': `${hostname}/#organization` },
        mainEntityOfPage: canonicalUrl,
        datePublished: page.frontmatter.createTime || undefined,
        dateModified: page.data.git?.updatedTime
          ? new Date(page.data.git.updatedTime).toISOString()
          : page.frontmatter.createTime || undefined,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首页',
            item: hostname,
          },
          ...(page.path === '/'
            ? []
            : [{
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: canonicalUrl,
              }]),
        ],
      },
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

export default defineUserConfig({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  head: [
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'author', content: 'yp7' }],
  ],
  extendsPage: (page) => {
    page.frontmatter.head = [
      ...(page.frontmatter.head || []),
      ['link', { rel: 'canonical', href: getCanonicalUrl(page.path) }],
      ['script', { type: 'application/ld+json' }, JSON.stringify(getPageSchema(page))],
    ]
  },
  shouldPrefetch: false,
  theme: plumeTheme({
    hostname,
    footer: { message: "yp7.net © 2026 CFF 版权所有" },
    navbar: [
      { text: '首页', link: '/', icon: 'material-symbols:home-rounded' },
      { text: '机场推荐', link: '/posts/jichang-tuijian/', icon: 'material-symbols:flight-takeoff' },
      {
        text: '翻墙工具',
        icon: 'ic:baseline-construction',
        items: [
          { text: 'Windows/Linux/MacOS', link: '/posts/clash-verge-guide-2026/', icon: 'ic:baseline-personal-video' },
          { text: 'Android手机', link: '/posts/clash-for-android-guide-2026/', icon: 'ic:baseline-android' },
          { text: 'iOS苹果手机', link: '/posts/shadowrocket-guide-2026/', icon: 'ic:baseline-rocket-launch' },
        ],
      },
      { text: '全部文章', link: '/blog/' },
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
      tags: false,
      categories: false,
      archives: false
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
