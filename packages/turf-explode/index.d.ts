/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#explode
 */
declare function explode(features: explode.Features): explode.Points;
declare namespace explode {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
}
export = explode;
