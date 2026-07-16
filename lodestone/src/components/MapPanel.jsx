import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import LogoMark from './LogoMark'
import { lodestoneMapStyle } from '../lib/mapStyle'
import LaneLayer from './LaneLayer'
import NodeLayer from './NodeLayer'
import CogMarker from './CogMarker'



export default function MapPanel({ 
  hasData, lanes, scaleWidth, highlightUtil, 
  showLabels, cogResult, showCog,
  parseWarnings, parseErrors
}) {
  return (
    <main className="lds-map">
      <Map
        initialViewState={{
          longitude: -98.35,
          latitude: 39.5,
          zoom: 4
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={lodestoneMapStyle}
      >
        <LaneLayer lanes={lanes} scaleWidth={scaleWidth} highlightUtil={highlightUtil} />
        <NodeLayer lanes={lanes} showLabels={showLabels} />
        {showCog && <CogMarker cogResult={cogResult} />}
      </Map>
      <ParseFeedback warnings={parseWarnings} errors={parseErrors} />
      {!hasData && (
        <div className="lds-empty-state">
          <LogoMark size={36} />
          <div className="lds-empty-title">Lodestone</div>
          <div className="lds-empty-sub">Upload a CSV to visualize your network</div>
        </div>
      )}
    </main>
  )
}
function ParseFeedback({ warnings, errors }) {
  if (warnings.length === 0 && errors.length === 0) return null

  return (
    <div style={{
      position:   'absolute',
      top:        12,
      left:       '50%',
      transform:  'translateX(-50%)',
      zIndex:     1000,
      display:    'flex',
      flexDirection: 'column',
      gap:        6,
      maxWidth:   500,
      width:      '90%',
    }}>
      {errors.map((e, i) => (
        <div key={i} style={{
          background:    'rgba(224,92,92,0.15)',
          border:        '1px solid rgba(224,92,92,0.4)',
          padding:       '8px 14px',
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      10,
          color:         '#e05c5c',
          letterSpacing: '.03em',
        }}>
          ✕ {e}
        </div>
      ))}
      {warnings.map((w, i) => (
        <div key={i} style={{
          background:    'rgba(200,154,62,0.1)',
          border:        '1px solid rgba(200,154,62,0.3)',
          padding:       '8px 14px',
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      10,
          color:         '#c89a3e',
          letterSpacing: '.03em',
        }}>
          ⚠ {w}
        </div>
      ))}
    </div>
  )
}