import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import LogoMark from './LogoMark'
import { useEffect } from 'react'
import { lodestoneMapStyle } from '../lib/mapStyle'


function ResizeHandler() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
  }, [map])
  return null
}

export default function MapPanel({ hasData }) {
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