interface NoExpiryPackage {
  priceCny: number | null
  trafficGb: number | null
  priceText: string
  trafficText: string
  status: 'listed' | 'conflicting' | 'unverified'
  deviceLimit: string
  validity: string
  checkedAt: string
  ownerConfirmedAt?: string
  ownerConfirmedScope?: string
}

// These are the entry-level regular one-off packages recorded in the linked
// review pages. Keep their source check dates separate from later policy edits.
const listed = (priceCny: number, trafficGb: number, deviceLimit: string, validity: string, checkedAt: string): NoExpiryPackage => ({
  priceCny, trafficGb, priceText: `${priceCny}元`, trafficText: `${trafficGb}GB`,
  status: 'listed', deviceLimit, validity, checkedAt,
})

export const noExpiryPackages: Record<string, NoExpiryPackage> = {
  '/posts/jisu123-review-2026/': {
    ...listed(128, 1000 / 6, '3台', '不限时间，用完为止；6倍扣量，重购覆盖而不叠加；不支持退款', '2026-10-05'),
    trafficText: '标称1000GB／6倍计费折合约166.7GB',
  },
  '/posts/andycloud-review-2026/': listed(100, 1000, '10台', '无过期日，用完即止；重购覆盖新额度，不叠加剩余流量', '2026-10-05'),
  '/posts/tidal-review-2026/': listed(59, 128, '不限同时在线设备', '永久有效，用完为止；续购叠加及退款适用范围待核实', '2026-10-05'),
  '/posts/yunjiexian-review-2026/': {
  "priceCny": 99,
  "trafficGb": 80,
  "priceText": "99元",
  "trafficText": "80GB",
  "status": "listed",
  "deviceLimit": "不限客户端数量",
  "validity": "永久总量，不按月刷新，用完重购；重购余量处理待核；另有199元200GB包",
  "checkedAt": "2026-10-18",
  "ownerConfirmedAt": "2026-10-19",
  "ownerConfirmedScope": "99元包一次性80GB"
},
  '/posts/lingmaowangluo-review-2026/': listed(100, 100, '不限客户端数量', '不限时，用完为止；手动重置9折，基数待核实', '2026-09-28'),
  '/posts/firefly-review-2026/': listed(100, 100, '不限时档未注明', '永久不过期，用完为止；续购规则待核实', '2026-09-28'),
  '/posts/jisucloud-review-2026/': {
    ...listed(329, 100, '3台', '不限时间，用完为止；10倍计费，单价按折合100GB计算', '2026-10-05'),
    trafficText: '标称1000GB／10倍计费折合100GB',
  },
  '/posts/wuyoulianjie-review-2026/': listed(98, 100, '待核实', '标注永久不限时；重置与续购规则待核实', '2026-09-28'),
  '/posts/shanshuiyun-review-2026/': listed(99, 100, '3台同时在线', '不限时；用完为止，续购规则待核实', '2026-09-27'),
  '/posts/miaomiaoyun-review-2026/': {
  "priceCny": 88,
  "trafficGb": 100,
  "priceText": "88元",
  "trafficText": "100GB",
  "status": "listed",
  "deviceLimit": "3台同时在线",
  "validity": "一次性总量，不限时，用完为止，不按月发放；重购余量处理待核；29.9/49.9元365天包不计入",
  "checkedAt": "2026-10-18",
  "ownerConfirmedAt": "2026-10-19",
  "ownerConfirmedScope": "88元包一次性100GB"
},
  '/posts/jinyun-review-2026/': listed(99, 100, '3台同时在线', '不限时；用完作废，不重置', '2026-09-27'),
  '/posts/jiuyun-review-2026/': {
  "priceCny": 36,
  "trafficGb": 100,
  "priceText": "36元",
  "trafficText": "100GB",
  "status": "listed",
  "deviceLimit": "3台同时在线",
  "validity": "不限时总量；9月22日旧说明不重置、用完作废；当前重购余量及补量细则未列",
  "checkedAt": "2026-10-19"
},
  '/posts/quanqiuyun/': listed(100, 100, '支持多终端及团队并发，具体数量未列', '一次购买总量，永久有效、用完即止；不设到期重置，重购余量待核', '2026-10-18'),
  '/posts/wangji-kuaiche-review/': listed(6.8, 20, '不限设备数', '不限时，用完为止；多套餐按日享→月套餐→永久包扣量', '2026-10-17'),
  '/posts/guangsuyun/': listed(147, 247, '不限设备数（商家标注）', '一次性总量，永久有效、不按月刷新；新包重置、重购及退款规则待核实', '2026-10-18'),
  '/posts/xxyun-review-2026/': listed(66.66, 500, '不限设备数', '一次买断，永久有效、用完为止；重购叠加与重置规则未注明', '2026-10-17'),
  '/posts/flybit-review-2026/': listed(36, 128, '不限设备数', '标注无期限；当前所有节点统一1倍率；续购与剩余流量叠加需确认；套餐标注不退款', '2026-10-15'),
  '/posts/adaxi-review-2026/': listed(50, 300, '不限设备数', '永久总量300GB，限速600Mbps；重购与剩余额度处理待核', '2026-10-17'),
  '/posts/runway-review-2026/': listed(70, 150, '第三方不限连接；新机场账号不提供专属客户端', '不限时；当前重置费、续购与剩余流量处理需确认', '2026-10-16'),
  '/posts/weituyun/': listed(100, 100, '不限时档待核实', '不限时；不自动刷新，续费9折', '2026-09-23'),
  '/posts/99ba-review-2026/': listed(35.9, 111, '同时登录99台', '不限时；不退款；续购与叠加细则待核实', '2026-10-17'),
  '/posts/xunda-review-2026/': listed(66, 300, '5台；仅限个人使用', '不限时；不自动重置，重置56.66元', '2026-09-27'),
  '/posts/ccyz-review-2026/': listed(145, 550, '5台', '不限时；不按月补充流量', '2026-09-27'),
  '/posts/uuone-review-2026/': listed(99, 450, '10台', '无时间限制；叠加规则待核实', '2026-09-23'),
  '/posts/chongshangyunxiao/': listed(365, 800, '不限设备数', '标注永不过期；续购与叠加待核实', '2026-09-23'),
  '/posts/xsus-review-2026/': listed(65, 188, '最多5个IP；同网络多设备计1个IP', '无过期日；再购重置额度，不叠加余量', '2026-09-23'),
  '/posts/tank-review-2026/': listed(50, 100, '2台设备与IP同时连接', '不限时；总流量用完为止', '2026-09-23'),
  '/posts/shunyun-review-2026/': listed(260, 2000, '不限客户端数量；仅限个人', '无到期日；不自动重置，重置234元', '2026-09-27'),
  '/posts/jilianyun-review-2026/': {
    priceCny: 399, trafficGb: 600, priceText: '399元', trafficText: '600GB', status: 'listed',
    deviceLimit: '不限同时使用客户端数量', validity: '不限时；重置按对应套餐费用90%为359.10元，重置后额度与余量处理未列', checkedAt: '2026-09-23', ownerConfirmedAt: '2026-10-20', ownerConfirmedScope: '重置费为对应套餐费用90%；价格与流量另据9月27日确认',
  },
  '/posts/ermiao-vpn-review/': {
    ...listed(100, 100, '不限设备数（当前卡片）', '长期有效；可补充流量，费用与重购余量处理待核实', '2026-10-18'),
    ownerConfirmedAt: '2026-10-18', ownerConfirmedScope: '卡片报价与付款周期',
  },
  '/posts/huanyuyun-review-2026/': listed(158, 1000, '不限在线设备或客户端数量', '不限时；按总流量使用', '2026-09-27'),
  '/posts/yifanyun-review-2026/': listed(100, 100, '不限设备数', '长期有效；常规包，另有中秋限售包', '2026-09-27'),
  '/posts/sogo-review-2026/': {
    ...listed(120, 120, '不限设备数', '不限时；不自动刷新；重置按卡片价90%为108元，余量处理与重置交付规则待核', '2026-09-27'),
    ownerConfirmedAt: '2026-10-18', ownerConfirmedScope: '卡片价格与重置费用',
  },
  '/posts/bianyuan-review-2026/': {
    ...listed(100, 100, '不限设备数', '不限时；不自动刷新；重置按对应套餐费用90%为90元，重置后额度与余量处理未列', '2026-09-27'),
    ownerConfirmedAt: '2026-10-20', ownerConfirmedScope: '重置费为对应套餐费用90%',
  },
  '/posts/yuzhoucloud-review-2026/': listed(110, 120, '不限设备数', '不限时；可补充流量，费用待核实', '2026-09-27'),
  '/posts/kexinyun-review-2026/': listed(50, 50, '不限设备数', '标注永久不限时；不参与活动', '2026-09-27'),
  '/posts/xingdaomeng-review-2026/': listed(100, 100, '不限设备数', '不限时；不自动重置，手动重置9折', '2026-09-27'),
  '/posts/yinxingren-review-2026/': {
    ...listed(229, 160, '不限设备数', '无时间限制；全部套餐不限制设备数量；续购余量规则待核', '2026-09-26'),
    ownerConfirmedAt: '2026-10-18', ownerConfirmedScope: '全部套餐不限设备',
  },
  '/posts/kuajieyun-review-2026/': listed(200, 300, '不限设备登录数', '长期有效；不自动刷新，重置180元', '2026-09-27'),
  '/posts/shanyue-review-2026/': {
    ...listed(150, 100, '不限时档未注明', '不限时总量；当前重置报价130元，预览0GB不作实际交付量；重置后额度与余量处理待核', '2026-10-20'),
    ownerConfirmedAt: '2026-10-18', ownerConfirmedScope: '首次交付流量',
  },
}

