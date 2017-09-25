/// <reference types="geojson" />

export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tin
 */
export default function tin(points: Points, z?: string): Polygons;
