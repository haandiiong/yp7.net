import { getSiilasArticleDateModified, syncSiilasArticleDateModified } from './siilas-article-date.mjs'
import { renderSiilasExperienceMethods } from './siilas-experience-methods.mjs'
import { loadConfig } from './load-config.mjs'

const { splitMarkdownTableRow, escapeMarkdownTableCell } = loadConfig('markdown-table.ts')
const cell = (value) => escapeMarkdownTableCell(value ?? '未记录')
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

const recommendationCell = (airport) => {
  if (!airport) return '套餐与客户端资料；暂无已接收 Siilas 测速'
  const days = new Set(airport.tests.map(recordedDate).filter(Boolean)).size
  const pendingCount = airport.tests.filter(pending).length
  return `[最近实际测试：${latestEvidenceDate(airport) ?? '暂无测速证据日期'}](${airport.sourceUrl})<br>${airport.tests.length}条原始记录；${days}个不同测试日${pendingCount ? `；${pendingCount}条待发布` : ''}`
}

const recordedDate = (test) => /^\d{4}-\d{2}-\d{2}$/.test(test?.testedAt ?? '') ? test.testedAt : undefined
// Match Siilas latestTestAt/latestRegionTests: a raw entry needs a Speedtest
// result or its main screenshot. Publication status is a separate distinction.
const hasTestEvidence = (test) => Boolean(test?.resultUrl || test?.evidenceImage)
const latestEvidenceDate = (airport) => airport.tests.filter(hasTestEvidence).map(recordedDate).filter(Boolean).sort().at(-1)
const measuredNumber = (value) => Number.isFinite(value) && value >= 0

const regionalCoverage = (airport) => {
  const regions = airport.latestRegionTests ?? []
  if (!regions.length) return '地区摘要未记录'
  const tested = regions.filter(({ test }) => test)
  const missing = regions.filter(({ test }) => !test).map(({ region }) => region)
  const dates = new Set(tested.map(({ test }) => recordedDate(test)).filter(Boolean))
  const undated = tested.filter(({ test }) => !recordedDate(test)).map(({ region }) => region)
  return [
    `${tested.length}/${regions.length}个所列地区有最近样本`,
    dates.size > 1 ? '最近日期混合，不能视为同一轮对照' : dates.size ? '有日期的最近样本同日，未确认同条件' : '',
    ...(missing.length ? [`${missing.join('、')}未测试`] : []),
    ...(undated.length ? [`${undated.join('、')}日期未记录`] : []),
  ].filter(Boolean).join('；')
}

const missingMeasurements = (tests) => {
  if (!tests.length) return '暂无原始记录，不统计指标缺口'
  const missing = (label, predicate) => {
    const count = tests.filter((test) => !predicate(test)).length
    return `${label}：${count ? `${count}/${tests.length}条未记录` : '每条均有记录'}`
  }
  const completeBuffers = (test) => Array.isArray(test.streamingTest?.seekBufferingSeconds)
    && test.streamingTest.seekBufferingSeconds.length === 3 && test.streamingTest.seekBufferingSeconds.every(measuredNumber)
  const incompleteBuffers = tests.filter((test) => !completeBuffers(test)).length
  const partialBuffers = tests.filter((test) => !completeBuffers(test)
    && Array.isArray(test.streamingTest?.seekBufferingSeconds) && test.streamingTest.seekBufferingSeconds.some(measuredNumber)).length
  return [
    missing('丢包', (test) => measuredNumber(test.packetLossPercent) && test.packetLossPercent <= 100),
    missing('抖动', (test) => measuredNumber(test.jitterMs)),
    missing('首答秒数', (test) => measuredNumber(test.chatgptTest?.firstResponseSeconds)),
    `三次缓冲秒数：${incompleteBuffers ? `${incompleteBuffers}/${tests.length}条未完整记录${partialBuffers ? `（含${partialBuffers}条部分计时）` : ''}` : '每条均完整记录'}`,
  ].join('<br>')
}

