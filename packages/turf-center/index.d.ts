/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#center
 */
declare function center(features: center.Features): center.Point;
declare namespace center {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = center;
