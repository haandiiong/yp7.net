import type { AirportData } from './airports'
import { getNoExpiryPackage } from './no-expiry-packages'

export const comparisonNoticeColumn = '近期提示'
export const getAirportComparisonNotice = (path: string) => path === '/posts/99ba-review-2026/'
  ? { text: '10月17日读取线路波动公告，现状未复核', sourcePath: path }
  : undefined

const trialText = (airport: AirportData) => airport.trial === null ? '试用待核实' : airport.trial ? '支持试用' : '无试用'

export const getRecommendationPackagePrimary = (airport: AirportData) => {
  if (airport.path === '/posts/wangji-kuaiche-review/') {
    const plan = getNoExpiryPackage(airport.path)
    return `低频备用：${plan.priceText}/次，${plan.trafficText}总量；${trialText(airport)}`
  }
  return `${airport.priceText}，${airport.traffic}；${trialText(airport)}`
}

export const getRecommendationPackageSecondary = (airport: AirportData) => airport.path === '/posts/wangji-kuaiche-review/'
  ? `日享备选：${airport.priceText}，${airport.traffic}`
  : undefined
