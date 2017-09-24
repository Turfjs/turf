/// <reference types="geojson" />

export type Line = GeoJSON.Feature<GeoJSON.LineString> | GeoJSON.LineString | Array<Array<number>>;

/**
 * http://turfjs.org/docs/#boolean-clockwise
 */
export default function clockwise(line: Line): boolean;
