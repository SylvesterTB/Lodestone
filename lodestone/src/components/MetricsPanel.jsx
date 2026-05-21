/**
 * @typedef {object} NetworkMetrics
 * @property {number} laneCount
 * @property {number} nodeCount
 * @property {number} totalCost   - in dollars
 * @property {number} totalVol
 *
 * @typedef {object} CogResult
 * @property {number}      lat
 * @property {number}      lon
 * @property {string|null} nearestCity
 * @property {number}      iters
 *
 * @typedef {object} AggregatedLane
 * @property {string} originLabel
 * @property {string} destLabel
 * @property {number} totalCost
 * @property {number} totalVol
 * @property {number} utilPct     - 0–100
 */

/**
 * @param {object}          props
 * @param {NetworkMetrics|null} props.metrics
 * @param {CogResult|null}  props.cogResult
 * @param {AggregatedLane[]} props.lanes    - pre-sorted by totalCost desc
 * @param {boolean}         props.showCog
 */
export default function MetricsPanel({ metrics, cogResult, lanes, showCog }) {
  return (
    <aside className="lds-metrics">

      {/* ── Network overview ──────────────────────────────────────────────── */}
      <div className="lds-section">
        <div className="lds-section-label">Network Overview</div>
        <div className="lds-stat-grid">
          <StatCard label="Lanes"      value={metrics?.laneCount ?? "—"} unit="active" />
          <StatCard label="Nodes"      value={metrics?.nodeCount ?? "—"} unit="locations" valueClass="teal" />
          <StatCard label="Total Cost" value={metrics ? formatCost(metrics.totalCost) : "—"} unit="USD" valueClass="gold sm" />
          <StatCard label="Volume"     value={metrics ? formatVol(metrics.totalVol)   : "—"} unit="units" valueClass="sm" />
        </div>
      </div>

      {/* ── CoG result (only in cog / both mode) ──────────────────────────── */}
      {showCog && cogResult && (
        <div className="lds-section">
          <div className="lds-cog-card">
            <div className="lds-cog-title">
              <DiamondIcon />
              Center of Gravity
            </div>
            <div className="lds-cog-coords">
              {cogResult.lat.toFixed(2)}°N, {Math.abs(cogResult.lon).toFixed(2)}°W
            </div>
            {cogResult.nearestCity && (
              <div className="lds-cog-address">Near {cogResult.nearestCity}</div>
            )}
            <div className="lds-cog-method">
              method: weiszfeld · iters: {cogResult.iters}
            </div>
          </div>
        </div>
      )}

      {/* ── Top lanes by cost ─────────────────────────────────────────────── */}
      <div className="lds-section" style={{ flex: 1 }}>
        <div className="lds-section-label">Top Lanes by Cost</div>
        {lanes.length === 0 ? (
          <div className="lds-empty-lanes">No lanes loaded</div>
        ) : (
          lanes.map((lane, i) => (
            <LaneRow key={i} lane={lane} />
          ))
        )}
      </div>

    </aside>
  );
}

// ─── Internal sub-components ─────────────────────────────────────────────────

function StatCard({ label, value, unit, valueClass = "" }) {
  return (
    <div className="lds-stat-card">
      <div className="lds-stat-label">{label}</div>
      <div className={`lds-stat-value ${valueClass}`}>{value}</div>
      <div className="lds-stat-unit">{unit}</div>
    </div>
  );
}

function LaneRow({ lane }) {
  const utilClass = lane.utilPct > 85 ? "crit" : lane.utilPct > 70 ? "high" : "";
  return (
    <div className="lds-lane-row">
      <div className="lds-lane-header">
        <span className="lds-lane-pair">{lane.originLabel} → {lane.destLabel}</span>
        <span className="lds-lane-cost">{formatCost(lane.totalCost)}</span>
      </div>
      <div className="lds-util-bar">
        <div className={`lds-util-fill ${utilClass}`} style={{ width: `${lane.utilPct}%` }} />
      </div>
      <div className="lds-lane-meta">
        <span>{lane.totalVol.toLocaleString()} units</span>
        <span>{lane.utilPct}% util</span>
      </div>
    </div>
  );
}

function DiamondIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9">
      <polygon points="4.5,0 9,4.5 4.5,9 0,4.5" fill="#c89a3e" />
    </svg>
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatCost(dollars) {
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000)     return `$${(dollars / 1_000).toFixed(0)}K`;
  return `$${dollars}`;
}

function formatVol(units) {
  if (units >= 1_000_000) return `${(units / 1_000_000).toFixed(1)}M`;
  if (units >= 1_000)     return `${(units / 1_000).toFixed(1)}K`;
  return `${units}`;
}