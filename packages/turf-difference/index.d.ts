/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#difference
 */
declare function difference(
    poly1: difference.Polygon,
    poly2: difference.Polygon): difference.Polygon;
declare namespace difference {
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
}
export = difference;
