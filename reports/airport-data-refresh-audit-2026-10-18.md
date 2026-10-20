# 机场数据更新复审 — 2026年10月18日

> 当前更新队列已重新审阅并剔除全部后续已确认项，请使用[最新57家资料复审](./airport-data-current-queue-2026-10-18.md)。本文件以下保留先前审查快照。

> 最新确认已落实：二猫云以卡片报价与付款周期为准，全球云99元年付59GB/月、光速云99元年付69GB/月已获用户确认。二猫价格、全球云59/60GB均不再是当前待办；其余规则按各自范围保留。见[卡片口径与月流量确认记录](./card-allowance-confirmations-2026-10-18.md)。

> 第二次后续纠正：用户明确隐形人全套餐不限设备，灯塔没有周付，试用300MB/3天且仅专属客户端，VIP/SVIP在24小时内且用量不超过10%可退款，已更新。此前将旧详情差异作为当前设备问题、将周付作为现售，是应更正的记录。全球云、光速云随后在Chrome重读，59GB是流量而非59元套餐；二猫云已重读8款并改年付96元、入门不限时100元。最新事实见[五家修正与重读记录](./five-airports-corrections-2026-10-18.md)，本表不再代表这些字段的最新待办状态。

> 后续已落实：同日用户确认云界线以卡片价为准、sogo卡片价及90%重置费、云图119元商品1年有效期，已同步网站。下表的云界线价格、sogo价格/重置费和云图有效期不再作为待办；云界线99元交付量、云图实际流量发放等未扩大确认。见[补充落实记录](./three-confirmations-2026-10-18.md)。下文及inventory.json保留本轮更改前审查快照。

本轮重新检查当前57家可见机场的共享记录、来源日期、详情和榜单，人工复读重点冲突服务；已把10月15日至18日的更新纳入。核查公开Siilas列表，当前仍为9家135条、最新10月8日，与已接收快照一致。未逐家重新登录57家商家后台，本报告列的是项目现有证据下的剩余更新队列，不是57家当日核价结果。

**当前主要工作是澄清金额、额度、期限和权益；生成数据已经同步。** 多数差异已在网站披露，不应未经新证据替商家选定其中一组数值。当前套餐截图或文档缺字段，与已证明网站填写错误，分别记录。

## 1. 本轮结论与旧队列变化

- 57家都有带日期来源。最近7天有套餐相关官网记录的11家；8至20天13家；21至29天33家；30天以上0家。该统计只取明确命名的套餐相关官网来源，排除用户补充、邀请更新及历史来源；局部商品新记录不代表全部套餐同日重读。
- 原先超过30天的xxyun、网际快车、全球云、99吧、光年梯、光速云、阿达西均已更新，不能继续作为整组旧资料列队。当前最旧为九云9月22日，26天前。
- 不限时候选40家，其中价格或额度明确冲突3项：云界线99元、秒秒云88元、sogo入门包，均未计算单位成本。37条listed表示有商品记录，其中18条设备或规则字段明确写有待核/未说明等，并不意味着其余全部细则完备。
- 阿达西最低充值1元、闪跃首次150元100GB及288元200GB、秒秒云当前7卡与29.90/49.90元365天总量、xxyun不限时整组及无退款政策、光速云新入门/147元包及流光238GB均已解决，不再复述旧问题。

## 2. 先核清金额、交付量、期限与设备

