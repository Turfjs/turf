/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point;
export type Line = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString;

interface Options {
    ignoreEndVertices?: boolean
}

/**
 * http://turfjs.org/docs/#booleanpointonline
 */
export default function (point: Point, linestring: Line, options?: Options): boolean;
