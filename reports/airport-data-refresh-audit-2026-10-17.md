# 机场资料更新需求审查 — 2026年10月17日

> 队列已更新：请以[2026年10月18日全站复审](./airport-data-refresh-audit-2026-10-18.md)为准。该轮已剔除阿达西最低充值、闪跃首次额度、秒秒云旧59元映射及近期套餐更新等已解决项，并补二猫云、速界、快狸等现存差异。本文件及附带清单保留原审查快照。

> 最新纠正：10月18日再次读取秒秒云官网，365天100GB现售29.90元，另有88元一次性不限时商品且正文100G/月冲突，已恢复候选并保留差异。此前59元映射及移出结论已由[秒秒云重读记录](./miaomiaoyun-reread-2026-10-18.md)替代。下文及原清单仍是历史审查快照。

> 后续进展：xxyun、网际快车、全球云已于同日按Chrome中的当前商家页面分别更新，见[三家更新记录](./three-airports-refresh-2026-10-17.md)。xxyun不限时整组缺口已补齐；全球云新增59/60GB差异，试用、优惠与部分规则仍需确认。99吧、光年梯、光速云随后也完成当前后台复核，见[第二组三家更新](./second-three-airports-refresh-2026-10-17.md)：光速云改25元168GB、147元247GB永久包，旧流光差异已消除但新增量子500/450GB差异；99吧新增近期线路波动公告。阿达西随后完成现售套餐、充值输入及客户端核对，见[阿达西更新](./adaxi-refresh-2026-10-17.md)：新增Windows GBox官方登录路线，支付渠道最低充值及手续费仍未提交验证。10月18日又完成[云界线复核及秒秒云、闪跃补充](./cloud-three-updates-2026-10-18.md)：秒秒云59元包为365天共100GB已移出不限时，闪跃首次交付按列表100/200GB确认，云界线当前周期卡价与正文、99元80/300GB差异仍在。下文及附带57家清单保留本轮更新前的审查快照。

本轮检查57家可见机场的主数据、详情、套餐来源日期、不限时包和Siilas接收快照，整理需要补齐或复核的字段。优先顺序按是否影响实付金额、交付流量、使用期限、设备和客户端权益确定。

**这是资料更新队列，不是57家商家后台的当日核价结果。** 较旧记录只能说明应复核；以下冲突是项目已经记录且尚未解决的差异，不能据此断言官网现在仍有相同文案或商家已经改价。本轮只生成报告和清单，没有修改网站内容、价格、来源日期或原始测试。

## 1. 总体缺口

- 57家均有带日期的来源；来源覆盖程度仍须按具体字段判断。
- 7家最新一条套餐相关官网记录距今至少30天：99吧40天；xxyun、网际快车37天；全球云36天；光年梯、光速云、阿达西31天。30天是本轮排队阈值，不是价格失效期限。
- 40家不限时候选中，4家入门包明确标为价格或额度冲突：云界线、秒秒云、闪跃、sogo；xxyun另有1组价格、额度和规则未核实。其余35个`listed`条目表示已有商品记录，不代表设备、重购、退款等全部条件已经确认。
- 9家有已接收Siilas记录，共135条；另外48家没有这套来源的记录，不能等同于48家完全没有任何历史配图或投稿。
- 17家保留销量样本，采样日期为6月18日，距今121天。要展示近期购买热度，应补新的真实采样日期和样本；保留旧记录时继续明确历史范围，不能只推进日期。

## 2. 第一批：先解决实付、到账量和周期

