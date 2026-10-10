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
    risk: '不支持试用，不支持退款；并发设备数因套餐而异',
    summary: '月付6元150GB起，每30天重置；不限时36元100GB、99元300GB，流量用完作废。教程提供Clash Verge、Clash Meta、Karing和Shadowrocket，海外中转及解锁能力为商家说明，未新增实测。',
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Karing', 'Shadowrocket'],
    informationSources: [
      { name: '九云套餐商店', url: 'https://888.jiuyundl.com/#/shop', checkedAt: '2026-09-22', link: false },
      { name: '九云客户端教程', url: 'https://888.jiuyundl.com/#/docs', checkedAt: '2026-09-22', link: false },
    ],
  },
  {
    name: '全球云', path: '/posts/quanqiuyun/', image: '/qqy.png',
    price: 20, priceText: '20元/月', traffic: '120GB/月',
    trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false,
    scenarios: ['stable', 'chatgpt', 'streaming', 'newbie'], status: '主推观察',
    risk: '不支持免费试用和通用订阅；旧优惠码与退款待核实',
    summary: '不支持免费试用和通用订阅。20元/月120GB起，另有99元/年59GB/月轻量版及100元100GB起的不限时包。知识库提供 Windows、Android、Mac、Linux 自研客户端说明，iOS 使用 Nextin；BGP、1倍流量和解锁能力为套餐标注，实际连接需自行验证。',
    informationSources: [{ name: '全球云官网', url: 'https://haandiiong.gcvipaff.cc/#/?code=Hg3FRQIf', checkedAt: '2026-09-11' }, { name: '全球云试用与订阅规则（站长补充）', url: '/posts/quanqiuyun/', checkedAt: '2026-09-27', link: false }],
    performance: { evidenceLevel: null, lastTestedAt: '2026-05-30', testWindow: '21:22-21:25（UTC+8）', testRegion: '截图未标注本地地区', testNetwork: '截图未标注本地运营商与接入带宽', testDevice: '旧文记载苹果电脑，截图未独立标注设备型号', latencyMs: 82, downloadMbpsRange: '778.79Mbps（Speedtest 单次历史结果）', chatgptResult: '本组历史截图未覆盖', youtube4kResult: '3840×2160@30，连接速率44052Kbps（历史画面）', stability: '单次历史记录，不代表持续稳定性', evidenceSummary: '2026-05-30既有客户端、YouTube及Speedtest配图；Speedtest使用M1 Limited Singapore服务器，图中下载778.79Mbps、上传52.09Mbps、Ping82ms。测速图未独立显示订阅身份、本地地区和运营商，不作字母评级。', evidenceSources: [{ name: '全球云归档Speedtest原图', url: '/speedtest.png' }, { name: '全球云归档YouTube原图', url: '/youtubecesu.png' }] },
    salesSample: 1048,
  },
  { name: '光年梯', path: '/posts/guangnianti-review-2026/', image: '/gnt.png', price: 18, priceText: '18元/月', traffic: '110GB/月', trial: false, noExpiry: false, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'streaming', 'newbie'], status: '资料已核对', risk: '套餐不退款；普通套餐不支持通用订阅，不支持免费试用，先确认设备兼容', summary: '18元/月110GB起，另有89元/年50GB/月限时套餐及680元/月500GB独享私人专线。官网提供多平台客户端说明，iOS使用Nextin，Linux另有文档；普通套餐标注IPLC、1倍率和不限在线客户端数量，不提供退款。线路与解锁为服务商宣传，普通套餐不支持通用订阅，不支持免费试用。2026年9月27日站长补充8折优惠码GNT80，适用套餐、期限、次数及叠加条件未说明，结算金额未验证。', informationSources: [{ name: '光年梯试用规则（站长补充）', url: '/posts/guangnianti-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '光年梯优惠码（站长补充）', url: '/posts/guangnianti-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '光年梯套餐页', url: 'https://bk1dvc.guangnianertt1.homes/#/plans', checkedAt: '2026-09-16', link: false }, { name: '光年梯客户端知识库', url: 'https://bk1dvc.guangnianertt1.homes/#/knowledge', checkedAt: '2026-09-16', link: false }, { name: '光年梯仪表盘', url: 'https://bk1dvc.guangnianertt1.homes/#/dashboard', checkedAt: '2026-09-16', link: false }], performance: { evidenceLevel: null, lastTestedAt: '2026-06-03', testWindow: 'YouTube图22:38-22:39（UTC+8）；Speedtest图仅显示22:41/22:42，完整日期未显示', testRegion: '截图未标注本地地区；Speedtest服务器显示Singapore，不能当作本地地点', testNetwork: '原图未标注本地运营商与接入带宽，旧文SoftBank / 1000Mbps条件未证实', testDevice: 'Android手机界面；型号未注明', latencyMs: null, downloadMbpsRange: '365.78及367.76Mbps（两张归档Speedtest图，完整日期及所用节点未独立注明）', chatgptResult: '未取得可追溯的历史操作记录，不作结论', youtube4kResult: '2026-06-03三张画面显示3840×2160@30，连接速率36789/40480/39909Kbps；不是秒开或持续流畅的证明', stability: '单次截图不能评定持续稳定性', evidenceSummary: '撤回旧文未证实的速度区间、单一延迟和字母评级；图中可读Speedtest下载为365.78/367.76Mbps、Ping121/105ms。YouTube图有6月3日完整时间，Speedtest图无完整日期，不能把全部图视为同一节点或同条件连续测试；未独立证实ChatGPT或长期稳定性。', evidenceSources: [{ name: '光年梯归档Speedtest图一', url: '/guangnianticesu1.jpg' }, { name: '光年梯归档Speedtest图二', url: '/guangnianticesu2.jpg' }, { name: '光年梯归档YouTube图一', url: '/guangniantispeedtest1.jpg' }, { name: '光年梯归档YouTube图二', url: '/guangniantispeedtest2.jpg' }, { name: '光年梯归档YouTube图三', url: '/guangniantispeedtest3.jpg' }] }, salesSample: 832 },
  {
    name: '网际快车', path: '/posts/wangji-kuaiche-review/', image: '/kuaiche.png',
    // Cycle-plan reference price; the separate 6.8 CNY / 20GB package is a one-off purchase.
    price: 28, priceText: '28元/30天', traffic: '60GB/日（每日重置）',
    trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['stable', 'clash', 'chatgpt', 'trial'], status: '重点观察',
    risk: '日享限60GB/日；免费试用需填写体验券yp7net，旧优惠码与退款待核实',
    summary: '不限时流量包6.8元20GB起；日享包28元30天，每天60GB、凌晨重置。首页提供 FlClash 等第三方客户端订阅，软路由另有 OpenClash 插件；填写体验券yp7net可获1天5GB免费试用。',
    subscriptionClients: ['FlClash', 'Hiddify', 'SingBox', 'Karing', 'v2ray', 'v2rayNG', 'Clash Meta', 'NekoBox', 'Egern', 'Shadowrocket', 'QuantumultX', 'Clash', 'Loon', 'Surge', 'Surfboard'],
    informationSources: [{ name: '网际快车官网', url: 'https://wjkc66.vip/?c=GDIHMU', checkedAt: '2026-09-10' }, { name: '网际快车体验券规则（站长补充）', url: '/posts/wangji-kuaiche-review/', checkedAt: '2026-09-27', link: false }],
    performance: { evidenceLevel: null, lastTestedAt: '2026-06-03', testWindow: '23:05-23:08（UTC+8），Speedtest图为15:08 GMT', testRegion: '本地地区未注明；Speedtest服务器ViewQwest Singapore，不能当作本地地点', testNetwork: '图中显示Cylix，但未标注本地接入线路、带宽或旧文SoftBank条件', testDevice: '网页测速与桌面客户端画面，具体设备未注明', latencyMs: 170, downloadMbpsRange: '13.96Mbps（2026-06-03 Speedtest单次原图），上传3.70Mbps', chatgptResult: '未取得可追溯的历史操作记录，不作结论', youtube4kResult: '2026-06-03 23:05画面显示当前3840×2160@30、连接速率46802Kbps；不能证明连续流畅', stability: '单次截图不能评定持续稳定性', evidenceSummary: '撤回旧文未证实的速度区间、单一延迟和字母评级；Speedtest图显示下载13.96Mbps、上传3.70Mbps、Ping170ms。YouTube图仅覆盖当时视频画面；两图不能证明办公、ChatGPT或长期稳定性，亦不由后来的Siilas样本替代旧记录。', evidenceSources: [{ name: '网际快车归档Speedtest原图', url: '/kuaichespeedtest.jpg' }, { name: '网际快车归档YouTube原图', url: '/kuaicheyoutube.jpg' }] },
    salesSample: 849,
  },
  { name: '光速云', path: '/posts/guangsuyun/', image: '/guangsuyun.png', price: 23, priceText: '23元/月', traffic: '148GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['stable', 'streaming'], status: '备用观察', risk: '不支持免费试用和通用订阅；套餐不退款；流光版238GB与220GB文案冲突待核实', summary: '月付23元含148GB/月，年付99元含59GB/月，均经9月27日站长补充确认；另有680元一次性1000GB不限时包。流光版238GB与220GB文案差异仍待核实。官网提供多平台客户端，iOS使用Nextin、专属码gsy；不限时包不自动重置，手动重置612元。不支持免费试用和通用订阅，套餐不退款。', informationSources: [{ name: '光速云年付及极速版额度（站长补充）', url: '/posts/guangsuyun/', checkedAt: '2026-09-27', link: false }, { name: '光速云试用与订阅规则（站长补充）', url: '/posts/guangsuyun/', checkedAt: '2026-09-27', link: false }, { name: '光速云套餐页', url: 'https://fdgfds.guangsut.sbs/#/plans', checkedAt: '2026-09-16', link: false }, { name: '光速云客户端知识库', url: 'https://fdgfds.guangsut.sbs/#/knowledge', checkedAt: '2026-09-16', link: false }, { name: '光速云仪表盘', url: 'https://fdgfds.guangsut.sbs/#/dashboard', checkedAt: '2026-09-16', link: false }], salesSample: 346 },
  { name: 'xxyun', path: '/posts/xxyun-review-2026/', image: '/xxyun.png', price: 9.99, priceText: '9.99元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['cheap', 'streaming'], status: '流媒体观察', risk: '仅官方客户端，解锁需按节点复核', summary: '9.99元/月起、100GB/月，提供 Android、iOS、Windows 和 Mac 官方客户端；不支持 Clash、FlClash 或 Shadowrocket，适合接受官方客户端的低预算用户短期比较。', informationSources: [{ name: 'xxyun 官网', url: 'https://xxyun.at/?code=3AYVsSKY', checkedAt: '2026-09-10' }], salesSample: 942 },
  {
    name: 'Flybit', path: '/posts/flybit-review-2026/', image: '/flybit.jpg',
    price: 15, priceText: '15元/月', traffic: '128GB/月',
    trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['clash', 'trial'], status: 'Clash观察',
    risk: '套餐不支持退款；购买前核实并短期测试',
    summary: '月付 15 元含 128GB，注册 1 天 2GB 免费试用（站长补充）；仪表盘列出 7 款第三方客户端一键导入，另有不限时流量包。套餐不支持退款，建议先试用。',
    subscriptionClients: ['Clash Meta', 'Hiddify', 'SingBox', 'Shadowrocket', 'QuantumultX', 'Surge', 'Stash'],
    // Public references use one official referral entry. Verification: /#/plan (2026-09-08),
    // /#/dashboard, goflybit.com and github.com/FlyBitVIP/FlyBit-Airport-Address (2026-09-09).
    informationSources: [
      { name: 'Flybit 官网', url: 'https://goflybit.com/#/register?code=p3DOcgzt', checkedAt: '2026-09-09' },
      { name: 'Flybit试用规则（站长补充）', url: '/posts/flybit-review-2026/', checkedAt: '2026-09-27', link: false },
    ],
    salesSample: 744,
  },
  { name: '阿达西', path: '/posts/adaxi-review-2026/', image: '/adaxi.png', price: 3, priceText: '3元/30天', traffic: '20GB/30天', trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'clash'], status: '低价观察', risk: '入门档限速100Mbps、不支持专线；不支持免费试用，退款待核实，独享节点默认自动续费', summary: '不支持免费试用。3元20GB/30天、10元80GB/30天，另有50元300GB不限时包；三档分别限速100/500/600Mbps，均不支持专线、设备数不限。官网提供v2rayN、Shadowrocket和Flyer订阅教程。日本独享节点20元/月，共用套餐流量且默认自动续费。', informationSources: [{ name: '阿达西试用规则（站长补充）', url: '/posts/adaxi-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '阿达西套餐页', url: 'https://adaxi.net/plan', checkedAt: '2026-09-16', link: false }, { name: '阿达西Windows教程', url: 'https://adaxi.net/doc', checkedAt: '2026-09-16', link: false }, { name: '阿达西macOS教程', url: 'https://adaxi.net/doc/macos', checkedAt: '2026-09-16', link: false }, { name: '阿达西iOS教程', url: 'https://adaxi.net/doc/ios', checkedAt: '2026-09-16', link: false }, { name: '阿达西Android教程', url: 'https://adaxi.net/doc/android', checkedAt: '2026-09-16', link: false }, { name: '阿达西常见问题', url: 'https://adaxi.net/doc/faq', checkedAt: '2026-09-16', link: false }, { name: '阿达西独享节点', url: 'https://adaxi.net/dedicated', checkedAt: '2026-09-16', link: false }], salesSample: 462 },
  {
    name: '拼好连', path: '/posts/runway-review-2026/', image: '/runway.png',
    price: 9.9, priceText: '9.9元/月', traffic: '100GB/月',
    trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true,
    scenarios: ['cheap', 'trial', 'newbie', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: '退款待核实；专属客户端限3台，入门限200Mbps',
    summary: '9.9元/月100GB起，另有19.9元200GB、50元600GB和79元1024GB；45元150GB不限时。官方四端客户端支持账号登录，后台可复制通用订阅，Windows教程使用FlClash。免费试用1天6GB。',
    informationSources: [
      { name: '拼好连套餐商店', url: 'https://new.runwayhz.com/#/shop', checkedAt: '2026-09-27', link: false },
      { name: '拼好连客户端与试用公告', url: 'https://new.runwayhz.com/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '拼好连试用规则（站长补充）', url: '/posts/runway-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '拼好连使用规则', url: 'https://new.runwayhz.com/#/docs/5', checkedAt: '2026-09-27', link: false },
      { name: '拼好连FlClash订阅教程', url: 'https://new.runwayhz.com/#/docs/2', checkedAt: '2026-09-27', link: false },
    ],
    salesSample: 445,
  },
  { name: '唯兔云', path: '/posts/weituyun/', image: '/weituyun.png', price: 19.9, priceText: '19.9元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['streaming'], status: '流媒体观察', risk: '不支持免费试用和通用订阅；14.9元节假日套餐暂无定价，退款待核实', summary: '当前月付19.9元150GB起，79.9元/年45GB每月、120元/年75GB每月；不限时100元100GB、160元200GB、340元500GB。提供自有客户端，不支持免费试用和通用订阅。', informationSources: [{ name: '唯兔云试用与订阅规则（站长补充）', url: '/posts/weituyun/', checkedAt: '2026-09-27', link: false }, { name: '唯兔云套餐页', url: 'https://hjusedi.v2saat.club/#/plans', checkedAt: '2026-09-23', link: false }, { name: '唯兔云知识库', url: 'https://hjusedi.v2saat.club/#/knowledge', checkedAt: '2026-09-23', link: false }, { name: '唯兔云仪表盘', url: 'https://hjusedi.v2saat.club/#/dashboard', checkedAt: '2026-09-23', link: false }], salesSample: 221 },
  // 2026-09-07: checked 99吧 plan cards, dashboard import menu and trial documentation; other airports were not re-reviewed.
  { name: '99吧', path: '/posts/99ba-review-2026/', image: '/99ba.png', price: 9.9, priceText: '9.9元/月', traffic: '70GB/月', trial: true, noExpiry: true, dedicatedClient: false, universalSubscription: true, scenarios: ['cheap', 'trial', 'clash'], status: '试用观察', risk: '套餐仅限内地使用，暂不支持退款，先试用', summary: '9.9元月付70GB，支持1天1GB试用、不限时流量包和多客户端一键订阅导入；实际节点表现需另行验证。', informationSources: [{ name: '99吧套餐、客户端与试用说明', url: 'https://99ba.net/#/register?code=Wls9E3cC', checkedAt: '2026-09-07', link: false }], salesSample: 413 },
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
  { name: '坦克云（原坦克加速）', path: '/posts/tank-review-2026/', image: '/tankejiasu.png', price: 9.9, priceText: '9.9元/月', traffic: '80GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['cheap', 'clash', 'trial'], status: '新手观察', risk: '入门限1台设备与IP；退款与旧优惠码待核实', summary: '支持1天200GB免费试用。9.9元/月80GB起；另有49元/月不限流量、50元100GB及199元500GB不限时。官方客户端支持Windows、Android、Mac、Linux，iOS使用第三方客户端。', subscriptionClients: ['Clash', 'Surge', 'Shadowrocket', 'Surfboard', 'Quantumult X'], informationSources: [{ name: '坦克云试用规则（站长补充）', url: '/posts/tank-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '坦克云套餐页', url: 'https://aa.tankejiasu.com/#/stage/buysubs', checkedAt: '2026-09-23', link: false }, { name: '坦克云使用文档', url: 'https://aa.tankejiasu.com/#/stage/knowledge', checkedAt: '2026-09-23', link: false }, { name: '坦克云仪表盘', url: 'https://aa.tankejiasu.com/#/stage/dashboard', checkedAt: '2026-09-23', link: false }], salesSample: 219 },
  { name: '瞬云', path: '/posts/shunyun-review-2026/', image: '/shunyun.png', price: 18, priceText: '18元/月', traffic: '150GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['streaming', 'clash'], status: '资料已核对', risk: '不支持免费试用和退款；周期套餐仅限个人使用，旧优惠码待核实', summary: '不支持免费试用。18元/月150GB起，99元年付59GB/月；不限时260元2000GB、600元5000GB，不自动重置，手动重置为原价90%。官方Android、Windows和macOS客户端，iOS可用Clash Mi或Shadowrocket等第三方订阅。ANYCAST、原生IP、最高2.5Gbps及解锁属于商家说明。', informationSources: [{ name: '瞬云试用规则（站长补充）', url: '/posts/shunyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '瞬云套餐商店', url: 'https://syjccloud.com/#/shop', checkedAt: '2026-09-27', link: false }, { name: '瞬云客户端文档', url: 'https://syjccloud.com/#/docs', checkedAt: '2026-09-27', link: false }, { name: '瞬云官方客户端教程', url: 'https://syjccloud.com/#/docs/6', checkedAt: '2026-09-27', link: false }, { name: '瞬云维护公告', url: 'https://syjccloud.com/#/dashboard', checkedAt: '2026-09-27', link: false }], performance: { evidenceLevel: null, lastTestedAt: '2026-05-09', testWindow: '16:58 CST（非晚高峰）', testRegion: '香港、台湾、美国、日本、新加坡等多节点', testNetwork: '广东佛山联通 / 2Gbps / 8线程订阅测速', testDevice: 'MiaoKo 自定义测试', latencyMs: null, downloadMbpsRange: '约144-2096Mbps（截图原值 17.96-262.06MB/s，低速节点另见截图）', chatgptResult: '历史记录未覆盖', youtube4kResult: '历史记录未覆盖', stability: '历史单次记录', evidenceSummary: '已补充 2026-05-09 MiaoKo 订阅测速截图；该截图为非晚高峰单次历史记录，当前表现请查看 Siilas。', evidenceSources: [{ name: '瞬云归档订阅测速原图', url: '/shunyuncesu.jpg' }] }, salesSample: 128 },
  { name: '极连云', path: '/posts/jilianyun-review-2026/', image: '/jilianyun.png', price: 18, priceText: '18元/月', traffic: '100GB/月', trial: false, noExpiry: true, dedicatedClient: true, universalSubscription: false, scenarios: ['stable'], status: '稳定观察', risk: '不支持免费试用和通用订阅；不退款；不限时399元600GB已确认，重置费用待核实', summary: '18元/月100GB起，96元/年60GB每月；不限时为399元600GB，9月27日站长补充确认；重置费用仍待核实，不按旧说明推算。提供自有客户端，不支持免费试用和通用订阅；套餐标注IPLC、1倍率及不限客户端数量。', informationSources: [{ name: '极连云不限时价格与流量（站长补充）', url: '/posts/jilianyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '极连云试用与订阅规则（站长补充）', url: '/posts/jilianyun-review-2026/', checkedAt: '2026-09-27', link: false }, { name: '极连云套餐页', url: 'https://roasa.jilianat.homes/#/plans', checkedAt: '2026-09-23', link: false }, { name: '极连云知识库', url: 'https://roasa.jilianat.homes/#/knowledge', checkedAt: '2026-09-23', link: false }] },
  { name: '二猫云', path: '/posts/ermiao-vpn-review/', image: '/ermaoyun.png', price: 20, priceText: '20元/月', traffic: '130GB/月', trial: true, noExpiry: true, dedicatedClient: true, universalSubscription: true, scenarios: ['stable', 'clash', 'chatgpt', 'streaming', 'newbie'], status: '专线观察', risk: '部分套餐价格文案与卡片不一致；退款及旧优惠码待核实', summary: '免费试用1天200GB；20元/月130GB起，每30天刷新；另有89元/年60GB/月及99元100GB、199元200GB不限时包。提供四平台官方客户端，教程支持Clash Mi、Clash Verge Rev、Clash Meta与Shadowrocket；IEPL、解锁及不限速为商家说明。', informationSources: [{ name: '二猫云套餐页', url: 'https://network.ermaotztz3.homes/#/plans', checkedAt: '2026-09-23', link: false }, { name: '二猫云帮助中心', url: 'https://network.ermaotztz3.homes/#/knowledge', checkedAt: '2026-09-23', link: false }, { name: '二猫云客户端下载', url: 'https://network.ermaotztz3.homes/#/dashboard', checkedAt: '2026-09-23', link: false }], performance: { evidenceLevel: null, lastTestedAt: '2026-06-30', testWindow: '14:58 CST（非晚高峰）', testRegion: '香港、台湾、日本、新加坡、美国多节点', testNetwork: '珠海联通 / 9Gbps / 32线程订阅测速', testDevice: 'MiaoKo 自定义测试', latencyMs: null, downloadMbpsRange: '约273-2130Mbps（截图原值 34.10-266.19MB/s）', chatgptResult: '历史记录未覆盖', youtube4kResult: '历史记录未覆盖', stability: '历史单次记录', evidenceSummary: '已补充 2026-06-30 MiaoKo 订阅测速截图；该截图为非晚高峰单次历史记录，当前表现请查看 Siilas。', evidenceSources: [{ name: '二猫云归档订阅测速原图', url: '/ermaoyuncesu.png' }] }, salesSample: 191 },
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
    risk: '不限时标价与说明冲突；不支持免费试用和通用订阅；退款及旧优惠码待核实',
    summary: '不支持免费试用和通用订阅。25元/月150GB起，98元年付每月60GB，周期流量每30天刷新；不限时卡片120元120GB起。提供四端官方客户端，iOS使用Nextin识别码sogoyun。不限时说明中的100元售价和90元重置费与卡片不符，需确认后购买。',
    informationSources: [
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
    risk: '月付体验不参加优惠；不支持免费试用和通用订阅，退款待核实；450GB不限时重置费说明冲突',
    summary: '限时体验15元/月50GB，标准22元/月120GB；98元年付每月45GB，不限时100元100GB或399元450GB。常规套餐展示xk808八折码，体验月付不参加。提供四端客户端，iOS使用Nextin识别码edgenova0526；不支持免费试用和通用订阅。',
    informationSources: [
      { name: '边缘节点试用与订阅规则（站长补充）', url: '/posts/bianyuan-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '边缘节点套餐与优惠说明', url: 'https://zvbghs02.ztymforedge.lol/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '边缘节点客户端下载', url: 'https://zvbghs02.ztymforedge.lol/#/dashboard', checkedAt: '2026-09-27', link: false },
      { name: '边缘节点客户端教程', url: 'https://zvbghs02.ztymforedge.lol/#/knowledge', checkedAt: '2026-09-27', link: false },
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
    risk: '不限时包设备数卡片与详情冲突；不支持试用和通用订阅，退款待核实',
    summary: '24元/月144GB起，109元年付80GB/月；不限时229元160GB、549元420GB、1199元1000GB。提供Android、Windows、Mac官方客户端，iOS使用Nextin及识别码yxr；不限时包详情分别限1、2、3台设备。不支持试用和通用订阅；另收录2026年9月26日用户提供的晚间单次测速截图，专线、AI和流媒体解锁仍为商家说明。',
    informationSources: [
      { name: '隐形人套餐页', url: 'https://wpkhf.invisibleattt.sbs/#/plans', checkedAt: '2026-09-26', link: false },
      { name: '隐形人帮助中心', url: 'https://wpkhf.invisibleattt.sbs/#/knowledge', checkedAt: '2026-09-26', link: false },
      { name: '隐形人客户端下载', url: 'https://wpkhf.invisibleattt.sbs/#/dashboard', checkedAt: '2026-09-26', link: false },
      { name: '用户提供的隐形人单次测速截图', url: '/yinxingren-speedtest-2026-09-26.jpg', checkedAt: '2026-09-26' },
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
    risk: '不支持免费试用；Clash订阅链接需联系客服获取；退款待核实；两档不限时包订单确认页流量额度均显示0GB，与列表100GB／200GB冲突，付款前需核实',
    summary: '24元月付150GB起，另有44元300GB、84元600GB、134元1000GB月付；96元年付60GB/月、180元年付120GB/月，重置费分别15元、30元。不限时包列表标150元100GB、288元200GB，长期不过期；2026年10月5日对应订单确认页均显示流量额度0GB，并提供130元、268元的重置流量选项，未提交订单或付款，实际交付额度待核实。提供四端客户端教程，iOS需外区Apple ID下载Nextin，输入识别码sywl后使用官网账号登录。常规套餐标注不限制同时使用客户端数量，IPLC、1倍率、晚高峰不限速、原生IP、ChatGPT/TikTok与流媒体支持均为商家说明，未新增实测。不支持免费试用；客服可提供Clash订阅链接，退款待核实。',
    informationSources: [
      { name: '闪跃试用与Clash订阅规则（站长补充）', url: '/posts/shanyue-review-2026/', checkedAt: '2026-09-27', link: false },
      { name: '闪跃套餐页', url: 'https://kkj.flashleaptt.xyz/#/plans', checkedAt: '2026-09-27', link: false },
      { name: '闪跃两档不限时包列表与订单确认页（未付款）', url: 'https://kkj.flashleaptt.xyz/?code=msdAwmER#/plans', checkedAt: '2026-10-05', link: false },
      { name: '闪跃四端客户端知识库', url: 'https://kkj.flashleaptt.xyz/#/knowledge', checkedAt: '2026-09-27', link: false },
      { name: '闪跃官方客户端下载', url: 'https://kkj.flashleaptt.xyz/#/dashboard', checkedAt: '2026-09-27', link: false },
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
      { name: '山水云官网邀请入口', url: 'https://sldm1.ssyylf.com/#/register?code=nhEZN9EI', checkedAt: '2026-09-27' },
    ],
  },
  {
    name: "秒秒云", path: "/posts/miaomiaoyun-review-2026/", image: '/shouye.png',
    price: 9, priceText: '9元/月', traffic: '128GB/月',
    trial: false, noExpiry: true, dedicatedClient: false, universalSubscription: true,
    scenarios: ['cheap', 'clash', 'chatgpt', 'streaming'], status: '资料已核对',
    risk: "不支持免费试用；普通套餐退款待核实；59元不限时包额度单位、49.9元365天包刷新量不清楚；特惠说明仅支持年付与订单页可选半年和一年冲突",
    summary: "月付9元128GB、15元256GB、29元512GB；18元季付64GB/月、88元年付100GB/月。10月5日订单页确认：59元一次性不限时包仍写100G/月，49.9元365天200GB包仍写每30天刷新；64G特惠半年39元/一年79元，200G特惠半年99元/一年198元，说明文字却仍写仅支持年付。提供Clash Verge、Clash Meta和Shadowrocket教程；特惠明确不退款。",
    subscriptionClients: ['Clash Verge', 'Clash Meta', 'Shadowrocket'],
    informationSources: [
      { name: '秒秒云套餐与订单确认页', url: 'https://m1.mmycnm.com/#/shop', checkedAt: '2026-10-05', link: false },
      { name: '秒秒云试用规则（站长补充）', url: '/posts/miaomiaoyun-review-2026/', checkedAt: '2026-10-05', link: false },
      { name: '秒秒云客户端教程', url: 'https://m3.mouhiojl.com/#/docs', checkedAt: '2026-09-27', link: false },
      { name: '秒秒云官网邀请入口', url: 'https://m3.mouhiojl.com/#/register?code=kRQzsnp3', checkedAt: '2026-09-27' },
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
      "risk": "不支持免费试用；套餐不退款；仅限5台个人设备；78元包为每月50GB、持续12个月，不属于不限时；119元商品期限与刷新规则仍待核实；新购套餐会替换当前有效套餐",
      "summary": "月付20元150GB、40元300GB、79元600GB，1倍率、5台设备，三款周期套餐购买日重置且不累积。2026年10月10日站长补充确认：78元一次支付，每月50GB，持续12个月，属于有限期限的周期套餐，不计为不限时；具体刷新日和剩余流量处理未确认。119元商品此前标每月100GB，其购后期限与刷新规则仍待核实，不能套用78元档的12个月规则。2026年10月5日订单页提示新购套餐替换当前有效套餐。Windows教程提供Clash Verge Rev及AnyTLS；ChatGPT和流媒体支持为官网声明，未新增实测。2026年9月28日站长补充确认不支持免费试用。",
      "subscriptionClients": [
          "Clash Verge Rev"
      ],
      "informationSources": [
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
    "priceText": "卡片22元/月（正文25元，结算待核实）",
    "traffic": "150GB/月",
    "trial": false,
    "noExpiry": true,
    "dedicatedClient": true,
    "universalSubscription": true,
    "scenarios": [
      "newbie"
    ],
    "status": "资料已核对",
    "risk": "月付卡片22/40/66元与正文25/45/75元冲突；99元不限时包卡片80GB与正文300GB冲突；不支持免费试用；通用订阅向客服领取，具体格式先确认；退款及优惠结算待核实",
    "summary": "不支持免费试用，通用订阅可向客服领取，具体客户端格式先确认。96元年付小包60GB/月，从购买日起每30天刷新。轻云150GB、凌云300GB、御云600GB月付卡片22/40/66元，正文25/45/75元，结算待核实；重置分别22/40/66元且不延长有效期。99元不限时包卡片80GB与正文300GB冲突，199元200GB不限时包两处一致，均不按月刷新，用完重购。Windows账号登录自有客户端，iOS用Nextin识别码yjx，另有Android与Mac教程。yjx888首单七折适用月/季/半年/年付，每人一次不可叠加，排除两年/三年/重置/一次性包；结算未验证。线路、速率及解锁为商家说明。",
    "informationSources": [
      { "name": "云界线试用与订阅规则（站长补充）", "url": "/posts/yunjiexian-review-2026/", "checkedAt": "2026-10-06", "link": false },
      {
        "name": "云界线套餐页",
        "url": "https://www1.yunjiexiant.xyz/#/plans",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "云界线客户端知识库",
        "url": "https://www1.yunjiexiant.xyz/#/knowledge",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "云界线仪表盘与优惠公告",
        "url": "https://www1.yunjiexiant.xyz/#/dashboard",
        "checkedAt": "2026-10-05",
        "link": false
      },
      {
        "name": "云界线官网邀请入口",
        "url": "https://www1.yunjiexiant.xyz/#/?code=y4BofmLr",
        "checkedAt": "2026-10-05"
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
]

export const hiddenAirportStatuses = new Set(['已淘汰', '停止推荐', '下架'])

export const isVisibleAirport = (airport: AirportData) => !hiddenAirportStatuses.has(airport.status)

export const visibleAirportData = airportData.filter(isVisibleAirport)

export const mainRecommendationData = mainRecommendationNames.map((name) => {
  const airport = visibleAirportData.find((item) => item.name === name)
  if (!airport) throw new Error(`Missing main recommendation data for ${name}`)
  return airport
})

// Date of the last full review; partial updates retain their per-source checkedAt dates.
export const airportDataLastReviewed = '2026-08-19'
// Advance for actual changes to current data or its classification, not historical test dates.
export const airportDataLastModified = '2026-10-10'

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
