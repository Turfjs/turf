/// <reference types="geojson" />

type BBox = Array<number>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tag
 */
declare function tag(points: Points, polygons: Polygons, field: string, outField: string): Points;
declare namespace tag { }
export = tag;
