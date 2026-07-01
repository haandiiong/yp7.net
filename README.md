# yp7.net

yp7.net 是一个基于 VuePress 2 和 vuepress-theme-plume 的中文内容站，主要维护机场推荐、机场评测、科学上网教程、工具教程、风险监测和结构化机场数据。

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
pnpm run docs:check-content
pnpm run docs:typecheck
pnpm run docs:preview
```

## 内容结构

- `docs/机场评测/`：单个机场测评文章。
- `docs/机场榜单/`：按稳定、低价、试用、不限时、客户端、Clash、ChatGPT、流媒体等场景整理的榜单页。
- `docs/机场推荐/`：机场推荐主文和机场大全。
- `docs/风险监测/`：机场风险监测页。
- `docs/科学上网专区/`、`docs/工具/`、`docs/tiktok专区/` 等：教程型内容。
- `docs/.vuepress/config/airports.ts`：结构化机场数据源，用于生成数据文件和部分结构化信息。

## 数据生成流程

构建时会从 `docs/.vuepress/config/airports.ts` 生成：

- `/data/airports.json`
- `/data/rankings.json`
- `/data/risk-monitor.json`
- 对应的 Markdown 和 HTML 数据页
- `/llms.txt`

构建后运行：

```bash
pnpm run docs:sync-data
```

这会把 `docs/.vuepress/dist/data` 和 `docs/.vuepress/dist/llms.txt` 同步回 `docs/.vuepress/public`，用于提交到仓库。

提交前至少运行：

```bash
pnpm run docs:sync-tables
pnpm run docs:sync-review-sections
pnpm run docs:build
pnpm run docs:sync-data
pnpm run docs:check-tables
pnpm run docs:check-review-sections
pnpm run docs:check-data
pnpm run docs:check-content
pnpm run docs:typecheck
```

## 内容更新 Checklist

新增或修改文章时，注意：

- frontmatter 必须包含 `title`、`description`、`createTime`、`dateModified`、`permalink`。
- 新增机场评测页时，同步检查 `docs/.vuepress/config/airports.ts` 里的结构化字段、页面图片和销量样本。
- 修改 `docs/.vuepress/config/airports.ts` 的价格、流量、试用、客户端、通用订阅、销量样本或风险字段后，运行 `pnpm run docs:sync-tables` 同步榜单和风险监测表格，避免多处数据漂移。
- 修改单机场页或机场结构化数据后，运行 `pnpm run docs:sync-review-sections` 同步“测评证据区”“本文属于”和“相关阅读”，避免证据页内链断层。
- 本地图片放在 `docs/.vuepress/public/`，正文使用 `/image-name.png` 这种绝对路径。
- 推广链接可以正常写入正文，构建时会自动补充 `rel="sponsored nofollow noopener noreferrer"`。
- 优化既有机场文章前，先按目标关键词检查 Google 和 Bing 的实际排名；排名前 5 的文章只做必要的数据、价格、日期、链接修正，不调整正文结构。
- 结构性改写优先用于排名靠后的文章，避免破坏已经稳定获得搜索流量的页面。例如“全球云机场”相关关键词如果已在前 5，不改动文章结构。

## CI 与发布

- `.github/workflows/deploy.yml`：push 到 `main` 后构建并部署到 `gh-pages`。
- `.github/workflows/indexnow.yml`：部署成功后提交 sitemap URL 到 IndexNow。
- GitHub Secrets 需要配置 `INDEXNOW_KEY`，部署时会动态生成 IndexNow 校验文件。

CI 会检查生成数据同步和内容健康，包括断链、缺图、缺 H1、缺 canonical、缺 JSON-LD、机场数据页面映射和 `dateModified` 覆盖。
