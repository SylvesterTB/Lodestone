export interface AggregatedLane {
  originLabel: string
  destLabel:   string
  totalCost:   number
  totalVol:    number
  utilPct:     number
}

export interface NetworkMetrics {
  laneCount: number
  nodeCount: number
  totalCost: number
  totalVol:  number
}