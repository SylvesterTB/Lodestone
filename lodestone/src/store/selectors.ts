import { LodestoneStore } from './useStore'
import { AggregatedLane, NetworkMetrics } from '../types'
import { ParsedShipment } from '../lib/csv';


export function selectFilteredLanes(shipments: ParsedShipment[], minVol: number): AggregatedLane[] {
    const filtered = shipments.filter(row => row.volume >= minVol);
    const lanesMap: Record<string, AggregatedLane> = {};

    for (const shipment of filtered) {
    const laneKey = `${shipment.origin_label}||${shipment.dest_label}`;    
    // if lane is not found already
    if (!lanesMap[laneKey]) {
        lanesMap[laneKey] = {
        originLabel: shipment.origin_label ?? 'Unknown',
        destLabel: shipment.dest_label ?? 'Unknown',
        totalCost: shipment.cost,
        totalVol: shipment.volume,
        utilPct: 0 
        };
    }
    // for preexising lane
    else
        {    
        lanesMap[laneKey].totalVol += shipment.volume;
        lanesMap[laneKey].totalCost += shipment.cost;
        }
    }
    const aggArray = Object.values(lanesMap);
    const volumes = aggArray.map(tempLane => tempLane.totalVol);
    const maxVol = Math.max(...volumes);
    if(maxVol > 0)
        {
        for (const lane of Object.keys(lanesMap)) 
            {
            lanesMap[lane].utilPct = (lanesMap[lane].totalVol / maxVol) * 100;
        }
    }
    return Object.values(lanesMap);
}

export function selectNetworkMetrics(shipments: ParsedShipment[], minVol: number): NetworkMetrics | null {
  const lanes = selectFilteredLanes(shipments, minVol);
  if (lanes.length === 0) return null;
  const lanesTotal = {
    totalCost: 0,
    totalVol: 0,
  };
    const uniqueNodes = new Set<string>();
    for(const lane of lanes)
    {
        lanesTotal.totalCost += lane.totalCost;
        lanesTotal.totalVol += lane.totalVol;
        uniqueNodes.add(lane.originLabel);
        uniqueNodes.add(lane.destLabel);

    }
    return {
    laneCount: lanes.length,
    nodeCount: uniqueNodes.size,
    totalCost: lanesTotal.totalCost,
    totalVol: lanesTotal.totalVol
  };
}


export function selectCogResult(s: LodestoneStore) {
  return null; // stub until cog.ts is built
}