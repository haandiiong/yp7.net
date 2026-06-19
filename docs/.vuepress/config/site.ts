import { airportData } from './airports'

export const hostname = 'https://yp7.net'
export const siteName = 'yp7.net'
export const siteDescription = 'yp7.net 提供2026机场推荐、VPN推荐、Clash节点使用教程、科学上网问题解决和机场测评数据，帮助用户按速度、稳定性、价格、客户端兼容性和购买风险选择合适工具。'
export const siteKeywords = '机场推荐,VPN推荐,Clash节点,Clash教程,Shadowrocket,科学上网,翻墙机场,ChatGPT机场,TikTok节点,流媒体解锁'
export const siteLastReviewed = '2026-06-18'
export const siteAuthorName = 'yp7'
export const siteAuthorDescription = 'yp7.net 编辑与测评维护者，长期整理机场推荐、机场评测、Clash 配置、科学上网教程和购买风险提示。'
export const siteAuthorUrl = `${hostname}/about/`
export const sitePublishingPrinciplesUrl = `${hostname}/about/#编辑原则`
export const siteContactUrl = 'https://t.me/yp7net'
export const monitoredAirportCount = 32
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
