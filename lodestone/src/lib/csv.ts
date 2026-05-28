import Papa from 'papaparse';
import mockCsvString from '../data/mock_shipments.csv?raw';
import Fuse from 'fuse.js';


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
  const parsed = Papa.parse(csvContent, {
    header: true, 
    skipEmptyLines: true
  });

  const rawRows = parsed.data;
  
  // make them lowercase to fix matching
  const rawHeaders = parsed.meta.fields ?? [];
  const headers = rawHeaders.map(h => h.toLowerCase().trim());

  // only need to check for lower case
  const explicitDictionary: Record<keyof ParsedShipment, string[]> = {
    origin_lat: ['from_lat', 'from_latitude', 'origin_lat', 'source_lat'],
    origin_lon: ['from_lon', 'from_longitude', 'origin_lon', 'source_lon'],
    dest_lat: ['destination lat', 'destination_lat', 'destination_latitude', 'to_lat', 'dest_lat'],
    dest_lon: ['to_lon', 'destination_lon', 'destination_longitude', 'dest_lon'],
    volume: ['qty', 'quantity', 'volume', 'shipments', 'units'],
    cost: ['freight_cost', 'cost', 'price', 'total_cost'],
    origin_label: ['ship_from', 'origin_label', 'from_city', 'origin'],
    dest_label: ['destination', 'dest_label', 'to_city', 'to_label']
  };

  function findBestHeader(canonicalTarget: keyof ParsedShipment): string {
    const targets = explicitDictionary[canonicalTarget];
    
    const matchedLowercaseHeader = headers.find(h => targets.includes(h));
    
    if (matchedLowercaseHeader) {
      return rawHeaders.find(h => h.toLowerCase().trim() === matchedLowercaseHeader) || canonicalTarget;
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

  const cleanShipments: ParsedShipment[] = rawRows.map((row: any) => {
    return {
      origin_lat: Number(row[headerMap.origin_lat]),
      origin_lon: Number(row[headerMap.origin_lon]),
      dest_lat: Number(row[headerMap.dest_lat]),
      dest_lon: Number(row[headerMap.dest_lon]),
      volume: Number(row[headerMap.volume]) || 0,
      cost: Number(row[headerMap.cost]) || 0,
      origin_label: row[headerMap.origin_label] || 'Unknown',
      dest_label: row[headerMap.dest_label] || 'Unknown'
    };
  });

  const validShipments = cleanShipments.filter(s => 
    !isNaN(s.origin_lat) && !isNaN(s.origin_lon) && !isNaN(s.dest_lat) && !isNaN(s.dest_lon)
  );

  return validShipments;
}

if (import.meta.env.DEV) {
  console.log("🧪 Running CSV Parser Test...");
  const result = parseAndNormalizeCSV(mockCsvString);
  console.log("📋 Normalized Output Result:", result);
}