const renderRecommendationCoverage = (collection, snapshot) => [
  '### 本页候选的证据覆盖与缺口',
  '',
  '下表统计本页候选的全部原始记录及指标缺口，含尚无测速证据的记录；最近有测速证据日只取有 Speedtest 链接或主截图的记录。同日补录会增加条数，不增加不同测试日数；日期跨度不代表连续观测或连续稳定天数。',
  '',
  '<div class="recommendation-evidence">',
  '',
  '| 机场 | 原始记录与测试日 | 最近有测速证据日 | 地区覆盖与日期关系 | 指标记录缺口 |',
  '| --- | --- | --- | --- | --- |',
  ...collection.items.map((item) => {
    const airport = recordFor(item, snapshot)
    if (!airport) return `| ${cell(item.name)} | 未接收 | 未接收 | 暂无已接收地区记录 | 暂无已接收原始记录，不统计指标缺口 |`
    const tests = airport.tests
    const days = new Set(tests.map(recordedDate).filter(Boolean)).size
    const undated = tests.filter((test) => !recordedDate(test)).length
    const pendingCount = tests.filter(pending).length
    return `| ${[
      `[${item.name}](${airport.sourceUrl})`,
      `${tests.length}条原始记录；${days}个不同测试日${undated ? `；${undated}条日期未记录` : ''}${pendingCount ? `；${pendingCount}条待发布` : ''}`,
      latestEvidenceDate(airport) ?? '未记录', regionalCoverage(airport), missingMeasurements(tests),
    ].map(cell).join(' | ')} |`
  }),
  '',
  '</div>',
  '',
  '缺口按原始数值字段统计；null或没有填写表示未记录，不能当作实测0。只有“流畅”等状态不算具体首答或缓冲计时；三次缓冲须保留三项实际数值，部分计时不补齐。地区最近日期混合或缺测时保留原状；同日样本也不自动构成同条件对照。',
  '',
  '来源稳定性分与速度分按其样本和计算口径解读，不是长期可用率或连续稳定天数，也不是跨机场同条件的公平速度名次。',
].join('\n')

const renderRecommendationEvidence = (collection, snapshot) => {
  const experienceMethods = renderSiilasExperienceMethods(snapshot)
  return [
  receiptNotice(snapshot),
  '',
  scoreNotice(snapshot),
  '',
  ...(experienceMethods ? [experienceMethods, ''] : []),
  '下表的最新测试日与“当日覆盖”只统计有 Speedtest 链接或主截图的记录；无测速证据的新记录不推进该日期，待发布状态另行标注。其他地区仍保留各自最近日期。ChatGPT 和视频状态在后表分别列出，具体时分与证据见单机场页。',
  '',
  '| 机场 | 最新测试日 | 当日覆盖 | 各地区最近样本日期 | 参评状态与综合分 |',
  '| --- | --- | --- | --- | --- |',
  ...collection.items.map((item) => {
    const airport = recordFor(item, snapshot)
    if (!airport) return `| ${cell(item.name)} | 未接收 | — | 暂无可引用的 Siilas 测速 | 暂无综合评分 |`
    const latestDate = latestEvidenceDate(airport)
    const current = airport.tests.filter((test) => hasTestEvidence(test) && latestDate && recordedDate(test) === latestDate)
    const regions = airport.latestRegionTests.filter(({ test }) => hasTestEvidence(test) && latestDate && recordedDate(test) === latestDate).map(({ region }) => region)
    const dates = new Map()
    for (const { region, test } of airport.latestRegionTests) {
      const date = test ? `${recordedDate(test) ?? '日期未记录'}${pending(test) ? '（待发布）' : ''}` : '未测试'
      if (!dates.has(date)) dates.set(date, [])
      dates.get(date).push(region)
    }
    return `| ${[
      `[${item.name}](${airport.sourceUrl})`, latestDate ?? '未记录',
      `${regions.join('、') || '地区未记录'}，${current.length}条${current.some(pending) ? '（含待发布）' : ''}`,
      [...dates].map(([date, areas]) => `${date} ${areas.join('、')}`).join('；'), siilasRankingStatus(airport),
    ].map(cell).join(' | ')} |`
  }),
  '',
  '### 各地区的 ChatGPT 与视频观察',
  '',
  '| 机场 | ChatGPT 最近分区观察 | 视频最近分区观察 |',
  '| --- | --- | --- |',
  ...collection.items.map((item) => {
    const airport = recordFor(item, snapshot)
    return `| ${[
      airport ? `[${item.name}](${airport.sourceUrl})` : item.name,
      siilasExperienceSummary(airport, 'chatgpt'), siilasExperienceSummary(airport, 'streaming'),
    ].map(cell).join(' | ')} |`
  }),
  '',
  renderRecommendationCoverage(collection, snapshot),
  '',
  experienceMethods
    ? `ChatGPT、视频列是测试者当次提交的体验；Speedtest 核对吞吐与延迟，不能由测速数值推导平台可用性。已确认的 ${snapshot.methodology.experienceMethods.streaming.platform} ${snapshot.methodology.experienceMethods.streaming.quality} 缓冲观察不证明 Netflix、Disney+、TikTok、其他 AI 平台可用或长期稳定性。更细的记录见[ChatGPT证据页](/rankings/chatgpt/)和[流媒体证据页](/rankings/streaming/)。`
    : 'ChatGPT、视频列是测试者当次提交的定性体验；Speedtest 核对吞吐与延迟，不能由测速数值推导平台可用性。未明确平台的记录只称视频/流媒体，不扩展为 YouTube 4K、Netflix、Disney+、TikTok、其他 AI 平台或长期稳定性。更细的记录见[ChatGPT证据页](/rankings/chatgpt/)和[流媒体证据页](/rankings/streaming/)。',
  ].join('\n')
}

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

