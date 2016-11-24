/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#distance
 */
declare function distance(
    from: GeoJSON.Feature<GeoJSON.Point>,
    to: GeoJSON.Feature<GeoJSON.Point>,
    units?: string): number;
declare namespace distance { }
export = distance;
