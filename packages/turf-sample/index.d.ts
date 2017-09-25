/// <reference types="geojson" />

/**
 * http://turfjs.org/docs/#sample
 */
export default function sample<T extends GeoJSON.GeometryObject>(
    features: GeoJSON.FeatureCollection<T>,
    num: number): GeoJSON.FeatureCollection<T>;
