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
  return markdown.replace(frontmatterPattern, (header) => header.replace(/^dateModified:[^\r\n]*/m, () => `dateModified: ${dateModified}`))
}