export const noExpiryColumns = ['机场', '一次付款金额', '一次性总流量', '每GB成本', '设备限制', '有效期与重置', '套餐核验日期']
export const noExpiryComparisonNotice = '按已核对的不限时入门包比较，金额为未扣优惠的整笔标价。每GB成本＝一次付款金额÷一次性总流量，保留三位小数；明确统一计费倍率时按折合传输额度计算，并在流量列注明。价格、流量或有效期存在冲突时不计算。各行注明官网套餐核验日期，后续站长补充单独记录，不代表当天重新核对全部官网或性能。'

export const getNoExpiryPackage = (path: string) => {
  const record = noExpiryPackages[path]
  if (!record) throw new Error(`Missing no-expiry package record: ${path}`)
  return {
    ...record,
    unitPriceCnyPerGb: record.status === 'listed' && record.priceCny !== null && record.trafficGb !== null && record.trafficGb > 0
      ? Number((record.priceCny / record.trafficGb).toFixed(3)) : null,
    sourcePage: path,
    currency: 'CNY' as const,
    billing: 'one-off' as const,
  }
}

export const getNoExpiryCells = (path: string) => {
  const record = getNoExpiryPackage(path)
  return [record.priceText, record.trafficText,
    record.unitPriceCnyPerGb === null ? '待核实，不计算' : `${record.unitPriceCnyPerGb.toFixed(3)}元/GB`,
    record.deviceLimit, record.validity, record.ownerConfirmedAt
      ? `${record.checkedAt}官网；${record.ownerConfirmedAt}站长确认${record.ownerConfirmedScope || '价格与流量'}`
      : record.checkedAt]
}
