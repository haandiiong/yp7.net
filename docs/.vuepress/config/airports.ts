export interface AirportData {
  name: string
  path: string
  image: string
  price: number
  priceText: string
  // Normal cycle reference when the entry price is an introductory offer.
  // This is not a claim that every provider's eventual renewal quote is verified.
  regularPrice?: number
  traffic: string
  // null means current free-trial availability has not been verified.
  trial: boolean | null
  // null means the advertised no-expiry package has conflicting validity terms.
  noExpiry: boolean | null
  dedicatedClient: boolean
  // null means the current subscription method or conditions are not verified.
  universalSubscription: boolean | null
  scenarios: string[]
  status: string
  risk: string
  summary: string
  subscriptionClients?: string[]
  informationSources?: { name: string; url: string; checkedAt: string; link?: boolean }[]
  performance?: AirportPerformanceSnapshot
  salesSample?: number
}

export interface AirportMetrics {
  count: number
  trialCount: number
  noExpiryCount: number
  noExpiryUnverifiedCount: number
  dedicatedClientCount: number
  universalSubscriptionCount: number
  cheapUnderTenCount: number
  averagePrice: number
  regularCheapUnderTenCount: number
  regularAveragePrice: number
  performanceCount: number
  salesSampleCount: number
}

export interface AirportSalesSampleMeta {
  observedAt: string
  source: string
  caveat: string
}

export interface AirportPerformanceSnapshot {
  // A missing grade means ungraded evidence, not a claim of superior performance.
  evidenceLevel: 'A' | 'B' | 'C' | null
  lastTestedAt: string
  testWindow: string
  testRegion: string
  testNetwork: string
  testDevice: string
  // null means no single, traceable latency figure is available.
  latencyMs: number | null
  downloadMbpsRange: string
  chatgptResult: string
  youtube4kResult: string
  stability: string
  evidenceSummary: string
  evidenceSources?: { name: string; url: string }[]
}

export const testingPolicyEffectiveDate = '2026-08-18'
export const currentTestingSourceName = 'Siilas'
export const currentTestingSourceUrl = 'https://siilas.com/test/'
export const historicalTestingNotice = '2026-08-18 前的 yp7.net 测速与测试记录仅作为历史资料，不代表当前表现'
export const mainRecommendationNames = ['Flybit', 'xxyun', '网际快车', '全球云', '拼好连', '九云', '阿达西'] as const

