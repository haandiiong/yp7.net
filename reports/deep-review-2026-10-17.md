# yp7.net 深度审查 — 2026年10月17日

> 后续状态：本报告的R1至R8已于2026年10月17日全部修复，见[逐项修复与验证记录](./deep-review-fixes-2026-10-17.md)。下文保留审查时的原始发现。

本轮确认8项可行动问题：4项P2、4项P3；另记录2条构建依赖公告。P2适合优先修复，P3属于日期一致性和结构化数据清理。本轮只生成审查报告与证据记录，没有修改内容、脚本、数据、依赖版本或发布配置，也未提交、推送、发布。

范围包括104篇Markdown、57家主数据、榜单与详情映射、Siilas接收和证据版本逻辑、同步脚本、首页、SEO与Schema、站点地图、发布工作流及最终静态产物。75项现有测试、类型检查和构建全部通过；通过检查仍不能覆盖下列边界。

## 优先修复的问题

### R1 · P2：最新测试日期使用了与来源不同的证据筛选口径

位置：[siilas-collection-summary.mjs:49](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/lib/siilas-collection-summary.mjs:49)，调用位置为第45、131行；接收路径见[sync-siilas-tests.mjs:64](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/sync-siilas-tests.mjs:64)。

`latestRecordDate`取所有原始记录的最大日期，来源的`latestTestAt`和`latestRegionTests`则仅使用有Speedtest链接或主截图的记录。来源规则已只读核实于相邻Siilas项目的`airport-data.ts:326–330`及`test-record-presentation.ts:38–44`。

内存复现：为Flybit追加10月17日、无Speedtest和截图的原始记录，并明确标为待发布。短表立即显示“最近实际测试10月17日”；当日覆盖为“地区未记录，1条”；四地区最近样本仍为8月13日，接收摘要的全站最新测试日仍为10月8日。同一页对“最近实际测试”产生了不同口径。

建议：以来源相同的有效证据条件计算最新测试日和当日覆盖；所有原始记录仍可进入条数、测试日和指标缺口统计。若需要显示未经证据确认的最新录入日期，应另列并明确命名。

当前快照135条均有原始证据，此边界尚未影响当前页面；它会在后续接收无证据的新日期记录时触发。应补充“新无证据记录不抬高已验证测试日期”的回归验证。

### R2 · P2：合法转义竖线会造成表格错列

位置：[sync-airport-tables.mjs:28](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/sync-airport-tables.mjs:28)，具体拆分位于第32行。

