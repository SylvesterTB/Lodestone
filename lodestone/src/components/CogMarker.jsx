import { Marker, Popup } from 'react-map-gl/maplibre'
import { useState } from 'react'

export default function CogMarker({ cogResult }) {
  const [showPopup, setShowPopup] = useState(false)

  if (!cogResult) return null

  return (
    <>
      <Marker
        longitude={cogResult.lon}
        latitude={cogResult.lat}
        anchor="center"
      >
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            setShowPopup(true)
          }}
        >
          {/* Diamond shape */}
          <div style={{
            width:       14,
            height:      14,
            background:  '#e0b050',
            transform:   'rotate(45deg)',
            boxShadow:   '0 0 12px rgba(224,176,80,0.8)',
          }} />
          {/* Crosshair rings */}
          <div style={{
            position:     'absolute',
            width:        36,
            height:       36,
            border:       '1px solid rgba(224,176,80,0.3)',
            borderRadius: '50%',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position:     'absolute',
            width:        56,
            height:       56,
            border:       '1px solid rgba(224,176,80,0.15)',
            borderRadius: '50%',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
          {/* Label */}
          <div style={{
            position:      'absolute',
            top:           18,
            left:          '50%',
            transform:     'translateX(-50%)',
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      9,
            color:         '#e0b050',
            letterSpacing: '.04em',
            whiteSpace:    'nowrap',
            pointerEvents: 'none',
            textShadow:    '0 1px 3px #070b13',
          }}>
            COG
          </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={cogResult.lon}
          latitude={cogResult.lat}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
          closeButton={false}
          closeOnClick={false}
          offset={20}
        >
          <div style={{
            background:  '#0d1422',
            border:      '1px solid rgba(200,154,62,0.3)',
            padding:     '10px 14px',
            fontFamily:  "'Syne', sans-serif",
            color:       '#d8e2f0',
            minWidth:    150,
          }}>
            <div style={{
              fontSize:      9,
              color:         '#c89a3e',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              marginBottom:  8,
              display:       'flex',
              alignItems:    'center',
              gap:           6,
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8">
                <polygon points="4,0 8,4 4,8 0,4" fill="#c89a3e" />
              </svg>
              Center of Gravity
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   13,
              color:      '#e0b050',
              marginBottom: 3,
            }}>
              {cogResult.lat.toFixed(4)}°N<br />
              {Math.abs(cogResult.lon).toFixed(4)}°W
            </div>
            <div style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      9,
              color:         '#3a4a60',
              marginTop:     8,
              letterSpacing: '.03em',
            }}>
              iters: {cogResult.iters}
            </div>
          </div>
        </Popup>
      )}
    </>
  )
}