// Lodestone map style — dark cartographic theme using OpenFreeMap vector tiles.
// Pass this object directly to the mapStyle prop on the react-map-gl <Map> component.

const C = {
  water:        '#04080e',
  land:         '#111827',
  landcover:    '#0d1422',
  landuse:      '#0f1826',
  waterway:     '#070b13',
  borderCountry:'#c89a3e',
  borderState:  '#c89a3e',
  roadMinor:    '#111b2e',
  roadMajor:    '#162035',
  roadHighway:  '#1c2d46',
  labelCountry: '#3a4a60',
  labelState:   '#3a4a60',
  labelCity:    '#5a7090',
  halo:         '#0d1422',
};

export const lodestoneMapStyle = {
  version: 8 as const,
  sources: {
    openmaptiles: {
      type: 'vector' as const,
      url: 'https://tiles.openfreemap.org/planet',
    },
  },
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  layers: [

    // ── Base ───────────────────────────────────────────────────────────────
    {
      id: 'background',
      type: 'background' as const,
      paint: { 'background-color': C.land },
    },
    {
      id: 'water',
      type: 'fill' as const,
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': C.water },
    },
    {
      id: 'waterway',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'waterway',
      paint: { 'line-color': C.waterway, 'line-width': 1 },
    },
    {
      id: 'landcover',
      type: 'fill' as const,
      source: 'openmaptiles',
      'source-layer': 'landcover',
      paint: { 'fill-color': C.landcover, 'fill-opacity': 1 },
    },
    {
      id: 'landuse',
      type: 'fill' as const,
      source: 'openmaptiles',
      'source-layer': 'landuse',
      paint: { 'fill-color': C.landuse, 'fill-opacity': 0.8 },
    },

    // ── Borders ────────────────────────────────────────────────────────────
    {
      id: 'boundary-country',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['==', 'admin_level', 2],
      minzoom: 2,
      paint: {
        'line-color': C.borderCountry,
        'line-width': 0.8,
        'line-opacity': 0.9,
      },
    },
    {
      id: 'boundary-state',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['==', 'admin_level', 4],
      minzoom: 3, 
      paint: {
        'line-color': C.borderState,
        'line-width': 0.5,
        'line-opacity': 0.6,
      },
    },

    // ── Roads (very subtle — just enough to show geography) ────────────────
    {
      id: 'road-minor',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'minor', 'service', 'track'],
      paint: { 'line-color': C.roadMinor, 'line-width': 0.4 },
    },
    {
      id: 'road-major',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'trunk'],
      paint: { 'line-color': C.roadMajor, 'line-width': 0.7 },
    },
    {
      id: 'road-highway',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', 'class', 'motorway'],
      paint: { 'line-color': C.roadHighway, 'line-width': 1 },
    },

    // ── Labels ─────────────────────────────────────────────────────────────
    {
      id: 'label-country',
      type: 'symbol' as const,
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['==', 'class', 'country'],
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 6, 14],
        'text-transform': 'uppercase' as const,
        'text-letter-spacing': 0.12,
      },
      paint: {
        'text-color': C.labelCountry,
        'text-halo-color': C.halo,
        'text-halo-width': 1,
      },
    },
    {
      id: 'label-state',
      type: 'symbol' as const,
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['==', 'class', 'state'],
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 9, 8, 12],
        'text-transform': 'uppercase' as const,
        'text-letter-spacing': 0.08,
      },
      paint: {
        'text-color': C.labelState,
        'text-halo-color': C.halo,
        'text-halo-width': 1,
      },
    },
    {
      id: 'label-city',
      type: 'symbol' as const,
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['in', 'class', 'city', 'town'],
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['Noto Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 10, 10, 14],
      },
      paint: {
        'text-color': C.labelCity,
        'text-halo-color': C.halo,
        'text-halo-width': 1.5,
      },
    },

  ],
};