| 优先级 | 对象及证据 | 当前问题类别与内容 | 下一次需要取得的数据 |
|---|---|---|---|
| P1 | [云界线](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云界线.md:36) | 明确冲突：各周期卡片价与正文不同；99元包80GB／300GB | 所选周期最终应付金额、99元首次交付量；重置/一次性包优惠范围 |
| P1 | [秒秒云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/秒秒云.md:53) | 明确冲突：当前88元一次性“不限时间100G”仍写100G/月 | 总量或周期额度、刷新与有效期；29.90/49.90元365天包已解决 |
| P1 | [sogo](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/sogo.md:65) | 明确冲突：不限时卡片120/220/450/850元，正文重复100元、重置90元 | 四档订单金额及逐档重置报价、补回额度 |
| P1 | [云图119元商品](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云图.md:43) | 关键字段缺失：名称不限时100G、正文每月100G，期限及发放未明确 | 独立确认总量/每月、有效期、刷新、结转；不套78元12个月规则 |
| P1 | [二猫云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/二猫云.md:43) | 明确冲突：橘猫/牛奶猫正文20元，卡片40/80元；年付8折文案对应实价8.5折 | 当前逐档应付金额、适用折扣及可选周期 |
| P1 | [隐形人](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐形人.md:53) | 明确冲突：不限时卡片设备不限，详情分别1/2/3台 | 229/549/1199元三档实际同时在线限制 |
| P1 | [光速云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光速云.md:81) | 明确冲突：68元量子版卡片500GB、正文450GB | 量子版月额度；147元247GB新包的重购、重置及退款范围 |
| P1 | [神行加速](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/神行加速.md:34) | 明确冲突：40/72元套餐卡片260/520GB，正文用40/月、72/月写流量 | 实际交付额度和正确单位 |
| P1 | [灯塔加速器](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md:31) | 关键字段缺失及退款口径冲突：VIP28元周付、SVIP66元周付只列月额度；低档无退款保障与帮助页泛化说明不同 | 周付发放量、统一试用额度与起算、各档退款/导出范围 |
| P1 | [边缘节点](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/边缘节点.md:80) | 明确冲突：399元450GB包重置说明沿用100×0.9=90 | 该档实际重置报价及补回额度；不自行算359.1元 |
| P2 | [极连云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极连云.md:35) | 明确冲突：399元600GB已确认，旧重置612元与399×0.9不一致 | 当前重置报价与额度；不再追问399元首次价量 |
| P2 | [全球云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md:116) | 明确冲突及规则缺失：99元年付卡片59GB/月、正文60GB/月；不限时并发未列具体数量 | 轻量月额度、并发上限、重购余量、Linux安装与退款 |
| P2 | [速界](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/速界.md:46) | 明确冲突及字段未读：100元光速档500GB／499G；长周期总价未逐项读取 | 当前额度、季/半年/年总额、重置日期及结转 |
| P2 | [快狸](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/快狸.md:46) | 价格结构和宣传需核对：夜狸季290元高于月95元×3=285元，年付不是统一8折 | 当前所选周期整笔报价与折扣条件；不擅自把290改为285 |
| P2 | [闪跃](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪跃.md:61) | 仅未记录：首次150元100GB、288元200GB已解决；重置后权益未明确 | 130/268元重置后的额度、原余量处理、不限时设备及退款 |
| P2 | [极速Cloud、极速123](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速Cloud.md:89) | 模板冲突及规则缺失：通用文档不限设备/无期限与具体卡片设备及365天期限不一致 | 实际设备执行规则、具体重置费及月付退款；保留已确认10倍/6倍分组 |

云界线、秒秒云10月18日已经重读，剩余冲突需要商家明确具体权益或所选商品订单口径，反复只看同一张卡片不能消除差异。sogo、云图119元、二猫云、隐形人适合作为下一批读取对象；九云可并行刷新主榜套餐。光速云只追量子500/450GB等当前差异，不再追旧流光238/220GB。

环球梯的“终身”卡片与365天详情差异已有记录，当前按365天处理并排除不限时；不能再写成期限完全未知。极速Cloud10倍、极速1236倍及对应365天/不限时产品已分开，后续应追具体设备执行与重置费用。

## 3. 主推荐7家剩余队列

