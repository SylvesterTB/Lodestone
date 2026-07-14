import { Source, Layer } from 'react-map-gl/maplibre'

/**
 * @param {object}          props
 * @param {AggregatedLane[]} props.lanes
 * @param {boolean}         props.scaleWidth
 * @param {boolean}         props.highlightUtil
 */
export default function LaneLayer({ lanes, scaleWidth, highlightUtil }) {
  const maxVol = Math.max(...lanes.map(l => l.totalVol), 1)

  const geojson = {
    type: 'FeatureCollection',
    features: lanes.map(lane => ({
      type: 'Feature',
      properties: {
        originLabel: lane.originLabel,
        destLabel:   lane.destLabel,
        totalCost:   lane.totalCost,
        totalVol:    lane.totalVol,
        relativeVol:  lane.relativeVol,
        weight:      lane.totalVol / maxVol,
      },
        geometry: {
        type: 'LineString',
        coordinates: getBezierCoords(
            [lane.originLon, lane.originLat],
            [lane.destLon,   lane.destLat]
        )
        }
    }))
  }

  const lineWidth = scaleWidth
    ? ['interpolate', ['linear'], ['get', 'weight'], 0, 1, 1, 5]
    : 2

  const lineColor = highlightUtil
    ? ['step', ['get', 'relativeVol'],
        '#2ec4b6',   // default teal
        40, '#c89a3e',  // gold above 40%
        70, '#e05c5c'   // red above 70%
      ]
    : '#2ec4b6'

  return (
    <Source id="lanes" type="geojson" data={geojson}>
    {/* Glow layer — wide and transparent underneath */}
    <Layer
        id="lane-glow"
        type="line"
        paint={{
        'line-color':   '#2ec4b6',
        'line-width':   scaleWidth
            ? ['interpolate', ['linear'], ['get', 'weight'], 0, 6, 1, 14]
            : 8,
        'line-opacity': 0.15,
        'line-blur':    4,
        }}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
    />
    {/* Solid lane on top */}
    <Layer
        id="lane-lines"
        type="line"
        paint={{
        'line-color':   lineColor,
        'line-width':   lineWidth,
        'line-opacity': 0.85,
        }}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
    />
    </Source>
  )
}
function getBezierCoords(start, end, segments = 50) {
  const mx = (start[0] + end[0]) / 2
  const my = (start[1] + end[1]) / 2
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const len = Math.sqrt(dx * dx + dy * dy)
  const curve = len * 0.15
  const cx = mx - (dy / len) * curve
  const cy = my + (dx / len) * curve

  const points = []
  for (let t = 0; t <= 1; t += 1 / segments) {
    points.push([
      (1-t)*(1-t)*start[0] + 2*(1-t)*t*cx + t*t*end[0],
      (1-t)*(1-t)*start[1] + 2*(1-t)*t*cy + t*t*end[1],
    ])
  }
  return points
}