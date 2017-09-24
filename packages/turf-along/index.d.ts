/// <reference types="geojson" />

export type LineString = GeoJSON.Feature<GeoJSON.LineString>;
export type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#along
 */
export default function along(line: LineString, distance: number, units?: string): Point;
