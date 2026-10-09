# yp7.net

yp7.net 是一个基于 VuePress 2 和 vuepress-theme-plume 的中文机场推荐站，主要维护机场推荐、套餐与客户端资料、科学上网教程、风险监测和结构化推荐数据。

## 测试数据政策

自 2026-08-18 起，yp7.net 不再自行开展或发布新的测速、实测、流媒体测试或 AI 可用性测试：

- 当前测试数据统一来自 [Siilas 测速中心](https://siilas.com/test/)。
- 2026-08-18 前的 yp7.net 测速截图和测试记录保留为历史资料，不代表当前表现。
- yp7.net 从此只负责推荐、套餐与客户端信息整理、风险提示、商业披露和教程。
- 用户测速教程可以保留，但不得把用户自行验证描述为 yp7.net 的项目测试。

yp7.net 与 Siilas 由同一站长运营。固定分工是 yp7.net 收集、复核商业资料 → Siilas 独立于商业采集开展实测 → 带日期、原始证据与评分的结果返回 yp7.net，用于编辑推荐。商业核价日期、实际测试日期、接收日期和文章编辑日期分别维护，两站互引不作为第三方背书。

## 本地开发

```bash
pnpm install
pnpm run docs:dev
```

常用脚本：

```bash
pnpm run docs:sync-tables
pnpm run docs:sync-review-sections
pnpm run docs:receive-siilas
pnpm run docs:check-siilas
pnpm run docs:build
pnpm run docs:sync-data
pnpm run docs:check-tables
pnpm run docs:check-review-sections
pnpm run docs:check-data
pnpm run docs:check-consistency
pnpm run docs:check-content
pnpm run docs:typecheck
pnpm run docs:test-head
pnpm run docs:test-data
pnpm run docs:preview
```

## 内容结构

- `docs/机场评测/`：单个机场推荐资料与历史测试记录。
- `docs/机场榜单/`：按稳定、低价、试用、不限时、客户端、Clash、ChatGPT、流媒体等场景整理的榜单页。
- `docs/机场推荐/`：机场推荐主文和机场大全。
- `docs/风险监测/`：机场风险监测页。
- `docs/科学上网专区/`、`docs/工具/`、`docs/tiktok专区/` 等：教程型内容。
- `docs/.vuepress/config/airports.ts`：机场价格、流量、客户端能力、历史记录及风险的基础数据源。
- `docs/.vuepress/config/airport-collections.ts`：各页面候选名单、顺序和筛选规则，供正文表格、JSON 与 ItemList Schema 共用。
- `docs/.vuepress/config/airport-public.ts`：公开数据对象，供 JSON、Markdown 和 HTML 数据页共同使用。
- `docs/.vuepress/config/data/siilas-tests.json`：已接收的 Siilas 原始测速、最新分区体验、评分、规则指纹与来源发布状态。生产构建只读取这份仓库快照。

## 接收 Siilas 测试结果

在本地从相邻 `../siilas` 工作区接收数据：

```bash
pnpm run docs:receive-siilas
pnpm run docs:check-siilas
```

来源目录不同可设置 `SIILAS_PROJECT_DIR`。接收脚本调用来源项目的实际评分与分区规则，不维护另一套评分公式；`--check` 核对原始记录、规则指纹、评分、9 篇单机场文章以及主推荐、ChatGPT榜和流媒体榜的生成摘要。仅接收步骤需要来源工作区，CI 和生产构建无需访问相邻项目。

发布状态按“机场 slug + 原始记录 ID + 完整记录及证据版本”跟踪，记录与每张截图都保存状态和 SHA256；不会用全站最新测试日期判断是否已发布。补录旧日期、修改已有记录、同 URL 更换图片，都保守标为 `pending`，已有待发布记录在再次接收或检查时保持待发布。初次来源未知时全部记录及证据待发布。旧版只有 `unpublishedTestDates` 的快照会迁移，保留原待发布记录；没有旧内容哈希的图片版本也先待核对。`unpublishedTestDates` 只为旧数据使用者保留，不是单条发布状态的依据。

接收与构建均不代表线上已更新。后续必须人工核对 Siilas 对应页面、完整原始记录及全部证据已经正式上线且与当前来源版本一致，再执行 `pnpm run docs:receive-siilas -- --source-published` 确认当前版本，随后运行 `docs:check-siilas`、重新构建并同步公开数据。该参数是人工核验后的明确确认，脚本不自行认定来源已上线；`--check` 只读核对已接收版本，不能同时使用 `--source-published`，也不能清除待发布状态。来源计算规则或其他来源文件发生变化时仍保守保留未发布来源状态。接收不会改动机场商业配置、资料复核日期或推荐顺序，旧 yp7 历史资料保持单列。

原始记录分别保留代理客户端 `client` 和测速工具 `measurementTool`；客户端未知如实留空。多张证据保留 `evidenceImages` 的标签与路径，并导出绝对 `evidenceUrls`；文章按“测速截图”“ChatGPT 状态截图”等语义展示，逐张标注待发布状态。

接收会同步单机场页 `siilas-testing` 标记内的记录表与评分，以及主推荐和两张场景榜的测试/体验列、`siilas-collection-evidence` 接收摘要、`siilas-score-comparison` 分数比较和 `siilas-page-updated` 页面编辑日期。各地区保留自己的最近样本时间和发布状态，缺测、未记录与 null 评分如实展示；原始记录未明确平台时只称视频/流媒体。旧手写样本收进带日期历史说明，选购理由、商业字段、候选名单与排序仍由编辑维护。更新 `airportDataLastModified` 编辑日期，不推进 `airportDataLastReviewed` 或各条商业复核日期。完成后重新构建并同步生成数据。不要在 CI 中执行需要相邻来源项目的接收脚本。

## 数据生成流程

构建时会从 `docs/.vuepress/config/airports.ts` 生成：

- `/data/airports.json`
- `/data/rankings.json`
- `/data/risk-monitor.json`
- `/data/siilas-tests.json`（完整原始记录与来源状态）
- 对应的 Markdown 和 HTML 数据页

`airport-collections.ts` 保留低价、Clash、流媒体页面的编辑筛选名单及顺序；`rankings.json` 中的对应集合与正文候选表、页面 ItemList 完全对应。全量数据仍可从 `airports.json` 或 `rankings.all` 获取。新增编辑候选应修改集合配置，再运行 `docs:sync-tables`；下架或失去对应能力的服务会从相关集合中排除。

`trial`（免费试用）和 `universalSubscription`（通用订阅）使用三种状态：`true` 为确认支持，`false` 为不支持，`null` 为待核实。待核实条目不进入对应的免费试用榜或 Clash 榜，正文、公开数据与 Schema 均保留该状态。价格按 `priceText` 标明的套餐周期比较，`traffic` 保留每日或每月重置说明；一次性流量包价格在详情中单列，不能写成月付价格。

`docs:sync-tables` 同步主推荐对比表、机场大全价格总表、各场景候选表及风险观察表的基础字段，保留表内编辑说明和已有页内链接。主推荐首屏 `recommendation-scope` 标记内的资料数量、精选数量和 Siilas 记录覆盖数也自动同步；记录覆盖按有原始样本的场景集合与首推名单交集计算，不表示连续监测或近期复测。详细套餐、优惠条件、推荐理由和历史引用仍需编辑维护，三篇页面的当前 Siilas 摘要由 `docs:receive-siilas` 同步。`docs:check-consistency` 在构建后交叉核对正文表格、公开 JSON/Markdown/HTML、单机场 Service 和集合 ItemList，检查名单、顺序、链接、价格、能力与历史证据。

主推荐表的“套餐与试用”列首行按 `priceText，traffic；支持试用/无试用/试用待核实` 自动生成，“客户端与限制”列首行同步客户端能力；人工补充放在第一个 `<br>` 后，同步时完整保留。适用场景由编辑维护，测试依据由 Siilas 接收脚本同步，桌面表格和手机卡片共用同一张 Markdown 表。

构建后运行：

```bash
pnpm run docs:sync-data
```

这会把 `docs/.vuepress/dist/data` 同步回 `docs/.vuepress/public`，用于提交到仓库。

提交前至少运行：

```bash
pnpm run docs:sync-tables
pnpm run docs:sync-review-sections
pnpm run docs:build
pnpm run docs:sync-data
pnpm run docs:check-tables
pnpm run docs:check-review-sections
pnpm run docs:check-data
pnpm run docs:check-consistency
pnpm run docs:check-content
pnpm run docs:typecheck
pnpm run docs:test-head
pnpm run docs:test-data
```

## 内容更新 Checklist

新增或修改文章时，注意：

- frontmatter 必须包含 `title`、`description`、`createTime`、`dateModified`、`permalink`。
- 新增机场评测页时，同步检查 `docs/.vuepress/config/airports.ts` 里的结构化字段、页面图片和销量样本。
- 修改 `docs/.vuepress/config/airports.ts` 的价格、流量、试用、客户端、通用订阅、销量样本或风险字段后，运行 `pnpm run docs:sync-tables` 同步榜单和风险监测表格，避免多处数据漂移。
- 完成价格、服务状态、能力和风险的实际复核后，手动更新 `airportDataLastReviewed`；仅补录历史测速或调整测试口径时不要推进该日期。
- 接收 Siilas 测速后检查 `docs:check-siilas` 与 `docs:test-data`，保留原始测试日期，人工核对标记外的历史引用；不以接收日期刷新商业核价日期。数据测试也检查三篇实际合集摘要与仓库快照一致，无需相邻来源项目。
- 修改单机场页或机场结构化数据后，运行 `pnpm run docs:sync-review-sections` 同步“推荐依据与历史测试记录”“本文属于”和“相关阅读”，避免页面内链断层。
- 本地图片放在 `docs/.vuepress/public/`，正文使用 `/image-name.png` 这种绝对路径。
- 推广链接可以正常写入正文，构建时会自动补充 `rel="sponsored nofollow noopener noreferrer"`。
- 分享封面与正文标志、原始测速截图分开：`page-covers.ts` 映射各页的1280×720 PNG，源SVG保存在 `public/covers/sources/`。新增页面后可运行 `node scripts/generate-page-covers.mjs`（维护环境需有 Sharp，也可通过 `YP7_SHARP_MODULE` 指定已有模块），再检查封面的标题和布局。生产构建直接使用已提交的图片，无需图片渲染依赖。
- 优化既有机场文章前，先按目标关键词检查 Google 和 Bing 的实际排名；排名前 5 的文章只做必要的数据、价格、日期、链接修正，不调整正文结构。
- 结构性改写优先用于排名靠后的文章，避免破坏已经稳定获得搜索流量的页面。例如“全球云机场”相关关键词如果已在前 5，不改动文章结构。

## CI 与发布

- `.github/workflows/deploy.yml`：push 到 `main` 后构建并部署到 `gh-pages`。
- `.github/workflows/indexnow.yml`：部署成功后提交 sitemap URL 到 IndexNow。
- GitHub Secrets 需要配置 `INDEXNOW_KEY`，部署时会动态生成 IndexNow 校验文件。

CI 会检查生成数据同步和内容健康，包括断链、缺图、缺 H1、缺 canonical、缺 JSON-LD、机场数据页面映射和 `dateModified` 覆盖。
