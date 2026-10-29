import { airportData, hiddenAirportStatuses } from './airports'

export interface SiteBreadcrumb {
  text: string
  link: string
  current?: boolean
}

const tutorialDirectories = new Set([
  '使用教程', '工具', '科学上网专区', 'chatgpt专区', 'tiktok专区',
  'telegram专区', 'usdt虚拟币专区',
])

const getParent = (page: any): Omit<SiteBreadcrumb, 'current'> | undefined => {
  const airport = airportData.find((item) => item.path === page.path)
  if (airport) {
    return hiddenAirportStatuses.has(airport.status)
      ? { text: '风险监测', link: '/risk-monitor/' }
      : { text: '机场大全', link: '/posts/jichang-heji/' }
  }

  const directory = (page.filePathRelative || '').replace(/\\/g, '/').split('/')[0]
  if (tutorialDirectories.has(directory) || page.path === '/posts/jichang-buying-guide/') {
    return { text: '使用教程', link: '/guides/' }
  }
  if (page.path.startsWith('/rankings/')) {
    return { text: '机场推荐', link: '/posts/jichang-tuijian/' }
  }
  if (directory === '机场评测') return { text: '机场大全', link: '/posts/jichang-heji/' }

  return undefined
}

// The visible trail and JSON-LD share this route-based hierarchy. File moves and
// blog categories must not change an existing article's public address.
export const getSiteBreadcrumbs = (page: any): SiteBreadcrumb[] => {
  if (!page.path || page.path === '/' || page.path === '/404.html' || page.path.startsWith('/blog/')) return []

  const items: SiteBreadcrumb[] = [{ text: '首页', link: '/' }]
  const parent = getParent(page)
  if (parent && parent.link !== page.path) items.push(parent)
  items.push({ text: page.title || 'yp7.net', link: page.path, current: true })
  return items
}
