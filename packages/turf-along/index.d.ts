/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Point = GeoJSON.Feature<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#along
 */
declare function along(line: LineString, distance: number, units?: string): Point;
declare namespace along { }
export = along;
