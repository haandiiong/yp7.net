import snapshot from './data/siilas-tests.json'

export const siilasTestingSnapshot = snapshot
export const getSiilasEvidence = (airportPath: string) => snapshot.airports.find((airport) => airport.yp7Path === airportPath)
