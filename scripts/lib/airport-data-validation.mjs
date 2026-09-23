const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const plainText = (value) => value.replace(/<[^>]*>/g, '')
  .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, key) => (
    key.startsWith('#x') ? String.fromCodePoint(parseInt(key.slice(2), 16))
      : key.startsWith('#') ? String.fromCodePoint(Number(key.slice(1)))
        : entities[key] || entity
  ))
  .replace(/\s+/g, ' ').trim()

const makeRows = (headers, rows, getText, getLinks) => rows.map((cells) => ({
  cells: Object.fromEntries(headers.map((header, i) => [header, getText(cells[i] || '')])),
  href: getLinks(cells[0] || '')[0],
  hrefs: cells.flatMap(getLinks),
}))

// These parsers inspect the static tables emitted by this project; no browser is required in CI.
export const htmlTables = (html) => [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map((table) => {
  const rows = [...table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => (
    [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((cell) => cell[1])
  ))
  return makeRows((rows[0] || []).map(plainText), rows.slice(1), plainText,
    (cell) => [...cell.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => plainText(match[1])))
})

export const markdownTables = (markdown) => [...markdown.matchAll(/(?:^\|[^\n]*\|\n)+/gm)].map((table) => {
  const lines = table[0].trim().split('\n').map((line) => line.slice(1, -1).split(/(?<!\\)\|/).map((cell) => cell.trim()))
  const text = (value) => plainText(value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\\\|/g, '|'))
  return makeRows(lines[0], lines.slice(2), text, (cell) => [...cell.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]))
})

