/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;

/**
 * http://turfjs.org/docs/#isolines
 */
declare function isolines(points: Points, z: string, resolution: number, breaks: Array<number>): LineStrings;
declare namespace isolines { }
export = isolines;
