import { createHash } from 'node:crypto'

const stableJson = (value) => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right)))
  : item)
const sha256 = (value) => createHash('sha256').update(stableJson(value)).digest('hex')
const identity = (slug, id) => JSON.stringify([slug, id])
const rawRecord = (record) => {
  const { publication, evidenceUrl, evidenceUrls, ...raw } = record
  return raw
}
const imageItems = (record) => {
  const byPath = new Map()
  for (const image of [
    ...(record.evidenceImage ? [{ label: '测速截图', path: record.evidenceImage }] : []),
    ...(record.evidenceImages ?? []),
  ]) {
    if (!image.path || !image.label) throw new Error(`证据缺少标签或路径：${record.id}`)
    if (!byPath.has(image.path)) byPath.set(image.path, image)
  }
  return [...byPath.values()]
}
const legacyStatus = (record, snapshot) => {
  if (snapshot?.source.publicationStatus === 'published') return 'published'
  const dates = snapshot?.source.unpublishedTestDates
  if (snapshot?.source.publicationStatus === 'local-unpublished' && Array.isArray(dates) && dates.length) {
    return dates.includes(record.testedAt) ? 'pending' : 'published'
  }
  return 'pending'
}

// An accepted version contains both the complete submitted record and local
// evidence file hashes. Dates and record IDs alone cannot identify a version.
export const applySiilasPublication = (airports, accepted, {
  origin = 'https://siilas.com',
  evidenceSha256,
  sourceFilesSha256 = {},
  sourcePublished = false,
} = {}) => {
  const acceptedRecords = new Map()
  const acceptedPending = new Set((accepted?.source.pendingRecords ?? [])
    .map(({ airportSlug, recordId }) => identity(airportSlug, recordId)))
  for (const airport of accepted?.airports ?? []) for (const record of airport.tests ?? []) {
    const key = identity(airport.slug, record.id)
    if (acceptedRecords.has(key)) throw new Error(`接受快照含重复记录：${airport.slug}/${record.id}`)
    acceptedRecords.set(key, record)
  }
  const pendingRecords = []
  const currentRecords = new Set()
  const annotated = airports.map((airport) => {
    const tests = (airport.tests ?? []).map((input) => {
      const raw = rawRecord(input)
      const key = identity(airport.slug, raw.id)
      if (!airport.slug || !raw.id || currentRecords.has(key)) throw new Error(`来源含缺失或重复的机场/记录 ID：${airport.slug}/${raw.id}`)
      currentRecords.add(key)
      const images = imageItems(raw).map(({ label, path }) => {
        const hash = evidenceSha256?.(path)
        if (!hash || !/^[a-f0-9]{64}$/.test(hash)) throw new Error(`无法记录证据版本：${airport.slug}/${raw.id} ${path}`)
        return { label, url: new URL(path, origin).href, sha256: hash }
      })
      const versionSha256 = sha256({ record: raw, evidenceVersions: images })
      const previous = acceptedRecords.get(key)
      let status = 'pending'
      if (sourcePublished) status = 'published'
      else if (acceptedPending.has(key)) status = 'pending'
      else if (previous?.publication) {
        // A repeated receipt/check never clears an existing pending version.
        const previousImages = (previous.publication.evidenceVersions ?? []).map(({ label, url, sha256: hash }) => ({ label, url, sha256: hash }))
        const acceptedVersion = sha256({ record: rawRecord(previous), evidenceVersions: previousImages })
        if (previous.publication.status === 'published' && previous.publication.versionSha256 === acceptedVersion
          && acceptedVersion === versionSha256) status = 'published'
      } else if (previous && legacyStatus(previous, accepted) === 'published'
        && stableJson(rawRecord(previous)) === stableJson(raw)
        && !images.length) {
        // Legacy snapshots cannot prove that an image at the same URL has not
        // changed. Migrate those unknown image versions conservatively.
        status = 'published'
      }
      const publication = {
        status,
        versionSha256,
        evidenceVersions: images.map((image) => ({ ...image, status })),
      }
      if (status === 'pending') pendingRecords.push({ airportSlug: airport.slug, recordId: raw.id, versionSha256 })
      return {
        ...raw,
        ...(raw.evidenceImage ? { evidenceUrl: new URL(raw.evidenceImage, origin).href } : {}),
        ...(images.length ? { evidenceUrls: images.map(({ url }) => url) } : {}),
        publication,
      }
    })
    const testsById = new Map(tests.map((record) => [record.id, record]))
    return {
      ...airport,
      tests,
      latestRegionTests: (airport.latestRegionTests ?? []).map(({ region, test }) => {
        const annotatedTest = test ? testsById.get(test.id) : null
        if (test && !annotatedTest) throw new Error(`最新地区摘要没有对应原始记录：${airport.slug}/${test.id}`)
        return { region, test: annotatedTest }
      }),
    }
  })
  const publicationStatus = sourcePublished
    || (accepted?.source.publicationStatus === 'published' && !pendingRecords.length
      && stableJson(sourceFilesSha256) === stableJson(accepted.source.sourceFilesSha256))
    ? 'published' : 'local-unpublished'
  const unpublishedTestDates = [...new Set(annotated.flatMap((airport) => airport.tests
    .filter((record) => record.publication.status === 'pending').map((record) => record.testedAt)))].sort()
  return {
    airports: annotated,
    publicationStatus,
    publicationNotice: publicationStatus === 'published'
      ? '已核对 Siilas 来源正式发布版本。'
      : pendingRecords.length
        ? `本次接收有 ${pendingRecords.length} 条记录或证据版本仍待发布，来源页面与截图可能还是旧版。`
        : 'Siilas 来源更新仍待发布，来源页面可能还是旧版。',
    pendingRecords,
    // Kept for old consumers only; record/evidence publication is authoritative.
    unpublishedTestDates,
  }
}
