# yp7.net

yp7.net 是一个基于 VuePress 2 和 vuepress-theme-plume 的中文机场推荐站，主要维护机场推荐、套餐与客户端资料、科学上网教程、风险监测和结构化推荐数据。

## 测试数据政策

自 2026-08-18 起，yp7.net 不再自行开展或发布新的测速、实测、流媒体测试或 AI 可用性测试：

- 当前测试数据统一来自 [Siilas 测速中心](https://siilas.com/test/)。
- 2026-08-18 前的 yp7.net 测速截图和测试记录保留为历史资料，不代表当前表现。
- yp7.net 从此只负责推荐、套餐与客户端信息整理、风险提示、商业披露和教程。
- 用户测速教程可以保留，但不得把用户自行验证描述为 yp7.net 的项目测试。

## 本地开发

```bash
pnpm install
pnpm run docs:dev
```

常用脚本：

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

## 数据生成流程

构建时会从 `docs/.vuepress/config/airports.ts` 生成：

- `/data/airports.json`
- `/data/rankings.json`
- `/data/risk-monitor.json`
- 对应的 Markdown 和 HTML 数据页

`airport-collections.ts` 保留低价、Clash、流媒体页面的编辑筛选名单及顺序；`rankings.json` 中的对应集合与正文候选表、页面 ItemList 完全对应。全量数据仍可从 `airports.json` 或 `rankings.all` 获取。新增编辑候选应修改集合配置，再运行 `docs:sync-tables`；下架或失去对应能力的服务会从相关集合中排除。

`trial`（免费试用）和 `universalSubscription`（通用订阅）使用三种状态：`true` 为确认支持，`false` 为不支持，`null` 为待核实。待核实条目不进入对应的免费试用榜或 Clash 榜，正文、公开数据与 Schema 均保留该状态。价格按 `priceText` 标明的套餐周期比较，`traffic` 保留每日或每月重置说明；一次性流量包价格在详情中单列，不能写成月付价格。

`docs:sync-tables` 同步主推荐对比表、机场大全价格总表、各场景候选表及风险观察表的基础字段，保留表内编辑说明和已有页内链接。详细套餐、优惠条件和正文叙述仍需编辑维护。`docs:check-consistency` 在构建后交叉核对正文表格、公开 JSON/Markdown/HTML、单机场 Service 和集合 ItemList，检查名单、顺序、链接、价格、能力与历史证据。

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
- 修改单机场页或机场结构化数据后，运行 `pnpm run docs:sync-review-sections` 同步“推荐依据与历史测试记录”“本文属于”和“相关阅读”，避免页面内链断层。
- 本地图片放在 `docs/.vuepress/public/`，正文使用 `/image-name.png` 这种绝对路径。
- 推广链接可以正常写入正文，构建时会自动补充 `rel="sponsored nofollow noopener noreferrer"`。
- 优化既有机场文章前，先按目标关键词检查 Google 和 Bing 的实际排名；排名前 5 的文章只做必要的数据、价格、日期、链接修正，不调整正文结构。
- 结构性改写优先用于排名靠后的文章，避免破坏已经稳定获得搜索流量的页面。例如“全球云机场”相关关键词如果已在前 5，不改动文章结构。

## CI 与发布

- `.github/workflows/deploy.yml`：push 到 `main` 后构建并部署到 `gh-pages`。
- `.github/workflows/indexnow.yml`：部署成功后提交 sitemap URL 到 IndexNow。
- GitHub Secrets 需要配置 `INDEXNOW_KEY`，部署时会动态生成 IndexNow 校验文件。

CI 会检查生成数据同步和内容健康，包括断链、缺图、缺 H1、缺 canonical、缺 JSON-LD、机场数据页面映射和 `dateModified` 覆盖。
