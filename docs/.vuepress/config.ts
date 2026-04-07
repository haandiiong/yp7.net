import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'author', content: 'yp7' }],
    ['meta', { name: 'keywords', content: 'VPN推荐,科学上网,机场推荐,翻墙VPN' }],
  ],
  theme: plumeTheme({
   // logo: '/logo.png',
    home: '/',
    hostname: 'https://yp7.net',
    footer: { message: "yp7.net © 2026 CFF 版权所有" },
    navbar: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '友链', link: '/friends/' },
    ],
    profile: {
      name: 'yp7.net',
      description: 'Y.P.7 的个人博客，分享VPN推荐、科学上网技巧和翻墙资源，帮助你畅游互联网世界。',
      //avatar: '/logo.png',
    },
    social: [
      { icon: 'github', link: 'https://github.com/haandiiong' },
      {
        icon: { svg: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M41.4193 7.30899C41.4193 7.30899 45.3046 5.79399 44.9808 9.47328C44.8729 10.9883 43.9016 16.2908 43.1461 22.0262L40.5559 39.0159C40.5559 39.0159 40.3401 41.5048 38.3974 41.9377C36.4547 42.3705 33.5408 40.4227 33.0011 39.9898C32.5694 39.6652 24.9068 34.7955 22.2086 32.4148C21.4531 31.7655 20.5897 30.4669 22.3165 28.9519L33.6487 18.1305C34.9438 16.8319 36.2389 13.8019 30.8426 17.4812L15.7331 27.7616C15.7331 27.7616 14.0063 28.8437 10.7686 27.8698L3.75342 25.7055C3.75342 25.7055 1.16321 24.0823 5.58815 22.459C16.3807 17.3729 29.6555 12.1786 41.4193 7.30899Z"></path> </g></svg>' },
        link: 'https://t.me/cff66778'
      },
    ],
    plugins: {

    },
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
      optimizeDeps: {
        exclude: [
          'mark.js/src/vanilla.js',
          '@vueuse/integrations/useFocusTrap',
          '@vueuse/core',
          'bcrypt-ts/browser',
          '@vuepress/helper/client',
          '@iconify/vue',
          '@iconify/vue/offline'
        ]
      }
    }
  }),
})