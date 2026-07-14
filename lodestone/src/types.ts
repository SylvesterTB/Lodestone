export interface AggregatedLane {
  originLabel: string
  destLabel:   string
  originLat:   number
  originLon:   number
  destLat:     number
  destLon:     number
  totalCost:   number
  totalVol:    number
  relativeVol:     number
}

export interface NetworkMetrics {
  laneCount: number
  nodeCount: number
  totalCost: number
  totalVol:  number
}