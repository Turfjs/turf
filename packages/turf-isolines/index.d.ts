/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#isolines
 */
declare function isolines(
    points: isolines.Points,
    z: string,
    resolution: number,
    breaks: Array<number>): isolines.LineStrings;
declare namespace isolines {
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
    type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
}
export = isolines;
