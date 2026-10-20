// Match markdown-it's table rule: a pipe immediately after a backslash stays
// inside its cell. Preserve the source escapes for lossless synchronization.
export const splitMarkdownTableRow = (line: string): string[] => {
  const source = line.trim()
  const cells: string[] = []
  let current = ''
  let escaped = false

  for (const character of source) {
    if (character === '|' && !escaped) {
      cells.push(current)
      current = ''
    } else {
      current += character
    }
    escaped = character === '\\'
  }
  cells.push(current)
  if (source.startsWith('|')) cells.shift()
  if (source.endsWith('|') && cells.at(-1) === '') cells.pop()

  return cells.map((cell) => cell.trim())
}

// This accepts Markdown fragments as well as plain fields. Already escaped
// editorial text must remain unchanged after repeated synchronizations.
export const escapeMarkdownTableCell = (value: unknown): string => {
  const source = String(value ?? '').replace(/\r\n|\r|\n/g, ' ')
  let result = ''
  let escaped = false

  for (const character of source) {
    if (character === '|' && !escaped) result += '\\'
    result += character
    escaped = character === '\\'
  }

  return result
}
