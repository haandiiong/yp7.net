import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import {
  generateAirportDataFiles,
  generateLlmsTxt,
  patchGeneratedHtml,
} from './config/generated'
import { extendSponsoredMarkdown } from './config/markdown'
import {
  extendPageWithSeo,
  getLlmsSection,
  shouldIncludeInLlms,
  truncateText,
} from './config/page-seo'
import { defaultRobots, siteDescription, siteName } from './config/site'
import { theme } from './config/theme'

export default defineUserConfig({
  lang: 'zh-CN',
  title: siteName,
  description: siteDescription,
  head: [
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
  extendsPage: extendPageWithSeo,
  extendsMarkdown: extendSponsoredMarkdown,
  shouldPrefetch: false,
  theme,
  bundler: viteBundler({
    viteOptions: {
      build: {
        modulePreload: false,
      },
    }
  })
})
