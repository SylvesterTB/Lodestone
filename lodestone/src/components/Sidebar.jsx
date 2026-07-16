import { useState } from "react";

/**
 * @param {object}   props
 * @param {boolean}  props.hasData
 * @param {string}   props.filename
 * @param {number}   props.rowCount
 * @param {string}   props.mode             - 'lanes' | 'cog' | 'both'
 * @param {function} props.onModeChange
 * @param {number}   props.minVol
 * @param {function} props.onMinVolChange
 * @param {boolean}  props.scaleWidth
 * @param {function} props.onScaleWidthChange
 * @param {boolean}  props.showLabels
 * @param {function} props.onShowLabelsChange
 * @param {boolean}  props.highlightUtil
 * @param {function} props.onHighlightUtilChange
 * @param {boolean}  props.weightByCost     - CoG: weight lanes by cost vs volume
 * @param {function} props.onWeightByCostChange
 * @param {boolean}  props.useWeiszfeld     - CoG: Weiszfeld vs simple centroid
 * @param {function} props.onUseWeiszfeldChange
 * @param {number}   props.cogIters         - iterations to convergence, shown when available
 * @param {function} props.onFileLoad       - called with a File object
 * @param {function} props.onFileClear
 */
export default function Sidebar({
  hasData,
  filename,
  rowCount,
  mode,
  onModeChange,
  minVol,
  onMinVolChange,
  scaleWidth,
  onScaleWidthChange,
  showLabels,
  onShowLabelsChange,
  highlightUtil,
  onHighlightUtilChange,
  weightByCost,
  onWeightByCostChange,
  useWeiszfeld,
  onUseWeiszfeldChange,
  cogIters,
  onFileLoad,
  onFileClear,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const showCog = mode === "cog" || mode === "both";

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileLoad(file);
  }

  return (
    <aside className="lds-sidebar">

      {/* ── Data source ───────────────────────────────────────────────────── */}
      <div className="lds-section">
        <div className="lds-section-label">Data Source</div>
        {hasData ? (
          <div className="lds-loaded-file">
            <CsvIcon />
            <span className="lds-file-name">{filename}</span>
            <span className="lds-file-meta">{rowCount.toLocaleString()} rows</span>
            <button className="lds-clear-btn" onClick={onFileClear}>×</button>
          </div>
        ) : (
          <div
            className={`lds-upload-zone ${isDragging ? "dragging" : ""}`}
            onClick={() => document.getElementById("csv-input").click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <UploadIcon />
            <div className="lds-upload-title">Drop CSV here</div>
            <div className="lds-upload-sub">
              or click to browse<br />
              origin · dest · lat/lon · vol · cost
            </div>
            <div
              style={{
                marginTop:     10,
                fontSize:      10,
                color:         '#c89a3e',
                cursor:        'pointer',
                letterSpacing: '.04em',
                textDecoration: 'underline',
              }}
              onClick={async (e) => {
                e.stopPropagation()
                const res  = await fetch('/sample_network.csv')
                const text = await res.text()
                const file = new File([text], 'sample_network.csv', { type: 'text/csv' })
                onFileLoad(file)
              }}
            >
              or load sample data
            </div>
          </div>
        )}
      </div>

      {/* ── Analysis mode ─────────────────────────────────────────────────── */}
      <div className="lds-section">
        <div className="lds-section-label">Analysis Mode</div>
        <div className="lds-mode-grid">
          {["lanes", "cog", "both"].map((m) => (
            <button
              key={m}
              className={`lds-mode-btn ${mode === m ? "active" : ""}`}
              onClick={() => onModeChange(m)}
            >
              {m === "cog" ? "CoG" : m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Network filters ───────────────────────────────────────────────── */}
      <div className="lds-section">
        <div className="lds-section-label">Network Filters</div>

        <div className="lds-filter-row">
          <div className="lds-filter-label">
            <span>Min lane volume</span>
            <span className="lds-filter-val">{minVol.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={minVol}
            onChange={(e) => onMinVolChange(+e.target.value)}
          />
        </div>

        <Toggle label="Scale lane width"    on={scaleWidth}    onChange={onScaleWidthChange} />
        <Toggle label="Show node labels"    on={showLabels}    onChange={onShowLabelsChange} />
        <Toggle label="Highlight high-util" on={highlightUtil} onChange={onHighlightUtilChange} />
      </div>

      {/* ── CoG settings (only in cog / both mode) ────────────────────────── */}
      {showCog && (
        <div className="lds-section">
          <div className="lds-section-label">CoG Settings</div>
          <Toggle label="Weight by cost"  on={weightByCost}  onChange={onWeightByCostChange} />
          <Toggle label="Weiszfeld algo"  on={useWeiszfeld}  onChange={onUseWeiszfeldChange} />
          {cogIters != null && (
            <div className="lds-cog-note">
              Iterating until Δ &lt; 0.001°<br />
              <span>converged in {cogIters} steps</span>
            </div>
          )}
        </div>
      )}

    </aside>
  );
}

// ─── Internal sub-components ─────────────────────────────────────────────────

function Toggle({ label, on, onChange }) {
  return (
    <div className="lds-toggle-row">
      <span>{label}</span>
      <div className={`lds-toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} />
    </div>
  );
}

function CsvIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
      <rect x=".75" y=".75" width="11.5" height="11.5" rx="1.5" stroke="#2ec4b6" strokeWidth="1.2" />
      <line x1="2.5" y1="4"   x2="10.5" y2="4"   stroke="#2ec4b6" strokeWidth=".9" />
      <line x1="2.5" y1="6.5" x2="10.5" y2="6.5" stroke="#2ec4b6" strokeWidth=".9" />
      <line x1="2.5" y1="9"   x2="7"    y2="9"   stroke="#2ec4b6" strokeWidth=".9" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ marginBottom: 8 }}>
      <path d="M11 3v11M7.5 6.5l3.5-3.5 3.5 3.5" stroke="#3a4a60" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 16v1.5a2 2 0 002 2h11a2 2 0 002-2V16" stroke="#3a4a60" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}