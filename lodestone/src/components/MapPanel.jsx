import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import LogoMark from './LogoMark'
import { lodestoneMapStyle } from '../lib/mapStyle'
import LaneLayer from './LaneLayer'
import NodeLayer from './NodeLayer'
import CogMarker from './CogMarker'



export default function MapPanel({ hasData, lanes, scaleWidth, highlightUtil, showLabels, cogResult, showCog  }) {
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