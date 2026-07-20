# Lodestone

**Free, web-native supply chain network analysis.**

Upload a CSV of shipment data, visualize lane flows on an interactive map, and compute center-of-gravity warehouse placement — no account, no install, no Excel.

**[Try it live →](https://d1jktqgh1yf85o.cloudfront.net)**

---

## Features

- **CSV upload** with fuzzy column name matching — works with real-world exports from any TMS or ERP
- **Lane visualization** on a dark cartographic map, with stroke width scaled to volume and directional arrows
- **Center of gravity** analysis using the Weiszfeld algorithm, weighted by cost or volume
- **Metrics panel** with lane count, node count, total cost, volume, and per-lane utilization
- **Non-destructive filters** — changing mode or adjusting filters never wipes your loaded data
- **No account required** — everything runs in your browser, nothing is stored server-side

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Map | MapLibre GL JS + react-map-gl + OpenFreeMap tiles |
| CSV parsing | PapaParse + Fuse.js |
| State | Zustand |
| Deploy | S3 + CloudFront |
| CI/CD | GitHub Actions |

---

## CSV Format

Column names are fuzzy-matched on upload — `FROM_LAT`, `ship_from_lat`, and `origin_lat` all resolve correctly.

| Field | Required | Common aliases |
|---|---|---|
| `origin_lat` | ✓ | from_lat, ship_from_lat |
| `origin_lon` | ✓ | from_lon, ship_from_lon |
| `dest_lat` | ✓ | to_lat, destination_lat |
| `dest_lon` | ✓ | to_lon, destination_lon |
| `volume` | ✓ | qty, units, quantity |
| `cost` | ✓ | freight_cost, total_cost |
| `origin_label` | — | from_city, ship_from, origin |
| `dest_label` | — | to_city, destination |

A sample dataset is available in the app via "load sample data."

---

## Local Development

```bash
git clone https://github.com/SylvesterTB/Lodestone
cd Lodestone/lodestone
npm install
npm run dev
```

Runs at `http://localhost:5173`. No environment variables required.

```bash
npm test          # watch mode
npm run test:run  # single pass
npm run build     # production build
```

---

## Project Structure

```
src/
  components/
    Header.jsx
    Sidebar.jsx
    MapPanel.jsx
    LaneLayer.jsx
    NodeLayer.jsx
    CogMarker.jsx
    MetricsPanel.jsx
    LogoMark.jsx
  store/
    useStore.ts       # Zustand store (rawData / filterState / viewState)
    selectors.ts      # filteredLanes, networkMetrics, cogResult
  lib/
    csv.ts            # PapaParse + fuzzy column normalization
    cog.ts            # Weiszfeld algorithm
    mapStyle.ts       # MapLibre dark cartographic style
  types.ts
  App.jsx
```

---

## Roadmap

- Geocoding via Lambda + Nominatim (city/state → lat/lon inputs)
- Vehicle capacity selector for true utilization calculation
- CSV export of CoG result and filtered lanes
- Multi-scenario comparison
- Parse report modal showing column mappings and dropped rows