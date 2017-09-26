/// <reference types="geojson" />

export type LineString = GeoJSON.Feature<GeoJSON.LineString>;

interface Options {
    resolution?: number;
    sharpness?: number;
}

/**
 * http://turfjs.org/docs/#bezier
 */
export default function bezier(line: LineString, options?: Options): LineString;
