const nonempty = (value) => typeof value === 'string' && value.trim().length > 0

// Older receipts did not preserve the source's confirmed experience methods.
// Only a complete structured receipt can qualify the generic experience labels.
const confirmedMethods = (snapshot) => {
  const methods = snapshot.methodology?.experienceMethods
  const streaming = methods?.streaming
  const chatgpt = methods?.chatgpt
  if (!/^\d{4}-\d{2}-\d{2}$/.test(methods?.confirmedAt ?? '')
    || !nonempty(streaming?.platform) || !nonempty(streaming?.quality)
    || !Number.isInteger(streaming?.seekCount) || streaming.seekCount <= 0
    || !nonempty(streaming?.measurement) || !nonempty(chatgpt?.measurement)
    || !Array.isArray(chatgpt?.responseTiers) || chatgpt.responseTiers.length < 2) return null

  let previous = 0
  for (const [index, tier] of chatgpt.responseTiers.entries()) {
    if (!nonempty(tier?.label) || !nonempty(tier?.status)
      || !Number.isFinite(tier?.score) || tier.score < 0 || tier.score > 100) return null
    if (index === chatgpt.responseTiers.length - 1) {
      if (tier.maxSeconds !== null) return null
    } else {
      if (!Number.isFinite(tier.maxSeconds) || tier.maxSeconds <= previous) return null
      previous = tier.maxSeconds
    }
  }
  return methods
}

export const renderSiilasExperienceMethods = (snapshot, field = 'all') => {
  const methods = confirmedMethods(snapshot)
  if (!methods) return ''
  const parts = []
  if (field === 'all' || field === 'streaming') {
    const { platform, quality, seekCount, measurement } = methods.streaming
    parts.push(`${platform} ${quality} 画质：拖动进度条 ${seekCount} 次，分别观察${measurement}。`)
  }
  if (field === 'all' || field === 'chatgpt') {
    const { measurement, responseTiers } = methods.chatgpt
    parts.push(`ChatGPT：观察${measurement}；${responseTiers.length} 档为${responseTiers.map((tier) => `${tier.label}＝${tier.status}（${tier.score} 分）`).join('；')}。`)
  }
  if (!parts.length) return ''
  return `**Siilas 已确认的体验方法（${methods.confirmedAt}）：**${parts.join('')}方法说明不为历史记录补写具体首答秒数、三次缓冲秒数或视频信息；单条记录仍以原始填写内容为准。`
}
