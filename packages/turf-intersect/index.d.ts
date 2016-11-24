/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#intersect
 */
declare function intersect(
    poly1: intersect.Polygon,
    poly2: intersect.Polygon): intersect.Feature;
declare namespace intersect {
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
    type Feature = GeoJSON.Feature<any>;
}
export = intersect;
