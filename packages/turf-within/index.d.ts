/// <reference types="geojson" />

type BBox = Array<number>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#within
 */
declare function within(points: Points, polygons: Polygons): Points;
declare namespace within { }
export = within;
