/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/
 */
declare function lineSliceAlong(
    line: lineSliceAlong.LineString,
    startDist: number,
    stopDist: number,
    units?: string): lineSliceAlong.LineString;
declare namespace lineSliceAlong {
    type LineString = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
}
export = lineSliceAlong;