解析器直接使用`split('|')`。在人工场景列填写合法Markdown文本`办公\|备用`后，解析结果依次变成：场景为`办公\`、套餐列为`备用`、客户端列为套餐和试用、测试依据列为客户端与退款说明。渲染时部分自动列被重新填回，但人工备注和证据列已经错位；再次同步可能稳定在这个错误结果，`--check`只验证同步幂等，无法识别语义损坏。

建议：统一使用支持转义符的表格解析器；自动生成的普通字段也应转义竖线。不限时Markdown当前直接拼接字段，应采用同一输出规则。新增验证需同时检查人工内容保留、列数和二次同步结果。

当前受管表没有用这一合法输入触发错列；内存复现证明此输入路径有缺陷。

### R3 · P2：详情资料区的字符串替换会解释正文中的美元替换符

位置：[sync-airport-review-sections.mjs:277](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/scripts/sync-airport-review-sections.mjs:277)。

生成资料区作为字符串传给`String.replace`。当风险说明包含字面文本“优惠码为 `$&`”时，JavaScript将其解释为整个旧匹配区，导致旧表被嵌进新风险行，资料区标题从1个变成2个。美元反引号和美元单引号还可能插入正文前缀或后缀。

建议：与Siilas摘要已有处理一致，使用返回生成文本的替换回调，保证所有正文都按字面值写入。验证应覆盖替换符、标题数量、旧区移除和重复同步。

当前资料区未发现触发文本；问题已用原函数在内存中复现，未运行生产同步。

### R4 · P2：购买教程把订阅导入写成所有服务的统一流程

位置：[机场购买教程:93](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场推荐/机场购买教程.md:93)，相关场景建议见第57行。

“买完后怎么测试”要求所有读者先复制、导入并更新订阅。xxyun和全球云等服务明确要求官方客户端登录，不支持通用订阅，这些用户无法完成第1、2步；多端使用也不必以支持通用订阅为前提。

交叉依据：[xxyun:96](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xxyun.md:96)、[全球云:343](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md:343)。

建议：先分“官方客户端登录连接”与“取得兼容订阅后导入”两条路径，再共用应用、晚高峰和多设备验收步骤；多端场景同时核对官方系统支持与订阅兼容性。

## 低优先级问题

| 编号 | 位置 | 已确认的问题 | 建议 |
|---|---|---|---|
| R5 · P3 | [寰宇云:18](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/寰宇云.md:18)、[瞬云:19](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/瞬云.md:19) | 将套餐核对和站长确认写为9月28日，同页正文、来源表和共享配置均记录9月27日 | 将资料核对日统一到已有来源记录，页面编辑日单独维护 |
| R6 · P3 | [不限时榜:4](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场榜单/不限时机场榜.md:4)、第17、52行 | 页面编辑日和可见日期仍为10月15日，但拼好连行已包含10月16日的70元150GB及新账号客户端规则 | 补记本次商业资料变更，维护真实页面编辑日，各套餐核验日期保留 |
| R7 · P3 | [schema.ts:199](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/.vuepress/config/schema.ts:199)、第323行 | 首页仍生成仅1项的BreadcrumbList，最终HTML可复现 | 首页省略该标记；Google面包屑展示要求至少2项，影响限于此条标记的展示资格 |
| R8 · P3 | [generated.ts:407](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/.vuepress/config/generated.ts:407) | 三个Dataset的license指向仅说明方法、没有许可条款的`/methodology/` | 许可未明确时省略字段，或由站长确定真实数据许可后链接具体文档 |

R7依据：[Google面包屑结构化数据要求](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)。R8依据：[Google Dataset的license定义](https://developers.google.com/search/docs/appearance/structured-data/dataset)；该字段应标明数据采用的具体许可，方法说明不能自动充当许可。

## 构建依赖观察

依赖审计返回两条已知拒绝服务公告，均通过VuePress构建工具链间接引入：

| 依赖 | 锁定版本 | 公告级别 | 现状 |
|---|---|---|---|
| braces | 3.0.3 | 高 | VuePress工具链经globby、fast-glob、micromatch引入；恶意深层花括号模式可耗尽调用栈。[官方公告](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |
| sprintf-js | 1.0.3 | 中 | 前置元数据解析依赖链经js-yaml、argparse引入；可控格式串的极端精度可触发异常。[官方公告](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) |

截至本次核查，两个公告均未列修复版本，未升级或覆盖依赖。本站发布的是静态构建产物；这些路径属于构建流程，本轮未证明公开网站存在相应可利用入口。应跟踪上游修复，公告级别不直接作为本项目缺陷优先级。

## 已通过与未验证

- 75项测试、类型检查、109页生产构建通过。
- 表格、详情受管区、生成数据、104篇Markdown内容检查通过；9个集合与57家服务的JSON、Markdown、HTML、Schema一致性通过。
- 扫描112个HTML（109页加3个数据页），检查7,893条站内链接及锚点、814个内部资源引用，未发现缺失目标；无重复ID、重复可索引标题、缺少alt的图片或超过500KB的非懒加载图片。
- 静态扫描另标出5个已设noindex的聚合/友链页没有H1，作为观察项保留，不列入本轮修复问题。所有可索引页面均有唯一标题、H1、robots、description和canonical。
- 109页客户端序列化数据与最终HTML的canonical、robots、description和完整JSON-LD一致；结构化数据的语义问题另列R7、R8。
- sitemap共103条，无重复、参数URL或博客聚合页；既有noindex规则与canonical符合当前定位。风险监测保留停止推荐记录属于现有设计，隐藏候选未进入公开机场和推荐集合。
- Flybit与拼好连的现行价格、试用、新旧用户客户端规则和原Siilas日期，未发现额外跨页冲突。明确标作历史或待核实的内容未当作新缺陷。
- 差异空白检查通过。472个源文件/公开资源的开始与结束哈希一致，原有未提交修改保留。
- 未操作GSC、商家账号、付款、试用、安装或连接测速。实际索引、排名与关键词竞争仍需GSC证据。

浏览器安全校验拒绝读取本地预览，返回原因为URL协议权限未通过。本轮未完成实际浏览器显示、手机横向溢出、交互、主题切换或视觉截图验证，也没有尝试绕过该限制。

记录：[生成产物审计](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-17/static-audit.json)、[三个同步边界复现](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-17/reproductions.json)、[依赖审计](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/deep-review-2026-10-17/dependency-audit.json)。

建议修复顺序：先统一最新测试日期与证据口径，再处理两处自动同步的文本损坏问题；随后修正购买流程分支，最后整理日期与结构化数据。修复时保留原始样本、旧计分套餐和推荐顺序，并将上述具体触发条件加入相应验证。
