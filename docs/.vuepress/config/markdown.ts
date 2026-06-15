import { isSponsoredLink, qualifySponsoredAnchors } from './generated'

export const extendSponsoredMarkdown = (md: any) => {
  const defaultLinkOpen = md.renderer.rules.link_open || ((tokens: any, idx: number, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options))
  const defaultHtmlBlock = md.renderer.rules.html_block || ((tokens: any, idx: number) => tokens[idx].content)
  const defaultHtmlInline = md.renderer.rules.html_inline || ((tokens: any, idx: number) => tokens[idx].content)

  md.renderer.rules.link_open = (tokens: any, idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx]
    const href = token.attrGet('href') || ''
    const rendered = defaultLinkOpen(tokens, idx, options, env, self)

    if (!isSponsoredLink(href)) return rendered

    token.attrSet('rel', 'sponsored nofollow noopener noreferrer')
    token.attrSet('target', '_blank')

    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.html_block = (tokens: any, idx: number, options: any, env: any, self: any) => qualifySponsoredAnchors(defaultHtmlBlock(tokens, idx, options, env, self))
  md.renderer.rules.html_inline = (tokens: any, idx: number, options: any, env: any, self: any) => qualifySponsoredAnchors(defaultHtmlInline(tokens, idx, options, env, self))
}
