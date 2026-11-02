# Siilas 数据同步与机场合集更新记录折叠

完成日期：2026年10月29日。

## 数据同步

- 从相邻Siilas项目接收9家机场154条原始测速记录，比此前135条增加19条，没有删除既有记录；最新实际测试日期为10月24日。
- 核对9个来源机场页的完整正文与来源构建一致，154条记录锚点全部在线；评分方法页一致，102张引用截图的线上内容SHA256全部与来源文件相同。核验通过后按既有流程确认来源正式发布，当前待发布记录数为0。
- 同步9篇单机场文章、主推荐、ChatGPT榜、流媒体榜及10个公开数据文件；补正块外残留的旧“最近日期”和当前评分表述，带日期的历史资料继续保留。
- 商业配置仅推进编辑日期，价格、商业资料核对日期及推荐顺序保持原值；接收日期没有代替实际测试日期。

| 机场 | 最近实际测试 | 当前综合分 |
|---|---|---:|
| 全球云 | 2026-10-08 | 5.4/10 |
| 光年梯 | 2026-10-08 | 5.0/10 |
| 网际快车 | 2026-10-23 | 5.6/10 |
| xxyun | 2026-10-23 | 5.7/10 |
| Flybit | 2026-10-23 | 6.0/10 |
| 拼好连 | 2026-10-24 | 4.4/10 |
| cocoduck | 2026-10-24 | 6.3/10 |
| 边缘节点 | 2026-10-08 | 4.0/10 |
| XSUS | 2026-10-24 | 5.5/10 |

这些评分直接接收来源计算结果，不代表同条件的速度排名或连续可用率。

## 合集页折叠与后续规则

- 保留此前用户已将页首历史移至文末的改动。
- 将不限时、免费试用、专属客户端三个分类表前的长更新过程收进默认关闭的折叠区，文末“更新详情与历史记录”继续保留。
- 页首仅保留页面更新日期；现行筛选规则与必要风险提示继续直接显示。全部768行Markdown表格保持原样，表格本身没有被折叠。
- README已写明：后续合集页的更新过程和历史记录统一追加到折叠区，默认关闭，不能重新堆到表格前。
- 内容健康检查增加守护：拒绝概览中展开的日期更新记录、默认打开的折叠、被折叠包住的对比表，以及概览中未闭合的容器。当前内容与四种反例均按预期通过或被拒绝。

## 验证

生产构建109页、84项自动测试、类型检查、Siilas来源一致性、表格与详情同步、公开数据同步、9个集合/57家服务跨格式一致性及104篇内容健康检查均通过。合集页390px/1440px明暗主题4组浏览验收通过：四个更新历史区均默认关闭且能开合，全部84张表格逐表行数保留；原235个Markdown链接目标与出现次数保留。主推荐及两张场景页显示新日期、评分与来源发布确认，当前摘要和候选表没有待发布标记。

本次完成本地修改与验证，未提交、推送或部署yp7.net；来源状态“已发布”指已核对的Siilas来源。

## 证据

- [来源页面、记录与102张截图核验](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/source-publication-check.json)
- [新增记录与商业配置、合集表格保留检查](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/preservation-check.json)
- [折叠维护规则反例检查](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/collapse-guard-check.json)
- [最终浏览检查](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/browser-check.json)
- [手机暗色默认收起](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/heji-390-dark-initial.png)、[桌面展开更新记录](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/reports/siilas-sync-heji-fold-2026-10-29/heji-1440-light-no-expiry-expanded.png)
