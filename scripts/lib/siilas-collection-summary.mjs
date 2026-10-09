const cell = (value) => String(value ?? '未记录').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const pending = (test) => test?.publication?.status === 'pending'
  || test?.publication?.evidenceVersions?.some((image) => image.status === 'pending')
const dateLabel = (date) => date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, year, month, day) => `${year}年${Number(month)}月${Number(day)}日`)
const recordFor = (item, snapshot) => snapshot.airports.find((airport) => airport.yp7Path === item.path)
const scored = (airport) => airport?.score !== null && airport?.score !== undefined

export const siilasRankingStatus = (airport) => {
  if (!airport) return '暂无已接收 Siilas 测速'
  const eligibility = airport.rankingEligible ? '已参评' : '未参评'
  return `${eligibility}；${scored(airport) ? `综合分 ${airport.score}/10` : '暂无综合评分'}`
}

// Preserve the latest record in each region, including mixed dates and unknown
// observations. The receipt date never becomes a test date or platform claim.
export const siilasExperienceSummary = (airport, field) => {
  if (!airport) return '暂无已接收记录'
  const dates = new Map()
  const untested = []
  for (const { region, test } of airport.latestRegionTests) {
    if (!test) { untested.push(region); continue }
    if (!dates.has(test.testedAt)) dates.set(test.testedAt, new Map())
    const states = dates.get(test.testedAt)
    const state = `${test[field] ?? '未记录'}${pending(test) ? '（待发布）' : ''}`
    if (!states.has(state)) states.set(state, [])
    states.get(state).push(region)
  }
  return [
    ...[...dates].sort(([left], [right]) => right.localeCompare(left)).map(([date, states]) =>
      `${date}：${[...states].map(([state, regions]) => `${regions.join('、')}${state}`).join('，')}`),
    ...(untested.length ? [`${untested.join('、')}未测试`] : []),
  ].join('；') || '暂无已接收记录'
}

const receiptNotice = (snapshot) => `${snapshot.receivedAt} 接收 [Siilas 原始记录](${snapshot.source.archiveUrl})；最新实际测试日为 ${snapshot.latestTestAt ?? '未记录'}。接收与页面编辑没有新增 yp7.net 测试或重新核价。${snapshot.source.publicationNotice}完整记录、测试环境与证据版本见[接收快照](/data/siilas-tests.json)。`
const scoreNotice = (snapshot) => `参评状态、综合分与分项分直接采用 Siilas 计算结果；参评要求为四地区各至少 ${snapshot.methodology.minimumDaysPerRegion} 个不同测试日。样本日数不等于连续稳定运行天数，综合分不决定本页编辑顺序。[评分方法](${snapshot.source.methodologyUrl})。`

const recommendationCell = (airport) => airport
  ? `[分区最新样本](${airport.sourceUrl})；${siilasRankingStatus(airport)}<br>ChatGPT：${siilasExperienceSummary(airport, 'chatgpt')}<br>视频：${siilasExperienceSummary(airport, 'streaming')}`
  : '套餐与客户端资料；暂无已接收 Siilas 测速'

const renderRecommendationEvidence = (collection, snapshot) => [
  receiptNotice(snapshot),
  '',
  scoreNotice(snapshot),
  '',
  '下表的“当日覆盖”只统计最新测试日；其他地区仍保留各自最近日期。ChatGPT 和视频状态见上方对比表，具体时分与证据见单机场页。',
  '',
  '| 机场 | 最新测试日 | 当日覆盖 | 各地区最近样本日期 | 参评状态与综合分 |',
  '| --- | --- | --- | --- | --- |',
  ...collection.items.map((item) => {
    const airport = recordFor(item, snapshot)
    if (!airport) return `| ${cell(item.name)} | 未接收 | — | 暂无可引用的 Siilas 测速 | 暂无综合评分 |`
    const current = airport.tests.filter((test) => test.testedAt === airport.latestTestAt)
    const regions = airport.latestRegionTests.filter(({ test }) => test && test.testedAt === airport.latestTestAt).map(({ region }) => region)
    const dates = new Map()
    for (const { region, test } of airport.latestRegionTests) {
      const date = test ? `${test.testedAt}${pending(test) ? '（待发布）' : ''}` : '未测试'
      if (!dates.has(date)) dates.set(date, [])
      dates.get(date).push(region)
    }
    return `| ${[
      `[${item.name}](${airport.sourceUrl})`, airport.latestTestAt,
      `${regions.join('、') || '地区未记录'}，${current.length}条${current.some(pending) ? '（含待发布）' : ''}`,
      [...dates].map(([date, areas]) => `${date} ${areas.join('、')}`).join('；'), siilasRankingStatus(airport),
    ].map(cell).join(' | ')} |`
  }),
  '',
  'ChatGPT、视频列是测试者当次提交的定性体验；Speedtest 核对吞吐与延迟，不能由测速数值推导平台可用性。未明确平台的记录只称视频/流媒体，不扩展为 YouTube 4K、Netflix、Disney+、TikTok、其他 AI 平台或长期稳定性。更细的记录见[ChatGPT证据页](/rankings/chatgpt/)和[流媒体证据页](/rankings/streaming/)。',
].join('\n')

