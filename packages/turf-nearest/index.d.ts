/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Feature = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#nearest
 */
declare function nearest(targetPoint: Point, points: Points): Feature;
declare namespace nearest { }
export = nearest;
