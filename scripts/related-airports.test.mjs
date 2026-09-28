import assert from 'node:assert/strict'
import test from 'node:test'
import { buildRelatedAirports } from './lib/related-airports.mjs'
import { loadConfig } from './lib/load-config.mjs'

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
