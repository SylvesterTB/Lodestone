import Papa from 'papaparse';
import Fuse from 'fuse.js'


export interface ParsedShipment {
  origin_lat: number;
  origin_lon: number;
  dest_lat: number;
  dest_lon: number;
  volume: number;
  cost: number;
  origin_label?: string;
  dest_label?: string;
}
  export interface ParseResult {
    shipments: ParsedShipment[];
    warnings: string[];
    errors: string[];
  }

  export function parseAndNormalizeCSV(csvContent: string): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true, 
    skipEmptyLines: true
  });

  const rawRows = parsed.data;
  
  // make them lowercase to fix matching
  const rawHeaders = parsed.meta.fields ?? [];
  const headers = rawHeaders.map(h => h.toLowerCase().trim());

  // only need to check for lower case
  const explicitDictionary: Record<keyof ParsedShipment, string[]> = {
    origin_lat: ['from_lat', 'from_latitude', 'origin_lat', 'source_lat', 'ship_from_lat', 'orig_lat'],
    origin_lon: ['from_lon', 'from_longitude', 'origin_lon', 'source_lon', 'ship_from_lon','orig_lon'],
    dest_lat: ['destination lat', 'destination_lat', 'destination_latitude', 'to_lat', 'dest_lat'],
    dest_lon: ['to_lon', 'destination_lon', 'destination_longitude', 'dest_lon'],
    volume: ['qty', 'quantity', 'volume', 'shipments', 'units'],
    cost: ['freight_cost', 'cost', 'price', 'total_cost'],
    origin_label: ['ship_from', 'origin_label', 'from_city', 'origin'],
    dest_label: ['destination', 'dest_label', 'to_city', 'to_label']
  };
  const options = {
    threshold: .25,
    includeScore: true

  }
  const fuse = new Fuse(headers, options);

  type MatchResult =
    | { status: 'exact';  header: string }
    | { status: 'fuzzy';  header: string; inferredFrom: string }
    | { status: 'missing'; header: null }
  const REQUIRED: (keyof ParsedShipment)[] = 
    ['origin_lat', 'origin_lon', 'dest_lat', 'dest_lon', 'volume', 'cost'];

  function findBestHeader(canonicalTarget: keyof ParsedShipment): MatchResult {
    const targets = explicitDictionary[canonicalTarget];

    // exact match
    const exactMatch = headers.find(h => targets.includes(h));
    if (exactMatch) {
      const original = rawHeaders.find(h => h.toLowerCase().trim() === exactMatch)!;
      return { status: 'exact', header: original };
    }

    // fuzzy, only attempt on required fields to avoid false matches on optional ones
    if (REQUIRED.includes(canonicalTarget)) {
    for (const alias of targets) {
      const results = fuse.search(alias);
      if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.2) {
        const original = rawHeaders.find(h => h.toLowerCase().trim() === results[0].item)!;
        return { status: 'fuzzy', header: original, inferredFrom: results[0].item };
      }
    }
  }

    return { status: 'missing', header: null };
  }

    const warnings: string[] = [];
    const errors: string[] = [];

    // matchResults holds the full MatchResult objects
    const matchResults = {
      origin_lat:    findBestHeader('origin_lat'),
      origin_lon:    findBestHeader('origin_lon'),
      dest_lat:      findBestHeader('dest_lat'),
      dest_lon:      findBestHeader('dest_lon'),
      volume:        findBestHeader('volume'),
      cost:          findBestHeader('cost'),
      origin_label:  findBestHeader('origin_label'),
      dest_label:    findBestHeader('dest_label'),
    };

    // walk the results and collect messages
    for (const [field, result] of Object.entries(matchResults) as [keyof ParsedShipment, MatchResult][]) {
      if (result.status === 'fuzzy') {
        warnings.push(`"${result.inferredFrom}" was mapped to ${field} — verify this is correct`);
      }
      if (result.status === 'missing' && REQUIRED.includes(field)) {
        errors.push(`No column found for "${field}" — try renaming it to "${explicitDictionary[field][0]}"`);
      }
    }

    const headerMap = Object.fromEntries(
      Object.entries(matchResults).map(([field, result]) => [field, result.header])
    ) as Record<keyof ParsedShipment, string | null>;


  // if any required headers are missing, abort early to avoid indexing with null
  if (errors.length > 0) {
    return { shipments: [], warnings, errors };
  }

  const headerMapNonNull = headerMap as Record<keyof ParsedShipment, string>;

  const cleanShipments: ParsedShipment[] = rawRows.map((row) => {
    return {
      origin_lat: Number(row[headerMapNonNull.origin_lat]),
      origin_lon: Number(row[headerMapNonNull.origin_lon]),
      dest_lat: Number(row[headerMapNonNull.dest_lat]),
      dest_lon: Number(row[headerMapNonNull.dest_lon]),
      volume: row[headerMapNonNull.volume] === '' ? NaN : Number(row[headerMapNonNull.volume]),
      cost:   row[headerMapNonNull.cost]   === '' ? NaN : Number(row[headerMapNonNull.cost]),
      origin_label: row[headerMapNonNull.origin_label] || 'Unknown',
      dest_label: row[headerMapNonNull.dest_label] || 'Unknown'
    };
  });
  const validShipments = cleanShipments.filter(s => {
    const coordsValid  = isFinite(s.origin_lat) && s.origin_lat !== 0 &&
                        isFinite(s.origin_lon) && s.origin_lon !== 0 &&
                        isFinite(s.dest_lat)   && s.dest_lat   !== 0 &&
                        isFinite(s.dest_lon)   && s.dest_lon   !== 0;
    const metricsValid = !isNaN(s.volume) && !isNaN(s.cost);
    return coordsValid && metricsValid;
  });

  return { shipments: validShipments, warnings, errors };
}
