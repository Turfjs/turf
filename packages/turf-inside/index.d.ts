/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#inside
 */
declare function inside(
    point: inside.Point,
    polygon: inside.Polygon): boolean;
declare namespace inside {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}
export = inside;
