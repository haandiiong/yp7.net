# Google 发布前 SEO 清单

本清单用于本次标题、数据 URL、结构化数据和 `llms.txt` 调整。发布前必须记录 Search Console 的真实搜索数据；在数据缺失时，不对排名升降作确定预测。

## 当前 URL 决策

| URL | 决策 | 发布状态与理由 |
| --- | --- | --- |
| `/rankings/sales/` | 保留 | 独立的本站销量样本与购买热度页面；保持 200、index/follow、自引用 canonical 和 Sitemap 收录 |
| `/data/airports` | 保留 | 人类可读的机场推荐、价格、流量、节点与客户端数据；保持 200 和 Sitemap 收录 |
| `/data/rankings` | 保留 | 人类可读的销量样本及场景筛选数据；保持 200 和 Sitemap 收录 |
| `/data/risk-monitor` | 保留 | 人类可读的风险状态与停止推荐记录；保持 200 和 Sitemap 收录 |
| `/data/*.json` | 保留 | 公开机器可读数据；保持 200、内部链接和 Sitemap 收录 |
| `/data/*.md` | 保留 | 公开 Markdown 数据；保持 200 和内部链接，但不加入 Sitemap |
| `/data/*.html` | 308 | 永久跳转到对应的无扩展名 HTML canonical |
| `/data/*/` | 308 | 托管层统一到对应的无尾斜杠 HTML canonical |
| `/rankings/sales` | 308 | 托管层统一到 `/rankings/sales/` |
| `/llms.txt` | 删除 | 发布后返回 404，并加入 IndexNow 删除 URL；Google Search 明确忽略 LLMS.txt |

在 Search Console 数据完成前，不对上述保留 URL 增加 `noindex`，也不删除 JSON/Markdown 数据入口。

## 标题与自然搜索表达

- [ ] 全部构建 HTML 的 `<title>` 和页面内容中均不存在“全部文章”。
- [ ] 首页自然保留“机场推荐、价格、节点、客户端”。
- [ ] 榜单页自然保留“机场推荐、价格、节点、客户端”，不为覆盖词形而堆砌标题。
- [ ] 单机场文章自然保留“机场推荐、怎么样、价格、节点、客户端”。

以上要求由 `scripts/check-content-health.mjs` 自动检查。

## 结构化数据证据边界

- [ ] Service schema 只保留价格、流量、试用、不限时、客户端、订阅、观察状态、风险提示和测试数据政策。
- [ ] 不恢复旧的测试时间、测试网络、延迟、速度区间、ChatGPT 表现、YouTube 表现或稳定性判断属性。
- [ ] 所有结构化数据必须能在可见正文、公开数据或明确的测试政策中找到对应依据。
- [ ] 2026-08-18 前记录继续标记为历史；当前测试来源继续指向 Siilas。

## Search Console：发布前必须完成

当前自动化环境没有可用的 Google 登录态，以下项目状态为 **待人工查询**，完成前 PR 保持草稿。

### 过去 90 天点击与展现

- [ ] 打开“效果 → 搜索结果”，日期设为过去 3 个月/90 天，搜索类型设为 Web。
- [ ] 在“网页”维度查询 `_redirects` 中所有旧 URL、`.github/indexnow-deleted-urls.txt` 中所有删除 URL，以及当前 noindex URL。
- [ ] 导出 URL、点击、展现、CTR、平均排名和带来展现的主要查询。
- [ ] 如果待删除 URL 有点击或展现，先确认是否存在主题等价页面；有等价页面则改为 301/308，没有等价页面才保留 404/410。
- [ ] 如果 noindex URL 有点击或展现，核查 Google 选定 canonical、历史索引状态和 noindex 生效时间。

### 外链

- [ ] 打开“链接 → 外部链接 → 热门链接网页”，查询同一批候选 URL 并导出 CSV/Google Sheet。
- [ ] 对有外链的删除 URL，优先映射到主题最接近的替代页，避免直接丢失链接信号。
- [ ] 保存“Latest links”和“More sample links”导出作为发布前快照。

Search Console 的效果报告支持 90 天日期过滤；Links 报告是 Google 历史发现链接的当前样本，不提供严格的“过去 90 天外链”统计口径。因此外链项应记录发布前最新快照，不能伪装成精确 90 天数据。

## 发布后复核

- [ ] Sitemap 仍包含 `/rankings/sales/`、三个无扩展名数据 HTML 页面和三个 JSON 页面。
- [ ] 三个 `/data/*.html` 返回 308，Location 指向对应无扩展名 canonical。
- [ ] `/llms.txt` 返回 404，且不在 Sitemap、构建产物或仓库 public 目录中。
- [ ] 在 URL Inspection 抽查销量榜、三个数据 HTML 页面、一个 JSON URL、一个重定向源和 `/llms.txt`。
- [ ] 发布后第 7、14、28 天使用相同口径比较点击、展现、CTR 和平均排名；没有实际数据时不下排名结论。

## Google 官方依据

- [生成式 AI 搜索优化指南](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [AI 功能和您的网站](https://developers.google.com/search/docs/appearance/ai-features?hl=zh-cn)
- [Search Console 效果报告](https://support.google.com/webmasters/answer/7576553)
- [Search Console Links 报告](https://support.google.com/webmasters/answer/9049606)
