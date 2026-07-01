import { plumeTheme } from 'vuepress-theme-plume'
import { normalizeDate } from './page-seo'
import { hostname } from './site'

export const theme = plumeTheme({
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
        { text: 'Clash机场', link: '/rankings/clash/', icon: 'material-symbols:hive-outline' },
        { text: 'ChatGPT机场', link: '/rankings/chatgpt/', icon: 'material-symbols:smart-toy-outline' },
        { text: '流媒体机场', link: '/rankings/streaming/', icon: 'material-symbols:live-tv-outline' },
        { text: '机场优惠码', link: '/rankings/coupons/', icon: 'material-symbols:confirmation-number-outline' },
      ],
    },
    {
      text: '科学上网教程',
      icon: 'ic:baseline-construction',
      items: [
        { text: '科学上网入门', link: '/posts/vpn-guide-2026/', icon: 'material-symbols:school-outline' },
        { text: 'Clash Verge教程', link: '/posts/clash-verge-guide-2026/', icon: 'ic:baseline-personal-video' },
        { text: 'Clash for Android', link: '/posts/clash-for-android-guide-2026/', icon: 'ic:baseline-android' },
        { text: 'Shadowrocket教程', link: '/posts/shadowrocket-guide-2026/', icon: 'ic:baseline-rocket-launch' },
        { text: 'ChatGPT打不开', link: '/posts/ai-tools-not-working/', icon: 'material-symbols:smart-toy-outline' },
        { text: 'Telegram教程', link: '/posts/telegram-guide-2026/', icon: 'material-symbols:send-outline' },
        { text: '测评方法', link: '/methodology/', icon: 'material-symbols:science-outline' },
      ],
    },
    { text: '风险监测', link: '/risk-monitor/', icon: 'material-symbols:warning-outline' },
    { text: '关于本站', link: '/about/', icon: 'material-symbols:info-outline' },
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
        '/data/airports',
        '/data/airports.json',
        '/data/rankings',
        '/data/rankings.json',
        '/data/risk-monitor',
        '/data/risk-monitor.json',
      ],
    },
    seo: false,
  },
})
