/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#center
 */
declare function centerOfMass(features: centerOfMass.Features): centerOfMass.Point;
declare namespace centerOfMass {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type Point = GeoJSON.Feature<GeoJSON.Point>;
}
export = centerOfMass;
