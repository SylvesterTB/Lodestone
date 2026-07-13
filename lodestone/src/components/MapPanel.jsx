import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import LogoMark from './LogoMark'

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
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        style={{ height: "100%", width: "100%", background: "#070b13" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <ResizeHandler />
      </MapContainer>

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