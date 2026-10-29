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
    ['/posts/example/', '教程', '科学上网专区/example.md', ['首页', '使用教程', '教程']],
    ['/posts/flybit-review-2026/', 'Flybit 评测', '机场评测/flybit.md', ['首页', '机场大全', 'Flybit 评测']],
    ['/posts/naiyun-review-2026/', '奈云风险记录', '机场评测/奈云.md', ['首页', '风险监测', '奈云风险记录']],
    ['/posts/jichang-buying-guide/', '购买教程', '机场推荐/机场购买教程.md', ['首页', '使用教程', '购买教程']],
    ['/posts/jichang-heji/', '机场大全', '机场推荐/机场合集.md', ['首页', '机场大全']],
    ['/guides/', '使用教程', '使用教程/index.md', ['首页', '使用教程']],
  ]) {
    const breadcrumbs = graphFor(path, title, source).filter((item) => item['@type'] === 'BreadcrumbList')
    assert.equal(breadcrumbs.length, 1)
    assert.deepEqual(breadcrumbs[0].itemListElement.map((item) => item.name), expected)
    assert.deepEqual(breadcrumbs[0].itemListElement.map((item) => item.position), expected.map((_, index) => index + 1))
    assert.equal(breadcrumbs[0].itemListElement.at(-1).item, `${hostname}${path}`)
  }
})

test('every airport keeps its route and belongs to the directory or risk records by status', () => {
  const { airportData, hiddenAirportStatuses } = loadConfig('airports.ts')
  const { getSiteBreadcrumbs } = loadConfig('page-structure.ts')
  for (const airport of airportData) {
    const page = { path: airport.path, title: airport.name, filePathRelative: '机场评测/example.md' }
    const trail = getSiteBreadcrumbs(page)
    const parent = hiddenAirportStatuses.has(airport.status) ? '/risk-monitor/' : '/posts/jichang-heji/'
    assert.equal(trail[1].link, parent, airport.name)
    assert.equal(trail.at(-1).link, airport.path, airport.name)
    assert.equal(trail.at(-1).current, true)
    assert.equal(new Set(trail.map((item) => item.link)).size, trail.length)
  }
})

test('visible page data and JSON-LD use the same hierarchy without blog category detours', () => {
  const { extendPageWithSeo } = loadConfig('page-head.ts')
  for (const [path, source] of [
    ['/posts/flybit-review-2026/', '机场评测/flybit.md'],
    ['/posts/naiyun-review-2026/', '机场评测/奈云.md'],
    ['/rankings/trial/', '机场榜单/免费试用机场榜.md'],
    ['/posts/flclash-guide-2026/', '工具/FlClash使用教程.md'],
    ['/guides/', '使用教程/index.md'],
  ]) {
    const page = { path, title: '页面', filePathRelative: source, frontmatter: {}, data: {}, content: '', contentRendered: '' }
    extendPageWithSeo(page)
    const serialized = JSON.parse(JSON.stringify(page))
    const jsonLd = serialized.frontmatter.head.find(([tag, attrs]) => tag === 'script' && attrs.type === 'application/ld+json')
    const trail = JSON.parse(jsonLd[2])['@graph'].find((item) => item['@type'] === 'BreadcrumbList').itemListElement
    assert.deepEqual(trail.map((item) => ({ text: item.name, link: item.item })), serialized.data.siteBreadcrumbs.map((item) => ({ text: item.text, link: `${hostname}${item.link}` })), path)
    assert.ok(trail.every((item) => !item.item.includes('/blog/')), path)
    assert.ok(!serialized.data.airportBrandIndex, path)
  }

  const catalogue = { path: '/posts/jichang-heji/', title: '机场大全', frontmatter: {}, data: {}, content: '', contentRendered: '' }
  extendPageWithSeo(catalogue)
  const { visibleAirportData } = loadConfig('airports.ts')
  assert.equal(catalogue.data.airportBrandIndex.length, visibleAirportData.length)
  assert.ok(catalogue.data.airportBrandIndex.every((item) => Object.keys(item).sort().join(',') === 'name,path'))
  assert.ok(!catalogue.data.airportBrandIndex.some((item) => item.path === '/posts/naiyun-review-2026/'))
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
