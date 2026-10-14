import assert from 'node:assert/strict'
import test from 'node:test'
import { renderSiilasSummary } from './lib/siilas-article-summary.mjs'
import { syncSiilasCollectionArticle } from './lib/siilas-collection-summary.mjs'
import { renderSiilasExperienceMethods } from './lib/siilas-experience-methods.mjs'

const methods = {
  confirmedAt: '2026-10-14',
  streaming: {
    platform: 'YouTube', quality: '4K', seekCount: 3,
    measurement: '拖动后至恢复播放前的缓冲等待',
  },
  chatgpt: {
    measurement: '发送消息至开始出现回答的等待',
    responseTiers: [
      { maxSeconds: 5, label: '≤ 5 秒', status: '流畅', score: 100 },
      { maxSeconds: 10, label: '> 5～10 秒', status: '轻微延迟', score: 75 },
      { maxSeconds: 20, label: '> 10～20 秒', status: '响应较慢', score: 50 },
      { maxSeconds: 30, label: '> 20～30 秒', status: '响应严重延迟', score: 25 },
      { maxSeconds: null, label: '超过 30 秒仍未开始回答，或页面无法打开', status: '不可用', score: 0 },
    ],
  },
}

const makeSnapshot = (experienceMethods) => {
  const record = {
    id: 'original-20260923-hk', testedAt: '2026-09-23', time: '22:09',
    node: '香港原始节点', downloadMbps: 80, uploadMbps: 40, latencyMs: 20,
    chatgpt: '流畅', streaming: '轻微缓冲', client: '原始客户端', measurementTool: 'Speedtest',
    resultUrl: 'https://www.speedtest.net/result/1',
    publication: { status: 'pending', evidenceVersions: [] },
  }
  return {
    receivedAt: '2026-10-14', latestTestAt: record.testedAt,
    source: {
      origin: 'https://siilas.com', archiveUrl: 'https://siilas.com/test/',
      methodologyUrl: 'https://siilas.com/methodology/', publicationStatus: 'local-unpublished',
      publicationNotice: '本次接收有记录或证据版本仍待发布，来源页面与截图可能还是旧版。',
    },
    methodology: { minimumDaysPerRegion: 3, ...(experienceMethods ? { experienceMethods } : {}) },
    airports: [{
      name: 'Flybit', slug: 'flybit', yp7Path: '/posts/flybit/',
      sourceUrl: 'https://siilas.com/airport/flybit/',
      score: 6.9, rankingEligible: true, verifiedTestCount: 1, testDateCount: 1,
      scoreBreakdown: { stability: 70, speed: 60, chatgpt: 100, streaming: 75, value: 40 },
      latestTestAt: record.testedAt, tests: [record], latestRegionTests: [{ region: '香港', test: record }],
    }],
  }
}

const collectionPage = (pagePath) => {
  const name = pagePath === '/posts/jichang-tuijian/' ? '测试依据'
    : pagePath === '/rankings/chatgpt/' ? 'ChatGPT观察' : '视频观察'
  const collection = {
    pagePath, sourceFile: 'fixture.md', heading: '## 候选机场',
    items: [{ name: 'Flybit', path: '/posts/flybit/' }],
  }
  const markdown = [
    '---', 'title: 保留人工文章', 'dateModified: 2026/10/12', '---', '',
    '<!-- siilas-page-updated:start -->', '旧日期', '<!-- siilas-page-updated:end -->', '',
    collection.heading, '', `| 机场 | 套餐 | ${name} |`, '| --- | --- | --- |',
    '| [Flybit](/posts/flybit/) | 人工套餐保持 | 原观察 |', '',
    '<!-- siilas-collection-evidence:start -->', '旧证据', '<!-- siilas-collection-evidence:end -->', '',
    '<!-- siilas-score-comparison:start -->', '旧比较', '<!-- siilas-score-comparison:end -->', '',
    '人工结论保持。',
  ].join('\n')
  return { collection, markdown }
}

test('accepted structured methods explain first-answer timing and all five tiers with a 30-second limit', () => {
  const snapshot = makeSnapshot(methods)
  const before = JSON.stringify(snapshot)
  const rendered = renderSiilasSummary(snapshot.airports[0], snapshot)
  assert.match(rendered, /已确认的体验方法（2026-10-14）/)
  assert.match(rendered, /YouTube 4K 画质：拖动进度条 3 次/)
  assert.match(rendered, /分别观察拖动后至恢复播放前的缓冲等待/)
  assert.match(rendered, /发送消息至开始出现回答的等待/)
  for (const tier of methods.chatgpt.responseTiers) {
    assert.ok(rendered.includes(`${tier.label}＝${tier.status}（${tier.score} 分）`))
  }
  assert.ok(!rendered.includes('40 秒'))
  assert.match(rendered, /不为历史记录补写具体首答秒数、三次缓冲秒数或视频信息/)
  const row = rendered.split('\n').find((line) => line.startsWith('| 香港 |'))
  assert.match(row, /2026-09-23 22:09（待发布）/)
  assert.match(row, /\| 流畅 \| 轻微缓冲 \|/)
  assert.ok(!row.includes('秒'), 'a status must not become an invented single-record timing')
  assert.equal(JSON.stringify(snapshot), before, 'rendering must not backfill raw measurements')
})

