# Lodestone

Supply chain network analysis — no account, no install, no Excel. Upload shipment CSVs, visualize lane flows on a map, compute center-of-gravity warehouse placement.

---

## Quick start

```bash
npm create vite@latest lodestone -- --template react
cd lodestone && npm install
npm install zustand papaparse react-leaflet leaflet
npm run dev
```

Copy the files in `src/` from this repo into your Vite project. Import `lodestone.css` in `App.jsx`.

---

## File structure

```
src/
  App.jsx                    # Root layout + placeholder state (migrate to Zustand)
  styles/
    lodestone.css            # All design tokens and component CSS
  components/
    LogoMark.jsx             # Compass SVG — used in Header and MapPanel
    Header.jsx               # Top bar: branding, file badge, upload button
    Sidebar.jsx              # Upload zone, mode toggle, filters, CoG settings
    MapPanel.jsx             # Wrapper shell — drop <MapContainer> in as children
    MetricsPanel.jsx         # Stat cards, CoG result card, lane list
  store/
    useStore.ts              # (you build) Zustand store
    selectors.ts             # (you build) derived data
  lib/
    csv.ts                   # (you build) PapaParse + column normalization
    cog.ts                   # (you build) Weiszfeld algorithm
    metrics.ts               # (you build) cost and utilization calculations
```

---

## Architecture

State has three layers. Keeping them separate is what makes filters non-destructive — changing a filter never touches raw data, and switching view modes never resets filters.

```ts
// store/useStore.ts
rawData:     ParsedShipment[]   // set once on upload, never mutated
filterState: FilterState        // always reversible
viewState:   ViewState          // which visualization is active
```

Derived values (filtered lanes, metrics, CoG result) live in `selectors.ts` as pure functions of those three layers. Nothing imperative, no re-fetches.

```ts
// store/selectors.ts
export const filteredLanes = (s: Store) =>
  s.rawData.filter(row => row.volume >= s.filterState.minVol);

export const cogResult = (s: Store) =>
  weiszfeld(filteredLanes(s), s.filterState.weightByCost);
```

`App.jsx` currently holds everything in `useState`. The comments there show exactly what to swap out once your store is ready.

---

## Component props

### `<Header>`
| Prop | Type | Description |
|---|---|---|
| `filename` | `string \| null` | Loaded file name; null renders "No data loaded" |
| `onUploadClick` | `() => void` | Opens the hidden file input |

### `<Sidebar>`
| Prop | Type | Description |
|---|---|---|
| `hasData` | `boolean` | Switches between upload zone and loaded-file row |
| `filename` | `string` | |
| `rowCount` | `number` | |
| `mode` | `'lanes' \| 'cog' \| 'both'` | |
| `onModeChange` | `(m: string) => void` | |
| `minVol` | `number` | |
| `onMinVolChange` | `(v: number) => void` | |
| `scaleWidth` | `boolean` | Scale lane stroke to volume |
| `showLabels` | `boolean` | Node label visibility |
| `highlightUtil` | `boolean` | Color high-utilization lanes red |
| `weightByCost` | `boolean` | CoG: weight by cost vs volume |
| `useWeiszfeld` | `boolean` | CoG: Weiszfeld vs simple centroid |
| `cogIters` | `number \| null` | Displayed once CoG has converged |
| `onFileLoad` | `(file: File) => void` | |
| `onFileClear` | `() => void` | |

### `<MapPanel>`
| Prop | Type | Description |
|---|---|---|
| `hasData` | `boolean` | Shows/hides the empty-state overlay |
| `children` | `ReactNode` | Your `<MapContainer>` from react-leaflet |

### `<MetricsPanel>`
| Prop | Type | Description |
|---|---|---|
| `metrics` | `NetworkMetrics \| null` | `{ laneCount, nodeCount, totalCost, totalVol }` |
| `cogResult` | `CogResult \| null` | `{ lat, lon, nearestCity, iters }` |
| `lanes` | `AggregatedLane[]` | Pre-sorted by `totalCost` desc — `{ originLabel, destLabel, totalCost, totalVol, utilPct }` |
| `showCog` | `boolean` | Controls CoG card visibility |

---

## CSV format

Column names are fuzzy-matched, so `ship_from_lat` and `FROM_LAT` both resolve.

| Canonical name | Required | Common aliases |
|---|---|---|
| `origin_lat` | ✓ | from_lat, ship_from_lat |
| `origin_lon` | ✓ | from_lon, ship_from_lon |
| `dest_lat` | ✓ | to_lat, destination_lat |
| `dest_lon` | ✓ | to_lon, destination_lon |
| `volume` | ✓ | qty, units, quantity |
| `cost` | ✓ | freight_cost, total_cost |
| `origin_label` | — | from_city, ship_from |
| `dest_label` | — | to_city, destination |

V1 requires lat/lon. Geocoding city/state strings is V2.

---

## Roadmap

**V1**
- [ ] `lib/csv.ts` — PapaParse + fuzzy column normalization
- [ ] `store/useStore.ts` — Zustand store (rawData / filterState / viewState)
- [ ] `store/selectors.ts` — filteredLanes, metrics, cogResult
- [ ] Leaflet map with lane polylines and node markers
- [ ] `lib/cog.ts` — Weiszfeld algorithm
- [ ] `lib/metrics.ts` — cost and utilization rollups
- [ ] Deploy to S3 + CloudFront via GitHub Actions

**V2**
- [ ] Geocoding via Lambda + Nominatim
- [ ] CSV export (CoG result, filtered lanes)
- [ ] Multi-scenario comparison