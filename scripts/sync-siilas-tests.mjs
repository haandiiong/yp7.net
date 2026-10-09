import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import { renderSiilasSummary } from './lib/siilas-article-summary.mjs'
import { applySiilasPublication } from './lib/siilas-publication.mjs'
import { syncSiilasCollectionArticle } from './lib/siilas-collection-summary.mjs'
import { loadConfig } from './lib/load-config.mjs'

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = resolve(process.env.SIILAS_PROJECT_DIR || resolve(projectDir, '../siilas'))
const outputPath = resolve(projectDir, 'docs/.vuepress/config/data/siilas-tests.json')
const metadataPath = resolve(projectDir, 'docs/.vuepress/config/airports.ts')
const args = process.argv.slice(2).filter((argument) => argument !== '--')
const checkOnly = args.includes('--check')
for (const argument of args) if (!['--check', '--source-published'].includes(argument)) throw new Error(`不支持的参数：${argument}`)
if (checkOnly && args.includes('--source-published')) throw new Error('--check 只读校验，不能同时确认来源已发布。')
const sha256 = (content) => createHash('sha256').update(content).digest('hex')
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
const existing = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf8')) : undefined
const sourceRequire = createRequire(resolve(sourceDir, 'package.json'))
const loaded = new Map()
const versions = {}

// Import the source project's actual scoring and latest-region rules. This
// importer does not maintain a second scoring formula. Only ingestion needs the
// adjacent source checkout; production reads the accepted JSON below.
const loadSource = (filename) => {
  const sourcePath = resolve(sourceDir, filename)
  if (loaded.has(sourcePath)) return loaded.get(sourcePath).exports
  const content = readFileSync(sourcePath, 'utf8')
  versions[filename] = sha256(content)
  if (extname(filename) === '.json') {
    const exports = JSON.parse(content)
    loaded.set(sourcePath, { exports })
    return exports
  }
  if (extname(filename) === '.mjs') return sourceRequire(sourcePath)
  const module = { exports: {} }
  loaded.set(sourcePath, module)
  const { outputText } = ts.transpileModule(content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  })
  const run = vm.runInThisContext(`(function(require, exports, module) {\n${outputText}\n})`, { filename: sourcePath })
  run((specifier) => {
    if (!specifier.startsWith('.')) return sourceRequire(specifier)
    const relativePath = resolve(dirname(sourcePath), specifier).slice(sourceDir.length + 1)
    return loadSource(extname(relativePath) ? relativePath : `${relativePath}.ts`)
  }, module.exports, module)
  return module.exports
}

