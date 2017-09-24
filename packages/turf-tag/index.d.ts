/// <reference types="geojson" />

export type BBox = [number, number, number, number];
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tag
 */
export default function tag(points: Points, polygons: Polygons, field: string, outField: string): Points;
