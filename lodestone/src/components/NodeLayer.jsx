import { Marker, Popup } from 'react-map-gl/maplibre'
import { useState, useMemo } from 'react'

export default function NodeLayer({ lanes, showLabels }) {
  const [selectedNode, setSelectedNode] = useState(null)

  // extract unique nodes from both ends of every lane
  const nodes = useMemo(() => {
    const nodeMap = new Map()
    for (const lane of lanes) {
      if (!nodeMap.has(lane.originLabel)) {
        nodeMap.set(lane.originLabel, {
          label: lane.originLabel,
          lat:   lane.originLat,
          lon:   lane.originLon,
        })
      }
      if (!nodeMap.has(lane.destLabel)) {
        nodeMap.set(lane.destLabel, {
          label: lane.destLabel,
          lat:   lane.destLat,
          lon:   lane.destLon,
        })
      }
    }
    return Array.from(nodeMap.values())
  }, [lanes])

  return (
    <>
      {nodes.map(node => (
        <Marker
        key={node.label}
        longitude={node.lon}
        latitude={node.lat}
        anchor="center"
        >
        <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseOver={(e) => {
            e.stopPropagation()
            setSelectedNode(node)
            }}
        >
            <div style={{
            width:        10,
            height:       10,
            borderRadius: '50%',
            background:   '#c89a3e',
            border:       '2px solid #e0b050',
            boxShadow:    '0 0 6px rgba(200,154,62,0.6)',
            }} />
            {showLabels && (
            <div style={{
                position:   'absolute',
                top:        14,
                left:       '50%',
                transform:  'translateX(-50%)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize:   9,
                color:      '#5a7090',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                textShadow: '0 1px 3px #070b13',
            }}>
                {node.label}
            </div>
            )}
        </div>
        </Marker>
      ))}
      {/* Popup on click */}
      {selectedNode && (
        <Popup
          longitude={selectedNode.lon}
          latitude={selectedNode.lat}
          anchor="bottom"
          onClose={() => setSelectedNode(null)}
          closeButton={false}
          offset={14}
        >
          <div style={{
            background:  '#0d1422',
            border:      '1px solid #1c2d46',
            padding:     '8px 12px',
            fontFamily:  "'Syne', sans-serif",
            color:       '#d8e2f0',
            minWidth:    120,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
              {selectedNode.label}
            </div>
            <div style={{
              fontSize:    9,
              color:       '#5a7090',
              fontFamily:  "'JetBrains Mono', monospace",
              letterSpacing: '.03em',
            }}>
              {selectedNode.lat.toFixed(4)}°N<br />
              {Math.abs(selectedNode.lon).toFixed(4)}°W
            </div>
          </div>
        </Popup>
      )}
    </>
  )
}