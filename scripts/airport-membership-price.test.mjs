import assert from 'node:assert/strict'
import test from 'node:test'
import { loadConfig } from './lib/load-config.mjs'
import { getAirportMembershipLinks } from './sync-airport-review-sections.mjs'

const { airportData, hiddenAirportStatuses, getAirportPriceMetrics } = loadConfig('airports.ts')
const { airportCollections } = loadConfig('airport-collections.ts')
const byName = (name) => airportData.find((airport) => airport.name === name)
const membershipPaths = (airport, collections = airportCollections) => getAirportMembershipLinks(airport, collections, hiddenAirportStatuses).map((link) => link.link)

test('Siilas-recorded airports join both evidence pages without changing other curated memberships', () => {
  const airport = byName('XSUS')
  assert.ok(airport.scenarios.includes('clash'))
  assert.ok(airport.scenarios.includes('streaming'))
  const paths = membershipPaths(airport)
  assert.ok(!paths.includes('/rankings/clash/'))
  assert.ok(paths.includes('/rankings/chatgpt/'))
  assert.ok(paths.includes('/rankings/streaming/'))
  assert.ok(!paths.includes('/posts/jichang-tuijian/'))
  assert.ok(paths.includes('/posts/jichang-heji/'))
  assert.ok(paths.includes('/rankings/cheap/'))
  assert.ok(paths.includes('/rankings/no-expiry/'))
})

test('AI and streaming scenario tags alone do not place an airport on evidence pages', () => {
  const airport = byName('U1S1')
  assert.ok(airport.scenarios.includes('chatgpt'))
  assert.ok(airport.scenarios.includes('streaming'))
  const paths = membershipPaths(airport)
  assert.ok(!paths.includes('/rankings/chatgpt/'))
  assert.ok(!paths.includes('/rankings/streaming/'))
  assert.ok(paths.includes('/posts/jichang-heji/'))
})

test('membership follows a changed editorial collection without changing scenario tags', () => {
  const airport = byName('Flybit')
  const before = membershipPaths(airport)
  assert.ok(before.includes('/posts/jichang-tuijian/'))
  assert.ok(before.includes('/rankings/clash/'))
  const collections = {
    ...airportCollections,
    clash: { ...airportCollections.clash, items: airportCollections.clash.items.filter((item) => item.path !== airport.path) },
  }
  const after = membershipPaths(airport, collections)
  assert.ok(!after.includes('/rankings/clash/'))
  assert.ok(after.includes('/posts/jichang-tuijian/'))
  assert.ok(airport.scenarios.includes('clash'))
})

test('hidden airports only belong to risk monitoring even if an old collection contains them', () => {
  const airport = { ...byName('Flybit'), status: '停止推荐' }
  assert.deepEqual(membershipPaths(airport), ['/risk-monitor/'])
})

test('introductory entry statistics preserve 8.9 while normal-cycle statistics use 30', () => {
  const airport = byName('极速Cloud')
  assert.equal(airport.price, 8.9)
  assert.equal(airport.regularPrice, 30)
  assert.deepEqual(getAirportPriceMetrics([airport]), {
    cheapUnderTenCount: 1, averagePrice: 8.9,
    regularCheapUnderTenCount: 0, regularAveragePrice: 30,
  })
  assert.equal(airport.price, 8.9)
})

test('normal references retain their price and hidden records do not affect either statistic', () => {
  const ordinary = { ...byName('九云'), price: 6, regularPrice: undefined }
  const hidden = { ...byName('极速Cloud'), status: '停止推荐' }
  assert.deepEqual(getAirportPriceMetrics([ordinary, hidden]), {
    cheapUnderTenCount: 1, averagePrice: 6,
    regularCheapUnderTenCount: 1, regularAveragePrice: 6,
  })
  assert.deepEqual(getAirportPriceMetrics([]), {
    cheapUnderTenCount: 0, averagePrice: 0,
    regularCheapUnderTenCount: 0, regularAveragePrice: 0,
  })
})
