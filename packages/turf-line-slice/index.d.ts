/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#lineslice
 */
declare function lineSlice(startPt: Point, stopPt: Point, line: LineString | GeoJSON.LineString): LineString;
declare namespace lineSlice { }
export = lineSlice;
