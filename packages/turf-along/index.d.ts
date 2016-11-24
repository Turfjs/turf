/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#along
 */
declare function along(
    line: along.LineString,
    distance: number,
    units?: string): along.Point;
declare namespace along {
    type LineString = GeoJSON.Feature<GeoJSON.LineString>;
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = along;
