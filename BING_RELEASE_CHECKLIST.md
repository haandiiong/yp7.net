# Bing 发布与监测清单

本清单用于本次标题、旧 URL 迁移与 IndexNow 发布。所有排名结论必须以 Bing Webmaster Tools 的发布后实际数据为准；代码检查、抓取成功或 IndexNow 接收都不等于排名提升。

## 发布前基线

- [ ] 记录发布日期、部署 commit SHA，以及发布前 7 天和 28 天的查询数据。
- [ ] 在 Search Performance 分别导出 `Web` 与 `Chat` 来源的点击、展现、CTR、平均位置。
- [ ] 在 AI Performance 记录 Copilot/Bing AI 的引用次数、引用页面和 grounding queries。
- [ ] 保存 Sitemaps、IndexNow、Site Explorer 中当前的已知 URL 数量与错误数量。

## 自动化发布门槛

- [ ] 构建产物中不存在标题短语“全部文章”，也不存在 Unicode 替换字符 `�`。
- [ ] Sitemap 只包含返回 200 的规范 URL，不包含重定向源或永久删除 URL。
- [ ] `_redirects` 中每个旧 URL 在生产环境返回规则声明的 301/308，且 `Location` 指向 Sitemap 内的替代内容。
- [ ] `.github/indexnow-deleted-urls.txt` 中每个 URL 在生产环境返回 404/410。
- [ ] IndexNow 工作流提交 Sitemap URL、重定向源 URL 和永久删除 URL。

上述门槛由构建检查和 `.github/workflows/indexnow.yml` 验证；任一条件不满足时，不提交 IndexNow。

## 发布后 Bing Webmaster Tools 核查

### Sitemaps

- [ ] 确认 `https://yp7.net/sitemap.xml` 已处理，发现的 URL 数量与本次构建一致。
- [ ] 确认旧重定向 URL、永久删除 URL 未出现在 Sitemap 中。
- [ ] 记录处理时间、发现 URL 数量和任何抓取错误。

### IndexNow

- [ ] 在提交历史中确认本次发布时间和 URL 批次。
- [ ] 抽查规范 URL、重定向源和永久删除 URL 三类提交。
- [ ] 预期重定向源被识别为 redirect，永久删除 URL 被识别为 dead link/404-410；若状态不符，先检查生产响应。

### Site Explorer

- [ ] 分别检查 Indexed、Error、Warning、Excluded。
- [ ] 使用 404-410 与 redirect 过滤器核查旧 URL 的最终状态。
- [ ] 确认替代页面可被发现，且没有被 `noindex`、robots 或错误 canonical 排除。

### URL Inspection

- [ ] 检查首页、`/posts/jichang-tuijian/`、一个机场详情页。
- [ ] 检查一个 301/308 旧 URL，确认 HTTP 响应和目标正确。
- [ ] 检查一个永久删除 URL，确认返回 404/410 且不再索引。
- [ ] 对规范页面检查 Index、HTTP、SEO、结构化数据与 Live URL；仅在需要时请求重新索引。

## 排名与 Copilot 观察

在发布后第 3、7、14、28 天按同一口径记录：

| 数据面 | 分开观察的指标 | 主要判断 |
| --- | --- | --- |
| Search Performance · Web | 点击、展现、CTR、平均位置、查询、页面 | 传统 Bing 搜索中的可见性与排名变化 |
| Search Performance · Chat | 点击、展现、CTR、平均位置、查询、页面 | Bing Chat 流量来源的变化 |
| AI Performance | Copilot/Bing AI 引用次数、引用页面、grounding queries | 页面是否被 AI 答案引用，以及引用来自哪些问题 |

发布前后应使用相同日期长度、国家/地区、设备和页面范围。只有获得发布后的实际展现与点击数据后，才能判断最终升降；单凭收录数量、IndexNow 接收或单次 URL Inspection 不能得出排名结论。

## 官方参考

- [IndexNow：提交新增、更新与删除 URL](https://www.bing.com/webmasters/help/indexnow-0z209wby)
- [永久删除或迁移 URL](https://www.bing.com/webmasters/help/how-to-permanently-remove-a-url-or-page-from-bing-or-copilot-37c07477)
- [Sitemaps](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed)
- [Site Explorer](https://www.bing.com/webmasters/help/site-explorer-c680da37)
- [URL Inspection](https://www.bing.com/webmasters/help/URL-Inspection-55a30305)
- [Search Performance](https://www.bing.com/webmasters/help/search-performance-c680da36)
- [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)
