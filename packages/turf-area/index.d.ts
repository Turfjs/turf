/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#area
 */
declare function area(features: area.Features): number;
declare namespace area {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
}
export = area;
