import { describe, it, expect } from 'vitest';
import { parseAndNormalizeCSV } from './csv';

// like Junit class definition, all tests go in here
describe('parseAndNormalizeCSV', () => {

  // test function
  it('parses standard column names', () => {
    // create a mock header and data line that doesn't actually use a csv
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
41.8,-87.6,40.7,-74.0,500,1200`;
    // run the test and store the value 
    const result = parseAndNormalizeCSV(csv);
    // simple assertion check "does the method with a csv with 1 valid line returns 1"
    // toHaveLength is good for any array
    expect(result).toHaveLength(1);
    // checks to see if the data under column headers is correctly matched
    // toBe is the .equals
    expect(result[0].origin_lat).toBe(41.8);
    expect(result[0].cost).toBe(1200);
  });

  it('resolves aliased column names', () => {
    const csv = `from_lat,from_lon,to_lat,to_lon,qty,freight_cost
41.8,-87.6,40.7,-74.0,500,1200`;

    const result = parseAndNormalizeCSV(csv);
    expect(result).toHaveLength(1);
  });

  it('drops rows with missing coordinates', () => {
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
,,40.7,-74.0,500,1200
41.8,-87.6,40.7,-74.0,500,1200`;

    const result = parseAndNormalizeCSV(csv);
    expect(result).toHaveLength(1); // first row dropped
  });

  it('drops rows with missing cost or volume', () => {
    const csv = `origin_lat,origin_lon,dest_lat,dest_lon,volume,cost
41.8,-87.6,40.7,-74.0,,`;

    const result = parseAndNormalizeCSV(csv);
    expect(result).toHaveLength(0);
  });

});