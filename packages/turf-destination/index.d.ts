/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#destination
 */
declare function destination(
    from: destination.Point,
    distance: number,
    bearing: number,
    units?: string): destination.Point;
declare namespace destination {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = destination;
