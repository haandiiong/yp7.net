const comparePaths = (left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0

const relevance = (airport, candidate) => {
  const common = airport.scenarios.filter((scenario) => candidate.scenarios.includes(scenario)).length
  const union = new Set([...airport.scenarios, ...candidate.scenarios]).size
  const sameSubscription = airport.universalSubscription !== null
    && airport.universalSubscription === candidate.universalSubscription
  const sameClient = airport.dedicatedClient === candidate.dedicatedClient
  const priceDifference = Math.abs(airport.price - candidate.price)

  return common / union * 10 + Number(sameSubscription) + Number(sameClient) + 1 / (1 + priceDifference)
}

// Only compare airports sharing a use case. Allocate one link per page in each
// round, giving less-linked candidates priority and using relevance to choose
// between equally represented candidates. Stable paths make source order inert.
export const buildRelatedAirports = (airports, limit = 3) => {
  const ordered = [...airports].sort(comparePaths)
  const related = new Map(ordered.map((airport) => [airport.path, []]))
  const incoming = new Map(ordered.map((airport) => [airport.path, 0]))
  const candidatesByPath = new Map(ordered.map((airport) => [airport.path, ordered
    .filter((candidate) => candidate.path !== airport.path
      && candidate.scenarios.some((scenario) => airport.scenarios.includes(scenario)))
    .map((candidate) => ({ candidate, score: relevance(airport, candidate) }))]))

  for (let round = 0; round < limit; round += 1) {
    for (const airport of ordered) {
      const selected = related.get(airport.path)
      const available = candidatesByPath.get(airport.path)
        .filter(({ candidate }) => !selected.some((item) => item.path === candidate.path))
        .sort((left, right) => incoming.get(left.candidate.path) - incoming.get(right.candidate.path)
          || right.score - left.score || comparePaths(left.candidate, right.candidate))
      const next = available[0]?.candidate

      if (next) {
        selected.push(next)
        incoming.set(next.path, incoming.get(next.path) + 1)
      }
    }
  }

  return related
}