const renderComparison = (collection, snapshot) => {
  const items = collection.items.filter((item) => ['Flybit', '拼好连'].includes(item.name))
  return [
    `以下性能参考来自 ${snapshot.receivedAt} 接收快照；各家测试日期另列，接收日期不是复测日期。${snapshot.source.publicationNotice}`,
    '',
    '| 机场 | 最近测试 | 参评与综合分 | 稳定性分 | 速度分 | ChatGPT分 | 流媒体分 | 性价比分 |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |',
    ...items.map((item) => {
      const airport = recordFor(item, snapshot)
      return `| ${[
        airport ? `[${item.name}](${airport.sourceUrl})` : item.name,
        airport?.latestTestAt ?? '未接收', siilasRankingStatus(airport),
        ...['stability', 'speed', 'chatgpt', 'streaming', 'value'].map((field) => airport?.scoreBreakdown?.[field] ?? '未提供'),
      ].map(cell).join(' | ')} |`
    }),
    '',
    '综合分范围为 0–10，分项范围为 0–100；性价比分含来源所列计分套餐。不同单项可以得出不同取舍，不能把综合分理解成每项领先。[查看 Siilas 评分方法](https://siilas.com/methodology/)。',
  ].join('\n')
}

const evidenceLinks = (airport, test) => [
  `[来源${pending(test) ? '（待发布）' : ''}](${airport.sourceUrl})`,
  ...(test.resultUrl ? [`[Speedtest](${test.resultUrl})`] : []),
  ...(test.publication?.evidenceVersions ?? []).map((image) => `[${image.label}${image.status === 'pending' ? '（待发布）' : ''}](${image.url})`),
].join(' · ')

const renderScenarioEvidence = (collection, snapshot, field) => [
  receiptNotice(snapshot),
  '',
  scoreNotice(snapshot),
  '',
  '以下逐项列出各地区最近一条记录，时间为北京时间；未测试或未记录的字段如实留空。不同地区的日期可能不同，历史样本另列。',
  '',
  `| 机场与节点地区 | 样本时间 | ${field === 'chatgpt' ? 'ChatGPT状态' : '视频/流媒体状态'} | 下载 Mbps | 原始记录与证据 |`,
  '| --- | --- | --- | ---: | --- |',
  ...collection.items.flatMap((item) => {
    const airport = recordFor(item, snapshot)
    if (!airport) return [`| ${cell(item.name)} | 未接收 | 未记录 | — | 暂无已接收 Siilas 原始记录 |`]
    return airport.latestRegionTests.map(({ region, test }) => test
      ? `| ${[
        `${item.name}·${region}`, `${test.testedAt} ${test.time ?? '时间未记录'}${pending(test) ? '（待发布）' : ''}`,
        test[field] ?? '未记录', test.downloadMbps ?? '未记录', evidenceLinks(airport, test),
      ].map(cell).join(' | ')} |`
      : `| ${cell(`${item.name}·${region}`)} | 未测试 | 未记录 | — | [来源](${airport.sourceUrl}) |`)
  }),
  '',
  field === 'chatgpt'
    ? 'ChatGPT 状态是测试者当次提交的定性体验，不由下载速度推导，也不证明 Claude、Gemini、OpenAI API、所有登录环节或长期稳定性。网络、设备、客户端与工具按每条原始记录区分，不把历史环境套用到新记录。'
    : '上表仅使用原始记录的“流媒体”状态；未逐项确认平台的记录不能扩展为 YouTube 4K、Netflix 片库、Disney+ 地区内容或 TikTok 功能验证。网络、设备、客户端与工具按每条原始记录区分，不把历史环境套用到新记录。',
].join('\n')

