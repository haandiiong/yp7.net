# yp7.net

yp7.net 是一个基于 VuePress 2 和 vuepress-theme-plume 的中文内容站，主要维护机场推荐、机场评测、科学上网教程、工具教程、风险监测和结构化机场数据。

## 本地开发

```bash
pnpm install
pnpm run docs:dev
```

常用脚本：

```bash
pnpm run docs:build
pnpm run docs:sync-data
pnpm run docs:check-data
pnpm run docs:check-content
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
pnpm run docs:build
pnpm run docs:sync-data
pnpm run docs:check-data
pnpm run docs:check-content
```

## 内容更新 Checklist

新增或修改文章时，注意：

- frontmatter 必须包含 `title`、`description`、`createTime`、`dateModified`、`permalink`。
- 新增机场评测页时，同步检查 `docs/.vuepress/config/airports.ts` 和 `docs/.vuepress/config/site.ts` 里的页面图片映射。
- 本地图片放在 `docs/.vuepress/public/`，正文使用 `/image-name.png` 这种绝对路径。
- 推广链接可以正常写入正文，构建时会自动补充 `rel="sponsored nofollow noopener noreferrer"`。
- 修改机场价格、流量、试用、客户端、通用订阅等字段时，优先同步结构化数据和相关榜单，避免多处数据漂移。

## CI 与发布

- `.github/workflows/deploy.yml`：push 到 `main` 后构建并部署到 `gh-pages`。
- `.github/workflows/indexnow.yml`：部署成功后提交 sitemap URL 到 IndexNow。

CI 会检查生成数据同步和内容健康，包括断链、缺图、缺 H1、缺 canonical、缺 JSON-LD、机场数据页面映射和 `dateModified` 覆盖。
