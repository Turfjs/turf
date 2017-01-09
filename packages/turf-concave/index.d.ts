/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#concave
 */
declare function concave(points: Points, maxEdge: number, units: string): Polygon;
declare namespace concave { }
export = concave;
