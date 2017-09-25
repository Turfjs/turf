/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | Array<number>;
export type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#greatcircle
 */
export default function greatCircle(start: Point, end: Point, properties?: any, npoints?: number, offset?: number): LineString;
