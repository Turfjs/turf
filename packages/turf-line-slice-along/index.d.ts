/// <reference types="geojson" />

export type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/
 */
export default function lineSliceAlong(line: LineString | GeoJSON.LineString, startDist: number, stopDist: number, units?: string): LineString;
