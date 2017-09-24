/// <reference types="geojson" />

type Types = GeoJSON.FeatureCollection<any> | GeoJSON.Feature<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/#clone
 */
export default function <T extends Types>(geojson: T): T;
