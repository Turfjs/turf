/// <reference types="geojson" />

type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#lineoverlap
 */
declare function lineOverlap<Geom1 extends Geoms, Geom2 extends Geoms>(source: Feature<Geom1> | Geom1, target: Feature<Geom2> | Geom2, precision?: number): LineStrings;
declare namespace lineOverlap {}
export = lineOverlap;
