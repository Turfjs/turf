/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#destination
 */
declare function destination(
    from: GeoJSON.Feature<GeoJSON.Point>,
    distance: number,
    bearing: number,
    units?: string): GeoJSON.Feature<GeoJSON.Point>;
declare namespace destination { }
export = destination;