const block = (key, content) => `<!-- ${key}:start -->\n\n${content}\n\n<!-- ${key}:end -->`
const replaceBlock = (markdown, key, content) => {
  const pattern = new RegExp(`<!-- ${key}:start -->[\\s\\S]*?<!-- ${key}:end -->`)
  if (!pattern.test(markdown)) throw new Error(`缺少 Siilas 合集摘要标记：${key}`)
  return markdown.replace(pattern, () => block(key, content))
}

// Update only the evidence column. Price, client, risk, links and row ordering
// remain owned by the existing editorial/table synchronizer.
const syncEvidenceColumn = (markdown, collection, snapshot, field) => {
  const lines = markdown.split('\n')
  const headingIndex = lines.findIndex((line) => line === collection.heading)
  if (headingIndex < 0) throw new Error(`缺少合集标题：${collection.heading}`)
  const tableIndex = lines.findIndex((line, index) => index > headingIndex && line.startsWith('|'))
  if (tableIndex < 0) throw new Error(`缺少合集候选表：${collection.pagePath}`)
  const split = (line) => line.split(/(?<!\\)\|/)
  const headers = split(lines[tableIndex]).map((part) => part.trim())
  const target = headers.indexOf(field === 'main' ? '测试依据' : field === 'chatgpt' ? 'ChatGPT观察' : '视频观察')
  const nameIndex = headers.indexOf('机场')
  if (target < 0 || nameIndex < 0) throw new Error(`缺少合集测试列：${collection.pagePath}`)
  const seen = new Set()
  for (let index = tableIndex + 2; index < lines.length && lines[index].startsWith('|'); index += 1) {
    const parts = split(lines[index])
    const name = parts[nameIndex].trim().match(/^\[([^\]]+)\]\(/)?.[1]
    const item = collection.items.find((candidate) => candidate.name === name)
    if (!item || seen.has(item.path)) throw new Error(`合集候选表含未知或重复机场：${name}`)
    seen.add(item.path)
    const airport = recordFor(item, snapshot)
    const summary = field === 'main' ? recommendationCell(airport)
      : `${siilasExperienceSummary(airport, field)}<br>${siilasRankingStatus(airport)}`
    parts[target] = ` ${cell(summary)} `
    lines[index] = parts.join('|')
  }
  if (seen.size !== collection.items.length) throw new Error(`合集候选表与编辑名单不一致：${collection.pagePath}`)
  return lines.join('\n')
}

export const syncSiilasCollectionArticle = (markdown, collection, snapshot) => {
  const field = collection.pagePath === '/posts/jichang-tuijian/' ? 'main'
    : collection.pagePath === '/rankings/chatgpt/' ? 'chatgpt'
      : collection.pagePath === '/rankings/streaming/' ? 'streaming' : undefined
  if (!field) throw new Error(`不支持的 Siilas 合集：${collection.pagePath}`)
  let next = syncEvidenceColumn(markdown, collection, snapshot, field)
  next = replaceBlock(next, 'siilas-page-updated', field === 'main'
    ? `**页面更新：${dateLabel(snapshot.receivedAt)}。**`
    : `更新时间：${dateLabel(snapshot.receivedAt)}（同步 Siilas 接收快照；各地区实际测试日期见下表，本次没有新增 yp7.net 现场测试）`)
  next = replaceBlock(next, 'siilas-collection-evidence', field === 'main'
    ? renderRecommendationEvidence(collection, snapshot) : renderScenarioEvidence(collection, snapshot, field))
  if (field === 'main') next = replaceBlock(next, 'siilas-score-comparison', renderComparison(collection, snapshot))
  return next === markdown ? next : next.replace(/^dateModified:\s*.+$/m, `dateModified: ${snapshot.receivedAt.replace(/-/g, '/')}`)
}
