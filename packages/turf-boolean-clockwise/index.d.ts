/// <reference types="geojson" />

type Line = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString | Array<Array<number>>;

/**
 * http://turfjs.org/docs/#boolean-clockwise
 */
declare function clockwise(line: Line): boolean;
declare namespace clockwise {
}
export = clockwise;