# yp7.net 深度检查（2026年10月13日）

后续进展：2026年10月14日已完成代码、界面、日期与 CI 修复，并将依赖告警降至 2 条。详见[修复记录](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/fixes-2026-10-14.md)。以下保留原检查时的发现与证据。

检查对象为当前工作区（含已有未提交改动），基准提交为 `1e7e4089d8ebb3b67afc96d36f057c389c22f3fb`。本轮发现 **3 项功能或界面缺陷、1 项依赖维护问题、2 项低优先级验证缺口**。当前构建和 56 项测试通过；Siilas 来源检查失败，原因是展示文件版本漂移，原始数据没有变化。线上主推荐页仍未包含本地改稿。

本轮仅新增报告和检查证据，没有修复业务代码、同步正式数据、确认来源发布、提交、推送或部署。构建更新了忽略的缓存和输出目录。

## 需要修复的问题

### 1. P2：主推机场停止推荐时，整个配置加载失败

位置：[airports.ts:1010](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/.vuepress/config/airports.ts:1010)。

`mainRecommendationData` 在模块初始化时，从已经排除隐藏状态的 `visibleAirportData` 查找七款主推；找不到便抛出异常。将 Flybit 等主推机场标为“停止推荐”“已淘汰”或“下架”，会让构建、表格同步及依赖该配置的检查全部中断，无法按既定规则从榜单自动排除。

纯内存验证只改变 Flybit 的状态，三种隐藏状态均产生 `Missing main recommendation data for Flybit`。当前正式配置尚未触发。现有测试在配置已经加载后修改克隆记录，无法覆盖初始化失败。该导出未发现消费者，建议删除无用导出，或让它过滤隐藏机场；同时增加从源配置加载隐藏主推的回归验证。

### 2. P2：接收摘要把原始文本当成字符串替换模板

位置：[sync-siilas-tests.mjs:141](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/sync-siilas-tests.mjs:141)。

单机场摘要通过 `String.replace(block, summary)` 写入。客户端名称、截图标签等原始文本若含 `$&`、`$'` 或美元加反引号，会按 JavaScript 替换模板展开，插入旧摘要或正文片段，而不是保留原始文字。首次插入路径也存在同类问题。

用真实 xxyun 快照的副本，将最近记录客户端设为 `Client $& annotation`，生成文章的 `siilas-testing:start` 标记由 1 个变为 2 个；改用替换回调后仍为 1 个。当前正式快照未含此类触发文本。建议两条插入路径均使用回调返回生成摘要，避免对来源文字进行二次解释。

### 3. P2：暗色首页的下载和教程链接对比度不足

位置：[HomeStart.vue:29](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/.vuepress/components/HomeStart.vue:29)。

首页固定 `--green: #17654f`，随后仅将背景和正文颜色切换到主题变量，绿色链接没有暗色适配。通过页面实际主题开关切换后，浏览器读到下载按钮文字为 `rgb(23, 101, 79)`，卡片背景为 `rgb(32, 33, 39)`，12–13px 链接的对比度约 **2.30:1**；页面普通背景下约 **2.46:1**。下载按钮、教程入口和榜单链接均受影响。

建议为暗色链接使用更浅的绿色，并单独保留按钮底色与按钮文字色，避免一次变量调整影响所有按钮。普通文字的 AA 对比度参考阈值为 4.5:1。[W3C 对比度说明](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)。

证据：[暗色截图](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/home-dark.png)、[浏览器实际颜色](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/dark-check.json)。

### 4. P2：锁定依赖包含已公开的安全告警

位置：[package.json:31](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/package.json:31)、[pnpm-lock.yaml](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/pnpm-lock.yaml)。

本次依赖审计返回 **83 条告警项**：36 高等级、38 中等级、9 低等级、0 严重等级；按 GHSA ID 去重为 73 个公告。告警项可能对应同一公告的不同依赖版本，不能解释为 83 条独立攻击路径。

