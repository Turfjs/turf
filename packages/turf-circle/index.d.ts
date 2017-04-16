/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#circle
 */
declare function circle(center: Point, radius: number, steps?: number, units?: string, properties?: any): Polygon;
declare namespace circle { }
export = circle;
