import { historicalTestingNotice, isVisibleAirport } from './airports'
import type { AirportData } from './airports'
import { hostname } from './site'
import { getNoExpiryPackage } from './no-expiry-packages'

// JSON, Markdown and HTML all consume this public shape. Historical evidence must
// keep its explicit status instead of being confused with current test results.
export const serializeAirport = (airport: AirportData) => {
  const { performance, ...publicAirport } = airport
  return {
    ...publicAirport,
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
