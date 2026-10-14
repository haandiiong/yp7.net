// Receiving an older snapshot must not undo a later manual article edit.
// This only selects the editorial date; receipt and test dates stay untouched.
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/

export const getSiilasArticleDateModified = (markdown, receivedAt) => {
  const frontmatter = markdown.match(frontmatterPattern)?.[1] ?? ''
  const modifiedAt = frontmatter.match(/^dateModified:\s*['"]?(\d{4})[/-](\d{2})[/-](\d{2})(?:['"]|\s|$)/m)?.slice(1).join('-')
  return modifiedAt && modifiedAt > receivedAt ? modifiedAt : receivedAt
}

export const syncSiilasArticleDateModified = (markdown, receivedAt) => {
  const frontmatter = markdown.match(frontmatterPattern)?.[1]
  if (!frontmatter || !/^dateModified:/m.test(frontmatter)) throw new Error('文章开头 frontmatter 缺少 dateModified')
  const dateModified = getSiilasArticleDateModified(markdown, receivedAt).replace(/-/g, '/')
  const next = markdown.replace(frontmatterPattern, (header) => header.replace(/^dateModified:[^\r\n]*/m, () => `dateModified: ${dateModified}`))
  // Align an existing introductory date without rewriting later historical notes.
  const firstSection = next.search(/^## /m)
  const boundary = firstSection < 0 ? next.length : firstSection
  const [year, month, day] = dateModified.split('/').map(Number)
  const intro = next.slice(0, boundary).replace(/^更新时间：(\*\*)?(\d{4}年\d{1,2}月(?:\d{1,2}日)?)/gm,
    (_, bold = '', original) => `更新时间：${bold}${year}年${month}月${original.endsWith('日') ? `${day}日` : ''}`)
  return intro + next.slice(boundary)
}
