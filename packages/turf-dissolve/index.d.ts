/// <reference types="geojson" />

export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs.html#dissolve
 */
export default function dissolve(featureCollection: Polygons, propertyName?: string): Polygons;
