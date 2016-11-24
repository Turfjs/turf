/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#flip
 */
declare function flip(features: flip.Features): flip.Features;
declare namespace flip {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
}
export = flip;
