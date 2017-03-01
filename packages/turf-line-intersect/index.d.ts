/// <reference types="geojson" />

type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#lineintersect
 */
declare function lineIntersect(line1: LineString, line2: LineString): Points;
declare namespace lineIntersect { }
export = lineIntersect;