| 主榜服务 | 最近套餐官网核对日 | 现在应补的字段 | 实际测试覆盖 |
|---|---|---|---|
| [Flybit](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/flybit.md:118) | 2026-10-15 | 1天2GB试用的当前领取/起算；周期结转及换套餐余量；不限时重购；flybit码范围；公告Vless与遗留AnyTLS说明 | 8月13日，66天前 |
| [xxyun](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xxyun.md:123) | 2026-10-17 | 不限时重购/重置及剩余量处理；新客码次数、期限、叠加；Linux/软路由须按已列系统架构 | 最近10月8日；美国8月8日，71天前 |
| [网际快车](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/网际快车.md:224) | 2026-10-17 | yp7net当前领取条件、起算及到账；退款、旧ZLOARB；Linux教程指向Windows路径的问题 | 香港10月8日，其他地区9月11日 |
| [全球云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md:116) | 2026-10-17 | 99元年付59/60GB；不限时并发具体数量/重购余量；Linux安装、退款与旧码 | 四地区10月8日 |
| [拼好连](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/runway.md:92) | 2026-10-16 | 新试用领取/起算；其他周期总额；70元包重置/重购；老用户锁价续费边界、退款与教程下载指向 | 最近9月23日，新加坡9月20日 |
| [九云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/九云.md:36) | 2026-09-22 | 主榜中最应下轮重新核价的一家；8款当前报价、带宽/并发；结转、提前续费及换套餐余量 | 无已接收Siilas记录 |
| [阿达西](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/阿达西.md:25) | 2026-10-17 | 支付手续费与到账口径；退款、重复购买余量、独享节点自动续费细则；最低充值1元已解决 | 无已接收Siilas记录 |

Flybit192GB季付62元、统一1倍率不再列未知；拼好连新账号使用第三方客户端及1天6GB试用已确认，待补领取、起算和其他细则。阿达西10月18日确认1元最低充值，不等于3元套餐只充值1元即可购买，也不等于手续费和到账已经实测。

## 4. 第二批：试用、订阅、活动与重购

| 对象 | 更新内容 | 现有边界 |
|---|---|---|
| SSONE、跨界云、灯塔 | 统一试用额度、起算、节点/客户端范围；跨界20GB期限；灯塔统一规则 | SSONE已知注册1小时；跨界已知客服20GB；灯塔300MB/2席位/10月13日到期仅为10月10日单账号快照 |
| Firefly、无忧链接、灵猫网络、榴莲云、神行加速 | 客服给订阅的领取条件、格式及设备兼容；总量包设备与重购/重置规则 | 已有支持订阅的补充不撤回，但不能泛化为所有Clash/软路由格式已验证 |
| 唯兔云、一翻云、跨界云、Tidal | 节日商品当前可购状态、明确截止、适用人群、折扣是否已计入展示价 | 不凭节日已过或动态“2天后”推断已停售；不把显示年价再乘一遍8折 |
| 坦克云、山水云 | 套餐/教程、试用起算及旧优惠规则的后续轮换复核 | 10月18日和14日分别更新邀请入口；实际套餐来源仍为9月23日和27日 |
| cocoduck、SSONE、光年梯 | 当前客户端支持矩阵；iOS/OpenWrt开发状态；SSONE iOS所称Clash应用及鸿蒙版本；光年Android V7/V8同链 | 文档或按钮存在不等于已运行安装、验证全部架构 |
| 冲上云霄、隐云、UUONE、宇宙云、极连云 | 长周期是否中途刷新、首次季度总额、公平使用/限速、重购结转与重置基数 | 具体已知套餐数量及初次价量保留，不用笼统“全部待核”替代 |
| 99吧 | 近期波动影响范围和恢复证据、所选订单的小数金额与长周期总价、重购细则 | 10月17日9款套餐及自动起算1天1GB文档已读；24.99/24.9、36.99/36.9、259.99/259.9仍有小数差异 |

细项与定位分别见[计费权益审阅](./airport-data-refresh-audit-2026-10-18/billing-review.md)、[非主推覆盖审阅](./airport-data-refresh-audit-2026-10-18/coverage-review.md)。

## 5. 项目内可单独整理的来源元数据

这3项属于来源可追溯性，不需要用新的商家报价才能发现；本轮只审查，未修改网站。

