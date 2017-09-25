/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Feature = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#nearest
 */
export default function nearest(targetPoint: Point, points: Points): Feature;
