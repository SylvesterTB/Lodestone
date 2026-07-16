import Header      from "./components/Header";
import Sidebar     from "./components/Sidebar";
import MapPanel    from "./components/MapPanel";
import MetricsPanel from "./components/MetricsPanel";
import "./styles/lodestone.css";
import { useLodestoneStore } from './store/useStore'
import { selectNetworkMetrics, selectFilteredLanes, selectCogResult } from './store/selectors'
import { parseAndNormalizeCSV } from './lib/csv'
import { useMemo } from 'react'
import './styles/lodestone.css'





export default function App() {

  // ── View state (→ viewState slice) ─────────────────────────────────────
  const mode    = useLodestoneStore(s => s.mode)// 'lanes' | 'cog' | 'both'
  const setMode = useLodestoneStore(s => s.setMode)


  // ── Raw data state (→ rawData slice) ───────────────────────────────────
  const filename      = useLodestoneStore(s => s.filename)
  const rowCount      = useLodestoneStore(s => s.rowCount)
  const parseWarnings = useLodestoneStore(s => s.parseWarnings)
  const parseErrors   = useLodestoneStore(s => s.parseErrors)
  const loadFile      = useLodestoneStore(s => s.loadFile)
  const clearData     = useLodestoneStore(s => s.clearData)

  // ── Filter state (→ filterState slice) ─────────────────────────────────
  const shipments = useLodestoneStore(s => s.shipments)
  const minVol    = useLodestoneStore(s => s.minVol)
  const scaleWidth    = useLodestoneStore(s => s.scaleWidth)
  const showLabels    = useLodestoneStore(s => s.showLabels)
  const highlightUtil = useLodestoneStore(s => s.highlightUtil)
  const weightByCost  = useLodestoneStore(s => s.weightByCost)
  const useWeiszfeld  = useLodestoneStore(s => s.useWeiszfeld)
  const setFilter     = useLodestoneStore(s => s.setFilter)

  // ── Derived (→ selectors.ts) ────────────────────────────────────────────
  // Replace these nulls with values from your computed selectors:
  //   const metrics   = useMetrics();
  //   const cogResult = useCogResult();
  //   const lanes     = useFilteredLanes(); // sorted by totalCost desc
  const lanes   = useMemo(() => selectFilteredLanes(shipments, minVol), [shipments, minVol])
  const metrics = useMemo(() => selectNetworkMetrics(shipments, minVol), [shipments, minVol])
  const cogResult = useMemo(
    () => selectCogResult(shipments, minVol, weightByCost),
    [shipments, minVol, weightByCost]
  )
  const cogIters  = cogResult?.iters ?? null;

  const hasData = filename !== null;
  const showCog = mode === "cog" || mode === "both";

  // ── Handlers ────────────────────────────────────────────────────────────
  async function handleFileLoad(file) {
    const text = await file.text()
    const result = parseAndNormalizeCSV(text)
    loadFile(file.name, result)
  }

  function handleFileClear() {
    clearData()
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
        onMinVolChange={(v) => setFilter('minVol', v)}
        scaleWidth={scaleWidth}
        onScaleWidthChange={(v) => setFilter('scaleWidth', v)}
        showLabels={showLabels}
        onShowLabelsChange={(v) => setFilter('showLabels', v)}
        highlightUtil={highlightUtil}
        onHighlightUtilChange={(v) => setFilter('highlightUtil', v)}
        weightByCost={weightByCost}
        onWeightByCostChange={(v) => setFilter('weightByCost', v)}
        useWeiszfeld={useWeiszfeld}
        onUseWeiszfeldChange={(v) => setFilter('useWeiszfeld', v)}
        cogIters={cogIters}
        onFileLoad={handleFileLoad}
        onFileClear={handleFileClear}
      />

    <MapPanel
      hasData={hasData}
      lanes={lanes}
      scaleWidth={scaleWidth}
      highlightUtil={highlightUtil}
      showLabels={showLabels}
      cogResult={cogResult}
      showCog={showCog}
      parseWarnings={parseWarnings}
      parseErrors={parseErrors}
    />

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