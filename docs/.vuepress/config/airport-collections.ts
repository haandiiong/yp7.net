import { airportData, isVisibleAirport, mainRecommendationNames } from './airports'
import type { AirportData } from './airports'

interface AirportCollectionDefinition {
  name: string
  dataTitle: string
  pagePath?: string
  sourceFile?: string
  heading?: string
  sectionLinks?: boolean
  ordered?: boolean
  select: (airports: AirportData[]) => AirportData[]
}

// Editorial selections belong here, not in separate Markdown, JSON and Schema filters.
// A service that is hidden or no longer eligible drops out of every corresponding view.
const selectNames = (
  airports: AirportData[],
  names: readonly string[],
  eligible: (airport: AirportData) => boolean = () => true,
  appendRemaining = false,
) => {
  const byName = new Map(airports.map((airport) => [airport.name, airport]))
  if (new Set(names).size !== names.length) throw new Error('Duplicate airport in collection selection')
  const selected = names.map((name) => {
    const airport = byName.get(name)
    if (!airport) throw new Error(`Unknown airport in collection: ${name}`)
    return airport
  })
  const ordered = appendRemaining
    ? [...selected, ...airports.filter((airport) => !names.includes(airport.name))]
    : selected
  return ordered.filter((airport) => isVisibleAirport(airport) && eligible(airport))
}

const visibleWhere = (predicate: (airport: AirportData) => boolean) => (airports: AirportData[]) => (
  airports.filter((airport) => isVisibleAirport(airport) && predicate(airport))
)

const definitions = {
  mainRecommendation: {
    name: '2026机场综合推荐顺序', dataTitle: '综合推荐顺序', ordered: true,
    pagePath: '/posts/jichang-tuijian/', sourceFile: 'docs/机场推荐/机场推荐.md',
    heading: '## 2026机场推荐对比', sectionLinks: true,
    select: (airports) => selectNames(airports, mainRecommendationNames),
  },
  all: {
    name: '2026机场大全', dataTitle: '全部机场',
    pagePath: '/posts/jichang-heji/', sourceFile: 'docs/机场推荐/机场合集.md',
    heading: '## 机场价格总表', sectionLinks: true,
    select: (airports) => selectNames(airports, [
      '网际快车', 'Flybit', '全球云', 'xxyun', '阿达西', '拼好连', '唯兔云', '99吧',
      '光年梯', '迅达', 'ccyz', 'uuone', '冲上云霄', 'SSONE', 'U1S1', '隐云',
      'cocoduck', 'XSUS', '坦克加速', '瞬云', '极连云', '二猫云', '寰宇云', '光速云',
      'sogo', '速界', '边缘节点', '宇宙云', '快狸', '可信云', '星岛梦', '一翻云',
    ], () => true, true),
  },
  sales: {
    name: '机场销量样本', dataTitle: '销量机场', ordered: true,
    select: (airports) => visibleWhere((airport) => typeof airport.salesSample === 'number')(airports)
      .sort((a, b) => b.salesSample! - a.salesSample!),
  },
  stable: {
    name: '稳定场景资料', dataTitle: '稳定机场',
    select: visibleWhere((airport) => airport.scenarios.includes('stable')),
  },
  cheap: {
    name: '2026低价机场筛选', dataTitle: '低价机场',
    pagePath: '/rankings/cheap/', sourceFile: 'docs/机场榜单/低价机场榜.md',
    heading: '## 低价机场候选',
    select: (airports) => selectNames(airports, [
      '阿达西', '冲上云霄', '坦克加速', '拼好连', '99吧', 'xxyun', 'XSUS', 'uuone',
    ], (airport) => airport.price <= 10 || airport.scenarios.includes('cheap')),
  },
  clash: {
    name: '2026 Clash机场筛选', dataTitle: 'Clash 机场',
    pagePath: '/rankings/clash/', sourceFile: 'docs/机场榜单/Clash机场榜.md',
    heading: '## Clash机场候选',
    select: (airports) => selectNames(airports, [
      'Flybit', '网际快车', '99吧', 'xxyun', '迅达', '速界', '边缘节点', '坦克加速',
      '二猫云', 'U1S1', '一翻云',
    ], (airport) => airport.universalSubscription === true),
  },
  chatgpt: {
    name: '2026 ChatGPT机场筛选', dataTitle: 'ChatGPT 机场',
    pagePath: '/rankings/chatgpt/', sourceFile: 'docs/机场榜单/ChatGPT机场榜.md',
    heading: '## ChatGPT机场候选',
    select: visibleWhere((airport) => airport.scenarios.includes('chatgpt')),
  },
  streaming: {
    name: '2026流媒体机场筛选', dataTitle: '流媒体机场',
    pagePath: '/rankings/streaming/', sourceFile: 'docs/机场榜单/流媒体机场榜.md',
    heading: '## 流媒体机场候选',
    select: (airports) => selectNames(airports, [
      'xxyun', '唯兔云', '光年梯', '全球云', 'ccyz', '速界', '边缘节点', '二猫云',
      'U1S1', '瞬云', '星岛梦', 'cocoduck',
    ], (airport) => airport.scenarios.includes('streaming')),
  },
  trial: {
    name: '2026免费试用机场筛选', dataTitle: '免费试用机场',
    pagePath: '/rankings/trial/', sourceFile: 'docs/机场榜单/免费试用机场榜.md',
    heading: '## 免费试用机场候选',
    select: visibleWhere((airport) => airport.trial === true),
  },
  noExpiry: {
    name: '2026不限时机场筛选', dataTitle: '不限时套餐机场',
    pagePath: '/rankings/no-expiry/', sourceFile: 'docs/机场榜单/不限时机场榜.md',
    heading: '## 不限时与按量套餐候选',
    select: visibleWhere((airport) => airport.noExpiry),
  },
  dedicatedClient: {
    name: '2026专属客户端机场筛选', dataTitle: '专属客户端机场',
    pagePath: '/rankings/dedicated-client/', sourceFile: 'docs/机场榜单/专属客户端机场榜.md',
    heading: '## 专属客户端机场候选',
    select: visibleWhere((airport) => airport.dedicatedClient),
  },
} satisfies Record<string, AirportCollectionDefinition>

export type AirportCollectionKey = keyof typeof definitions
export type AirportCollection = Omit<AirportCollectionDefinition, 'select'> & { items: AirportData[] }

export const createAirportCollections = (airports: AirportData[]) => Object.fromEntries(
  Object.entries(definitions).map(([key, { select, ...definition }]) => [
    key, { ...definition, items: select(airports) },
  ]),
) as Record<AirportCollectionKey, AirportCollection>

export const airportCollections = createAirportCollections(airportData)

export const getAirportCollectionForPage = (path: string) => (
  Object.values(airportCollections).find((collection) => collection.pagePath === path)
)

export const airportRankingKeys = [
  'mainRecommendation', 'sales', 'stable', 'cheap', 'trial', 'noExpiry',
  'dedicatedClient', 'clash', 'chatgpt', 'streaming',
] as const satisfies readonly AirportCollectionKey[]
