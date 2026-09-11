import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import { dedupeHead } from 'vuepress/shared'

const configDir = fileURLToPath(new URL('../docs/.vuepress/config/', import.meta.url))
const require = createRequire(import.meta.url)
const configModules = new Map()

// Load the existing TypeScript config without a build or additional test runtime.
const loadConfig = (filePath) => {
  if (configModules.has(filePath)) return configModules.get(filePath).exports

  const module = { exports: {} }
  configModules.set(filePath, module)
  const { outputText } = ts.transpileModule(readFileSync(filePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const run = vm.runInThisContext(`(function(require, exports, module) {\n${outputText}\n})`, { filename: filePath })
  run((specifier) => specifier.startsWith('.')
    ? loadConfig(resolve(dirname(filePath), `${specifier}.ts`))
    : require(specifier), module.exports, module)
  return module.exports
}

const { extendPageWithSeo } = loadConfig(join(configDir, 'page-head.ts'))
const { patchGeneratedHtml } = loadConfig(join(configDir, 'generated.ts'))
const { defaultRobots, siteName } = loadConfig(join(configDir, 'site.ts'))
const homepageTitle = 'yp7.net｜机场资料、风险监测与科学上网教程'

const makePage = (path, title = '') => {
  const page = { path, title, frontmatter: {}, data: {}, content: '', contentRendered: '' }
  extendPageWithSeo(page)
  return page
}

// VuePress 2.0.0-rc.24 resolvePageHead puts frontmatter before its default title.
// Use its real deduper to test the override contract used by SSR and the client.
const resolveHead = (page) => dedupeHead([
  ...page.frontmatter.head,
  ['title', {}, [page.title, siteName].filter(Boolean).join(' | ')],
])
const getTitles = (head) => head.filter(([tag]) => tag === 'title').map(([, , title]) => title)
const getRobots = (head) => head
  .filter(([tag, attrs]) => tag === 'meta' && attrs.name === 'robots')
  .map(([, attrs]) => attrs.content)

test('homepage title is in serialized page data and overrides the default site suffix', () => {
  const page = makePage('/', homepageTitle)
  const clientPage = JSON.parse(JSON.stringify(page))
  assert.deepEqual(getTitles(resolveHead(clientPage)), [homepageTitle])
  assert.deepEqual(getRobots(resolveHead(clientPage)), [defaultRobots])
})

test('404 title and noindex are in page data before HTML generation', () => {
  const page = makePage('/404.html')
  const clientPage = JSON.parse(JSON.stringify(page))
  assert.deepEqual(getTitles(resolveHead(clientPage)), ['页面未找到｜yp7.net'])
  assert.deepEqual(getRobots(resolveHead(clientPage)), ['noindex, follow'])
})

test('article titles retain the VuePress site suffix and normal indexing policy', () => {
  const page = makePage('/posts/example/', '文章标题')
  assert.deepEqual(getTitles(resolveHead(page)), ['文章标题 | yp7.net'])
  assert.deepEqual(getRobots(resolveHead(page)), [defaultRobots])
})

test('post-generation cleanup preserves the head that the client will take over', (t) => {
  const dest = mkdtempSync(join(tmpdir(), 'yp7-page-head-'))
  t.after(() => rmSync(dest, { recursive: true, force: true }))
  const fixtures = [
    ['index.html', makePage('/', homepageTitle)],
    ['404.html', makePage('/404.html')],
    ['article.html', makePage('/posts/example/', '文章标题')],
  ]
  const expectedHeads = new Map()

  for (const [file, page] of fixtures) {
    const head = `<head><title>${getTitles(resolveHead(page))[0]}</title><meta name="robots" content="${getRobots(resolveHead(page))[0]}"></head>`
    expectedHeads.set(file, head)
    writeFileSync(join(dest, file), `<!doctype html><html>${head}<body><div id="VPContent"></div></body></html>`)
  }

  patchGeneratedHtml({ dir: { dest: (file = '') => join(dest, file) } })

  for (const [file] of fixtures) {
    const html = readFileSync(join(dest, file), 'utf8')
    assert.equal(html.match(/<head>[\s\S]*?<\/head>/)?.[0], expectedHeads.get(file), file)
    assert.equal((html.match(/<title>/g) || []).length, 1, file)
    assert.equal((html.match(/<meta name="robots"/g) || []).length, 1, file)
  }
})
