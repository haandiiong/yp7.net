// Keep images near the beginning of an article eager. Images after substantial
// text are below the fold on the current article layouts; authors can override
// this estimate with an explicit loading attribute for unusual layouts.
const eagerTextLimit = 1000

const addHtmlImageLoading = (html: string, loading: string) => html.replace(/<img\b[^>]*>/gi, (tag) => {
  const additions = [
    /\sloading\s*=/i.test(tag) ? '' : ` loading="${loading}"`,
    /\sdecoding\s*=/i.test(tag) ? '' : ' decoding="async"',
  ].join('')
  // HTML img is a void element. Normalize its ending before Plume's attribute
  // parser reads it: a slash directly after a quote is otherwise parsed as part
  // of the last attribute value by the installed Plume version.
  return tag.replace(/\s*\/?>$/, `${additions}>`)
})

export const extendContentImageLoading = (md: any) => {
  md.core.ruler.push('yp7-content-image-loading', (state: any) => {
    const textBeforeLine = [0]
    for (const line of state.src.split('\n')) {
      textBeforeLine.push(textBeforeLine.at(-1)! + line.replace(/<[^>]+>|\s/g, '').length)
    }

    for (const token of state.tokens) {
      const loading = (textBeforeLine[token.map?.[0] ?? 0] || 0) < eagerTextLimit ? 'eager' : 'lazy'
      if (token.type === 'html_block') token.content = addHtmlImageLoading(token.content, loading)
      for (const child of token.children || []) {
        if (child.type === 'image') {
          if (!child.attrGet('loading')) child.attrSet('loading', loading)
          if (!child.attrGet('decoding')) child.attrSet('decoding', 'async')
        } else if (child.type === 'html_inline') {
          child.content = addHtmlImageLoading(child.content, loading)
        }
      }
    }
  })
}
