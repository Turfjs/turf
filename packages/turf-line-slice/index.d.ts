/// <reference types="geojson" />

export type LineString = GeoJSON.Feature<GeoJSON.LineString>;
export type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#lineslice
 */
export default function lineSlice(startPt: Point, stopPt: Point, line: LineString | GeoJSON.LineString): LineString;
