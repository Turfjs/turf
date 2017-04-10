/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#arcline
 */
declare function arcline(center: Point, radius: number, bearing1: number, bearing2: number, steps?: number, units?: string): LineString;
declare namespace arcline {
}
export = arcline;