test('each collection uses the received method appropriate to its evidence and keeps dates and pending notices', () => {
  const snapshot = makeSnapshot(methods)
  for (const pagePath of ['/posts/jichang-tuijian/', '/rankings/chatgpt/', '/rankings/streaming/']) {
    const { collection, markdown } = collectionPage(pagePath)
    const rendered = syncSiilasCollectionArticle(markdown, collection, snapshot)
    assert.match(rendered, /已确认的体验方法（2026-10-14）/)
    assert.match(rendered, /最新实际测试日为 2026-09-23/)
    assert.match(rendered, /仍待发布/)
    assert.match(rendered, /人工套餐保持/)
    assert.match(rendered, /人工结论保持/)
    assert.ok(!rendered.includes('40 秒'))
    assert.ok(!rendered.includes('不能扩展为 YouTube 4K'))
    if (pagePath !== '/rankings/chatgpt/') {
      assert.match(rendered, /YouTube 4K 画质：拖动进度条 3 次/)
      assert.match(rendered, /不证明 Netflix/)
    }
    if (pagePath !== '/rankings/streaming/') {
      assert.match(rendered, /发送消息至开始出现回答的等待/)
      assert.match(rendered, /超过 30 秒仍未开始回答，或页面无法打开＝不可用（0 分）/)
    }
    assert.equal(syncSiilasCollectionArticle(rendered, collection, snapshot), rendered)
  }
})

test('older receipts without confirmed methods retain generic experience language and no first-answer tiers', () => {
  const snapshot = makeSnapshot()
  const article = renderSiilasSummary(snapshot.airports[0], snapshot)
  assert.ok(!article.includes('YouTube 4K'))
  assert.ok(!article.includes('已确认的体验方法'))
  assert.ok(!article.includes('≤ 5 秒'))
  assert.match(article, /ChatGPT、流媒体是提交者的定性体验/)
  for (const pagePath of ['/posts/jichang-tuijian/', '/rankings/chatgpt/', '/rankings/streaming/']) {
    const { collection, markdown } = collectionPage(pagePath)
    const rendered = syncSiilasCollectionArticle(markdown, collection, snapshot)
    assert.ok(!rendered.includes('已确认的体验方法'))
    assert.ok(!rendered.includes('≤ 5 秒'))
    if (pagePath === '/rankings/streaming/') assert.match(rendered, /未逐项确认平台的记录不能扩展为 YouTube 4K/)
    if (pagePath === '/posts/jichang-tuijian/') assert.match(rendered, /未明确平台的记录只称视频\/流媒体/)
  }
})

test('method names and tier descriptions come from the received metadata rather than the record status', () => {
  const revised = structuredClone(methods)
  revised.streaming.platform = '已接收平台'
  revised.streaming.quality = '已接收画质'
  revised.streaming.seekCount = 4
  revised.chatgpt.responseTiers[0].label = '接收的首档说明'
  const snapshot = makeSnapshot(revised)
  const article = renderSiilasSummary(snapshot.airports[0], snapshot)
  assert.match(article, /已接收平台 已接收画质 画质：拖动进度条 4 次/)
  assert.match(article, /接收的首档说明＝流畅（100 分）/)
  assert.ok(!article.includes('YouTube 4K'))
  const { collection, markdown } = collectionPage('/rankings/streaming/')
  const rendered = syncSiilasCollectionArticle(markdown, collection, snapshot)
  assert.match(rendered, /按已确认的 已接收平台 已接收画质 方法说明解读/)
  assert.ok(!rendered.includes('YouTube 4K'))
})

test('incomplete or malformed method receipts fall back without upgrading generic observations', () => {
  for (const mutation of [
    (value) => { delete value.confirmedAt },
    (value) => { delete value.chatgpt },
    (value) => { value.streaming.seekCount = 0 },
    (value) => { value.chatgpt.responseTiers[1].maxSeconds = 5 },
    (value) => { value.chatgpt.responseTiers.at(-1).maxSeconds = 40 },
  ]) {
    const invalid = structuredClone(methods)
    mutation(invalid)
    const snapshot = makeSnapshot(invalid)
    assert.equal(renderSiilasExperienceMethods(snapshot), '')
    assert.ok(!renderSiilasSummary(snapshot.airports[0], snapshot).includes('YouTube 4K'))
  }
})
