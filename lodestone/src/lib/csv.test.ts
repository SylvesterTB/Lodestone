import { describe, it, expect } from 'vitest';
import { parseAndNormalizeCSV } from './csv';

describe('parseAndNormalizeCSV', () => {

  it('parses standard column names', () => {
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
41.8,-87.6,40.7,-74.0,500,1200`;

    const { shipments, warnings, errors } = parseAndNormalizeCSV(csv);

    expect(errors).toHaveLength(0);
    expect(shipments).toHaveLength(1);
    expect(shipments[0].origin_lat).toBe(41.8);
    expect(shipments[0].cost).toBe(1200);
  });

  it('resolves aliased column names', () => {
    const csv = `from_lat,from_lon,to_lat,to_lon,qty,freight_cost
41.8,-87.6,40.7,-74.0,500,1200`;

    const { shipments, errors } = parseAndNormalizeCSV(csv);

    expect(errors).toHaveLength(0);
    expect(shipments).toHaveLength(1);
  });

  it('drops rows with missing coordinates', () => {
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
,,40.7,-74.0,500,1200
41.8,-87.6,40.7,-74.0,500,1200`;

    const { shipments } = parseAndNormalizeCSV(csv);

    expect(shipments).toHaveLength(1);
  });

  it('drops rows with missing cost or volume', () => {
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
41.8,-87.6,40.7,-74.0,,`;

    const { shipments } = parseAndNormalizeCSV(csv);

    expect(shipments).toHaveLength(0);
  });
  it('returns a warning when a fuzzy match is used', () => {
    const csv = `origin_lats,origin_long,dest_lat,dest_lon,volume,cost
  41.8,-87.6,40.7,-74.0,500,1200`;

    const { warnings } = parseAndNormalizeCSV(csv);
    expect(warnings.length).toBeGreaterThan(0);
  });
  it('returns an error when a required column is missing', () => {
    const csv = `some_col,origin_lon,dest_lat,dest_lon,volume,cost
41.8,-87.6,40.7,-74.0,500,1200`;

    const { shipments, errors } = parseAndNormalizeCSV(csv);

    expect(errors.length).toBeGreaterThan(0);
    expect(shipments).toHaveLength(0);
  });

});