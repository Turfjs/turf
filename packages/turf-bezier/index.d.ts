/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#bezier
 */
export default function bezier(line: LineString, resolution?: number, sharpness?: number): LineString;
