/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#nearest
 */
declare function nearest(targetPoint: Point, points: Point): Point;
declare namespace nearest { }
export = nearest;
