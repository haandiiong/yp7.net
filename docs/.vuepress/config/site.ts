import { airportData, airportDataLastReviewed, airportMetrics } from './airports'

export const hostname = 'https://yp7.net'
export const siteName = 'yp7.net'
export const siteDescription = 'yp7.net 提供2026机场推荐、实测榜单、机场风险监测、单机场测评和科学上网教程，帮助用户先看风险，再按晚高峰、Clash、ChatGPT、流媒体、价格和客户端筛选机场。'
export const siteKeywords = '机场推荐,VPN推荐,Clash节点,Clash教程,Shadowrocket,科学上网,翻墙机场,ChatGPT机场,TikTok节点,流媒体解锁'
export const siteLastReviewed = airportDataLastReviewed
export const siteAuthorName = 'yp7'
export const siteAuthorDescription = 'yp7.net 编辑与测评维护者，长期整理机场推荐、机场评测、Clash 配置、科学上网教程和购买风险提示。'
export const siteAuthorUrl = `${hostname}/about/`
export const sitePublishingPrinciplesUrl = `${hostname}/about/#编辑原则`
export const siteContactUrl = 'https://t.me/yp7net'
export const monitoredAirportCount = airportMetrics.count
export const structuredRankingCount = 10
export const defaultImage = `${hostname}/shouye.png`
export const defaultRobots = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

const airportPageImages = Object.fromEntries(
  airportData.map((airport) => [airport.path, airport.image]),
)

export const pageImages: Record<string, string> = {
  '/': '/shouye.png',
  '/blog/': '/shouye.png',
  '/about/': '/shouye.png',
  '/posts/jichang-tuijian/': '/shouye.png',
  '/posts/jichang-heji/': '/shouye.png',
  ...airportPageImages,
  '/posts/clash-verge-guide-2026/': '/clashVerge4.png',
  '/posts/clash-for-android-guide-2026/': '/clashMeta1.png',
  '/posts/speedtest-vpn/': '/speedtest.png',
  '/rankings/all/': '/shouye.png',
  '/rankings/sales/': '/shouye.png',
  '/rankings/stable/': '/shouye.png',
  '/rankings/cheap/': '/shouye.png',
  '/rankings/clash/': '/clashVerge4.png',
  '/rankings/chatgpt/': '/shouye.png',
  '/rankings/streaming/': '/youtubecesu.png',
  '/risk-monitor/': '/shouye.png',
  '/methodology/': '/speedtest.png',
}