| 关键依赖 | 锁定版本 | 代表性公告与适用条件 |
| --- | --- | --- |
| Vite | 7.0.6 | 开发服务器 WebSocket 任意文件读取；该公告修复版本为 7.3.2，完整升级还需覆盖其他公告。[GitHub 公告](https://github.com/advisories/GHSA-p9ff-h696-f583) |
| Rollup | 4.50.0 | 构建输出路径穿越写文件；该公告修复版本为 4.59.0。[GitHub 公告](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) |
| Vue server-renderer | 3.5.21 | SSR 渲染不可信属性名时可能注入属性；该公告修复版本为 3.5.42。[GitHub 公告](https://github.com/advisories/GHSA-g2v6-rqmx-r4w6) |

站点为静态构建，本轮没有发现来自线上匿名访客的对应可利用输入路径。Vite 告警涉及开发服务器，SSR 告警需要不可信属性名等前提，不能据依赖版本断言线上已被攻击。建议单独进行兼容性升级和锁文件更新，复跑现有检查；还可移除未使用的 VuePress 1 插件 `@vuepress/plugin-medium-zoom@1.9.10`，其依赖链引入了旧版工具。不要直接对全部间接依赖执行跨大版本强制替换。

完整精简审计结果：[dependency-audit.json](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/dependency-audit.json)。

## 低优先级验证缺口

### 5. P3：摘要一致时，单机场日期过早不会被纠正

位置：[sync-siilas-tests.mjs:145](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/sync-siilas-tests.mjs:145)。

文章日期只在摘要内容变化时替换。若摘要已经与快照一致，但 frontmatter 日期早于接收日，日期辅助函数虽选择了较晚日期，结果仍被丢弃；只读检查也不报告这一差异。内存把 xxyun 文章日期设为 `2026/10/08`，接收日为 `2026-10-09`，输出仍保持 10 月 8 日。这与 README 中取文章日期和接收日期较晚值的约定不完全一致。

现有九篇正式单机场文章没有此问题。建议让日期替换独立于摘要变化判断，并增加“正文不变、日期过早”的测试。

### 6. P3：14 项已有测试没有进入提交前流程和 CI

位置：[package.json:27](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/package.json:27)、[deploy.yml:54](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/.github/workflows/deploy.yml:54)。

数据测试入口硬编码五个文件，遗漏 `airport-membership-price.test.mjs` 的 6 项、`related-airports.test.mjs` 的 4 项、`image-loading.test.mjs` 的 4 项。README 和 CI 的现有两个测试入口合计运行 42 项，本轮全文件检查运行 56 项。

遗漏的验证涉及榜单归属、常规价格统计、相关推荐和图片加载/缩略图证据链接，构建后的一致性检查不能完整代替。建议增加统一的全部测试入口，并让 CI 调用。

代码缺陷的纯内存复现输出：[reproduction-check.json](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/reproduction-check.json)。

## 当前状态差异

### Siilas 来源检查失败，但性能数据未漂移

`docs:check-siilas` 在接收快照比较处失败。相邻来源项目的 `src/data/test-record-presentation.ts` 新增两个记录锚点辅助函数，与接受快照的指纹不同。只读内存重算确认差异限于该文件指纹、来源发布状态和对应说明；**135 条原始记录、全部证据哈希、评分和各地区最近样本一致**。

这是既有保守来源版本检查生效。当前仓库快照仍代表已接受的旧版本，生产构建也只读该快照。后续若接收新来源版本，应保留其实际发布状态，完成来源版本核验后再确认；不能只为使检查变绿直接使用发布确认参数。本轮未执行接收。

### 线上主推荐页仍为旧稿

10 月 13 日只读请求 [线上主推荐页](https://yp7.net/posts/jichang-tuijian/) 得到 200，但正文更新时间仍为 **10 月 9 日**，主 Schema 与 Sitemap 日期为 **10 月 10 日**，没有本地新增的最低充值额说明。本地文章和本轮构建输出已为 **10 月 11 日**。线上 `deploy-sha.txt` 返回当前已提交 HEAD `1e7e4089d8ebb3b67afc96d36f057c389c22f3fb`，本地改稿尚未包含在该提交中。

本地检查通过不能作为改稿已上线的证明。这是既有线上版本差异，本轮没有发布。证据：[live-check.json](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/live-check.json)。

## 已完成的验证

| 检查 | 结果 |
| --- | --- |
| 全部 `scripts/*.test.mjs` | 56 项通过，0 失败、0 跳过 |
| 类型检查 | 通过 |
| 套餐表、评测归属检查 | 通过 |
| VuePress 生产构建 | 108 个页面渲染成功 |
| 生成数据检查 | 通过，仓库公开数据与构建一致 |
| 跨输出一致性 | 9 个集合、57 个公开服务的 JSON、Markdown、HTML 和 Schema 通过 |
| 内容健康检查 | 103 篇 Markdown 通过 |
| Siilas 来源一致性 | 失败；上文已定位为来源展示文件版本变化 |
| 依赖审计 | 83 条告警项，已按实际运行路径说明边界 |
| 全站生成 HTML 锚点扫描 | 111 个 HTML 文件中 2413 个站内片段链接，无失效目标；含重复出现的目录及正文链接 |
| 线上索引页扫描 | Sitemap 的 102 个 URL 直接返回 200，canonical 与 loc 一致，无 noindex，JSON-LD 可解析；lastmod 与主 Schema dateModified 一致 |
| 线上迁移和删除地址 | 50 个迁移规则、5 个删除地址的状态及 Location 符合配置 |

本地浏览器实测覆盖首页、主推荐、机场大全、不限时榜、ChatGPT 记录页、Flybit 评测六个页面，分别在 1440px、390px、320px 宽度检查，共 18 次加载。未出现脚本异常、请求失败、已加载图片损坏或整页横向溢出；每页一个 H1 和一个 main，标题与 canonical 正确。普通数据表在手机上按主题设计局部横向滚动，不能把内部单元格超过屏幕宽度直接当作整页溢出。主推荐手机卡片已截图核验。另验证了暗色主题开关、首页到推荐页的客户端跳转及 Flybit 搜索结果。

证据：[浏览器检查](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/browser-check.json)、[锚点检查](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/fragment-check.json)、[手机卡片截图](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-13/recommendation-mobile.png)。

## 检查范围与边界

已审查 58 条机场基础配置、榜单筛选和排序、公开数据契约、相关正文商业字段、接收与发布状态迁移、日期保护、生成摘要、元数据及结构化数据、组件样式、链接处理和两个部署工作流。未发现当前正式内容中可证实的价格周期混用、漏记录、评分偏差、待发布状态被自动清除、商业复核日期被接收推进或推荐顺序被来源评分改写。

运行环境为 Node 24.19.0、pnpm 11.25.0；项目声明 pnpm 10.15.0，CI 使用 Node 22。本轮没有重新安装依赖，也没有在实际 CI 环境重新执行；本地成功不替代 CI 结果。未进行登录购买、最低充值/退款核验、重新核价、节点测速或全量第三方外链审核；没有新增搜索排名、Search Console、真实用户性能数据。未触发的输入边界缺陷已与当前线上现象分开标注。

建议先修复主推隐藏与摘要替换问题，再处理暗色链接、统一测试入口并安排依赖升级；Siilas 来源版本与线上改稿分别按实际发布流程核对。
