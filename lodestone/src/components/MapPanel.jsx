import LogoMark from "./LogoMark";

/**
 * Shell that wraps the Leaflet map. Drop <MapContainer> in as children.
 *
 * @param {object}    props
 * @param {boolean}   props.hasData  - shows empty state overlay when false
 * @param {ReactNode} props.children - the <MapContainer> from react-leaflet
 */
export default function MapPanel({ hasData, children }) {
  return (
    <main className="lds-map">

      {/* react-leaflet <MapContainer> goes here */}
      <div style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>

      {/* Empty state — shown until a CSV is loaded */}
      {!hasData && (
        <div className="lds-empty-state">
          <LogoMark size={36} />
          <div className="lds-empty-title">Lodestone</div>
          <div className="lds-empty-sub">Upload a CSV to visualize your network</div>
        </div>
      )}

    </main>
  );
}