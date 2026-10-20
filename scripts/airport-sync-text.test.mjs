import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { markdownTables } from './lib/airport-data-validation.mjs'
import { parseMarkdownTable, renderTable } from './sync-airport-tables.mjs'
import { renderEvidenceSection, upsertEvidenceSection } from './sync-airport-review-sections.mjs'

const { splitMarkdownTableRow, escapeMarkdownTableCell } = loadConfig('markdown-table.ts')

test('table sync preserves escaped editorial pipes without shifting generated facts or adding escapes', () => {
  const airport = {
    name: '示例', path: '/example/', priceText: '15元|月', traffic: '128GB\n每月',
    trial: false, dedicatedClient: false, universalSubscription: true, risk: '条件A|条件B',
  }
  const source = [
    '| 机场 | 适用场景 | 套餐与试用 | 客户端与限制 | 测试依据 | 风险提示 |',
    '|---|---|---|---|---|---|',
    String.raw`| [示例](#示例) | 办公\|备用 | 旧套餐<br>人工\|备注 | 旧客户端<br>设备\\|限制 | 记录\|截图 | 旧风险 |`,
  ].join('\n')
  const config = { sectionLinks: true, filePath: 'fixture.md' }
  const synced = renderTable(parseMarkdownTable(source.split('\n'), 0), [airport], config)
  const table = parseMarkdownTable(synced.split('\n'), 0)
  assert.equal(splitMarkdownTableRow(synced.split('\n')[2]).length, 6)
  assert.deepEqual(table.rows[0], {
    机场: '[示例](#示例)',
    适用场景: String.raw`办公\|备用`,
    套餐与试用: String.raw`15元\|月，128GB 每月；无试用<br>人工\|备注`,
    客户端与限制: String.raw`通用订阅<br>设备\\|限制`,
    测试依据: String.raw`记录\|截图`,
    风险提示: String.raw`条件A\|条件B`,
  })
  assert.equal(renderTable(table, [airport], config), synced)
  assert.equal(markdownTables(`${synced}\n`)[0][0].cells['适用场景'], '办公|备用')
})

test('table parsing follows markdown-it escaped-pipe boundaries and rejects wrong column counts', () => {
  for (const value of [String.raw`办公\|备用`, String.raw`办公\\|备用`, String.raw`办公\\\|备用`]) {
    assert.deepEqual(splitMarkdownTableRow(`| ${value} | 后列 |`), [value, '后列'])
    assert.equal(escapeMarkdownTableCell(value), value)
  }
  assert.equal(escapeMarkdownTableCell('办公|备用'), String.raw`办公\|备用`)
  assert.equal(escapeMarkdownTableCell(escapeMarkdownTableCell('办公|备用')), String.raw`办公\|备用`)
  assert.throws(() => parseMarkdownTable(['| 机场 | 备注 |', '|---|---|', '| 示例 | 多出 | 一列 |'], 0), /3 cells; expected 2/)
  assert.throws(() => parseMarkdownTable(['| 机场 | 备注 |', '|---|', '| 示例 | 备注 |'], 0), /headers and divider/)
})

test('all generated Markdown tables escape ordinary fields including no-expiry and risk records', (t) => {
  const { airportData } = loadConfig('airports.ts')
  const { noExpiryPackages } = loadConfig('no-expiry-packages.ts')
  const { generateAirportDataFiles } = loadConfig('generated.ts')
  const airport = airportData.find((item) => item.name === 'Flybit')
  const record = noExpiryPackages[airport.path]
  const original = { priceText: airport.priceText, risk: airport.risk, validity: record.validity }
  const dest = mkdtempSync(join(tmpdir(), 'yp7-markdown-pipes-'))
  t.after(() => {
    airport.priceText = original.priceText
    airport.risk = original.risk
    record.validity = original.validity
    rmSync(dest, { recursive: true, force: true })
  })
  airport.priceText = '15元|月'
  airport.risk = '风险A|风险B\n补充限制'
  record.validity = '用完为止|重置待核实\n设备限制见详情'
  generateAirportDataFiles({ dir: { dest: (file = '') => join(dest, file) } })
  for (const file of ['airports.md', 'rankings.md', 'risk-monitor.md']) {
    const markdown = readFileSync(join(dest, 'data', file), 'utf8')
    for (const block of markdown.matchAll(/(?:^\|[^\n]*\|\n)+/gm)) {
      const rows = block[0].trim().split('\n').map(splitMarkdownTableRow)
      assert.ok(rows.every((row) => row.length === rows[0].length), `${file}: shifted columns`)
    }
    const rows = markdownTables(markdown).flat().filter((row) => row.cells['机场'] === 'Flybit')
    assert.ok(rows.length, `${file}: Flybit row missing`)
    if (file === 'risk-monitor.md') {
      assert.equal(rows[0].rawCells['风险提示'], String.raw`风险A\|风险B 补充限制`)
    } else {
      assert.ok(rows.some((row) => row.rawCells['最低价格'] === String.raw`15元\|月`))
    }
    if (file === 'rankings.md') {
      assert.equal(rows.find((row) => row.rawCells['有效期与重置']).rawCells['有效期与重置'], String.raw`用完为止\|重置待核实 设备限制见详情`)
    }
  }
  const noExpiryTable = renderTable({}, [airport], { noExpiryComparison: true })
  assert.equal(parseMarkdownTable(noExpiryTable.split('\n'), 0).rows[0]['有效期与重置'], String.raw`用完为止\|重置待核实 设备限制见详情`)
})

test('evidence updates retain literal dollar replacement tokens and remove the old managed section', () => {
  const { airportData } = loadConfig('airports.ts')
  const airport = structuredClone(airportData.find((item) => item.name === 'Flybit'))
  const risk = "优惠码 $&；备注 $`；尾注 $'；金额 $$"
  airport.risk = risk
  const section = renderEvidenceSection(airport, '2026-10-17', 'Flybit', new Set())
  const original = '# 页面\n\n保留前言\n\n## Flybit套餐与使用资料汇总\n\n旧受管内容\n\n## FAQ\n\n保留问答\n'
  const synced = upsertEvidenceSection(original, section)
  assert.ok(synced.includes(`| 风险记录 | ${risk} |`))
  assert.ok(!synced.includes('旧受管内容'))
  assert.equal((synced.match(/^## Flybit(?:套餐资料与历史记录|套餐与使用资料汇总)$/gm) || []).length, 1)
  assert.ok(synced.startsWith('# 页面\n\n保留前言\n'))
  assert.ok(synced.endsWith('## FAQ\n\n保留问答\n'))
  assert.equal(upsertEvidenceSection(synced, section), synced)
})