| 对象 | 仍需更新的具体字段 | 现有依据日期 | 应取得的答案 |
|---|---|---|---|
| 阿达西 | 3元是套餐标价，最低充值额/首次支付门槛未核实 | 套餐9月16日；主榜10月11日已更正付款表述 | 充值页最低金额、支付手续费、能否直接购买3元套餐；不要以3元标价推断首次只付3元 |
| 云界线 | 月付卡片22/40/66元，正文25/45/75元；99元包80GB与300GB | 10月5日套餐；10月6日另补试用/订阅规则 | 三档订单确认金额；99元包首次入账的总流量。199元200GB包两处一致，不列为冲突 |
| 秒秒云 | 59元包写不限时间100G又写100G/月；49.9元365天200GB又写每30天刷新 | 10月5日 | 分别明确首次额度、刷新周期、每期发放量和到期时间；半年/一年付款选项已经看到，不重列为完全未知 |
| 闪跃 | 150元100GB、288元200GB列表，对应订单确认页均显示0GB | 10月5日 | 首次实际交付量；130/268元重置后的额度；0GB是否展示问题。未付款前不能把0GB当真实到账结论 |
| sogo | 不限时卡片120/220/450/850元，说明反复写售价100元、重置90元 | 9月27日 | 每档一次性实付和重置报价，逐档记录，不能泛用100元/90元 |
| 云图119元商品 | 名称写不限时100G，卡片/订单权益写每月100G；总期限及刷新规则不明 | 该商品10月5日 | 单独确认119元商品的期限、每期流量、刷新和结转；78元商品的12个月规则不能套用 |

证据入口：[阿达西主榜限制](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场推荐/机场推荐.md:128)、[云界线](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云界线.md:33)、[秒秒云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/秒秒云.md:46)、[闪跃](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪跃.md:52)、[sogo](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/sogo.md:65)、[云图](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云图.md:40)。

## 3. 主推荐7家的更新队列

| 机场 | 套餐/官网实际核对日 | 有证据的最近Siilas测试 | 现在应补的数据 |
|---|---|---|---|
| Flybit | 10月15日，2天前 | 8月13日，65天前 | 试用领取和起算；周期重置、结转、续费/换套餐余量；不限时重购是否叠加；9折码范围和期限；Vless公告与残留AnyTLS说明的关系。价格较新 |
| xxyun | 9月10日，37天前 | 10月8日；美国仍8月8日 | 三档现售价与官方客户端；不限时包价格、总量、期限和设备规则整组未补齐；退款及新客码条件 |
| 网际快车 | 9月10日，37天前；体验券9月27日另补 | 香港10月8日，其余三地区9月11日 | 不限时包、日享包现售价与每日限额；`yp7net`当前领取条件；旧码`ZLOARB`适用与退款 |
| 全球云 | 9月11日，36天前；无试用/无通用订阅9月27日另补 | 四地区10月8日 | 周期、年付小包和不限时价格；不限时设备数；旧码`cff88`与退款；Linux安装和iOS识别码/下载要求 |
| 拼好连 | 10月16日，1天前；试用由同日用户确认 | 最近9月23日；新加坡9月20日 | 试用领取和起算；70元150GB包重置费、续购余量；老用户锁价期限及续费条件；退款；FlClash教程下载实际指向PinHaoLian安装包的差异 |
| 九云 | 9月22日，25天前；邀请入口另改不算重新核价 | 无已接收记录 | 八款现售价、带宽与并发限制；结转、提前续费、切套餐；需要另有证据才能形成当前性能结论 |
| 阿达西 | 9月16日，31天前；无试用9月27日另补 | 无已接收记录 | 优先明确首次付款门槛；其次套餐/限速、退款、重复购买余量、独享节点自动续费规则 |

各家详情：[Flybit](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/flybit.md:105)、[xxyun](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xxyun.md:103)、[网际快车](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/网际快车.md:197)、[全球云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md:117)、[拼好连](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/runway.md:100)、[九云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/九云.md:25)、[阿达西](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/阿达西.md:74)。

## 4. 第二批：额度单位、设备与重置费用

