/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#lineOffset
 */
declare function lineOffset(line: LineString | GeoJSON.LineString, distance: number, units?: string): LineString;
declare namespace lineOffset { }
export = lineOffset;
