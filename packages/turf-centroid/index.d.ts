/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#centroid
 */
declare function centroid(features: centroid.Features): centroid.Point;
declare namespace centroid {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = centroid;
