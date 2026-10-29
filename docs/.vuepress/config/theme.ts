import { plumeTheme } from 'vuepress-theme-plume'
import { normalizeDate } from './page-seo'
import { hostname } from './site'

export const theme = plumeTheme({
  hostname,
  // Our maintained dates are calendar days; do not imply an exact edit time.
  lastUpdated: { formatOptions: { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC', forceLocale: true } },
  footer: {
    message: '<a href="/methodology/">推荐方法与数据来源</a> · <a href="/about/">关于本站与商业披露</a> · <a href="/friends/">友情链接</a>',
    copyright: 'yp7.net © 2026 CFF 版权所有',
  },
  navbar: [
    { text: '首页', link: '/', icon: 'material-symbols:home-rounded' },
    { text: '机场推荐', link: '/posts/jichang-tuijian/', icon: 'material-symbols:flight-takeoff' },
    { text: '机场大全', link: '/posts/jichang-heji/', icon: 'material-symbols:format-list-bulleted' },
    {
      text: '按需筛选',
      icon: 'material-symbols:leaderboard',
      items: [
        {
          text: '套餐与费用',
          items: [
            { text: '低价机场', link: '/rankings/cheap/' },
            { text: '不限时套餐', link: '/rankings/no-expiry/' },
            { text: '免费试用', link: '/rankings/trial/' },
          ],
        },
        {
          text: '客户端方式',
          items: [
            { text: 'Clash订阅', link: '/rankings/clash/' },
            { text: '专属客户端', link: '/rankings/dedicated-client/' },
          ],
        },
        {
          text: '应用场景',
          items: [
            { text: 'ChatGPT记录', link: '/rankings/chatgpt/' },
            { text: '流媒体记录', link: '/rankings/streaming/' },
          ],
        },
        { text: '购买辅助', items: [{ text: '优惠码与试用券', link: '/rankings/coupons/' }] },
      ],
    },
    {
      text: '使用教程',
      icon: 'ic:baseline-construction',
      items: [
        { text: '全部使用教程', link: '/guides/', icon: 'material-symbols:menu-book-outline' },
        {
          text: '新手开始',
          items: [
            { text: '机场与订阅入门', link: '/posts/airport-node-subscription-guide/' },
            { text: '购买与试用流程', link: '/posts/jichang-buying-guide/' },
          ],
        },
        {
          text: '客户端安装',
          items: [
            { text: '按设备选择工具', link: '/posts/airport-tools/' },
            { text: 'FlClash教程', link: '/posts/flclash-guide-2026/' },
            { text: 'Clash Mi iOS教程', link: '/posts/clash-mi-guide-2026/' },
            { text: 'Shadowrocket教程', link: '/posts/shadowrocket-guide-2026/' },
          ],
        },
        {
          text: '连接与排错',
          items: [
            { text: '订阅导入失败', link: '/posts/clash-subscription-troubleshooting/' },
            { text: 'ChatGPT打不开', link: '/posts/ai-tools-not-working/' },
            { text: '常用网站打不开', link: '/posts/google-youtube-github-gmail-not-working/' },
          ],
        },
      ],
    },
    { text: '风险监测', link: '/risk-monitor/', icon: 'material-symbols:warning-outline' },
  ],
  profile: {
    name: 'yp7.net',
    description: 'yp7.net 专注机场推荐、套餐与客户端资料、风险提示和科学上网教程；当前测试数据统一来自 Siilas。',
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
    imageSize: 'local',
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
      excludePaths: [
        '/404.html',
        '/blog/',
        '/blog/tags/',
        '/blog/categories/',
        '/blog/archives/',
        '/friends/',
      ],
      modifyTimeGetter: (page: any) => {
        const explicitDate = normalizeDate(page.frontmatter.dateModified || page.frontmatter.updateTime || page.frontmatter.lastUpdated || page.frontmatter.createTime || page.frontmatter.date)
        if (explicitDate) return explicitDate

        return page.data.git?.updatedTime ? new Date(page.data.git.updatedTime).toISOString() : ''
      },
    },
    seo: false,
  },
})