export const airportData: AirportData[] = [
  {
    name: '九云', path: '/posts/jiuyun-review-2026/', image: '/shouye.png',
    price: 6, priceText: '6元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash'], status: '资料已核对',
    risk: "不支持试用和退款仍据9月22日；9yun仅排除19.90/29.90元两款365天包、次数不限，截止、叠加及结算待核；当前带宽、倍率和重购余量未列",
    summary: "10月19日官网重读10款：月付6元150GB、9元300GB、16元600GB，分别3/4/5台；季18元200GB、年68元200GB各3台，年88元400GB改4台。新365天总量500GB19.90元3台、1000GB29.90元5台，不计不限时；另有36元100GB、99元300GB不限时各3台。三档月度各周期总价已读，周期每30天刷新及无试用/不退款仍据9月22日旧资料，当前列表未重述。已读Clash Verge电脑/Mac、Clash Meta安卓、Karing与Shadowrocket教程，后台另列六类导入按钮，未实操。无日期公告提示维护后更新订阅及8折券9yun；10月19日用户补充确认8折码9yun仅排除19.90元500GB和29.90元1000GB两款365天流量包，六款周期商品及36元100GB、99元300GB不限时包均可用，不限制使用次数。截止日期、优惠叠加与实际结算未核；未新增测速。",
    subscriptionClients: [
  "Shadowrocket",
  "Clash",
  "Sing-box",
  "Surge",
  "Quantumult X",
  "Surfboard"
],
    informationSources: [
  {
    "name": "九云9yun八折码适用范围与次数（用户补充确认）",
    "url": "/posts/jiuyun-review-2026/",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "九云当前10款套餐、设备及付款周期选项",
    "url": "https://216.236.63.122/#/shop",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "九云客户端目录及五篇第三方使用教程",
    "url": "https://216.236.63.122/#/knowledge",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "九云订阅菜单、维护提示及9yun优惠公告（未标发布日期）",
    "url": "https://216.236.63.122/#/dashboard",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "九云套餐商店",
    "url": "https://888.jiuyundl.com/#/shop",
    "checkedAt": "2026-09-22",
    "link": false
  },
  {
    "name": "九云客户端教程",
    "url": "https://888.jiuyundl.com/#/docs",
    "checkedAt": "2026-09-22",
    "link": false
  }
],
  },
  {
    name: '全球云', path: '/posts/quanqiuyun/', image: '/qqy.png',
    price: 20, priceText: '20元/月', traffic: '120GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['stable', 'chatgpt', 'streaming', 'newbie'], status: '主推观察',
    risk: "不支持免费试用和通用订阅仍据9月27日补充；旧优惠码与退款待核实；不限时重购余量未明确",
    summary: "2026年10月18日用户确认99元年付轻量版为59GB/月，旧正文60GB不再作为当前权益。现售月付20/40/100/180元对应120/300/700/1500GB每月，季54/108/270/486、半年102/204/510/918、年192/384/960/1728元；一次性100/360/700元对应总量100/400/800GB，另680元/月500GB专线。不限时包支持多终端团队并发但未列具体数量，重购余量与退款待核。套餐官网10月18日重读，客户端仍按10月17日文档，iOS Nextin识别码quanqiuyun、Linux仅压缩包；未新增实测。",
    informationSources: [
  {
    "name": "全球云99元年付59GB每月（用户补充确认）",
    "url": "/posts/quanqiuyun/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "全球云官网",
    "url": "https://haandiiong.gcvipaff.cc/#/?code=Hg3FRQIf",
    "checkedAt": "2026-09-11"
  },
  {
    "name": "全球云当前套餐及各周期价格（10月18日重读）",
    "url": "https://n3oplhjnm.quanqiugttt1.club/?code=Hg3FRQIf#/plans",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "全球云当前客户端下载与系统要求",
    "url": "https://vnjg4ckga.quanqiugttt1.club/?code=Hg3FRQIf#/dashboard",
    "checkedAt": "2026-10-17",
    "link": false
  },
  {
    "name": "全球云五类客户端知识库（Linux仍缺完整教程）",
    "url": "https://vnjg4ckga.quanqiugttt1.club/?code=Hg3FRQIf#/knowledge",
    "checkedAt": "2026-10-17",
    "link": false
  },
  {
    "name": "全球云试用与订阅规则（站长补充）",
    "url": "/posts/quanqiuyun/",
    "checkedAt": "2026-09-27",
    "link": false
  }
],
    performance: { evidenceLevel: null, lastTestedAt: '2026-05-30', testWindow: '21:22-21:25（UTC+8）', testRegion: '截图未标注本地地区', testNetwork: '截图未标注本地运营商与接入带宽', testDevice: '旧文记载苹果电脑，截图未独立标注设备型号', latencyMs: 82, downloadMbpsRange: '778.79Mbps（Speedtest 单次历史结果）', chatgptResult: '本组历史截图未覆盖', youtube4kResult: '3840×2160@30，连接速率44052Kbps（历史画面）', stability: '单次历史记录，不代表持续稳定性', evidenceSummary: '2026-05-30既有客户端、YouTube及Speedtest配图；Speedtest使用M1 Limited Singapore服务器，图中下载778.79Mbps、上传52.09Mbps、Ping82ms。测速图未独立显示订阅身份、本地地区和运营商，不作字母评级。', evidenceSources: [{ name: '全球云归档Speedtest原图', url: '/speedtest.png' }, { name: '全球云归档YouTube原图', url: '/youtubecesu.png' }] },
    salesSample: 1048,
  },
  { name: '光年梯', path: '/posts/guangnianti-review-2026/', image: '/gnt.png', price: 18, priceText: '18元/月', traffic: '110GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'streaming', 'newbie'], status: '资料已核对', risk: "普通套餐不支持通用订阅或免费试用，套餐不退款；GNT80适用及结算待核实；Android V7/V8文档同链", summary: "18元/月110GB起，另有89元/年50GB/月及680元/月500GB私人专线；当前常规季、半年及年付总价已逐档核对，额度仍按月、季付以上购买起每30天刷新。普通套餐标注1倍率、不限在线数量及不退款；官方客户端含Nextin识别码guangnianti和Linux文档，Android V7/V8文案仍指向同一arm64安装包。普通套餐无试用/通用订阅仍沿用9月27日站长确认，私人卡的专属订阅说明不扩为普通套餐能力。GNT80八折仅9月27日补充，本次未见代码或验证结算；线路、解锁与私人性能为商家宣传。", informationSources: [{"name": "光年梯试用规则（站长补充）", "url": "/posts/guangnianti-review-2026/", "checkedAt": "2026-09-27", "link": false}, {"name": "光年梯优惠码（站长补充）", "url": "/posts/guangnianti-review-2026/", "checkedAt": "2026-09-27", "link": false}, {"name": "光年梯套餐及各周期价格", "url": "https://vv3dbvb.guangnianertt1.homes/#/plans", "checkedAt": "2026-10-17", "link": false}, {"name": "光年梯六篇客户端知识库", "url": "https://vv3dbvb.guangnianertt1.homes/#/knowledge", "checkedAt": "2026-10-17", "link": false}, {"name": "光年梯客户端仪表盘", "url": "https://vv3dbvb.guangnianertt1.homes/#/dashboard", "checkedAt": "2026-10-17", "link": false}], performance: { evidenceLevel: null, lastTestedAt: '2026-06-03', testWindow: 'YouTube图22:38-22:39（UTC+8）；Speedtest图仅显示22:41/22:42，完整日期未显示', testRegion: '截图未标注本地地区；Speedtest服务器显示Singapore，不能当作本地地点', testNetwork: '原图未标注本地运营商与接入带宽，旧文SoftBank / 1000Mbps条件未证实', testDevice: 'Android手机界面；型号未注明', latencyMs: null, downloadMbpsRange: '365.78及367.76Mbps（两张归档Speedtest图，完整日期及所用节点未独立注明）', chatgptResult: '未取得可追溯的历史操作记录，不作结论', youtube4kResult: '2026-06-03三张画面显示3840×2160@30，连接速率36789/40480/39909Kbps；不是秒开或持续流畅的证明', stability: '单次截图不能评定持续稳定性', evidenceSummary: '撤回旧文未证实的速度区间、单一延迟和字母评级；图中可读Speedtest下载为365.78/367.76Mbps、Ping121/105ms。YouTube图有6月3日完整时间，Speedtest图无完整日期，不能把全部图视为同一节点或同条件连续测试；未独立证实ChatGPT或长期稳定性。', evidenceSources: [{ name: '光年梯归档Speedtest图一', url: '/guangnianticesu1.jpg' }, { name: '光年梯归档Speedtest图二', url: '/guangnianticesu2.jpg' }, { name: '光年梯归档YouTube图一', url: '/guangniantispeedtest1.jpg' }, { name: '光年梯归档YouTube图二', url: '/guangniantispeedtest2.jpg' }, { name: '光年梯归档YouTube图三', url: '/guangniantispeedtest3.jpg' }] }, salesSample: 832 },
  {
    name: '网际快车', path: '/posts/wangji-kuaiche-review/', image: '/kuaiche.png',
    // Cycle-plan reference price; the separate 6.8 CNY / 20GB package is a one-off purchase.
    price: 28, priceText: '28元/30天', traffic: '60GB/日（每日重置）',
    trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['stable', 'clash', 'chatgpt', 'trial'], status: '重点观察',
    risk: '日享限60GB/日；体验券yp7net的1天5GB沿用9月27日补充，本次未兑券、起算未核；旧优惠码与退款待核实',
    summary: '2026年10月17日复核：永久包6.8/24/44/78/198/368元对应20/100/200/380/1000/1980GB，一次买断用完为止；日享28元30天、68元90天、198元365天，均每日60GB、凌晨重置。多套餐按日享→月套餐→永久包顺序扣量；日享展示总量是分日额度汇总。首页提供六类平台第三方订阅菜单，软路由当前为OpenClash插件；Linux部分教程链接仍指向Windows路径，未验证安装。体验券yp7net的1天5GB沿用9月27日站长确认，当前仅查看兑换入口，未领取。',
    subscriptionClients: ['FlClash', 'Hiddify', 'SingBox', 'Karing', 'v2ray', 'v2rayNG', 'Clash Meta', 'NekoBox', 'Egern', 'Shadowrocket', 'QuantumultX', 'Clash', 'Loon', 'Surge', 'Surfboard'],
    informationSources: [
      { name: '网际快车官网', url: 'https://wjkc66.vip/?c=GDIHMU', checkedAt: '2026-09-10' },
      { name: '网际快车当前永久包、日享套餐与扣量顺序', url: 'https://zv.wj-kc.com/#/shop', checkedAt: '2026-10-17', link: false },
      { name: '网际快车六平台客户端菜单、体验券入口及10月12日公告', url: 'https://zv.wj-kc.com/#/', checkedAt: '2026-10-17', link: false },
      { name: '网际快车体验券规则（站长补充）', url: '/posts/wangji-kuaiche-review/', checkedAt: '2026-09-27', link: false },
    ],
    performance: { evidenceLevel: null, lastTestedAt: '2026-06-03', testWindow: '23:05-23:08（UTC+8），Speedtest图为15:08 GMT', testRegion: '本地地区未注明；Speedtest服务器ViewQwest Singapore，不能当作本地地点', testNetwork: '图中显示Cylix，但未标注本地接入线路、带宽或旧文SoftBank条件', testDevice: '网页测速与桌面客户端画面，具体设备未注明', latencyMs: 170, downloadMbpsRange: '13.96Mbps（2026-06-03 Speedtest单次原图），上传3.70Mbps', chatgptResult: '未取得可追溯的历史操作记录，不作结论', youtube4kResult: '2026-06-03 23:05画面显示当前3840×2160@30、连接速率46802Kbps；不能证明连续流畅', stability: '单次截图不能评定持续稳定性', evidenceSummary: '撤回旧文未证实的速度区间、单一延迟和字母评级；Speedtest图显示下载13.96Mbps、上传3.70Mbps、Ping170ms。YouTube图仅覆盖当时视频画面；两图不能证明办公、ChatGPT或长期稳定性，亦不由后来的Siilas样本替代旧记录。', evidenceSources: [{ name: '网际快车归档Speedtest原图', url: '/kuaichespeedtest.jpg' }, { name: '网际快车归档YouTube原图', url: '/kuaicheyoutube.jpg' }] },
    salesSample: 849,
  },
  { name: '光速云', path: '/posts/guangsuyun/', image: '/guangsuyun.png', price: 25, priceText: "25元/月", traffic: "168GB/月", trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'streaming'], status: '备用观察', risk: "不支持免费试用和通用订阅；退款与147元包重购规则未明确", summary: "2026年10月19日用户确认68元量子版为500GB/月；10月18日确认99元年付轻量版69GB/月。现售月付25/34/68/138元对应168/238/500/900GB；季74/96/198/398、半年94/147/375/702、年179/249/667/998元。147元一次性总247GB永久包不按月刷新，680元/月500GB为定制。重购与退款规则待核。套餐官网仍10月18日重读，客户端仍据10月17日知识库、Nextin识别码gsy、Linux仅下载包；不支持试用和通用订阅沿用9月27日确认，本次未新增实测。", informationSources: [
  {
    "name": "光速云68元量子版500GB每月（用户补充确认）",
    "url": "/posts/guangsuyun/",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "光速云99元年付69GB每月（用户补充确认）",
    "url": "/posts/guangsuyun/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "光速云旧年付及极速版额度（历史站长补充）",
    "url": "/posts/guangsuyun/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "光速云试用与订阅规则（站长补充）",
    "url": "/posts/guangsuyun/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "光速云现售7款套餐及各周期价格（10月18日重读）",
    "url": "https://fdgfds.guangsut.sbs/#/plans",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "光速云五类客户端知识库",
    "url": "https://fdgfds.guangsut.sbs/#/knowledge",
    "checkedAt": "2026-10-17",
    "link": false
  },
  {
    "name": "光速云客户端仪表盘",
    "url": "https://fdgfds.guangsut.sbs/#/dashboard",
    "checkedAt": "2026-10-17",
    "link": false
  }
], salesSample: 346 },
  {
    name: 'xxyun', path: '/posts/xxyun-review-2026/', image: '/xxyun.png',
    price: 9.99, priceText: '9.99元/月', traffic: '100GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['cheap', 'streaming'], status: '流媒体观察',
    risk: '仅官方客户端，不支持第三方通用订阅；无退款政策，不支持新疆，校园网不保证；Linux和软路由限所列系统及架构',
    summary: '2026年10月17日复核：月付9.99/19.90/39.90元，年付89.99/180/459元，对应每月100/300/1000GB；订单日月重置、不结转。不限时66.66元500GB、199元2888GB，一次买断用完为止，卡片标注不限设备。提供Android、Windows、macOS、iOS Nextin、Linux桌面/终端及x86_64 OpenWrt系官方插件的账号登录路线，仍不作为Clash通用订阅服务。iOS要求15+、识别码xxyun；Linux桌面支持所列Ubuntu/Debian amd64，终端版要求systemd 245+。新客9折码xxyun仍展示，订单未验证；购买须知明确无退款。',
    informationSources: [
      { name: 'xxyun 官网邀请入口（用户更新）', url: 'https://www.xxyun.app/?code=3AYVsSKY', checkedAt: '2026-10-22' },
      { name: 'xxyun当前月付、年付与不限时套餐', url: 'https://cloud.xxvip.shop/plan', checkedAt: '2026-10-17', link: false },
      { name: 'xxyun当前新客优惠展示及客户端下载入口', url: 'https://cloud.xxvip.shop/dashboard', checkedAt: '2026-10-17', link: false },
      { name: 'xxyun购买与退款须知', url: 'https://cloud.xxvip.shop/knowledge/20', checkedAt: '2026-10-17', link: false },
      { name: 'xxyun七类官方客户端教程目录及各端使用说明', url: 'https://cloud.xxvip.shop/knowledge', checkedAt: '2026-10-17', link: false },
      { name: 'xxyun Linux桌面客户端教程', url: 'https://cloud.xxvip.shop/knowledge/25', checkedAt: '2026-10-17', link: false },
      { name: 'xxyun x86_64官方软路由插件教程', url: 'https://cloud.xxvip.shop/knowledge/18', checkedAt: '2026-10-17', link: false },
    ],
    salesSample: 942,
  },
  {
    name: 'Flybit', path: '/posts/flybit-review-2026/', image: '/flybit.jpg',
    price: 15, priceText: '15元/月', traffic: '128GB/月',
    trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['clash', 'trial'], status: 'Clash观察',
    risk: '套餐标注不退款；协议公告残留AnyTLS；入口恢复仅为商家声明，旧订阅需按公告重新获取',
    summary: '月付15/22/28/52元对应128/192/256/512GB；192GB档季付62元，2026年10月15日用户确认。前三档标注30台设备、512GB档50台；不限时128/256/512/1024GB标价36/68/128/238元，标注不限设备、无期限。后台当前具名导入5个：Clash/Mihomo、Shadowrocket、sing-box、Stash、Quantumult X，另有通用自动识别复制及二维码；客户端下载区显示“暂无客户端”。套餐卡写Vless及Secure隧道并标注不退款；10月10日协议公告宣称全部转为Vless，但同段遗留AnyTLS，未验证实际连接。1天2GB试用仍沿用9月27日站长资料，本次未新注册核验；2026年10月15日用户补充确认，当前所有节点统一1倍率，没有其他节点或时段倍率。',
    subscriptionClients: ['Clash Meta', 'Shadowrocket', 'SingBox', 'Stash', 'QuantumultX'],
    // Keep the referral entry separate from current backend checks and the older trial confirmation.
    informationSources: [
      { name: 'Flybit 官网', url: 'https://goflybit.com/#/register?code=p3DOcgzt', checkedAt: '2026-09-09' },
      { name: 'Flybit当前后台套餐页', url: 'https://fastfastfast.best/purchase', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit192GB季付62元（用户确认）', url: '/posts/flybit-review-2026/', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit当前所有节点统一1倍率（用户确认）', url: '/posts/flybit-review-2026/', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit当前后台订阅与客户端入口', url: 'https://fastfastfast.best/portal', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit协议与历史公告（10月10日编辑）', url: 'https://fastfastfast.best/my-announcements/40', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit入口异常与订阅更新公告（商家10月11日声明）', url: 'https://fastfastfast.best/my-announcements/42', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit电脑FlClash教程（10月13日更新）', url: 'https://fastfastfast.best/my-tutorials/16', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit iOS Shadowrocket教程（10月13日更新）', url: 'https://fastfastfast.best/my-tutorials/12', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit九折码公告（未验证订单）', url: 'https://fastfastfast.best/my-announcements/1', checkedAt: '2026-10-15', link: false },
      { name: 'Flybit试用规则（站长补充）', url: '/posts/flybit-review-2026/', checkedAt: '2026-09-27', link: false },
    ],
    salesSample: 744,
  },
  { name: '阿达西', path: '/posts/adaxi-review-2026/', image: '/adaxi.png', price: 3, priceText: '3元/30天', traffic: '20GB/30天', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'clash'], status: '低价观察', risk: "充值手续费待核；入门限100Mbps、无专线；GBox目前仅Windows；无试用、退款待核；独享默认续费", summary: "3元20GB/30天、10元80GB/30天和50元300GB永久总量，限速100/500/600Mbps，设备不限且无专线。10月18日用户补充确认最低充值支持1元；3元入门套餐仍需3元账户余额，手续费及实际付款未测试。10月17日充值页默认10元、自填3元的界面观察保留原日期。新增商家称官方的Windows GBox，UID账号登录；Windows另有v2rayN，Mac v2rayN、iOS Shadowrocket/sing-box、Android Flyer保留通用订阅。当前快速导入菜单8种客户端，未调用或验证兼容。FAQ按节点昵称倍率扣量。日本独享20元/月共用套餐流量并默认自动续费。不支持试用仍据9月27日确认，退款及重购余量未明确。", subscriptionClients: ["Shadowrocket", "Sing-Box", "Stash", "Surge", "Clash", "Clash Meta", "Clash Verge", "FlClash"], informationSources: [{"name": "阿达西试用规则（站长补充）", "url": "/posts/adaxi-review-2026/", "checkedAt": "2026-09-27", "link": false}, {"name": "阿达西最低充值额（用户补充确认）", "url": "/posts/adaxi-review-2026/", "checkedAt": "2026-10-18", "link": false}, {"name": "阿达西现售套餐", "url": "https://adaxi.net/plan", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西充值输入与默认档位", "url": "https://adaxi.net/deposit", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西快速订阅菜单", "url": "https://adaxi.net/dashboard", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西Windows GBox与v2rayN教程", "url": "https://adaxi.net/doc", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西macOS教程", "url": "https://adaxi.net/doc/macos", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西iOS两类客户端教程", "url": "https://adaxi.net/doc/ios", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西Android教程", "url": "https://adaxi.net/doc/android", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西常见问题", "url": "https://adaxi.net/doc/faq", "checkedAt": "2026-10-17", "link": false}, {"name": "阿达西独享节点", "url": "https://adaxi.net/dedicated", "checkedAt": "2026-10-17", "link": false}], salesSample: 462 },
  {
    name: '拼好连', path: '/posts/runway-review-2026/', image: '/runway.png',
    price: 19.9, priceText: '19.9元/月', traffic: '50GB/月',
    trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['trial', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: '新机场账号不提供专属客户端，需第三方订阅工具；试用领取及起算方式、退款、不限时重置费及老用户锁价期限待核实',
    summary: '当前新购19.9元/月50GB、35元100GB、68元200GB、120元350GB，四档分别标200/400/800/1000Mbps；不限时70元150GB，第三方连接不限，重置费待核。公告将机场订阅与独立VPN服务分开：新注册机场用户仅提供第三方订阅，老用户客户端仍可使用；已购套餐到期前保留原价原流量，后续锁价期限及续费条件未明确。新机场试用仍为1天6GB，10月16日用户再次确认，领取渠道与起算方式待核，本次未领取或测试。旧600GB档800Mbps确认及Siilas旧9.9元100GB计分套餐仅作历史资料。',
    informationSources: [
      { name: '拼好连套餐商店', url: 'https://new.runwayhz.com/#/shop', checkedAt: '2026-10-16', link: false },
      { name: '拼好连旧600GB档限速800Mbps（用户确认）', url: '/posts/runway-review-2026/', checkedAt: '2026-10-16', link: false },
      { name: '拼好连机场与VPN分流、调价及老用户公告', url: 'https://new.runwayhz.com/#/dashboard', checkedAt: '2026-10-16', link: false },
      { name: '拼好连机场官方导航（本次打开核对）', url: 'https://www.phl2.one/', checkedAt: '2026-10-16' },
      { name: '拼好连新机场试用仍为1天6GB（用户再次确认）', url: '/posts/runway-review-2026/', checkedAt: '2026-10-16', link: false },
      { name: '拼好连此前试用规则（9月27日站长补充）', url: '/posts/runway-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '拼好连使用规则', url: 'https://new.runwayhz.com/#/docs/5', checkedAt: '2026-10-16', link: false },
      { name: '拼好连Windows FlClash教程', url: 'https://new.runwayhz.com/#/docs/2', checkedAt: '2026-10-16', link: false },
      { name: '拼好连macOS FlClash教程', url: 'https://new.runwayhz.com/#/docs/3', checkedAt: '2026-10-16', link: false },
      { name: '拼好连Android FlClash教程', url: 'https://new.runwayhz.com/#/docs/4', checkedAt: '2026-10-16', link: false },
      { name: '拼好连iOS Shadowrocket教程（含旧域名残留）', url: 'https://new.runwayhz.com/#/docs/1', checkedAt: '2026-10-16', link: false },
      { name: '拼好连此前专属客户端下载（不代表新机场账号权益）', url: 'https://down.runwayhz.com/', checkedAt: '2026-10-16' },
    ],
    salesSample: 445,
  },
  { name: '唯兔云', path: '/posts/weituyun/', image: '/weituyun.png', price: 19.9, priceText: '19.9元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming'], status: '流媒体观察', risk: '不支持免费试用和通用订阅；14.9元节假日套餐暂无定价，退款待核实', summary: '当前月付19.9元150GB起，79.9元/年45GB每月、120元/年75GB每月；不限时100元100GB、160元200GB、340元500GB。提供自有客户端，不支持免费试用和通用订阅。', informationSources: [{ name: '唯兔云试用与订阅规则（站长补充）', url: '/posts/weituyun/', checkedAt: '2026-09-27', link: false }, { name: '唯兔云套餐页', url: 'https://hjusedi.v2saat.club/#/plans', checkedAt: '2026-09-23', link: false }, { name: '唯兔云知识库', url: 'https://hjusedi.v2saat.club/#/knowledge', checkedAt: '2026-09-23', link: false }, { name: '唯兔云仪表盘', url: 'https://hjusedi.v2saat.club/#/dashboard', checkedAt: '2026-09-23', link: false }], salesSample: 221 },
  // 2026-10-17: checked 99吧 plan cards, import menu, trial/client documents and disruption notice; no new performance test.
  { name: '99吧', path: '/posts/99ba-review-2026/', image: '/99ba.png', price: 9.9, priceText: '9.9元/月', traffic: '70GB/月', trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'trial', 'clash'], status: '试用观察', risk: "10月15日公告提示近期线路不稳定；公告标题与展示时间不一致；仅限内地、不退款，先试用", summary: "9.9元月付70GB；试用文档为新账号注册成功起自动1天1GB，未新注册验证。另有35.9元111GB等一次性包、99台同时登录及999Mbps标注。当前有5类客户端导入菜单和复制Vless订阅入口，实际节点协议与表现未验证。年特惠仍展示2026-99九折码，适用范围和结算未验证。标题为2026年10月15日的公告称近期网络波动，但展示时间仍为8月7日；不据此保证恢复时间。", subscriptionClients: ['ClashX Meta', 'Hiddify Next', 'sing-box', 'Shadowrocket（后台标为Shadowsocket）', 'Stash'], informationSources: [{"name": "99吧现售套餐", "url": "https://99vpn.bar/#/plan", "checkedAt": "2026-10-17", "link": false}, {"name": "99吧试用及客户端文档", "url": "https://99vpn.bar/#/knowledge", "checkedAt": "2026-10-17", "link": false}, {"name": "99吧导入菜单及网络波动公告", "url": "https://99vpn.bar/#/dashboard", "checkedAt": "2026-10-17", "link": false}], salesSample: 413 },
  {
    name: '迅达', path: '/posts/xunda-review-2026/', image: '/xunda.png',
    price: 15, priceText: '15元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['chatgpt', 'clash'], status: '资料已核对',
    risk: '不支持退款，仅限个人使用；设备限5至20台，不支持免费试用',
    summary: '15元/月150GB起，35元300GB、50元600GB；年付169元起，流量仍按月。66元300GB、299元1200GB不限时，支持付费重置。提供Android、Windows和Mac专属客户端，Clash/ClashMeta一键导入及通用订阅；不支持免费试用。',
    subscriptionClients: ['Clash', 'ClashMeta'],
    informationSources: [{ name: '迅达试用规则（站长补充）', url: '/posts/xunda-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '迅达套餐页', url: 'https://sulianproxy.com/plan', checkedAt: '2026-09-27', link: false },
      { name: '迅达订阅入口', url: 'https://sulianproxy.com/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '迅达购买条款', url: 'https://sulianproxy.com/knowledge/1', checkedAt: '2026-09-27', link: false },
      { name: '迅达常见问题', url: 'https://sulianproxy.com/knowledge/2', checkedAt: '2026-09-27', link: false },
      { name: '迅达专属客户端下载', url: 'https://sulianproxy.com/knowledge/10', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: 'ccyz', path: '/posts/ccyz-review-2026/', image: '/ccyz.png',
    price: 16.63, priceText: '49.9元/季（约16.63元/月）', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['streaming', 'clash'], status: '资料已核对', risk: '季度起付，限5至10台设备；退款与优惠码适用范围待核实',
    summary: 'Lite 49.9元/季含150GB/月，另有170元年付；145元550GB不限时。普通套餐每月订单日重置，未用流量不累计。支持Clash、ClashMeta及通用订阅，教程使用FlClash、Clash Verge、Nextin和Shadowrocket；BGP+IEPL和解锁为商家说明。首页展示ccyz九五折码。',
    subscriptionClients: ['Clash', 'ClashMeta'],
    informationSources: [{ name: 'CCYZ套餐页', url: 'https://ccyz.uu-cc123.com/plan', checkedAt: '2026-09-27', link: false }, { name: 'CCYZ客户端与优惠说明', url: 'https://ccyz.uu-cc123.com/dashboard', checkedAt: '2026-09-27', link: false }, { name: 'CCYZ文档中心', url: 'https://ccyz.uu-cc123.com/knowledge', checkedAt: '2026-09-27', link: false }],
  },
  { name: 'uuone', path: '/posts/uuone-review-2026/', image: '/uuone.png', price: 19, priceText: '19元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['streaming', 'clash'], status: '性价比观察', risk: '不支持免费试用；退款与旧优惠码待核实；设备数量和速率因套餐不同', summary: '不支持免费试用。19元/月150GB起，29元300GB、49元800GB；99元450GB不限时。BGP套餐标注300至800Mbps、10至20台设备。教程使用Clash Verge、Clash Meta和Nextin，支持通用订阅，未见自有客户端说明。', informationSources: [{ name: 'uuone试用规则（站长补充）', url: '/posts/uuone-review-2026/', checkedAt: '2026-09-27', link: false }, { name: 'UUONE套餐页', url: 'https://uu-1.v1ppone.de/plan', checkedAt: '2026-09-23', link: false }, { name: 'UUONE使用文档', url: 'https://uu-1.v1ppone.de/knowledge', checkedAt: '2026-09-23', link: false }, { name: 'UUONE iOS教程', url: 'https://uu-1.v1ppone.de/knowledge/9', checkedAt: '2026-09-23', link: false }] },
  { name: '冲上云霄', path: '/posts/chongshangyunxiao/', image: '/csyx.png', price: 7, priceText: '7元/30天', traffic: '50GB/30天', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'clash', 'streaming'], status: '低价观察', risk: '不支持免费试用；入门限速200Mbps且无专线；退款和长周期流量重置待核实', summary: '不支持免费试用。7元/30天50GB起，30元500GB起支持IEPL；365元800GB及800元5120GB不限时。套餐不限设备，Windows与Mac教程使用v2rayN，Android使用Flyer；默认1倍率，特殊倍率按节点标注。', informationSources: [{ name: '冲上云霄试用规则（站长补充）', url: '/posts/chongshangyunxiao/', checkedAt: '2026-09-27', link: false }, { name: '冲上云霄套餐页', url: 'https://678.999865.xyz/plan', checkedAt: '2026-09-23', link: false }, { name: '冲上云霄使用文档', url: 'https://678.999865.xyz/doc', checkedAt: '2026-09-23', link: false }, { name: '冲上云霄常见问题', url: 'https://678.999865.xyz/doc/faq', checkedAt: '2026-09-23', link: false }], salesSample: 929 },
  { name: 'SSONE', path: '/posts/ssone/', image: '/ssone.png', price: 15, priceText: '15元/月', traffic: '60GB/月', trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['clash', 'trial'], status: '订阅观察', risk: '购买后不退款，新套餐覆盖旧套餐；年付超值无忧按年重置流量', summary: '15元/月60GB起，新注册账号免费体验1小时；另有80元/季300GB每月、200元/年5000GB每年。自有Windows、Mac和Android客户端，支持第三方订阅；套餐不限在线数量，峰值速率因档位不同。', informationSources: [{ name: 'SSONE套餐与购买说明', url: 'https://m.ssone.io/shop', checkedAt: '2026-09-23', link: false }, { name: 'SSONE使用文档', url: 'https://m.ssone.io/docs', checkedAt: '2026-09-23', link: false }] },
  { name: 'U1S1', path: '/posts/u1s1-review-2026/', image: '/u1s1.png', price: 20, priceText: '20元/月', traffic: '120GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'streaming', 'chatgpt', 'clash', '直播', '电商'], status: '专线观察', risk: '当前未见在售不限时套餐；定制需询价，旧优惠码与退款条件待核实', summary: '20元/月120GB起，96元年付60GB/月；常规套餐标注BGP三网优化、IEPL出口、SS协议和不限设备，AI与流媒体解锁为商家说明。提供四端客户端，600元/月起的直播或电商定制方案需咨询具体资源；本次套餐页未见在售不限时包。', informationSources: [{ name: 'U1S1套餐页', url: 'https://njdsues.u1sat.homes/#/plans', checkedAt: '2026-09-27', link: false }, { name: 'U1S1客户端入口', url: 'https://njdsues.u1sat.homes/#/dashboard', checkedAt: '2026-09-27', link: false }], performance: { evidenceLevel: null, lastTestedAt: '2026-04-04', testWindow: '12:55 CST（非晚高峰）', testRegion: '香港、美国、日本、新加坡、马来西亚、台湾、俄罗斯等多节点', testNetwork: '珠海联通 / 9Gbps / 32线程订阅测速', testDevice: 'MiaoKo 自定义测试', latencyMs: null, downloadMbpsRange: '主流节点约82-430Mbps，截图最高约780Mbps（原值 10.22-53.75MB/s，个别低速或0速节点另见截图）', chatgptResult: '历史记录未覆盖，仅有服务商宣传', youtube4kResult: '历史记录未覆盖，仅有服务商宣传', stability: '历史单次记录', evidenceSummary: '已补充 2026-04-04 MiaoKo 订阅测速截图，概要 61/61；该截图为非晚高峰单次历史记录，当前表现请查看 Siilas。', evidenceSources: [{ name: 'U1S1归档订阅测速原图', url: '/U1S1CS.png' }] }, salesSample: 82 },
  { name: '奈云', path: '/posts/naiyun-review-2026/', image: '/naiyun.png', price: 28, priceText: '历史28元/月', traffic: '历史388GB/月', trial: false, noExpiry: false, dedicatedClient: false, universalSubscription: false, scenarios: [], status: '停止推荐', risk: '2026年6月下旬外部预警显示官网异常、客服失联、节点不可用和订阅失效，暂停新购续费', summary: '2026年6月下旬出现多项高风险信号，当前仅保留风险记录，不再作为推荐候选。', salesSample: 774 },
  { name: '隐云', path: '/posts/yinyun-review-2026/', image: '/yinyun.png', price: 29, priceText: '29元/月参考价（首购季付起）', traffic: '专属模式不限流量；通用模式150GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'clash'], status: '备用观察', risk: '轻量版首购季付起；两种模式限制不同；不支持免费试用，退款待核实', summary: '不支持免费试用。轻量、标准、高级版月价参考29/49/99元。专属模式不限流量，分别限2/5/10台设备；通用模式不限设备，分别150/400/1024GB每月。专属模式标注不可降级，轻量首次需季付。', informationSources: [{ name: '隐云试用规则（站长补充）', url: '/posts/yinyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '隐云购买页', url: 'https://103.238.130.44:2026/purchase', checkedAt: '2026-09-23', link: false }, { name: '隐云仪表盘', url: 'https://103.238.130.44:2026/dashboard', checkedAt: '2026-09-23', link: false }] },
  {
    name: 'cocoduck', path: '/posts/cocoduck-review/', image: '/cocoduck.png',
    price: 17, priceText: '17元/月', traffic: '100GB/月',
    trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: true,
    scenarios: ['streaming', 'trial', 'clash'], status: '资料已核对', risk: '试用无人工支持；加油包需搭配常规套餐，旧客户端需确认兼容性',
    summary: '17元/月100GB起，77元年付迷你鸭含40GB/月；新用户1天2GB免费体验。自有Android、Android TV、Windows和macOS客户端，iOS专属客户端仍开发中，可用第三方订阅。提供Clash主备订阅、Shadowrocket、Quantumult、Stash和V2Ray；9月5日公告称DNS问题修复，建议更新订阅。',
    subscriptionClients: ['Clash', 'Shadowrocket', 'Quantumult', 'Stash', 'V2Ray'],
    informationSources: [{ name: 'COCODUCK套餐与加油包', url: 'https://dash.cocoduck.live/user/product', checkedAt: '2026-09-27', link: false }, { name: 'COCODUCK客户端与试用公告', url: 'https://dash.cocoduck.live/user', checkedAt: '2026-09-27', link: false }],
    salesSample: 280,
  },
  { name: 'XSUS', path: '/posts/xsus-review-2026/', image: '/xsus.png', price: 12, priceText: '12元/月', traffic: '168GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'streaming', 'clash'], status: '性价比观察', risk: '无法原路退款；流量不叠加，续费不立即重置；不支持免费试用', summary: '不支持免费试用。12元/月168GB起，65元188GB起不限时包，另有52元/季50GB每月的IEPL套餐。最多5个IP，同网络多设备算1个IP；支持专用客户端及第三方订阅。', subscriptionClients: ['Clash', 'sing-box', 'Shadowrocket', 'Loon'], informationSources: [{ name: 'XSUS试用规则（站长补充）', url: '/posts/xsus-review-2026/', checkedAt: '2026-09-27', link: false }, { name: 'XSUS套餐与购买须知', url: 'https://xsus.cloud/plan', checkedAt: '2026-09-23', link: false }, { name: 'XSUS帮助中心', url: 'https://xsus.cloud/knowledge', checkedAt: '2026-09-23', link: false }, { name: 'XSUS仪表盘', url: 'https://xsus.cloud/dashboard', checkedAt: '2026-09-23', link: false }] },
  { name: '坦克云（原坦克加速）', path: '/posts/tank-review-2026/', image: '/tankejiasu.png', price: 9.9, priceText: '9.9元/月', traffic: '80GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'clash', 'trial'], status: '新手观察', risk: '入门限1台设备与IP；退款与旧优惠码待核实', summary: '支持1天200GB免费试用。9.9元/月80GB起；另有49元/月不限流量、50元100GB及199元500GB不限时。官方客户端支持Windows、Android、Mac、Linux，iOS使用第三方客户端。', subscriptionClients: ['Clash', 'Surge', 'Shadowrocket', 'Surfboard', 'Quantumult X'], informationSources: [{ name: '坦克云试用规则（站长补充）', url: '/posts/tank-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '坦克云套餐页', url: 'https://aa.tankejiasu.com/#/stage/buysubs', checkedAt: '2026-09-23', link: false }, { name: '坦克云使用文档', url: 'https://aa.tankejiasu.com/#/stage/knowledge', checkedAt: '2026-09-23', link: false }, { name: '坦克云仪表盘', url: 'https://aa.tankejiasu.com/#/stage/dashboard', checkedAt: '2026-09-23', link: false }, { name: '坦克云官网邀请入口（用户更新）', url: 'https://kele.tankeyun.com/#/register?code=hZKUg7Sw', checkedAt: '2026-10-18' }], salesSample: 219 },
  { name: '瞬云', path: '/posts/shunyun-review-2026/', image: '/shunyun.png', price: 18, priceText: '18元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['streaming', 'clash'], status: '资料已核对', risk: '不支持免费试用和退款；周期套餐仅限个人使用，旧优惠码待核实', summary: '不支持免费试用。18元/月150GB起，99元年付59GB/月；不限时260元2000GB、600元5000GB，不自动重置，手动重置为原价90%。官方Android、Windows和macOS客户端，iOS可用Clash Mi或Shadowrocket等第三方订阅。ANYCAST、原生IP、最高2.5Gbps及解锁属于商家说明。', informationSources: [{ name: '瞬云试用规则（站长补充）', url: '/posts/shunyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '瞬云套餐商店', url: 'https://syjccloud.com/#/shop', checkedAt: '2026-09-27', link: false }, { name: '瞬云客户端文档', url: 'https://syjccloud.com/#/docs', checkedAt: '2026-09-27', link: false }, { name: '瞬云官方客户端教程', url: 'https://syjccloud.com/#/docs/6', checkedAt: '2026-09-27', link: false }, { name: '瞬云维护公告', url: 'https://syjccloud.com/#/dashboard', checkedAt: '2026-09-27', link: false }], performance: { evidenceLevel: null, lastTestedAt: '2026-05-09', testWindow: '16:58 CST（非晚高峰）', testRegion: '香港、台湾、美国、日本、新加坡等多节点', testNetwork: '广东佛山联通 / 2Gbps / 8线程订阅测速', testDevice: 'MiaoKo 自定义测试', latencyMs: null, downloadMbpsRange: '约144-2096Mbps（截图原值 17.96-262.06MB/s，低速节点另见截图）', chatgptResult: '历史记录未覆盖', youtube4kResult: '历史记录未覆盖', stability: '历史单次记录', evidenceSummary: '已补充 2026-05-09 MiaoKo 订阅测速截图；该截图为非晚高峰单次历史记录，当前表现请查看 Siilas。', evidenceSources: [{ name: '瞬云归档订阅测速原图', url: '/shunyuncesu.jpg' }] }, salesSample: 128 },
  { name: '极连云', path: '/posts/jilianyun-review-2026/', image: '/jilianyun.png', price: 18, priceText: '18元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['stable'], status: '稳定观察', risk: "不支持免费试用和通用订阅；不退款；重置后额度与余量处理未列", summary: "18元/月100GB起，96元/年60GB每月；不限时为399元600GB，9月27日站长补充确认。10月20日用户确认重置费为对应套餐费用90%，399元档为359.10元，旧612元说明不再作为现行费用；重置后额度与余量处理未列。提供自有客户端，不支持免费试用和通用订阅；套餐标注IPLC、1倍率及不限客户端数量。官网套餐与客户端仍据9月23日资料，未新增实测。", informationSources: [
  {
    "name": "极连云重置费为对应套餐费用90%（用户确认）",
    "url": "/posts/jilianyun-review-2026/",
    "checkedAt": "2026-10-20",
    "link": false
  },
  {
    "name": "极连云不限时价格与流量（站长补充）",
    "url": "/posts/jilianyun-review-2026/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "极连云试用与订阅规则（站长补充）",
    "url": "/posts/jilianyun-review-2026/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "极连云套餐页",
    "url": "https://roasa.jilianat.homes/#/plans",
    "checkedAt": "2026-09-23",
    "link": false
  },
  {
    "name": "极连云知识库",
    "url": "https://roasa.jilianat.homes/#/knowledge",
    "checkedAt": "2026-09-23",
    "link": false
  }
] },
  { name: '二猫云', path: '/posts/ermiao-vpn-review/', image: '/ermaoyun.png', price: 20, priceText: '20元/月', traffic: '130GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'clash', 'chatgpt', 'streaming', 'newbie'], status: '专线观察', risk: "退款及旧优惠码待核；美国家宽IP为客服定制，购前咨询商定；普通总量包补量费用及余量处理未列", summary: "10月18日用户确认以卡片报价和付款周期为准：月付20/40/80/160元对应130/230/430/850GB；季57/114/228/456、半年108/216/432/864、年204/408/816/1632元，按卡片整笔金额比较，不套旧宣传折扣。年付小包96元60GB/月；不限时100元100GB及199元200GB，可补量但费用未明。10月20日用户确认美国家庭原生宽带IP为客服沟通后定制服务，购买前咨询客服；700元一次性付款、月500GB仅为卡片展示，资源、服务周期、流量刷新、费用与交付按商定方案，不能当作固定自助套餐承诺。官网全量8款仍10月18日重读，试用1天200GB据9月26日补充、客户端据9月23日；未新增实测。", informationSources: [
  {
    "name": "二猫云美国家宽IP为客服定制、购前咨询（用户确认）",
    "url": "/posts/ermiao-vpn-review/",
    "checkedAt": "2026-10-20",
    "link": false
  },
  {
    "name": "二猫云以卡片报价与付款周期为准（用户补充确认）",
    "url": "/posts/ermiao-vpn-review/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "二猫云1天200GB试用（9月26日站长补充）",
    "url": "/posts/ermiao-vpn-review/",
    "checkedAt": "2026-09-26",
    "link": false
  },
  {
    "name": "二猫云当前8款套餐及各周期报价（官网重读）",
    "url": "https://samejob.maomaotoo.autos/#/plans",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "二猫云帮助中心",
    "url": "https://network.ermaotztz3.homes/#/knowledge",
    "checkedAt": "2026-09-23",
    "link": false
  },
  {
    "name": "二猫云客户端下载",
    "url": "https://network.ermaotztz3.homes/#/dashboard",
    "checkedAt": "2026-09-23",
    "link": false
  }
], performance: { evidenceLevel: null, lastTestedAt: '2026-06-30', testWindow: '14:58 CST（非晚高峰）', testRegion: '香港、台湾、日本、新加坡、美国多节点', testNetwork: '珠海联通 / 9Gbps / 32线程订阅测速', testDevice: 'MiaoKo 自定义测试', latencyMs: null, downloadMbpsRange: '约273-2130Mbps（截图原值 34.10-266.19MB/s）', chatgptResult: '历史记录未覆盖', youtube4kResult: '历史记录未覆盖', stability: '历史单次记录', evidenceSummary: '已补充 2026-06-30 MiaoKo 订阅测速截图；该截图为非晚高峰单次历史记录，当前表现请查看 Siilas。', evidenceSources: [{ name: '二猫云归档订阅测速原图', url: '/ermaoyuncesu.png' }] }, salesSample: 191 },
  {
    name: '寰宇云', path: '/posts/huanyuyun-review-2026/', image: '/huanyuyun.png',
    price: 18, priceText: '18元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['stable', 'clash'], status: '资料已核对',
    risk: '售出不退款；不支持免费试用；旧优惠码待核实',
    summary: '不支持免费试用。18元/月150GB起，79元年付60GB/月；不限时158元1000GB、368元3000GB。周期套餐流量不累计，不限在线设备；提供Android、Windows和macOS官方客户端以及通用订阅，iOS有Nextin、Shadowrocket教程。原生IP、平台解锁和晚高峰不降速均为商家说明。',
    subscriptionClients: ['Clash', 'Nekoray', 'ClashX Meta', 'Stash'],
    informationSources: [{ name: '寰宇云试用规则（站长补充）', url: '/posts/huanyuyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '寰宇云套餐商店', url: 'https://hyy.52kok.cn/#/shop', checkedAt: '2026-09-27', link: false }, { name: '寰宇云订阅入口', url: 'https://hyy.52kok.cn/#/dashboard', checkedAt: '2026-09-27', link: false }, { name: '寰宇云客户端文档', url: 'https://hyy.52kok.cn/#/docs', checkedAt: '2026-09-27', link: false }, { name: '寰宇云官方客户端教程', url: 'https://hyy.52kok.cn/#/docs/1', checkedAt: '2026-09-27', link: false }],
  },
  {
    name: '一翻云', path: '/posts/yifanyun-review-2026/', image: '/yifanyun.png',
    price: 20, priceText: '20元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['newbie'], status: '资料已核对',
    risk: '不支持免费试用和通用订阅；退款和旧优惠码待核实；中秋限定套餐停售时间未注明',
    summary: '20元/月150GB起，98元年付每月60GB；中秋限定50元50GB不限时，常规100元100GB起。Android、Windows与Mac提供专属客户端，iOS文档使用Nextin及识别码1fly0404；不支持免费试用和通用订阅，线路与解锁为商家宣传。',
    informationSources: [
      { name: '一翻云试用与订阅规则（站长补充）', url: '/posts/yifanyun-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '一翻云套餐页', url: 'https://ngfi2bnfn.1fyohnzt.xyz/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '一翻云客户端下载', url: 'https://ngfi2bnfn.1fyohnzt.xyz/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '一翻云客户端帮助中心', url: 'https://ngfi2bnfn.1fyohnzt.xyz/#/knowledge', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: 'sogo', path: '/posts/sogo-review-2026/', image: '/sogo.png',
    price: 25, priceText: '25元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['newbie'], status: '资料已核对',
    risk: '不支持免费试用和通用订阅；退款及旧优惠码待核实；重置后的余量处理与交付规则未明确',
    summary: '不支持免费试用和通用订阅。25元/月150GB起，98元年付每月60GB，周期流量每30天刷新。10月18日用户确认采用卡片价格，重置费用为卡片价90%：不限时120/220/450/850元对应总量120/250/500/1000GB，重置108/198/405/765元；入门首次标价1.000元/GB。旧说明100元售价、90元重置仅历史。基础月付25元按同一规则折算重置22.50元，旧订单22元不再作为现行报价；长周期具体重置基数未扩展。四端官方客户端，iOS Nextin识别码sogoyun。',
    informationSources: [
      { name: 'sogo卡片价格与九折重置费（用户补充确认）', url: '/posts/sogo-review-2026/', checkedAt: '2026-10-18', link: false },
      { name: 'sogo试用与订阅规则（站长补充）', url: '/posts/sogo-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: 'sogo套餐商店', url: 'https://afasfw.sogotztz2.sbs/#/plans', checkedAt: '2026-09-27', link: false },
      { name: 'sogo基础版价格详情', url: 'https://afasfw.sogotztz2.sbs/#/order/1?period=month_price', checkedAt: '2026-09-27', link: false },
      { name: 'sogo客户端下载', url: 'https://afasfw.sogotztz2.sbs/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: 'sogo客户端教程', url: 'https://afasfw.sogotztz2.sbs/#/knowledge', checkedAt: '2026-09-27', link: false },
    ],
    salesSample: 419,
  },
  {
    name: '速界', path: '/posts/sujie-review-2026/', image: '/sujie.png',
    price: 15, priceText: '15元/月', traffic: '50GB/月',
    trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: false,
    scenarios: ['streaming', 'newbie', 'trial'], status: '资料已核对',
    risk: '免费试用1天50GB需注册后联系客服领取；15元月付体验另为付费套餐且不参加优惠；不支持通用订阅；退款待核实；光速版流量说明冲突',
    summary: '注册后联系客服可领取1天50GB免费试用。限时月付体验15元50GB为另一付费套餐，90元年付每月50GB；常规25元120GB、50元250GB、100元卡片500GB、200元1000GB。提供四端客户端，iOS使用Nextin识别码speedworld0526。不支持通用订阅，退款及旧优惠码待核实。',
    informationSources: [
      { name: '速界试用与订阅规则（站长补充）', url: '/posts/sujie-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '速界套餐商店', url: 'https://utyimn.azjstq.xyz/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '速界客户端下载', url: 'https://utyimn.azjstq.xyz/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '速界客户端教程', url: 'https://utyimn.azjstq.xyz/#/knowledge', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: '边缘节点', path: '/posts/bianyuan-review-2026/', image: '/bianyuan.png',
    price: 15, priceText: '15元/月', traffic: '50GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['streaming', 'chatgpt', 'newbie'], status: '资料已核对',
    risk: "月付体验不参加优惠；不支持免费试用和通用订阅，退款待核实；重置后额度与余量处理未列",
    summary: "限时体验15元/月50GB，标准22元/月120GB；98元年付每月45GB，不限时100元100GB或399元450GB。10月20日用户确认重置费用为对应套餐费用90%，两档不限时分别为90元、359.10元，不再采用旧100元基数套算450GB档；重置后额度与余量处理未列。常规套餐展示xk808八折码，体验月付不参加。提供四端客户端，iOS使用Nextin识别码edgenova0526；不支持免费试用和通用订阅。官网套餐与客户端仍据9月27日资料，未新增实测。",
    informationSources: [
  {
    "name": "边缘节点重置费为对应套餐费用90%（用户确认）",
    "url": "/posts/bianyuan-review-2026/",
    "checkedAt": "2026-10-20",
    "link": false
  },
  {
    "name": "边缘节点试用与订阅规则（站长补充）",
    "url": "/posts/bianyuan-review-2026/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "边缘节点套餐与优惠说明",
    "url": "https://zvbghs02.ztymforedge.lol/#/plans",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "边缘节点客户端下载",
    "url": "https://zvbghs02.ztymforedge.lol/#/dashboard",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "边缘节点客户端教程",
    "url": "https://zvbghs02.ztymforedge.lol/#/knowledge",
    "checkedAt": "2026-09-27",
    "link": false
  }
],
  },
  {
    name: '宇宙云', path: '/posts/yuzhoucloud-review-2026/', image: '/yuzhouyun.png',
    price: 25, priceText: '25元/月', traffic: '160GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'clash'], status: '资料已核对',
    risk: '不支持免费试用；退款及旧优惠码待核实；周期重置费基数与补流量费用需确认',
    summary: '不支持免费试用。25元/月160GB起，96元年付每月60GB，不限时110元120GB起。提供四端客户端及Clash Mi手动导入教程；iOS自研模式使用Nextin识别码yuzhouyun0405。220元不限时包提供240GB总流量，9月27日站长补充确认；周期重置9折的基数及补流量费用需确认。',
    informationSources: [
      { name: '宇宙云220元不限时额度（站长补充）', url: '/posts/yuzhoucloud-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '宇宙云试用规则（站长补充）', url: '/posts/yuzhoucloud-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '宇宙云套餐商店', url: 'https://tlsmvchy.yuzhoutttt3.click/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '宇宙云客户端下载', url: 'https://tlsmvchy.yuzhoutttt3.click/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '宇宙云客户端与Clash Mi教程', url: 'https://tlsmvchy.yuzhoutttt3.click/#/knowledge', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: '快狸', path: '/posts/kuaili-review-2026/', image: '/kuaili.png',
    price: 15, priceText: '15元/月', traffic: '50GB/月',
    trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'chatgpt', 'clash', 'streaming'], status: '客户端观察',
    risk: '不支持免费试用；季付与年付优惠文案需核对；退款及旧优惠码待核实',
    summary: '不支持免费试用。15元月付50GB起，120元年付30GB/月；22元100GB、35元250GB、95元500GB、180元1000GB月付，周期流量每30天刷新。提供四平台客户端，iOS使用Nextin识别码kuaili0421，并有Clash Mi订阅导入教程。夜狸季付290元高于三个月月付285元，年付并非统一8折；IEPL、解锁与不限设备为商家说明。',
    informationSources: [
      { name: '快狸试用规则（站长补充）', url: '/posts/kuaili-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '快狸套餐页', url: 'https://m3lop.ztfxkl.xyz/#/plans', checkedAt: '2026-09-26', link: false },
      { name: '快狸帮助中心', url: 'https://m3lop.ztfxkl.xyz/#/knowledge', checkedAt: '2026-09-26', link: false },
      { name: '快狸客户端下载', url: 'https://m3lop.ztfxkl.xyz/#/dashboard', checkedAt: '2026-09-26', link: false },
    ],
  },
  {
    name: '可信云', path: '/posts/kexinyun-review-2026/', image: '/kexinyun.png',
    price: 15, priceText: '15元/月', traffic: '60GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['stable'], status: '资料已核对',
    risk: '不支持免费试用和通用订阅；退款待核实；50GB不限时包不参加优惠活动',
    summary: '15元/月60GB起，96元年付60GB/月；标准档50元/月300GB，新增50元一次性50GB不限时。自有桌面和Android客户端，iOS使用Nextin及识别码kosing0404；套餐标注不限设备。IEPL、原生IP及流媒体AI解锁为商家说明，不支持免费试用和通用订阅，退款待核实。',
    informationSources: [{ name: '可信云试用与订阅规则（站长补充）', url: '/posts/kexinyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '可信云套餐页', url: 'https://aass.kexintztz2.sbs/#/plans', checkedAt: '2026-09-27', link: false }, { name: '可信云客户端下载', url: 'https://aass.kexintztz2.sbs/#/dashboard', checkedAt: '2026-09-27', link: false }, { name: '可信云帮助中心', url: 'https://aass.kexintztz2.sbs/#/knowledge', checkedAt: '2026-09-27', link: false }],
  },
  {
    name: '星岛梦', path: '/posts/xingdaomeng-review-2026/', image: '/xingdaomeng.png',
    price: 25, priceText: '25元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['streaming'], status: '资料已核对', risk: '年付与一次性包规则不同；旧优惠码与退款条件待核实',
    summary: '月付25元150GB起，96元年付小包含60GB/月；不限时100元100GB、300元300GB、600元1TB，不自动重置，手动重置为原价90%。提供四端客户端；1倍率、不限设备、IPLC或IEPL、最高2.5Gbps及解锁能力均为套餐说明。',
    informationSources: [{ name: '星岛梦套餐页', url: 'https://rweqr.xdmttt4.click/#/plans', checkedAt: '2026-09-27', link: false }, { name: '星岛梦客户端入口', url: 'https://rweqr.xdmttt4.click/#/dashboard', checkedAt: '2026-09-27', link: false }, { name: '星岛梦客户端知识库', url: 'https://rweqr.xdmttt4.click/#/knowledge', checkedAt: '2026-09-27', link: false }],
  },
  {
    name: '隐形人', path: '/posts/yinxingren-review-2026/', image: '/shouye.png',
    price: 24, priceText: '24元/月', traffic: '144GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['newbie', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持试用和通用订阅，退款待核实；全部套餐不限设备数量已由10月18日用户确认",
    summary: "24元/月144GB起，109元年付80GB/月；不限时229元160GB、549元420GB、1199元1000GB。2026年10月18日用户确认全部套餐不限设备数量，三档不限时旧1/2/3台说明仅历史。Android/Windows/Mac官方客户端及iOS Nextin识别码yxr仍据9月26日教程；不支持试用和通用订阅。保留9月26日用户晚间单次测速截图，专线、AI及流媒体宣传不作实测结论。",
    informationSources: [
  {
    "name": "隐形人全部套餐不限设备（用户补充确认）",
    "url": "/posts/yinxingren-review-2026/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "隐形人套餐页",
    "url": "https://wpkhf.invisibleattt.sbs/#/plans",
    "checkedAt": "2026-09-26",
    "link": false
  },
  {
    "name": "隐形人帮助中心",
    "url": "https://wpkhf.invisibleattt.sbs/#/knowledge",
    "checkedAt": "2026-09-26",
    "link": false
  },
  {
    "name": "隐形人客户端下载",
    "url": "https://wpkhf.invisibleattt.sbs/#/dashboard",
    "checkedAt": "2026-09-26",
    "link": false
  },
  {
    "name": "用户提供的隐形人单次测速截图",
    "url": "/yinxingren-speedtest-2026-09-26.jpg",
    "checkedAt": "2026-09-26"
  }
],
  },
  {
    name: '闪电鼠', path: '/posts/shandianshu-review-2026/', image: '/shouye.png',
    price: 22, priceText: '22元/月', traffic: '120GB/月',
    trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false,
    scenarios: ['newbie', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: '不支持免费试用和通用订阅；退款待核实；首购优惠适用范围需核对',
    summary: '不支持免费试用和通用订阅。22元月付120GB起，另有40元250GB、70元500GB月付及96元年付60GB/月；流量每30天重置。提供四平台客户端教程，iOS使用Nextin识别码sd88。公告列出新用户首购7折码sd88，未验证适用套餐与叠加条件；专线、解锁及不限设备为商家说明。',
    informationSources: [
      { name: '闪电鼠试用与订阅规则（站长补充）', url: '/posts/shandianshu-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '闪电鼠套餐页', url: 'https://www2.shandiantt.xyz/#/plans', checkedAt: '2026-09-26', link: false },
      { name: '闪电鼠使用教程', url: 'https://www2.shandiantt.xyz/#/knowledge', checkedAt: '2026-09-26', link: false },
      { name: '闪电鼠下载中心', url: 'https://www2.shandiantt.xyz/#/downloads', checkedAt: '2026-09-26', link: false },
      { name: '闪电鼠新人优惠公告', url: 'https://www2.shandiantt.xyz/#/dashboard', checkedAt: '2026-09-26', link: false },
    ],
  },
  {
    name: '环球梯', path: '/posts/huanqiuti-review-2026/', image: '/shouye.png',
    price: 23, priceText: '23元/月', traffic: '120GB/月',
    trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false,
    scenarios: ['newbie', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: '按量包详情限365天，与卡片终身标签不同；不支持免费试用和通用订阅，退款待核实',
    summary: '不支持免费试用和通用订阅。23元月付120GB起，96元年付60GB/月；39元240GB、69元600GB月付，设备分别限3、5、10台。按量包99元80GB、299元400GB，有效期均为365天，不属于不限时套餐。提供四平台客户端教程，iOS使用Nextin识别码HQ66。公告七折码HQ66限2000份、每人一次、不可叠加，截止2026年11月30日，结算与余量未验证；流媒体和AI支持为商家说明。',
    informationSources: [
      { name: '环球梯试用与订阅规则（站长补充）', url: '/posts/huanqiuti-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '环球梯套餐页', url: 'https://www2.huanqiutitt.xyz/#/plans', checkedAt: '2026-09-26', link: false },
      { name: '环球梯客户端教程', url: 'https://www2.huanqiutitt.xyz/#/knowledge', checkedAt: '2026-09-26', link: false },
      { name: '环球梯客户端下载与优惠公告', url: 'https://www2.huanqiutitt.xyz/#/dashboard', checkedAt: '2026-09-26', link: false },
    ],
  },
  {
    name: '跨界云', path: '/posts/kuajieyun-review-2026/', image: '/shouye.png',
    price: 20, priceText: '20元/月', traffic: '120GB/月',
    trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'chatgpt', 'streaming', 'trial', 'clash'], status: '资料已核对',
    risk: '20GB试用需注册后联系客服领取，期限未说明；通用订阅需购买订阅后联系客服领取；退款待核实，不限时包不参与优惠，中秋老用户套餐停售日期未明确',
    summary: '20元月付120GB起，另有40元330GB、90元830GB、130元1800GB月付；96元年付60GB/月、150元年付100GB/月。不限时200元300GB，180元重置且不参与优惠；40元50GB中秋包仅限老用户，具体停售日期未明确。注册后可向在线客服领取20GB试用，期限未说明；通用订阅需购买订阅后联系在线客服领取。提供Android、Windows、Mac客户端，iOS使用Nextin识别码kjy。普通周期套餐描述年付8折、两年付7折、三年付6折，本次未核实可用优惠码；AI与流媒体能力为商家说明，退款待核实。',
    informationSources: [
      { name: '跨界云试用与通用订阅规则（站长补充）', url: '/posts/kuajieyun-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '跨界云套餐页', url: 'https://kasoasf.kuajiecloudtttt.mom/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '跨界云客户端教程', url: 'https://kasoasf.kuajiecloudtttt.mom/#/knowledge', checkedAt: '2026-09-27', link: false },
      { name: '跨界云客户端下载', url: 'https://kasoasf.kuajiecloudtttt.mom/#/dashboard', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: 'Edge-X', path: '/posts/edge-x-review-2026/', image: '/shouye.png',
    price: 22.8, priceText: '22.8元/月', traffic: '200GB/月',
    trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: '不支持免费试用；普通订阅需关闭DNS覆写，特殊网络按专用教程；全年流量包不退款；月付退款须流量≤5GB、支付宝付款及生效未满12小时同时满足并提交工单；优惠叠加与结算未验证',
    summary: '22.8元月付200GB起，另有34.8元300GB、64.8元600GB月付，按每月订单日重置；全年总量800GB年付168元、1600GB年付268元、3600GB年付468元，按每年订单日重置且不退款，不属于不限时套餐。提供四端客户端，iOS合作客户端Nextin识别码为edgex，并提供Clash、Surge、Surfboard、Stash通用订阅入口；普通订阅需关闭DNS覆写，特殊网络按专用教程；Shadowrocket、Quantumult X和Loon需按各自教程导入配置。IEPL、平峰1倍率/闲时0.5倍率、境外接入、AI与流媒体支持均为商家说明，闲时时间范围未明确；不支持免费试用。',
    informationSources: [
      { name: 'Edge-X试用规则（站长补充）', url: '/posts/edge-x-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: 'Edge-X套餐商店', url: 'https://edgex-net.com/#/shop', checkedAt: '2026-09-27', link: false },
      { name: 'Edge-X官方客户端教程', url: 'https://edgex-net.com/#/knowledge/1', checkedAt: '2026-09-27', link: false },
      { name: 'Edge-X新用户必读与退款规则', url: 'https://edgex-net.com/#/knowledge/4', checkedAt: '2026-09-27', link: false },
      { name: 'Edge-X第三方客户端与境外订阅教程', url: 'https://edgex-net.com/#/knowledge/5', checkedAt: '2026-09-27', link: false },
      { name: 'Edge-X客户端、订阅入口与活动公告', url: 'https://edgex-net.com/#/dashboard', checkedAt: '2026-09-27', link: false },
    ],
  },
  {
    name: '闪跃', path: '/posts/shanyue-review-2026/', image: '/shouye.png',
    price: 24, priceText: '24元/月', traffic: '150GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；Clash订阅需联系客服；退款待核；不限时包重置后额度、余量处理和设备限制待核",
    summary: "10月20日官网重读8款套餐与各周期报价：月付24/44/84/134元对应150/300/600/1000GB，年付96元60GB/月、180元120GB/月。不限时150元100GB、288元200GB仍与10月18日用户确认首次交付一致，首次标价1.500/1.440元每GB；当前重置选项130/268元，两种报价预览仍显示0GB，原因未明，不作为实际交付量；重置后额度与余量处理未列。六款周期套餐正文不限客户端、1倍率/IPLC等为商家说明；不限时设备限制未列。四端客户端、iOS Nextin识别码sywl仍据9月27日资料，无试用及客服Clash也据同日补充；退款待核，未提交订单或新增实测。",
    informationSources: [
  {
    "name": "闪跃不限时包首次交付量（用户补充确认）",
    "url": "/posts/shanyue-review-2026/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "闪跃试用与Clash订阅规则（站长补充）",
    "url": "/posts/shanyue-review-2026/",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "闪跃当前8款套餐及各周期报价（官网重读）",
    "url": "https://kkj.flashleaptt.xyz/#/plans",
    "checkedAt": "2026-10-20",
    "link": false
  },
  {
    "name": "闪跃两档不限时包列表与一次性/重置报价预览（未提交订单）",
    "url": "https://kkj.flashleaptt.xyz/?code=msdAwmER#/plans",
    "checkedAt": "2026-10-20",
    "link": false
  },
  {
    "name": "闪跃四端客户端知识库",
    "url": "https://kkj.flashleaptt.xyz/#/knowledge",
    "checkedAt": "2026-09-27",
    "link": false
  },
  {
    "name": "闪跃官方客户端下载",
    "url": "https://kkj.flashleaptt.xyz/#/dashboard",
    "checkedAt": "2026-09-27",
    "link": false
  }
],
  },
  {
    name: "无忧链接", path: "/posts/wuyoulianjie-review-2026/", image: '/shouye.png',
    price: 19, priceText: '19元/月', traffic: '100GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['chatgpt', 'streaming', 'newbie', 'clash'], status: '资料已核对',
    risk: "不支持免费试用；通用订阅需向客服索取；退款、设备限制及具体订阅格式待核实；定制套餐需先联系客服",
    summary: "当前可见月付19元100GB起，另有79元年付40GB/月；98元100GB、288元300GB一次性不限时包。官网提供四端客户端，Android以官网账号登录，iOS使用Nextin、专属码wylj。IPLC及AI、流媒体支持为商家说明，未新增实测；2026年9月28日站长补充确认不支持免费试用，通用订阅可向客服索取，具体格式和退款仍需核实。",
    informationSources: [
      { name: '无忧链接套餐页', url: 'https://iwerer.worryfreettt.xyz/#/plans', checkedAt: '2026-09-28', link: false },
      { name: '无忧链接客户端教程', url: 'https://iwerer.worryfreettt.xyz/#/knowledge', checkedAt: '2026-09-28', link: false },
      { name: '无忧链接官网邀请入口', url: 'https://haandiiong.worryfreeaff.com/#/?code=h5MSQqsL', checkedAt: '2026-09-28' },
      { name: '无忧链接试用与订阅规则（站长补充）', url: '/posts/wuyoulianjie-review-2026/', checkedAt: '2026-09-28', link: false },
    ],
  },
  {
    name: "榴莲云", path: "/posts/liulianyun-review-2026/", image: '/shouye.png',
    price: 24, priceText: '24元/月', traffic: '140GB/月',
    trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: true,
    scenarios: ['chatgpt', 'streaming', 'newbie', 'clash'], status: '资料已核对',
    risk: "不支持免费试用；通用订阅需购买后向客服领取，具体格式与客户端兼容先确认；退款待核实；ll88七折码适用及叠加条件需确认",
    summary: "不支持免费试用；通用订阅需购买订阅后向客服领取，具体格式与客户端兼容先确认。可见最低月付24元140GB，40元260GB、60元420GB、100元750GB；96元年付提供60GB/月，购买日起每30天刷新，不限同时使用客户端数量。四端账号登录客户端，iOS Nextin专属码lly；公告展示ll88七折码，结算未验证。IPLC及原生IP、AI与流媒体为商家说明。",
    informationSources: [
      { name: '榴莲云试用与订阅规则（站长补充）', url: '/posts/liulianyun-review-2026/', checkedAt: '2026-09-28', link: false },
      { name: '榴莲云套餐页', url: 'https://www2.liulianyuntt.xyz/#/plans', checkedAt: '2026-09-28', link: false },
      { name: '榴莲云客户端教程', url: 'https://www2.liulianyuntt.xyz/#/knowledge', checkedAt: '2026-09-28', link: false },
      { name: '榴莲云官网邀请入口', url: 'https://haadvip01.liulianyunaff.com/?code=wNI31wy3', checkedAt: '2026-09-28' },
    ],
  },
  {
    name: "鲤云", path: "/posts/liyun-review-2026/", image: '/shouye.png',
    price: 5, priceText: '5元/月', traffic: '100GB/月',
    trial: false, noExpiry: false, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；周期套餐不退款；59元200GB包客服确认有效期1年（站长2026-10-05提供），此前官网含永久文案",
    summary: "月付5元100GB、8元200GB、15元400GB；16元季付128GB/月、88元年付256GB/月。59元一次性200GB包经站长2026-10-05转述客服确认有效期1年，不计为不限时；此前官网同时写永久与限时1年。提供Clash Verge、Clash Meta及Shadowrocket教程；liyun888八折码未核对结算，周期套餐明确不退款。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
      { name: '鲤云套餐页', url: 'https://ly888.liydl.com:8888/#/plan', checkedAt: '2026-09-28', link: false },
      { name: '鲤云试用规则（站长补充）', url: '/posts/liyun-review-2026/', checkedAt: '2026-10-05', link: false },
      { name: '鲤云客户端教程', url: 'https://ly888.liydl.com:8888/#/knowledge-base', checkedAt: '2026-09-28', link: false },
      { name: '鲤云官网邀请入口', url: 'https://ly888.liydl.com:8888/#/register?code=5cHFZJPd', checkedAt: '2026-09-28' },
    ],
  },
  {
    name: "山水云", path: "/posts/shanshuiyun-review-2026/", image: '/shouye.png',
    price: 12, priceText: '12元/月', traffic: '100GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；退款待核实；同时在线3台；365天包有到期时间",
    summary: "月付12元100GB、20元200GB、39元500GB；33元季付128GB/月、77元年付64GB/月。39.9元128GB、59.9元256GB总量包365天有效且不重置；99元100GB不限时，均限3台设备。支持Clash Verge、Clash Meta及Shadowrocket；线路带宽和解锁为商家说明。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
      { name: '山水云套餐页', url: 'https://sldm1.ssyylf.com/#/shop', checkedAt: '2026-09-27', link: false },
      { name: '山水云试用规则（站长补充）', url: '/posts/shanshuiyun-review-2026/', checkedAt: '2026-10-05', link: false },
      { name: '山水云客户端教程', url: 'https://sldm1.ssyylf.com/#/docs', checkedAt: '2026-09-27', link: false },
      { name: '山水云官网邀请入口（站长更新）', url: 'https://yp7.yqhyym.com', checkedAt: '2026-10-14' },
    ],
  },
  {
    name: "秒秒云", path: "/posts/miaomiaoyun-review-2026/", image: '/shouye.png',
    price: 9, priceText: '9元/月', traffic: '128GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；当前退款及重购余量处理待核；29.9元100GB与49.9元200GB均仅有效365天",
    summary: "10月19日用户确认88元不限时间包为一次性总量100GB，不按月发放，标价0.880元/GB；重购与余量处理未明确。10月18日官网重读7款：128/256/512GB月付9/15/29元；64GB/月特惠季18、半年36、年72元。365天总量100/200GB分别一次性29.9/49.9元，不计不限时。此前59元包、88元年付100GB/月及200G特惠未见，旧记录仅作历史。第三方Clash Verge、Clash Meta及Shadowrocket教程、Windows教程中心入口仍据10月18日读取；无试用据10月5日站长确认。没有重新读取官网、付款或新增实测。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
  {
    "name": "秒秒云88元包一次性总量100GB（用户补充确认）",
    "url": "/posts/miaomiaoyun-review-2026/",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "秒秒云当前7款套餐及可选周期（官网重读）",
    "url": "https://m3.mouhiojl.com/#/shop",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "秒秒云试用规则（站长补充）",
    "url": "/posts/miaomiaoyun-review-2026/",
    "checkedAt": "2026-10-05",
    "link": false
  },
  {
    "name": "秒秒云第三方客户端教程及Windows入口（官网重读）",
    "url": "https://m3.mouhiojl.com/#/docs",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "秒秒云官网邀请入口",
    "url": "https://m3.mouhiojl.com/#/register?code=kRQzsnp3",
    "checkedAt": "2026-09-27"
  }
],
  },
  {
    name: "锦云", path: "/posts/jinyun-review-2026/", image: '/shouye.png',
    price: 6, priceText: '6元/月', traffic: '50GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；套餐不退款；按套餐限3至5台设备，365天包不等于不限时",
    summary: "月付6元50GB、9元100GB、16元200GB；18元季付64GB/月、99元年付128GB/月。29.9元100GB及48.8元300GB包365天有效，99元100GB不限时用完作废。支持Clash Verge、Clash Meta及Shadowrocket；所有核对套餐不退款，AI和流媒体为商家说明。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
      { name: '锦云套餐页', url: 'https://jybdw1.wanhlj.com:8888/#/shop', checkedAt: '2026-09-27', link: false },
      { name: '锦云试用规则（站长补充）', url: '/posts/jinyun-review-2026/', checkedAt: '2026-10-05', link: false },
      { name: '锦云客户端教程', url: 'https://jybdw1.wanhlj.com:8888/#/docs', checkedAt: '2026-09-27', link: false },
      { name: '锦云官网邀请入口', url: 'https://jybdw1.wanhlj.com:8888/#/register?code=KgThlDZI', checkedAt: '2026-09-27' },
    ],
  },
  {
    name: "熊猫cloud", path: "/posts/xiongmaocloud-review-2026/", image: '/shouye.png',
    price: 6, priceText: '6元/月', traffic: '300GB/月',
    trial: false, noExpiry: false, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；套餐不退款；66元600GB包客服确认有效期1年（站长2026-10-05提供），此前官网商品名写不限时",
    summary: "月付6元300GB、10元600GB、15元1200GB；24元季付500GB/月，限3至5台设备。25.9元500GB总量包365天有效；66元600GB包经站长2026-10-05转述客服确认有效期1年，不计为不限时；此前官网商品名称写不限时，正文写限时365天。支持Clash、Clash Verge、Clash Meta及Shadowrocket订阅；套餐不退款，流媒体与AI支持为商家说明。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
      { name: '熊猫cloud套餐页', url: 'https://cl888.cailudl.com:9999/#/shop', checkedAt: '2026-09-27', link: false },
      { name: '熊猫cloud试用规则（站长补充）', url: '/posts/xiongmaocloud-review-2026/', checkedAt: '2026-10-05', link: false },
      { name: '熊猫cloud客户端教程', url: 'https://cl888.cailudl.com:9999/#/docs', checkedAt: '2026-09-27', link: false },
      { name: '熊猫cloud官网邀请入口', url: 'https://cl888.cailudl.com:9999/#/register?code=NEU8pOgo', checkedAt: '2026-09-27' },
    ],
  },
  {
      "name": "云图",
      "path": "/posts/yuntu-review-2026/",
      "image": "/shouye.png",
      "price": 20,
      "priceText": "20元/月",
      "traffic": "150GB/月",
      "trial": false,
      "noExpiry": false,
      "dedicatedClient": false,
      "universalSubscription": true,
      "scenarios": [
          "clash",
          "chatgpt",
          "streaming"
      ],
      "status": "资料已核对",
      "risk": "不支持免费试用；套餐不退款；仅限5台个人设备；78元50GB/月及119元100GB/月均持续12个月，均非不限时；具体刷新日、结转和续购余量待核；新购套餐会替换当前有效套餐",
      "summary": "月付20元150GB、40元300GB、79元600GB，1倍率、5台设备，三款周期套餐购买日重置且不累积。2026年10月10日站长确认78元一次支付、每月50GB持续12个月；119元商品购后有效期1年已于10月18日确认，10月19日用户进一步确认每月100GB，共12个月。两档均为一次付款后分月提供额度，不计为不限时；119元不能作为一次可自由使用的1200GB总量包，具体刷新日、结转和续购余量仍待核。10月5日订单页提示新购套餐替换当前有效套餐。官网套餐与客户端资料仍据9月28日及10月5日复核；Windows教程为Clash Verge Rev及AnyTLS，AI和流媒体为商家声明。无试用仍据9月28日站长补充，本次未新增实测。",
      "subscriptionClients": [
          "Clash Verge Rev"
      ],
      "informationSources": [
  {
    "name": "云图119元每月100GB持续12个月（用户补充确认）",
    "url": "/posts/yuntu-review-2026/",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "云图119元商品1年有效期（用户补充确认）",
    "url": "/posts/yuntu-review-2026/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "云图套餐页",
    "url": "https://ytjcok.com/#/shop",
    "checkedAt": "2026-09-28",
    "link": false
  },
  {
    "name": "云图78元与119元商品卡片及订单确认页（站长复核）",
    "url": "https://ytjcok.com/#/shop",
    "checkedAt": "2026-10-05",
    "link": false
  },
  {
    "name": "云图78元套餐每月流量与12个月期限（站长补充）",
    "url": "/posts/yuntu-review-2026/",
    "checkedAt": "2026-10-10",
    "link": false
  },
  {
    "name": "云图客户端教程",
    "url": "https://ytjcok.com/#/docs/1",
    "checkedAt": "2026-09-28",
    "link": false
  },
  {
    "name": "云图官网邀请入口（站长更新）",
    "url": "https://super.ytjcok.org/#/register?code=jHSxbS1R",
    "checkedAt": "2026-10-05"
  },
  {
    "name": "云图试用规则（站长补充）",
    "url": "/posts/yuntu-review-2026/",
    "checkedAt": "2026-09-28",
    "link": false
  }
]
  },
  {
      "name": "灵猫网络",
      "path": "/posts/lingmaowangluo-review-2026/",
      "image": "/shouye.png",
      "price": 25,
      "priceText": "25元/月",
      "traffic": "150GB/月",
      "trial": false,
      "noExpiry": true,
      "dedicatedClient": true,
      "universalSubscription": true,
      "scenarios": [
          "chatgpt",
          "streaming",
          "newbie",
          "clash"
      ],
      "status": "资料已核对",
      "risk": "不支持免费试用；支持通用订阅；退款、不限时重置9折基数待核实，定制需联系客服询价",
      "summary": "月付25元150GB、45元300GB；85元年付45GB/月，周期套餐按购买日重置。不限时100元100GB、350元500GB总量，用完手动重置9折但基数待确认。Mac专属客户端账号登录、iOS Nextin识别码lmwl。线路峰值及AI、流媒体解锁为商家说明，未新增实测。2026年9月28日站长补充确认不支持免费试用，支持通用订阅。",
      "informationSources": [
          {
              "name": "灵猫网络套餐页",
              "url": "https://downwww.civetnettttt.lol/#/plans",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "灵猫网络客户端教程",
              "url": "https://downwww.civetnettttt.lol/#/knowledge",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "灵猫网络官网邀请入口",
              "url": "https://haandiiong.civetaff.com/#/?code=NeRAyp5h",
              "checkedAt": "2026-09-28"
          },
          {
              "name": "灵猫网络试用与订阅规则（站长补充）",
              "url": "/posts/lingmaowangluo-review-2026/",
              "checkedAt": "2026-09-28",
              "link": false
          }
      ]
  },
  {
      "name": "Firefly",
      "path": "/posts/firefly-review-2026/",
      "image": "/shouye.png",
      "price": 25,
      "priceText": "25元/月",
      "traffic": "150GB/月",
      "trial": false,
      "noExpiry": true,
      "dedicatedClient": true,
      "universalSubscription": true,
      "scenarios": [
          "chatgpt",
          "streaming",
          "newbie",
          "clash"
      ],
      "status": "资料已核对",
      "risk": "不支持免费试用；通用订阅需向客服索取；退款、不限时设备数及重置规则待核实",
      "summary": "月付25元150GB起，45元300GB、85元600GB、150元1.0TB；96元年付含60GB/月，当月用完可加15元重置。100元一次性100GB总量不过期、用完为止。Windows专属客户端账号登录，iOS Nextin识别码firefly；IPLC、AI及流媒体为官网声明，未新增实测。2026年9月28日站长补充确认不支持免费试用，通用订阅可向客服索取。",
      "informationSources": [
          {
              "name": "Firefly套餐页",
              "url": "https://fly.fireflyxx.cfd/#/plans",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "Firefly客户端教程",
              "url": "https://fly.fireflyxx.cfd/#/knowledge",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "Firefly官网邀请入口",
              "url": "https://haandiiong.fireflyaff.com/#/?code=3u9poqXH",
              "checkedAt": "2026-09-28"
          },
          {
              "name": "Firefly试用与订阅规则（站长补充）",
              "url": "/posts/firefly-review-2026/",
              "checkedAt": "2026-09-28",
              "link": false
          }
      ]
  },
  {
      "name": "神行加速",
      "path": "/posts/shenxingjiasu-review-2026/",
      "image": "/shouye.png",
      "price": 23,
      "priceText": "23元/月",
      "traffic": "120GB/月",
      "trial": false,
      "noExpiry": false,
      "dedicatedClient": true,
      "universalSubscription": true,
      "scenarios": [
          "clash",
          "chatgpt",
          "streaming",
          "newbie"
      ],
      "status": "资料已核对",
      "risk": "基础与尊享正文流量单位错误，采用卡片260GB和520GB仍需复核；不支持免费试用；通用订阅需购买订阅后联系客服领取；退款待核实",
      "summary": "月付23元120GB、40元260GB、72元520GB，后两档正文错写40/月与72/月，须复核；96元年付60GB/月，每30天刷新。Windows账号登录专属客户端，iOS Nextin识别码xs0077。公告新客7折优惠码sx0077，结算未验证；IPLC、IEPL及解锁为商家说明。不支持免费试用，通用订阅需购买订阅后联系客服领取，具体客户端格式需确认。",
      "informationSources": [
          {
              "name": "神行加速套餐页",
              "url": "https://www1.shenxingjstt.xyz/#/plans",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "神行加速客户端教程",
              "url": "https://www1.shenxingjstt.xyz/#/knowledge",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "神行加速优惠公告",
              "url": "https://www1.shenxingjstt.xyz/#/dashboard",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "神行加速官网邀请入口",
              "url": "https://haandiion01.shenxingaff.com/#/?code=FiirNX8j",
              "checkedAt": "2026-09-28"
          },
          {
              "name": "神行加速试用与订阅规则（站长补充）",
              "url": "/posts/shenxingjiasu-review-2026/",
              "checkedAt": "2026-09-28",
              "link": false
          }
      ]
  },
  {
      "name": "极速Cloud",
      "path": "/posts/jisucloud-review-2026/",
      "image": "/shouye.png",
      "price": 15,
      "regularPrice": 30,
      "priceText": "新人15元/月（不可续费）；常规30元/月起",
      "traffic": "新人标称200GB/月，10倍折合20GB；常规折合100GB/月起",
      "trial": false,
      "noExpiry": true,
      "dedicatedClient": false,
      "universalSubscription": true,
      "scenarios": [
          "clash",
          "chatgpt",
          "streaming"
      ],
      "status": "资料已核对",
      "risk": "全套餐10倍倍率；新人档不能续费；设备数与知识库通用文案冲突；不支持免费试用",
      "summary": "新人15元月付标称200GB、10倍折合20GB，仅可买一次不可续费；常规30元标称1000GB/月、折合100GB限3台，45元1500GB折合150GB限5台。329元标称1000GB不限时间总量包折合100GB，限3台且不退款；88元与168元包有365天期限。支持Clash Verge订阅，文档不限设备与卡片2至5台不一致。每月账单日刷新，续费不立即重置；用量90%后出现重置入口，费用待核实。同款一次性重购覆盖、不叠加余量。",
      "subscriptionClients": [
          "Clash Verge"
      ],
      "informationSources": [
          {
              "name": "极速Cloud试用规则（站长补充）",
              "url": "/posts/jisucloud-review-2026/",
              "checkedAt": "2026-10-05",
              "link": false
          },
          {
              "name": "极速Cloud套餐页",
              "url": "https://191.101.132.80/#/plan",
              "checkedAt": "2026-10-05",
              "link": false
          },
          {
              "name": "极速Cloud客户端教程",
              "url": "https://191.101.132.80/#/knowledge-base/3",
              "checkedAt": "2026-10-05",
              "link": false
          },
          {
              "name": "极速Cloud续费重置说明",
              "url": "https://191.101.132.80/#/knowledge-base/6",
              "checkedAt": "2026-10-05",
              "link": false
          },
          {
              "name": "极速Cloud官网邀请入口",
              "url": "https://y1.jisucloud8.com:8888/#/register?code=XDSrGf1n",
              "checkedAt": "2026-09-28"
          }
      ]
  },
  {
      "name": "杏花云",
      "path": "/posts/xinghuayun-review-2026/",
      "image": "/shouye.png",
      "price": 3,
      "priceText": "3元/月",
      "traffic": "200GB/月",
      "trial": false,
      "noExpiry": false,
      "dedicatedClient": false,
      "universalSubscription": true,
      "scenarios": [
          "cheap",
          "clash",
          "streaming"
      ],
      "status": "资料已核对",
      "risk": "不支持免费试用；退款、倍率与月额度重置日期待核实；20元总量包只有一年有效期",
      "summary": "月付3元200GB、6元500GB、10元1000GB，分别限2、3、5台；年付12元50GB/月和24元100GB/月。20元1000GB为一年有效总量包，不计入不限时。教程提供Clash Verge订阅导入；主流AI和流媒体支持为笼统商家说明，未给出各平台实测。",
      "subscriptionClients": [
          "Clash Verge"
      ],
      "informationSources": [
          {
              "name": "杏花云试用规则（站长补充）",
              "url": "/posts/xinghuayun-review-2026/",
              "checkedAt": "2026-10-05",
              "link": false
          },
          {
              "name": "杏花云套餐页",
              "url": "https://xh.xinghuajichang.com/#/shop",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "杏花云客户端教程",
              "url": "https://xh.xinghuajichang.com/#/docs/1",
              "checkedAt": "2026-09-28",
              "link": false
          },
          {
              "name": "杏花云官网邀请入口",
              "url": "https://xh.xinghuajichang.com/#/register?code=GxpLWxgt",
              "checkedAt": "2026-09-28"
          }
      ]
  },

  {
    "name": "AnDy Cloud",
    "path": "/posts/andycloud-review-2026/",
    "image": "/shouye.png",
    "price": 5,
    "priceText": "5元/月",
    "traffic": "100GB/月",
    "trial": false,
    "noExpiry": true,
    "dedicatedClient": false,
    "universalSubscription": true,
    "scenarios": [
      "cheap",
      "clash"
    ],
    "status": "资料已核对",
    "risk": "不支持免费试用；退款、计费倍率与重置费用待核实；订阅导入需先购买；一次性重购覆盖额度，不叠加余量",
    "summary": "不支持免费试用。月付5元100GB、10元300GB、15元500GB、25元1000GB，限2至8台；年付30元含50GB/月，限2台。100元一次性1000GB包无过期日，用完为止，限10台，重购覆盖不叠加。周期套餐按账单日重置，未用流量不累积；续费不立即重置，已用90%后出现重置入口，费用未明。提供Clash Verge、Android Clash、Clash Mi与Shadowrocket教程，购买后开放订阅导入。速率与流媒体支持为商家标注，没有新增实测。",
    "subscriptionClients": [
      "Clash Verge",
      "Clash Mi",
      "Android Clash",
      "Shadowrocket"
    ],
    "informationSources": [
      { "name": "AnDy Cloud试用规则（站长补充）", "url": "/posts/andycloud-review-2026/", "checkedAt": "2026-10-06", "link": false },
      {
        "name": "AnDy Cloud套餐页",
        "url": "https://ddhh.andycloud.cc:8888/#/shop",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "AnDy Cloud续费与重置说明",
        "url": "https://ddhh.andycloud.cc:8888/#/docs/2",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "AnDy Cloud Windows Clash教程",
        "url": "https://ddhh.andycloud.cc:8888/#/docs/4",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "AnDy Cloud仪表盘订阅说明",
        "url": "https://ddhh.andycloud.cc:8888/#/dashboard",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "AnDy Cloud官网邀请入口",
        "url": "https://ddhh.andycloud.cc:8888/#/register?code=a8qOz45S",
        "checkedAt": "2026-10-05"
      }
    ]
  },
  {
    "name": "Tidal潮汐加速",
    "path": "/posts/tidal-review-2026/",
    "image": "/shouye.png",
    "price": 25,
    "priceText": "25元/月",
    "traffic": "100GB/月",
    "trial": false,
    "noExpiry": true,
    "dedicatedClient": true,
    "universalSubscription": true,
    "scenarios": [
      "clash",
      "newbie"
    ],
    "status": "资料已核对",
    "risk": "不支持免费试用；取消套餐按使用比例退回账户余额，不等于原路退款；年付优惠期限、叠加与结算未验证",
    "summary": "不支持免费试用。Air月付25元100GB限3台，Plus35元300GB限6台，Pro55元1024GB不限设备；年付卡片分别展示118.8、238.8、358.8元。59元128GB、89元256GB、159元512GB永久流量包不限设备，用完为止。周期按每月账单日重置；购买后可获取Clash等通用订阅，也有Windows、macOS、Android、Linux及iOS客户端入口。FAQ允许按使用比例取消套餐并退到账户余额；现金退款范围未明。Tidal年付八折活动有倒计时，结算和叠加未验证。AI与流媒体为商家说明，未新增实测。",
    "subscriptionClients": [
      "Clash Verge Rev",
      "Clash Meta for Android",
      "Clash Mi",
      "ClashX",
      "Shadowrocket",
      "Stash",
      "Quantumult X"
    ],
    "informationSources": [
      { "name": "Tidal试用规则（站长补充）", "url": "/posts/tidal-review-2026/", "checkedAt": "2026-10-06", "link": false },
      {
        "name": "Tidal套餐页与常见问题",
        "url": "https://tidalfast.com/plans",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "Tidal客户端下载页",
        "url": "https://tidalfast.com/download",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "Tidal服务条款页（本次显示暂无内容）",
        "url": "https://tidalfast.com/tos",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "Tidal官网邀请入口",
        "url": "https://www.chaoxijiasu.com/register?code=uuttj42W",
        "checkedAt": "2026-10-05"
      }
    ]
  },
  {
    "name": "云界线",
    "path": "/posts/yunjiexian-review-2026/",
    "image": "/shouye.png",
    "price": 22,
    "priceText": "22元/月",
    "traffic": "150GB/月",
    "trial": false,
    "noExpiry": true,
    "dedicatedClient": true,
    "universalSubscription": true,
    "scenarios": [
      "newbie"
    ],
    "status": "资料已核对",
    "risk": "无试用、订阅需客服；退款、重购余量与优惠范围待核",
    "summary": "10月19日用户确认闲云99元包为一次性总量80GB，不按月刷新，标价约1.238元/GB；199元包为总量200GB。10月18日已确认卡片价：96元年付60GB/月，轻云22元150GB/月、凌云40元300GB/月、御云66元600GB/月，各周期按已读整笔卡片金额记录。不限时包用完重购，余量叠加或覆盖未明。四平台知识库为官网账号登录，iOS Nextin识别码yjx；下载中心标签与FAQ分开，未安装验证。无试用及通用订阅向客服仍据10月6日确认。yjx888公告列月/季/半年/年新客首单7折一次，其他商品适用、叠加与实际结算待核。官网套餐与客户端读取仍10月18日，本次未新增实测。",
    "informationSources": [
  {
    "name": "云界线99元包一次性80GB（用户补充确认）",
    "url": "/posts/yunjiexian-review-2026/",
    "checkedAt": "2026-10-19",
    "link": false
  },
  {
    "name": "云界线以卡片价格为准（用户补充确认）",
    "url": "/posts/yunjiexian-review-2026/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "云界线试用与订阅规则（站长补充）",
    "url": "/posts/yunjiexian-review-2026/",
    "checkedAt": "2026-10-06",
    "link": false
  },
  {
    "name": "云界线官网邀请入口（用户更新）",
    "url": "https://a01vipaff.yunjiexianaff.com/#/?code=y4BofmLr",
    "checkedAt": "2026-10-18"
  },
  {
    "name": "云界线现售套餐及周期切换价",
    "url": "https://sfsggds.yunjie162.lol/#/plans",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "云界线四平台客户端知识库",
    "url": "https://sfsggds.yunjie162.lol/#/knowledge",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "云界线仪表盘及新客优惠公告",
    "url": "https://sfsggds.yunjie162.lol/#/dashboard",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "云界线下载中心（页面标注）",
    "url": "https://sfsggds.yunjie162.lol/#/downloads",
    "checkedAt": "2026-10-18",
    "link": false
  }
]
  },
  {
    name: '极速123', path: '/posts/jisu123-review-2026/', image: '/shouye.png',
    price: 15.99, priceText: '15.99元/月', traffic: '标称1200GB/月，6倍折合200GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['clash'], status: '资料已核对',
    risk: '商品标注6倍扣量；文档与卡片设备数、一次性有效期存在差异；不支持免费试用；月付退款与重置费待核实',
    summary: '不支持免费试用。月付15.99元标称1200GB、6倍折合200GB限3台，22元折合300GB限5台；118元年付每月标称1000GB、折合约166.7GB。不限时128元标称1000GB总量、折合约166.7GB，限3台且不退款；59元与98元总量包有365天有效期。官网文档指向第三方客户端教程，支持Clash Verge、FlClash等订阅导入；续费不立即刷新，重购一次性包覆盖而不叠加。IEPL与GPT、Netflix、TikTok解锁为商家说明，未新增实测。',
    subscriptionClients: ['Clash Verge', 'FlClash', 'v2rayN', 'Clash Meta', 'NekoBox', 'v2rayNG', 'Shadowrocket'],
    informationSources: [
      { name: '极速123试用规则（站长补充）', url: '/posts/jisu123-review-2026/', checkedAt: '2026-10-06', link: false },
      { name: '极速123套餐商店', url: 'https://905.jsy902.xyz/#/shop', checkedAt: '2026-10-05', link: false },
      { name: '极速123线路及倍率介绍', url: 'https://905.jsy902.xyz/#/docs/16', checkedAt: '2026-10-05', link: false },
      { name: '极速123续费与流量重置说明', url: 'https://905.jsy902.xyz/#/docs/13', checkedAt: '2026-10-05', link: false },
      { name: '极速123电脑端教程入口', url: 'https://905.jsy902.xyz/#/docs/5', checkedAt: '2026-10-05', link: false },
      { name: '官网指向的第三方客户端教程目录', url: 'https://www.ruanjiandaohang.com/', checkedAt: '2026-10-05', link: false },
      { name: '官网指向的Clash Verge订阅教程', url: 'https://www.ruanjiandaohang.com/tutorial.html?id=art_clash', checkedAt: '2026-10-05', link: false },
      { name: '极速123官网邀请入口', url: 'https://905.jsy902.xyz/#/register?code=PB9zvaUD', checkedAt: '2026-10-05' },
    ],
  },
  {
    name: '灯塔加速器', path: '/posts/dengta-review-2026/', image: '/shouye.png',
    price: 30, priceText: '30元/月', traffic: '120GB/月',
    trial: true, noExpiry: false, dedicatedClient: true, universalSubscription: true,
    scenarios: ['newbie', 'trial'], status: '资料已核对',
    risk: "试用300MB/3天仅专属客户端；付费订阅导出受周期限制，Clash格式未确认；入门与轻量无退款保障，VIP/SVIP退款须24小时内且用量不超过10%",
    summary: "10月18日用户纠正灯塔没有周付，删除原28/66元周付误记录；新用户试用300MB、有效3天，仅限专属客户端，不可导出订阅，起算方式未另确认。最低月付轻量30元120GB、入门120元年付60GB/月；VIP月68/季168/年400元300GB/月，SVIP月138/季328/年660元800GB/月。VIP/SVIP有24小时退款政策，要求已用流量不超过10%；入门和轻量无退款保障。付费导出仍限轻量年付、VIP/SVIP季付及以上，入门不导出，未确认Clash格式。官网套餐和客户端来源仍10月10日，未重新访问官网或新增实测。",
    informationSources: [
  {
    "name": "灯塔无周付、300MB三天专属客户端试用及退款条件（用户纠正）",
    "url": "/posts/dengta-review-2026/",
    "checkedAt": "2026-10-18",
    "link": false
  },
  {
    "name": "灯塔官网套餐与客户端下载",
    "url": "https://dengta12.com/",
    "checkedAt": "2026-10-10"
  },
  {
    "name": "灯塔个人中心套餐购买页",
    "url": "https://dengta12.com/account?tab=plans",
    "checkedAt": "2026-10-10",
    "link": false
  },
  {
    "name": "灯塔新用户免费试用说明",
    "url": "https://dengta12.com/help/4/57",
    "checkedAt": "2026-10-10"
  },
  {
    "name": "灯塔试用账户额度快照",
    "url": "https://dengta12.com/account?tab=invite",
    "checkedAt": "2026-10-10",
    "link": false
  },
  {
    "name": "灯塔订阅导出说明",
    "url": "https://dengta12.com/help/1/123",
    "checkedAt": "2026-10-10"
  },
  {
    "name": "灯塔退款帮助与套餐限制",
    "url": "https://dengta12.com/help/2/46",
    "checkedAt": "2026-10-10"
  },
  {
    "name": "灯塔流量统计与重置说明",
    "url": "https://dengta12.com/help/1/16",
    "checkedAt": "2026-10-10"
  },
  {
    "name": "灯塔官网邀请入口（站长提供）",
    "url": "https://www.dengta12.com/reg?ref=DjdVKysq",
    "checkedAt": "2026-10-10"
  }
],
  },
]

export const hiddenAirportStatuses = new Set(['已淘汰', '停止推荐', '下架'])

export const isVisibleAirport = (airport: AirportData) => !hiddenAirportStatuses.has(airport.status)

export const visibleAirportData = airportData.filter(isVisibleAirport)

// Date of the last full review; partial updates retain their per-source checkedAt dates.
export const airportDataLastReviewed = '2026-08-19'
// Advance for actual changes to current data or its classification, not historical test dates.
export const airportDataLastModified = '2026-10-22'

export const getAirportPriceMetrics = (airports: readonly AirportData[]) => {
  const visible = airports.filter(isVisibleAirport)
  const average = (prices: number[]) => prices.length
    ? Number((prices.reduce((total, price) => total + price, 0) / prices.length).toFixed(1)) : 0
  const entryPrices = visible.map((airport) => airport.price)
  const regularPrices = visible.map((airport) => airport.regularPrice ?? airport.price)
  return {
    cheapUnderTenCount: entryPrices.filter((price) => price < 10).length,
    averagePrice: average(entryPrices),
    regularCheapUnderTenCount: regularPrices.filter((price) => price < 10).length,
    regularAveragePrice: average(regularPrices),
  }
}

export const airportMetrics: AirportMetrics = {
  count: visibleAirportData.length,
  trialCount: visibleAirportData.filter((airport) => airport.trial === true).length,
  noExpiryCount: visibleAirportData.filter((airport) => airport.noExpiry === true).length,
  noExpiryUnverifiedCount: visibleAirportData.filter((airport) => airport.noExpiry === null).length,
  dedicatedClientCount: visibleAirportData.filter((airport) => airport.dedicatedClient).length,
  universalSubscriptionCount: visibleAirportData.filter((airport) => airport.universalSubscription === true).length,
  ...getAirportPriceMetrics(visibleAirportData),
  performanceCount: visibleAirportData.filter((airport) => airport.performance).length,
  salesSampleCount: visibleAirportData.filter((airport) => typeof airport.salesSample === 'number').length,
}

export const airportSalesSampleMeta: AirportSalesSampleMeta = {
  observedAt: '2026-06-18',
  source: 'yp7.net 当前可见销量样本',
  caveat: '销量样本只用于观察本站读者购买热度，不等同于全网销量、服务商真实总销量或长期稳定性排名。',
}
