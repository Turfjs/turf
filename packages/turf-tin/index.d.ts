/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tin
 */
declare function tin(points: Points, z?: string): Polygons;
declare namespace tin { }
export = tin;
