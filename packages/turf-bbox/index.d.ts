/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#bbox
 */
declare function bbox(features: bbox.Features): bbox.BBox;
declare namespace bbox {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type BBox = Array<number>;
}
export = bbox;
