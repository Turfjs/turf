/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#circle
 */
declare function circle(center: Point, radius: number, steps?: number, units?: string): Polygon;
declare namespace circle { }
export = circle;
