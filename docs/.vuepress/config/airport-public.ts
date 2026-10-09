import { historicalTestingNotice, isVisibleAirport } from './airports'
import type { AirportData } from './airports'
import { hostname } from './site'
import { getNoExpiryPackage } from './no-expiry-packages'
import { getSiilasEvidence, siilasTestingSnapshot } from './siilas-evidence'

// JSON, Markdown and HTML all consume this public shape. Historical evidence must
// keep its explicit status instead of being confused with current test results.
export const serializeAirport = (airport: AirportData) => {
  const { performance, ...publicAirport } = airport
  const siilasEvidence = getSiilasEvidence(airport.path)
  const { tests: _rawTests, ...siilasSummary } = siilasEvidence || { tests: [] }
  return {
    ...publicAirport,
    ...(siilasEvidence ? { siilasEvidence: {
      ...siilasSummary,
      rawRecordsUrl: `${hostname}/data/siilas-tests.json`,
      receivedAt: siilasTestingSnapshot.receivedAt,
      sourcePublicationStatus: siilasTestingSnapshot.source.publicationStatus,
      sourcePublicationNotice: siilasTestingSnapshot.source.publicationNotice,
      methodologyUrl: siilasTestingSnapshot.source.methodologyUrl,
      experienceNotice: siilasTestingSnapshot.methodology.experienceNotice,
    } } : {}),
    ...(airport.noExpiry !== false && isVisibleAirport(airport) ? { noExpiryPackage: getNoExpiryPackage(airport.path) } : {}),
    ...(performance ? {
      historicalEvidence: {
        evidenceLevel: performance.evidenceLevel,
        lastTestedAt: performance.lastTestedAt,
        testWindow: performance.testWindow,
        testRegion: performance.testRegion,
        testNetwork: performance.testNetwork,
        testDevice: performance.testDevice,
        latencyMs: performance.latencyMs,
        downloadMbpsRange: performance.downloadMbpsRange,
        evidenceSummary: performance.evidenceSummary,
        evidenceSources: performance.evidenceSources || [],
        recordStatus: 'historical' as const,
        recordNotice: historicalTestingNotice,
      },
    } : {}),
    url: `${hostname}${airport.path}`,
  }
}

export type PublicAirportData = ReturnType<typeof serializeAirport>
