/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/
 */
declare function lineSliceAlong(line: LineString | GeoJSON.LineString, startDist: number, stopDist: number, units?: string): LineString;
declare namespace lineSliceAlong { }
export = lineSliceAlong;
