import { ParsedShipment } from './csv'

export interface CogResult {
  lat:   number
  lon:   number
  iters: number
}

export function computeCog(
  shipments:    ParsedShipment[],
  weightByCost: boolean
): CogResult | null {

  if (shipments.length === 0) return null

  const getWeight = (s: ParsedShipment): number =>
    weightByCost ? s.cost : s.volume

  function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const newLat1 = lat1 * (Math.PI/180)
    const newLat2 = lat2 * (Math.PI/180)
    const newLon1 = lon1 * (Math.PI/180)
    const newLon2 = lon2 * (Math.PI/180)
    const deltaLat = newLat2 - newLat1
    const deltaLon = newLon2 - newLon1
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(newLat1) * Math.cos(newLat2) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2)   
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R*c
  }


    const totalWeight = shipments.reduce((sum, s) => sum + getWeight(s), 0)

    let lat = shipments.reduce((sum, s) => sum + s.origin_lat * getWeight(s), 0) / totalWeight
    let lon = shipments.reduce((sum, s) => sum + s.origin_lon * getWeight(s), 0) / totalWeight

   let iters = 0
   const maxIters = 100
   const tol = 0.001

   while (iters < maxIters) {
     let numLat = 0
     let numLon = 0
     let denom = 0

    for (const s of shipments) {
        const weight = getWeight(s)
        const dist = haversine(lat, lon, s.origin_lat, s.origin_lon)
        if (dist > 0) {
            const weightDist = weight / dist
            numLat += s.origin_lat * weightDist
            denom += weightDist
            numLon += s.origin_lon * weightDist
    }
    }

    if (denom === 0) break
    const newLat = numLat / denom
    const newLon = numLon / denom
     
    if (Math.abs(newLat - lat) < tol && Math.abs(newLon - lon) < tol) {
        break
    }
    iters++
    lat = newLat
    lon = newLon

     }


    

  return { lat, lon, iters }
}