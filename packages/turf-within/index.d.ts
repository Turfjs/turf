/// <reference types="geojson" />

export type BBox = Array<number>;
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#within
 */
export default function within(points: Points, polygons: Polygons): Points;