const { airports, MIN_RANKING_REGION_DAYS } = loadSource('src/data/airport-data.ts')
const { getLatestRegionTests, getLatestExperienceSummary } = loadSource('src/data/test-record-presentation.ts')
const rawAirports = airports.map((airport) => ({
  slug: airport.slug,
  name: airport.name,
  yp7Path: new URL(airport.sourcePage).pathname,
  sourceUrl: `https://siilas.com/airport/${airport.slug}/`,
  latestTestAt: airport.latestTestAt,
  verifiedTestCount: airport.verifiedTestCount,
  testDateCount: airport.dataDays,
  regionalSampleDays: airport.regionalSampleDays,
  rankingEligible: airport.rankingEligible,
  score: airport.score,
  stability: airport.stability,
  scoreBreakdown: airport.scoreBreakdown,
  experienceScores: airport.experienceScores,
  scoringPlan: airport.scoringPlan,
  latestExperience: {
    chatgpt: getLatestExperienceSummary(airport.tests ?? [], 'chatgpt'),
    streaming: getLatestExperienceSummary(airport.tests ?? [], 'streaming'),
  },
  latestRegionTests: getLatestRegionTests(airport.tests ?? []).map(({ region, test }) => ({ region, test: test ?? null })),
  tests: airport.tests ?? [],
}))
const sourceFilesSha256 = Object.fromEntries(Object.entries(versions).sort(([left], [right]) => left.localeCompare(right)))
const evidenceHashes = new Map()
const publication = applySiilasPublication(rawAirports, existing, {
  sourceFilesSha256,
  // This is an operator assertion after checking the exact live source version.
  // Neither --check nor a previously published snapshot grants it to new data.
  sourcePublished: args.includes('--source-published'),
  evidenceSha256: (path) => {
    if (!evidenceHashes.has(path)) evidenceHashes.set(path, sha256(readFileSync(resolve(sourceDir, 'public', `.${path}`))))
    return evidenceHashes.get(path)
  },
})
const records = publication.airports
const latestTestAt = records.map((airport) => airport.latestTestAt).filter(Boolean).sort().at(-1)
const snapshot = {
  schemaVersion: 2,
  receivedAt: checkOnly && existing ? existing.receivedAt : today,
  source: {
    name: 'Siilas',
    origin: 'https://siilas.com',
    archiveUrl: 'https://siilas.com/test/',
    methodologyUrl: 'https://siilas.com/methodology/',
    testedBy: 'siilas',
    relationship: 'Siilas 与 yp7.net 由同一站长运营；独立测速指独立于商业资料采集，不是第三方背书。',
    publicationStatus: publication.publicationStatus,
    publicationNotice: publication.publicationNotice,
    pendingRecords: publication.pendingRecords,
    unpublishedTestDates: publication.unpublishedTestDates,
    sourceFilesSha256,
  },
  methodology: {
    minimumDaysPerRegion: MIN_RANKING_REGION_DAYS,
    scoreRange: '0–10',
    scoreNotice: '综合评分、分项分数和参评状态直接来自 Siilas 当前计算规则。样本不足为 null，不自行补评分；性价比分项同时受所列计分套餐影响。',
    experienceNotice: 'ChatGPT 与流媒体为提交者定性体验。Speedtest 链接和截图佐证测速数值，不代表逐项验证 Netflix、Disney+、TikTok、其他 AI 平台或长期解锁。',
  },
  airportCount: records.length,
  rawTestCount: records.reduce((count, airport) => count + airport.tests.length, 0),
  verifiedTestCount: records.reduce((count, airport) => count + airport.verifiedTestCount, 0),
  latestTestAt,
  airports: records,
}
const serialized = `${JSON.stringify(snapshot, null, 2)}\n`
const metadata = readFileSync(metadataPath, 'utf8')
const modifiedAtPattern = /^export const airportDataLastModified = '(\d{4}-\d{2}-\d{2})'$/m
const currentModifiedAt = metadata.match(modifiedAtPattern)?.[1]
if (!currentModifiedAt) throw new Error('无法读取机场数据编辑日期')
const reviewsDir = resolve(projectDir, 'docs/机场评测')
const reviewsByPath = new Map(readdirSync(reviewsDir).filter((file) => file.endsWith('.md')).map((file) => {
  const filename = resolve(reviewsDir, file)
  const markdown = readFileSync(filename, 'utf8')
  const permalink = markdown.match(/^permalink:\s*["']?([^\s"']+)/m)?.[1]
  return [permalink, { filename, markdown }]
}))
const articleChanges = records.map((airport) => {
  const article = reviewsByPath.get(airport.yp7Path)
  if (!article) throw new Error(`找不到 ${airport.name} 的 yp7.net 独立文章：${airport.yp7Path}`)
  const summary = renderSiilasSummary(airport, snapshot)
  const block = /<!-- siilas-testing:start -->[\s\S]*?<!-- siilas-testing:end -->/
  const markdown = block.test(article.markdown)
    ? article.markdown.replace(block, summary)
    : article.markdown.replace(/^## /m, `${summary}\n\n## `)
  if (!block.test(markdown)) throw new Error(`无法插入 ${airport.name} 的 Siilas 接收摘要`)
  return { ...article, markdown: markdown === article.markdown ? markdown : markdown.replace(/^dateModified:\s*.+$/m, `dateModified: ${snapshot.receivedAt.replace(/-/g, '/')}`) }
})
const { airportCollections } = loadConfig('airport-collections.ts')
const collectionChanges = ['mainRecommendation', 'chatgpt', 'streaming'].map((key) => {
  const collection = airportCollections[key]
  const filename = resolve(projectDir, collection.sourceFile)
  const markdown = syncSiilasCollectionArticle(readFileSync(filename, 'utf8'), collection, snapshot)
  return { filename, markdown }
})
const allArticleChanges = [...articleChanges, ...collectionChanges]
if (checkOnly) {
  if (currentModifiedAt < snapshot.receivedAt) throw new Error('机场数据编辑日期早于 Siilas 接收日期，请重新运行接收脚本。')
  if (!existing || readFileSync(outputPath, 'utf8') !== serialized) throw new Error('Siilas 接收快照与当前来源记录、评分或计算规则不一致，请重新运行接收脚本。')
  for (const article of allArticleChanges) if (readFileSync(article.filename, 'utf8') !== article.markdown) throw new Error(`Siilas 接收摘要与当前快照不一致：${article.filename}`)
  console.log(`Siilas 接收快照一致：${snapshot.airportCount} 家机场、${snapshot.rawTestCount} 条原始测速；来源状态为 ${snapshot.source.publicationStatus}。`)
} else {
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, serialized)
  // Receipt changes editorial data, not commercial or full-review dates.
  if (currentModifiedAt < snapshot.receivedAt) writeFileSync(metadataPath, metadata.replace(modifiedAtPattern, `export const airportDataLastModified = '${snapshot.receivedAt}'`))
  for (const article of allArticleChanges) if (readFileSync(article.filename, 'utf8') !== article.markdown) writeFileSync(article.filename, article.markdown)
  console.log(`已本地接收 Siilas ${snapshot.airportCount} 家机场、${snapshot.rawTestCount} 条原始测速及权威评分；没有提交或发布。`)
}
