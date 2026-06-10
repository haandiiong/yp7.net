import { readFileSync, writeFileSync } from 'node:fs'

const siteConfigPath = 'docs/.vuepress/config/site.ts'
const homePath = 'docs/index.md'
const timeZone = process.env.TZ || 'Asia/Shanghai'

const getTodayParts = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  return {
    year: parts.find((part) => part.type === 'year')?.value,
    month: parts.find((part) => part.type === 'month')?.value,
    day: parts.find((part) => part.type === 'day')?.value,
  }
}

const updateFile = (filePath, updater) => {
  const current = readFileSync(filePath, 'utf8')
  const next = updater(current)

  if (next !== current) writeFileSync(filePath, next)
}

const { year, month, day } = getTodayParts()
const isoDate = `${year}-${month}-${day}`
const displayDate = `${Number(year)}年${Number(month)}月${Number(day)}日`

updateFile(siteConfigPath, (content) => content.replace(
  /export const siteLastReviewed = '[^']+'/,
  `export const siteLastReviewed = '${isoDate}'`,
))

updateFile(homePath, (content) => content.replace(
  /title: "\d{4}年\d{1,2}月\d{1,2}日数据看板"/,
  `title: "${displayDate}数据看板"`,
))

console.log(`Updated reviewed date to ${isoDate} (${timeZone}).`)
