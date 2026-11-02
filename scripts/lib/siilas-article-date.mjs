// Receiving an older snapshot must not undo a later manual article edit.
// Editorial date labels follow that date; receipt and test dates stay untouched.
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const monthlyTitlePattern = /（\d{4}年\d{1,2}月更新）/

export const getSiilasArticleDateModified = (markdown, receivedAt) => {
  const frontmatter = markdown.match(frontmatterPattern)?.[1] ?? ''
  const modifiedAt = frontmatter.match(/^dateModified:\s*['"]?(\d{4})[/-](\d{2})[/-](\d{2})(?:['"]|\s|$)/m)?.slice(1).join('-')
  return modifiedAt && modifiedAt > receivedAt ? modifiedAt : receivedAt
}

export const syncSiilasArticleDateModified = (markdown, receivedAt) => {
  const frontmatter = markdown.match(frontmatterPattern)?.[1]
  if (!frontmatter || !/^dateModified:/m.test(frontmatter)) throw new Error('文章开头 frontmatter 缺少 dateModified')
  const dateModified = getSiilasArticleDateModified(markdown, receivedAt).replace(/-/g, '/')
  const [year, month, day] = dateModified.split('/').map(Number)
  const isMergedRecommendation = /^permalink:[\t ]*['"]?\/posts\/jichang\/['"]?[\t ]*\r?$/m.test(frontmatter)
  const next = markdown.replace(frontmatterPattern, (header) => {
    const dated = header.replace(/^dateModified:[^\r\n]*/m, () => `dateModified: ${dateModified}`)
    // Keep the existing monthly title format and any YAML quotes; other titles
    // and every date in commercial facts or historical body text stay intact.
    return isMergedRecommendation
      ? dated.replace(/^title:[^\r\n]*/m, (title) => title.replace(monthlyTitlePattern, () => `（${year}年${month}月更新）`))
      : dated
  })
  // Align an existing introductory date without rewriting later historical notes.
  const firstSection = next.search(/^## /m)
  const boundary = firstSection < 0 ? next.length : firstSection
  const intro = next.slice(0, boundary).replace(/^更新时间：(\*\*)?(\d{4}年\d{1,2}月(?:\d{1,2}日)?)/gm,
    (_, bold = '', original) => `更新时间：${bold}${year}年${month}月${original.endsWith('日') ? `${day}日` : ''}`)
  return intro + next.slice(boundary)
}
