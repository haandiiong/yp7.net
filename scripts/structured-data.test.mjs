import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { jsonLdGraph } from './lib/airport-data-validation.mjs'

const { getPageSchema } = loadConfig('schema.ts')
const { generateAirportDataFiles } = loadConfig('generated.ts')
const { hostname } = loadConfig('site.ts')
const graphFor = (path, title, filePathRelative) => getPageSchema({
  path, title, filePathRelative, frontmatter: {}, data: {}, content: '',
})['@graph']

test('homepage omits a singleton breadcrumb while article and review trails retain their hierarchy', () => {
  const home = graphFor('/', '首页', 'index.md')
  assert.ok(!home.some((item) => item['@type'] === 'BreadcrumbList'))
  assert.ok(home.some((item) => item['@type'] === 'WebSite'))
  assert.ok(home.some((item) => item['@id'] === `${hostname}/#webpage`))

  for (const [path, title, source, expected] of [
    ['/posts/example/', '教程', '科学上网专区/example.md', ['首页', '教程']],
    ['/posts/flybit-review-2026/', 'Flybit 评测', '机场评测/flybit.md', ['首页', '机场大全', 'Flybit 评测']],
  ]) {
    const breadcrumbs = graphFor(path, title, source).filter((item) => item['@type'] === 'BreadcrumbList')
    assert.equal(breadcrumbs.length, 1)
    assert.deepEqual(breadcrumbs[0].itemListElement.map((item) => item.name), expected)
    assert.deepEqual(breadcrumbs[0].itemListElement.map((item) => item.position), expected.map((_, index) => index + 1))
    assert.equal(breadcrumbs[0].itemListElement.at(-1).item, `${hostname}${path}`)
  }
})

test('generated datasets keep their identity and creator without declaring an unverified license', (t) => {
  const output = mkdtempSync(join(tmpdir(), 'yp7-dataset-schema-'))
  t.after(() => rmSync(output, { recursive: true, force: true }))
  generateAirportDataFiles({ dir: { dest: (file = '') => join(output, file) } })

  for (const slug of ['airports', 'rankings', 'risk-monitor']) {
    const html = readFileSync(join(output, 'data', `${slug}.html`), 'utf8')
    const datasets = jsonLdGraph(html).filter((item) => item['@type'] === 'Dataset')
    assert.equal(datasets.length, 1, slug)
    const dataset = datasets[0]
    assert.equal(dataset.url, `${hostname}/data/${slug}`)
    assert.equal(dataset.creator['@id'], `${hostname}/#organization`)
    assert.ok(dataset.name && dataset.description && dataset.dateModified, slug)
    assert.ok(!Object.hasOwn(dataset, 'license'), slug)
  }
})
