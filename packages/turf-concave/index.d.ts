/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#concave
 */
declare function concave(
    points: GeoJSON.FeatureCollection<GeoJSON.Point>,
    maxEdge: number,
    units: string): GeoJSON.Feature<GeoJSON.Polygon>;
declare namespace concave { }
export = concave;