export const htmlTableAfterHeading = (html, heading) => {
  const title = heading.replace(/^#+\s*/, '')
  const headings = [...html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
  const index = headings.findIndex((match) => plainText(match[1]).replace(/^#\s*/, '') === title)
  if (index === -1) throw new Error(`Missing HTML heading: ${heading}`)
  const match = headings[index]
  const table = htmlTables(html.slice(match.index + match[0].length, headings[index + 1]?.index))[0]
  if (!table) throw new Error(`Missing HTML table: ${heading}`)
  return table
}

export const markdownTableAfterHeading = (markdown, heading) => {
  const index = markdown.split('\n').indexOf(heading)
  if (index === -1) throw new Error(`Missing Markdown heading: ${heading}`)
  const remaining = markdown.split('\n').slice(index + 1).join('\n')
  const nextHeading = remaining.search(/^#{1,6} /m)
  const table = markdownTables(nextHeading === -1 ? remaining : remaining.slice(0, nextHeading))[0]
  if (!table) throw new Error(`Missing Markdown table: ${heading}`)
  return table
}

export const jsonLdGraph = (html) => [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .flatMap((match) => {
    const schema = JSON.parse(match[1])
    return schema['@graph'] || (Array.isArray(schema) ? schema : [schema])
  })

const booleanValue = (value) => /^(支持|✔)/.test(value) ? true
  : /^(不支持|无试用|❌)/.test(value) ? false
    : /^(待核实|试用待核实)$/.test(value) ? null : undefined
const yesNo = (value) => value === null ? '待核实' : value ? '支持' : '不支持'
const clients = (airport) => [airport.dedicatedClient && '专属客户端', airport.universalSubscription && '通用订阅']
  .filter(Boolean).join('、') || '无专属客户端'

export const validateAirportRows = (rows, airports, context, { sectionLinks = false, hostname = 'https://yp7.net', requiredColumns = [] } = {}) => {
  const errors = []
  if (!Array.isArray(rows)) return [`${context}: missing table`]
  for (const column of requiredColumns) {
    if (rows.some((row) => !(column in row.cells))) errors.push(`${context}: missing ${column} column`)
  }
  const names = rows.map((row) => row.cells['机场'])
  if (JSON.stringify(names) !== JSON.stringify(airports.map((airport) => airport.name))) {
    errors.push(`${context}: airport names/order differ`)
  }
  airports.forEach((airport, index) => {
    const row = rows[index]
    if (!row || row.cells['机场'] !== airport.name) return
    const evidence = airport.performance || airport.historicalEvidence
    const expected = {
      价格: airport.priceText, 最低价格: airport.priceText,
      价格与试用: `${airport.priceText}，${airport.trial === null ? '试用待核实' : airport.trial ? '支持试用' : '无试用'}`,
      月流量: airport.traffic, 流量额度: airport.traffic, 流量: airport.traffic,
      客户端: clients(airport), '订阅/客户端': clients(airport),
      当前状态: airport.status, 状态: airport.status, 风险提示: airport.risk,
      销量样本: String(airport.salesSample),
      历史证据: evidence?.evidenceLevel || '无',
      历史测试日期: evidence?.lastTestedAt || '无历史记录',
      历史延迟: evidence ? `${evidence.latencyMs}ms` : '无历史记录',
      历史速度区间: evidence?.downloadMbpsRange || '无历史记录',
    }
    const capabilities = {
      试用: airport.trial, 免费试用: airport.trial, 不限时: airport.noExpiry,
      不限时套餐: airport.noExpiry, 不限时状态: airport.noExpiry,
      专属客户端: airport.dedicatedClient, 通用订阅: airport.universalSubscription,
    }
    for (const [column, value] of Object.entries(row.cells)) {
      if (column in capabilities) {
        if (booleanValue(value) !== capabilities[column]) errors.push(`${context}: ${airport.name} ${column} differs`)
      } else if (column in expected) {
        const normalize = (text) => ['月流量', '流量额度', '流量'].includes(column) ? text.replace(/\/月$/, '') : plainText(text)
        if (normalize(value) !== normalize(expected[column])) errors.push(`${context}: ${airport.name} ${column} differs`)
      }
    }
    if (row.href !== airport.path && row.href !== `${hostname}${airport.path}` && !(sectionLinks && row.href?.startsWith('#'))) {
      errors.push(`${context}: ${airport.name} link differs`)
    }
  })
  return errors
}

export const validateItemList = (schema, airports, context, hostname = 'https://yp7.net', ordered = false) => {
  if (!schema) return [`${context}: missing ItemList`]
  const expected = airports.map((airport, index) => ({ name: airport.name, url: `${hostname}${airport.path}`, position: index + 1 }))
  const actual = (schema.itemListElement || []).map((entry) => ({ name: entry.item?.name, url: entry.item?.url, position: entry.position }))
  const errors = []
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${context}: ItemList names/URLs/order differ from visible table`)
  if (schema.numberOfItems !== airports.length) errors.push(`${context}: ItemList count differs`)
  const order = `https://schema.org/ItemList${ordered ? 'OrderAscending' : 'Unordered'}`
  if (schema.itemListOrder !== order) errors.push(`${context}: ItemList ordering policy differs`)
  return errors
}

export const validateServiceSchema = (schema, airport, context) => {
  if (!schema) return [`${context}: missing Service schema`]
  const properties = Object.fromEntries((schema.additionalProperty || []).map((item) => [item.name, item.value]))
  const expected = {
    最低价格: airport.priceText, 流量额度: airport.traffic,
    免费试用: yesNo(airport.trial), 不限时套餐: yesNo(airport.noExpiry),
    专属客户端: yesNo(airport.dedicatedClient), 通用订阅: yesNo(airport.universalSubscription),
    观察状态: airport.status, 风险提示: airport.risk,
    ...(airport.subscriptionClients?.length ? { 一键订阅客户端: airport.subscriptionClients.join('、') } : {}),
  }
  const errors = Object.entries(expected).filter(([key, value]) => properties[key] !== value)
    .map(([key]) => `${context}: Service ${key} differs from airport data`)
  if (!airport.subscriptionClients?.length && '一键订阅客户端' in properties) errors.push(`${context}: Service unexpected 一键订阅客户端`)
  const sources = (schema.additionalProperty || []).filter((item) => item.name === '资料来源')
    .map((item) => ({ name: item.value, url: item.url, checkedAt: item.description?.replace(/^复核日期：/, '') }))
  if (JSON.stringify(sources) !== JSON.stringify((airport.informationSources || []).map(({ name, url, checkedAt }) => ({ name, url, checkedAt })))) {
    errors.push(`${context}: Service information sources/URLs/review dates differ from airport data`)
  }
  return errors
}

export const validateReviewEvidence = (rows, airport, context) => {
  if (!Array.isArray(rows)) return [`${context}: missing review evidence table`]
  const byLabel = new Map(rows.map((row) => [row.cells['项目'], row]))
  const expected = { 套餐价格: `${airport.priceText}，${airport.traffic}` }
  if ('trial' in airport) expected['免费试用'] = yesNo(airport.trial)
  if (airport.universalSubscription === null || byLabel.has('通用订阅')) expected['通用订阅'] = yesNo(airport.universalSubscription)
  if (airport.subscriptionClients?.length) expected['一键订阅客户端'] = airport.subscriptionClients.join('、')
  if (airport.informationSources?.length) {
    expected['资料来源'] = airport.informationSources.map((source) => source.name).join('；')
    expected['资料复核日期'] = airport.informationSources.map((source) => `${source.name}：${source.checkedAt}`).join('；')
  }
  const errors = Object.entries(expected).filter(([label, value]) => byLabel.get(label)?.cells['当前记录'] !== value)
    .map(([label]) => `${context}: review ${label} differs from airport data`)
  for (const label of ['一键订阅客户端', '资料来源', '资料复核日期']) {
    if (!(label in expected) && byLabel.has(label)) errors.push(`${context}: review unexpected ${label}`)
  }
  if (airport.informationSources?.length && JSON.stringify(byLabel.get('资料来源')?.hrefs) !== JSON.stringify(airport.informationSources.filter((source) => source.link !== false).map((source) => source.url))) {
    errors.push(`${context}: review information source URLs differ from airport data`)
  }
  return errors
}