| 对象 | 待核字段 | 依据日期/位置 |
|---|---|---|
| 隐形人 | 不限时卡片设备不限，详情三档分别限1/2/3台；应确认实际同时在线/登录规则 | 9月26日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐形人.md:45) |
| 光速云 | 34元流光版238GB/月与220GB/月；已有23元148GB和99元年付59GB/月确认应保留 | 官网9月16日；其他两档9月27日确认，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光速云.md:74) |
| 神行加速 | 卡片260/520GB，正文“40/月”“72/月”缺流量单位；确认实际交付量 | 9月28日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/神行加速.md:25) |
| 边缘节点 | 399元450GB包仍用100×0.9＝90元的重置说明，需此档真实报价；入门100元100GB档不连带列为冲突 | 9月27日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/边缘节点.md:74) |
| 极速Cloud | 设备数通用说明与卡片2/3/5台差异；付费重置金额 | 10月5日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速Cloud.md:81) |
| 极速123 | 通用文档设备与一次性期限描述不同于具体卡片；需设备执行规则和重置费。保留6倍计费及59/98元包365天与128元不限时的区分 | 10月5日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速123.md:79) |
| 灯塔 | VIP/SVIP周付实际额度；入门/轻量无退款保障与帮助页泛化退款说明的边界；第三方订阅具体格式 | 10月10日，[周付](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md:27)、[退款](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md:46) |
| 速界 | 100元档500GB与499G的小幅差异，可以后排核对 | 9月27日，[详情](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/速界.md:46) |

## 5. 试用、订阅、优惠活动与客户端

| 对象 | 仍需补的数据 |
|---|---|
| 99吧 | 官网套餐/试用/客户端资料9月7日，40天前；复核9.9元70GB、1天1GB自动试用、导入入口和`2026-99`范围。10月16日编辑仅改横向对照 |
| 跨界云 | 已确认客服领20GB；期限、起算、节点/客户端范围未知；付费后客服给订阅不代表试用也有订阅；中秋老用户包是否仍在售 |
| SSONE | 免费1小时已记录；额度、节点范围和具体起算尚未完整记录 |
| 灯塔 | 10月10日单账号300MB/2席位/10月13日到期不能推导统一试用天数和额度；需统一规则、试用是否可导出和具体格式。保留入门不导出、轻量仅年付、VIP/SVIP季付以上等已记录门槛 |
| 无忧链接、Firefly、榴莲云、神行加速 | 客服给订阅的领取条件、付费门槛、格式和客户端兼容；不能将“支持通用订阅”扩成所有Clash/软路由均已确认 |
| cocoduck | 9月27日资料中iOS/OpenWRT仍开发中、旧客户端兼容和DNS修复声明，需要查看现在的正式版本与公告 |
| 光年梯 | 官网页面9月16日，31天前；9月27日仅补试用与`GNT80`，需重核套餐及8折码的范围、截止、次数和叠加条件 |
| 一翻云、跨界云、Tidal | 中秋限定包、“2天后下架”、年付8折倒计时应补明确截止日及当前销售状态；不能根据日历自行断言已停售 |

参考：[跨界云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/跨界云.md:87)、[SSONE](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/ssone.md:48)、[灯塔](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md:44)、[Firefly](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Firefly.md:68)、[cocoduck](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/cocoduck.md:84)、[光年梯](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光年梯.md:139)。

## 6. 已有资料即可修正的两处项目问题

1. **阿达西首次付款措辞。** [主榜128行](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场推荐/机场推荐.md:128)明确最低充值额未核实，但[详情201行](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/阿达西.md:201)仍写“3元档也能控制首次购买金额”。应统一为套餐标价与首次实付分开，不用等待商家新资料才纠正文案。
2. **二猫云试用的来源元数据。** [详情101行](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/二猫云.md:101)记录9月26日站长确认1天200GB，详情底部及共享`informationSources`只列9月23日官网记录。应补这条已存在的补充确认来源，随后正常同步资料区；不将已确认额度重新列成未知。

本轮没有代为修改这两处，均进入更新队列。

## 7. 测速资料后续队列

