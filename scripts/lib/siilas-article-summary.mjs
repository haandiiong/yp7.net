export const renderSiilasSummary = (airport, snapshot) => {
  const cell = (value) => String(value ?? '未记录').replace(/\|/g, '\\|').replace(/\n/g, ' ')
  const firstDate = airport.tests.map((test) => test.testedAt).sort()[0]
  const score = airport.score === null ? '样本不足，暂无综合评分' : `${airport.score}/10`
  const pendingCount = airport.tests.filter((test) => test.publication?.status === 'pending').length
  const publicationNotice = snapshot.source.publicationStatus === 'published' ? snapshot.source.publicationNotice
    : pendingCount ? `本页有 ${pendingCount} 条记录或证据版本仍待发布，来源页面与截图可能还是旧版。`
      : snapshot.source.publicationNotice
  const imageLink = (test, url, fallbackLabel) => {
    const version = test.publication?.evidenceVersions?.find((image) => image.url === url)
    const pending = test.publication?.status === 'pending' || version?.status === 'pending'
    const label = version?.label ?? test.evidenceImages?.find(({ path }) => new URL(path, snapshot.source.origin).href === url)?.label ?? fallbackLabel
    return `[${label}${pending ? '（待发布）' : ''}](${url})`
  }
  const rows = airport.latestRegionTests.map(({ region, test }) => {
    if (!test) return `| ${region} | 未测试 | — | — | — | 待测试 | 待测试 | — |`
    const pending = test.publication?.status === 'pending'
    const imageUrls = test.evidenceUrls ?? [...new Set([
      test.evidenceUrl,
      ...(test.evidenceImages ?? []).map(({ path }) => new URL(path, snapshot.source.origin).href),
    ].filter(Boolean))]
    const evidence = [
      test.resultUrl ? `[Speedtest](${test.resultUrl})` : '',
      ...imageUrls.map((url, index) => imageLink(test, url, `截图${imageUrls.length > 1 ? index + 1 : ''}`)),
    ].filter(Boolean).join(' · ')
    return `| ${[region, `${test.testedAt} ${test.time ?? '时间未记录'}${pending ? '（待发布）' : ''}`, test.downloadMbps, test.uploadMbps, test.latencyMs ?? '未记录', test.chatgpt, test.streaming, evidence].map(cell).join(' | ')} |`
  })
  const clients = [...new Set(airport.latestRegionTests.map(({ test }) => test?.client).filter(Boolean))].join('、') || '未记录'
  const measurementTools = [...new Set(airport.latestRegionTests.map(({ test }) => test?.measurementTool).filter(Boolean))].join('、') || '未记录'
  const latestIds = new Set(airport.latestRegionTests.map(({ test }) => test?.id))
  const otherEvidence = airport.tests.filter((test) => test.evidenceImages?.length && !latestIds.has(test.id))
    .map((test) => `- ${test.testedAt} ${test.time ?? '时间未记录'} ${test.node}：${test.evidenceImages
      .map(({ label, path }) => imageLink(test, new URL(path, snapshot.source.origin).href, label)).join(' · ')}`)
  return [
    '<!-- siilas-testing:start -->',
    '## Siilas 测速与使用体验记录',
    '',
    `${snapshot.receivedAt} 接收 [Siilas ${airport.name}原始记录](${airport.sourceUrl}) **${airport.verifiedTestCount} 条已验证测速**，覆盖 ${airport.testDateCount} 个不同测试日，采样跨度为 ${firstDate} 至 ${airport.latestTestAt}。接收日期不是测速日期；yp7.net 没有重新测速或重新核价。`,
    '',
    `${publicationNotice}完整记录、测试环境与证据见[接收快照](/data/siilas-tests.json)。`,
    '',
    `Siilas 当前规则计算的综合评分为 **${score}**，参评要求为四地区各至少 ${snapshot.methodology.minimumDaysPerRegion} 个不同测试日。评分来自其全部有效样本，含所列性价比计分套餐；它不直接改写 yp7.net 推荐顺序。[查看 Siilas 评分方法](${snapshot.source.methodologyUrl})。`,
    '',
    '各地区最新一条记录分别如下，时间为北京时间。不同地区的最近日期可能不同：',
    '',
    '| 地区 | 样本时间 | 下载 Mbps | 上传 Mbps | 空闲延迟 ms | ChatGPT | 流媒体 | 原始证据 |',
    '| --- | --- | ---: | ---: | ---: | --- | --- | --- |',
    ...rows,
    '',
    ...(otherEvidence.length ? ['附加应用证据保留原采样日期，不作为测速截图：', '', ...otherEvidence, ''] : []),
    `上述最近记录所列代理客户端：${clients}；测速工具：${measurementTools}。每条原始记录保留自己的网络、设备和工具字段，未记录的历史条件不套用到新样本。`,
    '',
    'ChatGPT、流媒体是提交者的定性体验；Speedtest 佐证测速数值，不证明各平台解锁、其他 AI 服务或长期稳定性。Siilas 与 yp7.net 由同一站长运营，不能当作独立第三方背书。',
    '<!-- siilas-testing:end -->',
  ].join('\n')
}
