/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | Array<number>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#greatcircle
 */
declare function greatCircle(start: Point, end: Point, properties?: any, npoints?: number, offset?: number): LineString;
declare namespace greatCircle {}
export = greatCircle;