公开[Siilas测速中心](https://siilas.com/test/)本轮读取仍显示9家、135条，最新列表为10月8日，与项目快照的总量和最新日期一致。本轮没有发现可从该公开列表补入的新记录，也没有运行测速。

- Flybit和cocoduck最近有证据记录仍为8月13日，65天前；需要新观察时应新增实际记录。
- xxyun美国最近8月8日，主页面不能把“最近10月8日”解释成四地区同日更新。
- 网际快车香港10月8日，其他三地区9月11日；拼好连新加坡9月20日、其他最近9月23日，保留日期混合。
- 九云、阿达西没有已接收的Siilas记录；不能用商家宣传补成当前实测。
- 拼好连现新套餐没有对应的新性能测试。旧6.4分所用计分套餐仍是历史9.9元100GB，不能自动套用新价重算。
- 需要收集新样本时，应记录实际本地地区/运营商、接入与基准带宽、客户端/版本、节点、日期时段、原始链接或截图、AI与视频逐次观察；未保存的旧指标不反向补写。

## 8. 需要保留的已确认事实与日期边界

- Flybit192GB档季付62元、当前统一1倍率已于10月15日用户确认；不重列为未知。
- 拼好连10月16日现行套餐、新机场账号仅订阅路线、同日用户确认的1天6GB试用保持；待补的是领取/起算及其他细则。
- 云图78元为每月50GB、持续12个月已于10月10日确认；鲤云59元200GB及熊猫cloud66元600GB包1年期限已于10月5日客服答复解决。
- 极速Cloud10倍、极速1236倍及具体期限分组已有依据；继续补设备和重置规则，不能把已明确倍率撤回成未知。
- 山水云10月14日仅改邀请入口，套餐/教程仍为9月27日。按来源最大日期判断整组套餐新鲜度会误判。
- 页面编辑日、官网某字段核对日、用户/站长补充日、测试日、数据接收日和服务状态观察日应分别记录。当前`status`是编辑标签，没有逐家`statusCheckedAt`，不能据此宣称实时在线或无故障。

## 9. 公开来源抽查范围

本轮额外读取7家商家的公开入口及Siilas；未登录商家后台，未注册、领取试用、提交订单、付款、安装或连接客户端。

| 公开来源 | 本轮可读信息 | 能否完成当前套餐核价 |
|---|---|---|
| [xxyun导航](https://xxyun.at/) | 公开发布页和多个访问入口 | 否，导航本身没有套餐表 |
| [网际快车入口](https://wjkc66.vip/) | 国内/国际访问说明、域名通知 | 否 |
| [99吧导航](https://99ba.net/) | 宣传注册试用1G | 否；不足以重新确认1天期限及全部套餐 |
| [阿达西套餐地址](https://adaxi.net/plan) | 需要JavaScript的页面壳 | 否 |
| [九云入口](https://888.jiuyundl.com/) | 加载用户中心和JavaScript提示 | 否 |
| [全球云入口](https://haandiiong.gcvipaff.cc/) | 本工具未能读取 | 否；不能据此推断官网异常或服务故障 |
| [灯塔入口](https://dengta12.com/) | 本工具未能读取 | 否；不能据此推断官网异常或服务故障 |
| [Siilas测速中心](https://siilas.com/test/) | 9家135条，最新列表10月8日 | 已核对总量与最新日期，未逐一重开135条证据 |

## 10. 完整57家清单

后附表的日期仅指共享配置中**最新一条套餐相关官网来源记录**，部分重核、仅邀请入口更新、站长补充和整组核对须结合上文理解；它不代替各字段的实际来源日期。完整来源列表、各地区测试日期及未决风险见机器可读[清单](./airport-data-refresh-audit-2026-10-17/inventory.json)。

| 机场 | 记录中的入门价 | 最近套餐来源 | 距今天数 | 不限时记录 | 最近Siilas | 更新队列与重点 |
| --- | --- | --- | --- | --- | --- | --- |
| [九云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/九云.md>) | 6元/月 | 2026-09-22 | 25 | 已有记录 | 无已接收记录 | 第二批：现售档位、并发、续费/结转 |
| [全球云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md>) | 20元/月 | 2026-09-11 | 36 | 已有记录 | 2026-10-08 | 第一批：现行套餐；不限时设备/退款 |
| [光年梯](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光年梯.md>) | 18元/月 | 2026-09-16 | 31 | 未列入候选 | 2026-10-08 | 第二批：套餐复核；GNT80优惠完整条件 |
| [网际快车](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/网际快车.md>) | 28元/30天 | 2026-09-10 | 37 | 已有记录 | 2026-10-08 | 第一批：现行套餐/日享限额；体验券 |
| [光速云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光速云.md>) | 23元/月 | 2026-09-16 | 31 | 已有记录 | 无已接收记录 | 第二批：34元档238/220GB；旧套餐复核 |
| [xxyun](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xxyun.md>) | 9.99元/月 | 2026-09-10 | 37 | 未核齐 | 2026-10-08 | 第一批：现行套餐；不限时整组资料 |
| [Flybit](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/flybit.md>) | 15元/月 | 2026-10-15 | 2 | 已有记录 | 2026-08-13 | 第二批：试用/结转/续购；优惠及协议公告 |
| [阿达西](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/阿达西.md>) | 3元/30天 | 2026-09-16 | 31 | 已有记录 | 无已接收记录 | 第一批：最低充值/实付；详情首次付款措辞 |
| [拼好连](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/runway.md>) | 19.9元/月 | 2026-10-16 | 1 | 已有记录 | 2026-09-23 | 第一批：试用领取/起算；重置与老用户锁价 |
| [唯兔云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/唯兔云.md>) | 19.9元/月 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [99吧](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/99吧.md>) | 9.9元/月 | 2026-09-07 | 40 | 已有记录 | 无已接收记录 | 第一批：40天旧套餐/试用/导入/优惠复核 |
| [迅达](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/迅达.md>) | 15元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [ccyz](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/ccyz.md>) | 49.9元/季（约16.63元/月） | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [uuone](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/uuone.md>) | 19元/月 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [冲上云霄](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/冲上云霄.md>) | 7元/30天 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [SSONE](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/ssone.md>) | 15元/月 | 2026-09-23 | 24 | 未列入候选 | 无已接收记录 | 第二批：1小时试用的额度、范围与起算 |
| [U1S1](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/u1s1.md>) | 20元/月 | 2026-09-27 | 20 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [隐云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐云.md>) | 29元/月参考价（首购季付起） | 未单列 | — | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [cocoduck](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/cocoduck.md>) | 17元/月 | 2026-09-27 | 20 | 未列入候选 | 2026-08-13 | 第二批：iOS/OpenWRT版本与当前故障公告 |
| [XSUS](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xsus.md>) | 12元/月 | 2026-09-23 | 24 | 已有记录 | 2026-10-08 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [坦克云（原坦克加速）](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/坦克加速.md>) | 9.9元/月 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [瞬云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/瞬云.md>) | 18元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [极连云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极连云.md>) | 18元/月 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [二猫云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/二猫云.md>) | 20元/月 | 2026-09-23 | 24 | 已有记录 | 无已接收记录 | 第二批：补9月26日试用确认来源元数据 |
| [寰宇云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/寰宇云.md>) | 18元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [一翻云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/一翻云.md>) | 20元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 第二批：中秋限定是否仍售；活动截止 |
| [sogo](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/sogo.md>) | 25元/月 | 2026-09-27 | 20 | 金额/额度冲突 | 无已接收记录 | 第一批：各档一次性实付与重置费 |
| [速界](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/速界.md>) | 15元/月 | 2026-09-27 | 20 | 未列入候选 | 无已接收记录 | 常规：500GB/499G小差异 |
| [边缘节点](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/边缘节点.md>) | 15元/月 | 2026-09-27 | 20 | 已有记录 | 2026-10-08 | 第二批：399元450GB档重置报价 |
| [宇宙云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/宇宙云.md>) | 25元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [快狸](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/快狸.md>) | 15元/月 | 2026-09-26 | 21 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [可信云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/可信云.md>) | 15元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [星岛梦](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/星岛梦.md>) | 25元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [隐形人](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐形人.md>) | 24元/月 | 2026-09-26 | 21 | 已有记录 | 无已接收记录 | 第二批：不限时并发设备不限与1/2/3台差异 |
| [闪电鼠](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪电鼠.md>) | 22元/月 | 2026-09-26 | 21 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [环球梯](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/环球梯.md>) | 23元/月 | 2026-09-26 | 21 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [跨界云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/跨界云.md>) | 20元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 第二批：试用期限；客服订阅；中秋销售状态 |
| [Edge-X](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Edge-X.md>) | 22.8元/月 | 2026-09-27 | 20 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [闪跃](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪跃.md>) | 24元/月 | 2026-10-05 | 12 | 金额/额度冲突 | 无已接收记录 | 第一批：列表与订单0GB差异及重置到账量 |
| [无忧链接](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/无忧链接.md>) | 19元/月 | 2026-09-28 | 19 | 已有记录 | 无已接收记录 | 第二批：客服订阅格式/付费门槛；不限时设备 |
| [榴莲云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/榴莲云.md>) | 24元/月 | 2026-09-28 | 19 | 未列入候选 | 无已接收记录 | 第二批：客服订阅条件/格式；优惠结算 |
| [鲤云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/鲤云.md>) | 5元/月 | 2026-09-28 | 19 | 未列入候选 | 无已接收记录 | 常规：优惠结算/续购；1年期限已确认 |
| [山水云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/山水云.md>) | 12元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：套餐仍9月27日；续购规则 |
| [秒秒云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/秒秒云.md>) | 9元/月 | 2026-10-05 | 12 | 金额/额度冲突 | 无已接收记录 | 第一批：59元总量/周期；365天包刷新量 |
| [锦云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/锦云.md>) | 6元/月 | 2026-09-27 | 20 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [熊猫cloud](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/熊猫cloud.md>) | 6元/月 | 2026-09-27 | 20 | 未列入候选 | 无已接收记录 | 常规：续购余量处理；1年期限已确认 |
| [云图](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云图.md>) | 20元/月 | 2026-10-05 | 12 | 未列入候选 | 无已接收记录 | 第一批：119元商品期限/刷新；78元已确认 |
| [灵猫网络](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灵猫网络.md>) | 25元/月 | 2026-09-28 | 19 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [Firefly](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Firefly.md>) | 25元/月 | 2026-09-28 | 19 | 已有记录 | 无已接收记录 | 第二批：客服订阅条件/格式；重购规则 |
| [神行加速](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/神行加速.md>) | 23元/月 | 2026-09-28 | 19 | 未列入候选 | 无已接收记录 | 第二批：260/520GB与正文单位；客服订阅 |
| [极速Cloud](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速Cloud.md>) | 新人15元/月（不可续费）；常规30元/月起 | 2026-10-05 | 12 | 已有记录 | 无已接收记录 | 第二批：设备上限、付费重置金额 |
| [杏花云](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/杏花云.md>) | 3元/月 | 2026-09-28 | 19 | 未列入候选 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [AnDy Cloud](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/AnDy Cloud.md>) | 5元/月 | 2026-10-05 | 12 | 已有记录 | 无已接收记录 | 常规：按各条来源复核现售套餐、试用、设备及退款 |
| [Tidal潮汐加速](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Tidal潮汐加速.md>) | 25元/月 | 2026-10-05 | 12 | 已有记录 | 无已接收记录 | 第二批：年付优惠截止；续购/退款边界 |
| [云界线](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云界线.md>) | 卡片22元/月（正文25元，结算待核实） | 2026-10-05 | 12 | 金额/额度冲突 | 无已接收记录 | 第一批：三档实付；99元包交付流量 |
| [极速123](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速123.md>) | 15.99元/月 | 2026-10-05 | 12 | 已有记录 | 无已接收记录 | 第二批：设备执行规则、重置费和文档范围 |
| [灯塔加速器](</Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md>) | 30元/月 | 2026-10-10 | 7 | 未列入候选 | 无已接收记录 | 第二批：周付额度、统一试用/退款/导出格式 |
