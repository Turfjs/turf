/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bearing
 */
declare function bearing(start: bearing.Point, end: bearing.Point): number;
declare namespace bearing {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = bearing;
