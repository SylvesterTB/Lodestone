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

export function parseAndNormalizeCSV(csvContent: string): ParsedShipment[] {
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
    origin_lat: ['from_lat', 'from_latitude', 'origin_lat', 'source_lat', 'ship_from_lat'],
    origin_lon: ['from_lon', 'from_longitude', 'origin_lon', 'source_lon', 'ship_from_lon'],
    dest_lat: ['destination lat', 'destination_lat', 'destination_latitude', 'to_lat', 'dest_lat'],
    dest_lon: ['to_lon', 'destination_lon', 'destination_longitude', 'dest_lon'],
    volume: ['qty', 'quantity', 'volume', 'shipments', 'units'],
    cost: ['freight_cost', 'cost', 'price', 'total_cost'],
    origin_label: ['ship_from', 'origin_label', 'from_city', 'origin'],
    dest_label: ['destination', 'dest_label', 'to_city', 'to_label']
  };
  const options = {
    threshold: .4
  }
  const fuse = new Fuse(headers, options);

  function findBestHeader(canonicalTarget: keyof ParsedShipment): string {
    const targets = explicitDictionary[canonicalTarget];

    const matchedLowercaseHeader = headers.find(h => targets.includes(h));
    
    if (matchedLowercaseHeader) {
      return rawHeaders.find(h => h.toLowerCase().trim() === matchedLowercaseHeader) || canonicalTarget;
    }
    // last check to see if any close matches
    for (const alias of targets) {
      const results = fuse.search(alias);
      if (results.length > 0) {
        return rawHeaders.find(h => h.toLowerCase().trim() === results[0].item) || canonicalTarget;
      }
  }
  
    return canonicalTarget; 
  }

  const headerMap = {
    origin_lat: findBestHeader("origin_lat"),
    origin_lon: findBestHeader("origin_lon"),
    dest_lat: findBestHeader("dest_lat"),
    dest_lon: findBestHeader("dest_lon"),
    volume: findBestHeader("volume"),
    cost: findBestHeader("cost"),
    origin_label: findBestHeader("origin_label"),
    dest_label: findBestHeader("dest_label"),
  };

  console.log("Calculated Header Map:", headerMap);

  const cleanShipments: ParsedShipment[] = rawRows.map((row) => {
    return {
      origin_lat: Number(row[headerMap.origin_lat]),
      origin_lon: Number(row[headerMap.origin_lon]),
      dest_lat: Number(row[headerMap.dest_lat]),
      dest_lon: Number(row[headerMap.dest_lon]),
      volume: Number(row[headerMap.volume]),
      cost: Number(row[headerMap.cost]),
      origin_label: row[headerMap.origin_label] || 'Unknown',
      dest_label: row[headerMap.dest_label] || 'Unknown'
    };
  });

  const validShipments = cleanShipments.filter(s => {
    const coordsValid  = !isNaN(s.origin_lat) && !isNaN(s.origin_lon)
                      && !isNaN(s.dest_lat)   && !isNaN(s.dest_lon);
    const metricsValid = !isNaN(s.volume) && !isNaN(s.cost);
    return coordsValid && metricsValid;
  });

  return validShipments;
}

if (import.meta.env.DEV) {
  const { default: mockCsv } = await import('../data/mock_shipments.csv?raw');
  console.log("🧪 Running CSV Parser Test...");
  const result = parseAndNormalizeCSV(mockCsv);
  console.log("📋 Normalized Output Result:", result);
}