1. [二猫云9月26日试用补充](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/二猫云.md:101)已经明确1天200GB，但共享informationSources和详情底部仅列9月23日官网来源。应补已有确认的来源及日期，不重列额度未知。
2. [UUONE页首](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/uuone.md:16)写9月28日补充试用，正文、FAQ和共享记录是9月27日。需按原确认记录统一日期。
3. [一翻云页首](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/一翻云.md:20)写9月28日核对与补充，而正文及共享来源是9月27日。应查原核对记录后统一，不能凭文章编辑日推进来源日期。

服务status是编辑状态，目前没有逐家状态观察日期及恢复证据字段。若要展示实时可用/稳定，应补对应观测记录，而不把“资料已核对”视作当前线路无故障。

## 6. 测速与销量数据

[Siilas公开测速中心](https://siilas.com/test/)本轮仍显示9家135条，最新列表10月8日；与本地接收总数和最新日期一致，未观察到可从列表新增的记录。只核总量及最新排序，未逐条重开135份证据，也没有运行接收器写入新日期。

- Flybit、cocoduck最近有证据测试均为8月13日，66天前，应优先增加新实际样本。
- xxyun美国最近8月8日，71天前；其他三地区10月8日。网际快车仅香港10月8日，其余三地区9月11日。XSUS新加坡10月8日，其余三地区9月23日。保留分地区日期，不用最近一条代表全部节点。
- 拼好连最近9月23日、新加坡9月20日，且10月16日新套餐没有对应新性能样本；不能把新标价自动套入旧计分套餐重算。
- 九云、阿达西无已接收Siilas记录。全站另48家无这套来源的接收记录，不等于48家没有任何历史图片或用户投稿，隐形人用户截图等应继续独立标明。
- 新采样应实际保存本地地区/运营商、接入和基准带宽、客户端版本、节点、时间、原始链接或图，以及AI/视频逐次观察；缺失的旧指标不反向补写。
- 17家销量样本停留6月18日，距今122天。如继续用于近期热度，应补新的真实样本和采样日期；否则保持历史标注，不仅改日期。

## 7. 检查范围与数据保护

受管表、详情汇总、公开生成文件、9个集合57家服务的JSON/Markdown/HTML/Schema一致；104篇内容健康及Siilas快照检查通过。当前没有查到需要靠重新构建解决的数据同步错误。

本轮只新增审查报告和清单，网站内容、价格、来源日期、原始测速均不改变。源稿哈希前后比对结果见[verification.json](./airport-data-refresh-audit-2026-10-18/verification.json)。本次也未重新访问商家后台、兑换试用、下单、付款、下载、安装或连接测试。

## 8. 全部57家套餐来源清单

以下“最近套餐记录”可能只涉及来源名明确指向的部分商品，旁列来源名以保留范围。补充确认、邀请链接、客户端日期与Siilas各地区日期在[inventory.json](./airport-data-refresh-audit-2026-10-18/inventory.json)中分别列出。21/30天只是排队阈值，不是信息到期或商家变价的判据。

| 服务 | 当前比较参考价 | 最近套餐相关官网记录 | 对应来源范围 |
|---|---|---|---|
| [九云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/九云.md) | 6元/月 | 2026-09-22（26天） | 九云套餐商店：2026-09-22 |
| [全球云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/全球云.md) | 20元/月 | 2026-10-17（1天） | 全球云当前套餐及月季半年年付价格：2026-10-17 |
| [光年梯](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光年梯.md) | 18元/月 | 2026-10-17（1天） | 光年梯套餐及各周期价格：2026-10-17 |
| [网际快车](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/网际快车.md) | 28元/30天 | 2026-10-17（1天） | 网际快车当前永久包、日享套餐与扣量顺序：2026-10-17 |
| [光速云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/光速云.md) | 25元/月 | 2026-10-17（1天） | 光速云现售套餐及各周期价格：2026-10-17 |
| [xxyun](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xxyun.md) | 9.99元/月 | 2026-10-17（1天） | xxyun当前月付、年付与不限时套餐：2026-10-17 |
| [Flybit](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/flybit.md) | 15元/月 | 2026-10-15（3天） | Flybit当前后台套餐页：2026-10-15 |
| [阿达西](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/阿达西.md) | 3元/30天 | 2026-10-17（1天） | 阿达西现售套餐：2026-10-17 |
| [拼好连](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/runway.md) | 19.9元/月 | 2026-10-16（2天） | 拼好连套餐商店：2026-10-16 |
| [唯兔云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/唯兔云.md) | 19.9元/月 | 2026-09-23（25天） | 唯兔云套餐页：2026-09-23 |
| [99吧](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/99吧.md) | 9.9元/月 | 2026-10-17（1天） | 99吧现售套餐：2026-10-17 |
| [迅达](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/迅达.md) | 15元/月 | 2026-09-27（21天） | 迅达套餐页：2026-09-27 |
| [ccyz](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/ccyz.md) | 49.9元/季（约16.63元/月） | 2026-09-27（21天） | CCYZ套餐页：2026-09-27 |
| [uuone](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/uuone.md) | 19元/月 | 2026-09-23（25天） | UUONE套餐页：2026-09-23 |
| [冲上云霄](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/冲上云霄.md) | 7元/30天 | 2026-09-23（25天） | 冲上云霄套餐页：2026-09-23 |
| [SSONE](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/ssone.md) | 15元/月 | 2026-09-23（25天） | SSONE套餐与购买说明：2026-09-23 |
| [U1S1](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/u1s1.md) | 20元/月 | 2026-09-27（21天） | U1S1套餐页：2026-09-27 |
| [隐云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐云.md) | 29元/月参考价（首购季付起） | 2026-09-23（25天） | 隐云购买页：2026-09-23 |
| [cocoduck](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/cocoduck.md) | 17元/月 | 2026-09-27（21天） | COCODUCK套餐与加油包：2026-09-27 |
| [XSUS](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/xsus.md) | 12元/月 | 2026-09-23（25天） | XSUS套餐与购买须知：2026-09-23 |
| [坦克云（原坦克加速）](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/坦克加速.md) | 9.9元/月 | 2026-09-23（25天） | 坦克云套餐页：2026-09-23 |
| [瞬云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/瞬云.md) | 18元/月 | 2026-09-27（21天） | 瞬云套餐商店：2026-09-27 |
| [极连云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极连云.md) | 18元/月 | 2026-09-23（25天） | 极连云套餐页：2026-09-23 |
| [二猫云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/二猫云.md) | 20元/月 | 2026-09-23（25天） | 二猫云套餐页：2026-09-23 |
| [寰宇云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/寰宇云.md) | 18元/月 | 2026-09-27（21天） | 寰宇云套餐商店：2026-09-27 |
| [一翻云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/一翻云.md) | 20元/月 | 2026-09-27（21天） | 一翻云套餐页：2026-09-27 |
| [sogo](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/sogo.md) | 25元/月 | 2026-09-27（21天） | sogo套餐商店：2026-09-27；sogo基础版价格详情：2026-09-27 |
| [速界](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/速界.md) | 15元/月 | 2026-09-27（21天） | 速界套餐商店：2026-09-27 |
| [边缘节点](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/边缘节点.md) | 15元/月 | 2026-09-27（21天） | 边缘节点套餐与优惠说明：2026-09-27 |
| [宇宙云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/宇宙云.md) | 25元/月 | 2026-09-27（21天） | 宇宙云套餐商店：2026-09-27 |
| [快狸](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/快狸.md) | 15元/月 | 2026-09-26（22天） | 快狸套餐页：2026-09-26 |
| [可信云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/可信云.md) | 15元/月 | 2026-09-27（21天） | 可信云套餐页：2026-09-27 |
| [星岛梦](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/星岛梦.md) | 25元/月 | 2026-09-27（21天） | 星岛梦套餐页：2026-09-27 |
| [隐形人](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/隐形人.md) | 24元/月 | 2026-09-26（22天） | 隐形人套餐页：2026-09-26 |
| [闪电鼠](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪电鼠.md) | 22元/月 | 2026-09-26（22天） | 闪电鼠套餐页：2026-09-26 |
| [环球梯](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/环球梯.md) | 23元/月 | 2026-09-26（22天） | 环球梯套餐页：2026-09-26 |
| [跨界云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/跨界云.md) | 20元/月 | 2026-09-27（21天） | 跨界云套餐页：2026-09-27 |
| [Edge-X](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Edge-X.md) | 22.8元/月 | 2026-09-27（21天） | Edge-X套餐商店：2026-09-27 |
| [闪跃](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/闪跃.md) | 24元/月 | 2026-09-27（21天） | 闪跃套餐页：2026-09-27 |
| [无忧链接](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/无忧链接.md) | 19元/月 | 2026-09-28（20天） | 无忧链接套餐页：2026-09-28 |
| [榴莲云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/榴莲云.md) | 24元/月 | 2026-09-28（20天） | 榴莲云套餐页：2026-09-28 |
| [鲤云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/鲤云.md) | 5元/月 | 2026-09-28（20天） | 鲤云套餐页：2026-09-28 |
| [山水云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/山水云.md) | 12元/月 | 2026-09-27（21天） | 山水云套餐页：2026-09-27 |
| [秒秒云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/秒秒云.md) | 9元/月 | 2026-10-18（0天） | 秒秒云当前7款套餐及可选周期（官网重读）：2026-10-18 |
| [锦云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/锦云.md) | 6元/月 | 2026-09-27（21天） | 锦云套餐页：2026-09-27 |
| [熊猫cloud](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/熊猫cloud.md) | 6元/月 | 2026-09-27（21天） | 熊猫cloud套餐页：2026-09-27 |
| [云图](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云图.md) | 20元/月 | 2026-10-05（13天） | 云图套餐页：2026-09-28；云图78元与119元商品卡片及订单确认页（站长复核）：2026-10-05 |
| [灵猫网络](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灵猫网络.md) | 25元/月 | 2026-09-28（20天） | 灵猫网络套餐页：2026-09-28 |
| [Firefly](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Firefly.md) | 25元/月 | 2026-09-28（20天） | Firefly套餐页：2026-09-28 |
| [神行加速](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/神行加速.md) | 23元/月 | 2026-09-28（20天） | 神行加速套餐页：2026-09-28 |
| [极速Cloud](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速Cloud.md) | 新人15元/月（不可续费）；常规30元/月起 | 2026-10-05（13天） | 极速Cloud套餐页：2026-10-05 |
| [杏花云](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/杏花云.md) | 3元/月 | 2026-09-28（20天） | 杏花云套餐页：2026-09-28 |
| [AnDy Cloud](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/AnDy Cloud.md) | 5元/月 | 2026-10-05（13天） | AnDy Cloud套餐页：2026-10-05 |
| [Tidal潮汐加速](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/Tidal潮汐加速.md) | 25元/月 | 2026-10-05（13天） | Tidal套餐页与常见问题：2026-10-05 |
| [云界线](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/云界线.md) | 卡片22元/月（正文25元，结算待核实） | 2026-10-18（0天） | 云界线现售套餐及周期切换价：2026-10-18 |
| [极速123](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/极速123.md) | 15.99元/月 | 2026-10-05（13天） | 极速123套餐商店：2026-10-05 |
| [灯塔加速器](/Users/aaaaa/Documents/Codex/2026-09-16/con/outputs/projects/yp7.net/docs/机场评测/灯塔加速器.md) | 30元/月 | 2026-10-10（8天） | 灯塔官网套餐与客户端下载：2026-10-10；灯塔个人中心套餐购买页：2026-10-10；灯塔退款帮助与套餐限制：2026-10-10 |
