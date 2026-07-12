import { create } from 'zustand'

import { ParsedShipment, ParseResult } from '../lib/csv'

interface FilterState{
  minVol:        number
  scaleWidth:    boolean
  showLabels:    boolean
  highlightUtil: boolean
  weightByCost:  boolean
  useWeiszfeld:  boolean
}

export interface LodestoneStore extends FilterState {
  // ── rawData ──────────────────────────────────────
  shipments:     ParsedShipment[]
  filename:      string | null
  rowCount:      number
  parseWarnings: string[]
  parseErrors:   string[]

  // ── viewState ─────────────────────────────────────
  mode: 'lanes' | 'cog' | 'both'

  // ── actions ───────────────────────────────────────
  loadFile:  (filename: string, result: ParseResult) => void
  clearData: () => void
  setMode:   (mode: 'lanes' | 'cog' | 'both') => void
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
}

export const useLodestoneStore = create<LodestoneStore>((set) => ({
  // initial state
  shipments:     [],
  filename:      null,
  rowCount:      0,
  parseWarnings: [],
  parseErrors:   [],
  minVol:        0,
  scaleWidth:    true,
  showLabels:    true,
  highlightUtil: false,
  weightByCost:  true,
  useWeiszfeld:  true,
  mode:          'lanes',

  // actions — each calls set() with the slice of state to update
  loadFile: (filename, result) => set({
    filename,
    shipments:     result.shipments,
    rowCount:      result.shipments.length,
    parseWarnings: result.warnings,
    parseErrors:   result.errors,
  }),

  clearData: () => set({
    shipments:     [],
    filename:      null,
    rowCount:      0,
    parseWarnings: [],
    parseErrors:   [],
  }),

  setMode: (mode) => set({ mode }),

  setFilter: (key, value) => set({ [key]: value }),

  setMinVol: (minVol) => set({ minVol }),
}))