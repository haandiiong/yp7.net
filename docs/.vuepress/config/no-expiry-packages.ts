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
    priceCny: 99, trafficGb: null, priceText: '99元', trafficText: '卡片80GB／正文300GB（冲突）', status: 'conflicting',
    deviceLimit: '不限客户端数量', validity: '标注不限时，不按月刷新、用完重购；交付额度待核实；另有199元200GB包', checkedAt: '2026-10-05',
  },
  '/posts/yuntu-review-2026/': {
    priceCny: 78, trafficGb: null, priceText: '78元', trafficText: '标题50GB／正文每月50GB（冲突）', status: 'conflicting',
    deviceLimit: '5台', validity: '两档订单页均写每月流量且提示新购替换现有套餐；销售窗口、购后有效期与刷新规则未明', checkedAt: '2026-10-05',
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
    priceCny: 59, trafficGb: null, priceText: '59元', trafficText: '商品100GB／正文100GB每月（冲突）', status: 'conflicting',
    deviceLimit: '3台同时在线', validity: '10月5日订单页标注不限时但也写100G/月；总量及刷新规则待确认', checkedAt: '2026-10-05',
  },
  '/posts/jinyun-review-2026/': listed(99, 100, '3台同时在线', '不限时；用完作废，不重置', '2026-09-27'),
  '/posts/jiuyun-review-2026/': listed(36, 100, '3台同时在线', '不限时；不重置，用完作废', '2026-09-22'),
  '/posts/quanqiuyun/': listed(100, 100, '不限时档待核实', '无到期日；不自动重置', '2026-09-11'),
  '/posts/wangji-kuaiche-review/': listed(6.8, 20, '不限设备数', '不限时；不按月清零，用完为止', '2026-09-10'),
  '/posts/guangsuyun/': listed(680, 1000, '不限时档待核实', '无时间限制；不自动重置，重置612元', '2026-09-16'),
  '/posts/xxyun-review-2026/': {
    priceCny: null, trafficGb: null, priceText: '待核实', trafficText: '待核实', status: 'unverified',
    deviceLimit: '不限时档待核实', validity: '已见不限时入口；具体规则待核实', checkedAt: '2026-09-10',
  },
  '/posts/flybit-review-2026/': listed(36, 128, '不限设备数，支持家庭共享', '不限时；按用量扣除，用完后按规则续购', '2026-09-08'),
  '/posts/adaxi-review-2026/': listed(50, 300, '不限设备数', '标注永不过期；限速600Mbps', '2026-09-16'),
  '/posts/runway-review-2026/': listed(45, 150, '专属客户端3台；第三方不限连接', '不限时；手动重置45元', '2026-09-27'),
  '/posts/weituyun/': listed(100, 100, '不限时档待核实', '不限时；不自动刷新，续费9折', '2026-09-23'),
  '/posts/99ba-review-2026/': listed(35.9, 111, '同时登录99台', '不限时；续购与叠加细则待核实', '2026-09-07'),
  '/posts/xunda-review-2026/': listed(66, 300, '5台；仅限个人使用', '不限时；不自动重置，重置56.66元', '2026-09-27'),
  '/posts/ccyz-review-2026/': listed(145, 550, '5台', '不限时；不按月补充流量', '2026-09-27'),
  '/posts/uuone-review-2026/': listed(99, 450, '10台', '无时间限制；叠加规则待核实', '2026-09-23'),
  '/posts/chongshangyunxiao/': listed(365, 800, '不限设备数', '标注永不过期；续购与叠加待核实', '2026-09-23'),
  '/posts/xsus-review-2026/': listed(65, 188, '最多5个IP；同网络多设备计1个IP', '无过期日；再购重置额度，不叠加余量', '2026-09-23'),
  '/posts/tank-review-2026/': listed(50, 100, '2台设备与IP同时连接', '不限时；总流量用完为止', '2026-09-23'),
  '/posts/shunyun-review-2026/': listed(260, 2000, '不限客户端数量；仅限个人', '无到期日；不自动重置，重置234元', '2026-09-27'),
  '/posts/jilianyun-review-2026/': {
    priceCny: 399, trafficGb: 600, priceText: '399元', trafficText: '600GB', status: 'listed',
    deviceLimit: '不限同时使用客户端数量', validity: '不限时；重置费待核实', checkedAt: '2026-09-23', ownerConfirmedAt: '2026-09-27',
  },
  '/posts/ermiao-vpn-review/': listed(99, 100, '卡片不限；帮助中心提示按套餐限制，待确认', '长期有效；可补充流量，费用待核实', '2026-09-23'),
  '/posts/huanyuyun-review-2026/': listed(158, 1000, '不限在线设备或客户端数量', '不限时；按总流量使用', '2026-09-27'),
  '/posts/yifanyun-review-2026/': listed(100, 100, '不限设备数', '长期有效；常规包，另有中秋限售包', '2026-09-27'),
  '/posts/sogo-review-2026/': {
    priceCny: null, trafficGb: 120, priceText: '卡片120元／正文100元（冲突）', trafficText: '120GB', status: 'conflicting',
    deviceLimit: '不限设备数', validity: '不限时；不自动刷新，重置费待核实', checkedAt: '2026-09-27',
  },
  '/posts/bianyuan-review-2026/': listed(100, 100, '不限设备数', '不限时；不自动刷新，重置90元', '2026-09-27'),
  '/posts/yuzhoucloud-review-2026/': listed(110, 120, '不限设备数', '不限时；可补充流量，费用待核实', '2026-09-27'),
  '/posts/kexinyun-review-2026/': listed(50, 50, '不限设备数', '标注永久不限时；不参与活动', '2026-09-27'),
  '/posts/xingdaomeng-review-2026/': listed(100, 100, '不限设备数', '不限时；不自动重置，手动重置9折', '2026-09-27'),
  '/posts/yinxingren-review-2026/': listed(229, 160, '详情1台／卡片不限（冲突）', '无时间限制；设备规则需先确认', '2026-09-26'),
  '/posts/kuajieyun-review-2026/': listed(200, 300, '不限设备登录数', '长期有效；不自动刷新，重置180元', '2026-09-27'),
  '/posts/shanyue-review-2026/': {
    priceCny: 150, trafficGb: null, priceText: '150元', trafficText: '列表100GB／订单确认页0GB（冲突）', status: 'conflicting',
    deviceLimit: '不限时档未注明', validity: '标注不限时；订单确认页重置选项130元，交付额度待核实', checkedAt: '2026-10-05',
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
      ? `${record.checkedAt}官网；${record.ownerConfirmedAt}站长确认价格与流量`
      : record.checkedAt]
}
