import { historicalTestingNotice } from './airports'
import type { AirportData } from './airports'
import { hostname } from './site'

// JSON, Markdown and HTML all consume this public shape. Historical evidence must
// keep its explicit status instead of being confused with current test results.
export const serializeAirport = (airport: AirportData) => {
  const { performance, ...publicAirport } = airport
  return {
    ...publicAirport,
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
        recordStatus: 'historical' as const,
        recordNotice: historicalTestingNotice,
      },
    } : {}),
    url: `${hostname}${airport.path}`,
  }
}

export type PublicAirportData = ReturnType<typeof serializeAirport>
