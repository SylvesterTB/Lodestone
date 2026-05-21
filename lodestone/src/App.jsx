import { useState } from "react";
import Header      from "./components/Header";
import Sidebar     from "./components/Sidebar";
import MapPanel    from "./components/MapPanel";
import MetricsPanel from "./components/MetricsPanel";
import "./styles/lodestone.css";

/**
 * Root layout. All useState here is placeholder until you wire in Zustand.
 *
 * Migration path:
 *   1. Create store/useStore.ts with rawData / filterState / viewState slices
 *   2. Create store/selectors.ts for filteredLanes, cogResult, metrics
 *   3. Replace useState blocks below with the relevant store hooks
 *   4. Move handleFileLoad / handleFileClear into store actions
 */
export default function App() {

  // ── View state (→ viewState slice) ─────────────────────────────────────
  const [mode, setMode] = useState("lanes"); // 'lanes' | 'cog' | 'both'

  // ── Raw data state (→ rawData slice) ───────────────────────────────────
  const [filename, setFilename] = useState(null);
  const [rowCount,  setRowCount]  = useState(0);

  // ── Filter state (→ filterState slice) ─────────────────────────────────
  const [minVol,        setMinVol]        = useState(0);
  const [scaleWidth,    setScaleWidth]    = useState(true);
  const [showLabels,    setShowLabels]    = useState(true);
  const [highlightUtil, setHighlightUtil] = useState(false);
  const [weightByCost,  setWeightByCost]  = useState(true);
  const [useWeiszfeld,  setUseWeiszfeld]  = useState(true);

  // ── Derived (→ selectors.ts) ────────────────────────────────────────────
  // Replace these nulls with values from your computed selectors:
  //   const metrics   = useMetrics();
  //   const cogResult = useCogResult();
  //   const lanes     = useFilteredLanes(); // sorted by totalCost desc
  const metrics   = null;
  const cogResult = null;
  const lanes     = [];
  const cogIters  = cogResult?.iters ?? null;

  const hasData = filename !== null;
  const showCog = mode === "cog" || mode === "both";

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleFileLoad(file) {
    // TODO:
    //   1. Parse with PapaParse in a Web Worker (lib/csv.ts)
    //   2. Normalize column names (fuzzy match)
    //   3. Dispatch parsed rows to rawData store
    setFilename(file.name);
    setRowCount(0); // update once parse resolves
  }

  function handleFileClear() {
    // TODO: dispatch clearRawData action to store
    setFilename(null);
    setRowCount(0);
  }

  function handleUploadClick() {
    document.getElementById("csv-file-input").click();
  }

  return (
    <div className="lds-app">

      <Header
        filename={filename}
        onUploadClick={handleUploadClick}
      />

      <Sidebar
        hasData={hasData}
        filename={filename}
        rowCount={rowCount}
        mode={mode}
        onModeChange={setMode}
        minVol={minVol}
        onMinVolChange={setMinVol}
        scaleWidth={scaleWidth}
        onScaleWidthChange={setScaleWidth}
        showLabels={showLabels}
        onShowLabelsChange={setShowLabels}
        highlightUtil={highlightUtil}
        onHighlightUtilChange={setHighlightUtil}
        weightByCost={weightByCost}
        onWeightByCostChange={setWeightByCost}
        useWeiszfeld={useWeiszfeld}
        onUseWeiszfeldChange={setUseWeiszfeld}
        cogIters={cogIters}
        onFileLoad={handleFileLoad}
        onFileClear={handleFileClear}
      />

      <MapPanel hasData={hasData}>
        {/*
          TODO: replace this comment with your Leaflet map.

          Example structure once react-leaflet is installed:

            <MapContainer
              center={[39.5, -98.35]}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LaneLayer lanes={lanes} scaleWidth={scaleWidth} highlightUtil={highlightUtil} />
              <NodeLayer lanes={lanes} showLabels={showLabels} />
              {showCog && cogResult && <CogMarker position={[cogResult.lat, cogResult.lon]} />}
            </MapContainer>
        */}
      </MapPanel>

      <MetricsPanel
        metrics={metrics}
        cogResult={showCog ? cogResult : null}
        lanes={lanes}
        showCog={showCog}
      />

      {/* Hidden file input — triggered by Sidebar upload zone and Header button */}
      <input
        id="csv-file-input"
        type="file"
        accept=".csv,.tsv"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFileLoad(file);
          e.target.value = ""; // reset so same file can be re-uploaded
        }}
      />

    </div>
  );
}