/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#distance
 */
declare function distance(
    from: distance.Point,
    to: distance.Point,
    units?: string): number;
declare namespace distance {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = distance;
