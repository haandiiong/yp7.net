import assert from 'node:assert/strict'
import test from 'node:test'
import { buildRelatedAirports } from './lib/related-airports.mjs'
import { loadConfig } from './lib/load-config.mjs'
import { getAirportRelatedLinks } from './sync-airport-review-sections.mjs'

const airport = (path, scenarios = ['clash']) => ({ path, scenarios, price: 15, dedicatedClient: false, universalSubscription: true })
const paths = (related) => [...related].map(([path, peers]) => [path, peers.map((peer) => peer.path)])
const incomingCounts = (airports, related) => airports.map((item) => [...related.values()]
  .flat().filter((peer) => peer.path === item.path).length)

test('related links only use distinct peers with a shared use case', () => {
  const airports = [airport('/a/'), airport('/b/'), airport('/c/', ['streaming']), airport('/d/', [])]
  const related = buildRelatedAirports(airports)
  assert.deepEqual(paths(related), [['/a/', ['/b/']], ['/b/', ['/a/']], ['/c/', []], ['/d/', []]])
})

test('equally relevant peers receive balanced links independent of source order', () => {
  const airports = Array.from({ length: 10 }, (_, index) => airport(`/airport-${index}/`))
  const related = buildRelatedAirports(airports)
  const counts = incomingCounts(airports, related)
  assert.deepEqual(paths(related), paths(buildRelatedAirports([...airports].reverse())))
  assert.equal([...related.values()].every((peers) => peers.length === 3), true)
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1)
})

test('equally represented peers are ordered by shared use cases and subscription fit', () => {
  const airports = [airport('/a/', ['clash', 'streaming']), airport('/b/', ['clash']),
    airport('/c/', ['clash', 'streaming']), airport('/d/', ['streaming'])]
  const related = buildRelatedAirports(airports, 1)
  assert.equal(related.get('/a/')[0].path, '/c/')
})

test('production recommendations cover all eligible airports without unrelated padding', () => {
  const { visibleAirportData } = loadConfig('airports.ts')
  const related = buildRelatedAirports(visibleAirportData)
  for (const airport of visibleAirportData) {
    const peers = related.get(airport.path)
    assert.equal(new Set(peers.map((peer) => peer.path)).size, peers.length)
    assert.ok(peers.length <= 3)
    assert.ok(peers.every((peer) => peer.path !== airport.path
      && peer.scenarios.some((scenario) => airport.scenarios.includes(scenario))))
    const eligible = visibleAirportData.some((peer) => peer.path !== airport.path
      && peer.scenarios.some((scenario) => airport.scenarios.includes(scenario)))
    if (eligible) assert.ok([...related.values()].flat().some((peer) => peer.path === airport.path), airport.name)
  }
})

test('review footers keep one recommendation entry and only relevant, distinct destinations', () => {
  const { airportData, visibleAirportData, hiddenAirportStatuses } = loadConfig('airports.ts')
  const { airportCollections } = loadConfig('airport-collections.ts')
  const related = buildRelatedAirports(visibleAirportData, 2)
  const names = new Map(airportData.map((item) => [item.path, item.name]))
  const visiblePaths = new Set(visibleAirportData.map((item) => item.path))

  for (const item of airportData) {
    const links = getAirportRelatedLinks(item, related, names, hiddenAirportStatuses, airportCollections)
    const destinations = links.map((link) => link.link)
    assert.equal(new Set(destinations).size, destinations.length, item.name)
    assert.ok(destinations.length >= 3 && destinations.length <= 5, item.name)
    assert.equal(destinations.filter((path) => path.startsWith('/posts/jichang/')).length, 1, item.name)
    assert.ok(destinations.includes('/risk-monitor/'), item.name)
    const peers = destinations.filter((path) => visiblePaths.has(path))
    if (hiddenAirportStatuses.has(item.status)) {
      assert.deepEqual(destinations, ['/risk-monitor/', '/methodology/', '/posts/jichang/'])
    } else {
      assert.ok(peers.length <= 2 && peers.every((path) => path !== item.path), item.name)
    }
  }

  const linkedPeers = [...related.values()].flat().map((item) => item.path)
  for (const item of visibleAirportData) {
    const hasPeer = visibleAirportData.some((peer) => peer.path !== item.path
      && peer.scenarios.some((scenario) => item.scenarios.includes(scenario)))
    if (hasPeer) assert.ok(linkedPeers.includes(item.path), item.name)
  }
})