const renderScenarioEvidence = (collection, snapshot, field) => {
  const experienceMethods = renderSiilasExperienceMethods(snapshot, field)
  return [
  receiptNotice(snapshot),
  '',
  scoreNotice(snapshot),
  '',
  ...(experienceMethods ? [experienceMethods, ''] : []),
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
    : experienceMethods
      ? `上表使用原始记录的“流媒体”状态，按已确认的 ${snapshot.methodology.experienceMethods.streaming.platform} ${snapshot.methodology.experienceMethods.streaming.quality} 方法说明解读；这不证明 Netflix 片库、Disney+ 地区内容或 TikTok 功能验证。网络、设备、客户端与工具按每条原始记录区分，不把历史环境套用到新记录。`
      : '上表仅使用原始记录的“流媒体”状态；未逐项确认平台的记录不能扩展为 YouTube 4K、Netflix 片库、Disney+ 地区内容或 TikTok 功能验证。网络、设备、客户端与工具按每条原始记录区分，不把历史环境套用到新记录。',
  ].join('\n')
}

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
  const headers = splitMarkdownTableRow(lines[tableIndex])
  const target = headers.indexOf(field === 'main' ? '测试依据' : field === 'chatgpt' ? 'ChatGPT观察' : '视频观察')
  const nameIndex = headers.indexOf('机场')
  if (target < 0 || nameIndex < 0) throw new Error(`缺少合集测试列：${collection.pagePath}`)
  const seen = new Set()
  for (let index = tableIndex + 2; index < lines.length && lines[index].startsWith('|'); index += 1) {
    const parts = splitMarkdownTableRow(lines[index])
    if (parts.length !== headers.length) throw new Error(`合集候选表列数不一致：${collection.pagePath} 第${index + 1}行`)
    const name = parts[nameIndex].trim().match(/^\[([^\]]+)\]\(/)?.[1]
    const item = collection.items.find((candidate) => candidate.name === name)
    if (!item || seen.has(item.path)) throw new Error(`合集候选表含未知或重复机场：${name}`)
    seen.add(item.path)
    const airport = recordFor(item, snapshot)
    const summary = field === 'main' ? recommendationCell(airport)
      : `${siilasExperienceSummary(airport, field)}<br>${siilasRankingStatus(airport)}`
    parts[target] = cell(summary)
    lines[index] = `| ${parts.join(' | ')} |`
  }
  if (seen.size !== collection.items.length) throw new Error(`合集候选表与编辑名单不一致：${collection.pagePath}`)
  return lines.join('\n')
}

export const syncSiilasCollectionArticle = (markdown, collection, snapshot) => {
  const field = collection.pagePath === '/posts/jichang-tuijian/' ? 'main'
    : collection.pagePath === '/rankings/chatgpt/' ? 'chatgpt'
      : collection.pagePath === '/rankings/streaming/' ? 'streaming' : undefined
  if (!field) throw new Error(`不支持的 Siilas 合集：${collection.pagePath}`)
  const dateModified = getSiilasArticleDateModified(markdown, snapshot.receivedAt)
  let next = syncEvidenceColumn(markdown, collection, snapshot, field)
  next = replaceBlock(next, 'siilas-page-updated', field === 'main'
    ? `**页面更新：${dateLabel(dateModified)}。**`
    : `更新时间：${dateLabel(dateModified)}（同步 Siilas 接收快照；各地区实际测试日期见下表，本次没有新增 yp7.net 现场测试）`)
  next = replaceBlock(next, 'siilas-collection-evidence', field === 'main'
    ? renderRecommendationEvidence(collection, snapshot) : renderScenarioEvidence(collection, snapshot, field))
  if (field === 'main') next = replaceBlock(next, 'siilas-score-comparison', renderComparison(collection, snapshot))
  return syncSiilasArticleDateModified(next, snapshot.receivedAt)
}
