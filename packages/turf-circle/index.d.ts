/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#circle
 */
declare function circle(
    center: GeoJSON.Feature<GeoJSON.Point>,
    radius: number,
    steps?: number,
    units?: string): GeoJSON.Feature<GeoJSON.Polygon>;

declare namespace circle { }
export = circle;
