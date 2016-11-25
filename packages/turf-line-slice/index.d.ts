/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#lineslice
 */
declare function lineSlice(
    startPt: lineSlice.Point,
    stopPt: lineSlice.Point,
    line: lineSlice.LineString): lineSlice.LineString;
declare namespace lineSlice {
    type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
    type Point = GeoJSON.Feature<GeoJSON.Point>; 
}
export = lineSlice;
