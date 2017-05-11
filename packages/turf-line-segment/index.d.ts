/// <reference types="geojson" />

type LineString = GeoJSON.LineString;
type MultiLineString = GeoJSON.MultiLineString;
type Polygon = GeoJSON.Polygon;
type MultiPolygon = GeoJSON.MultiPolygon;
type GeometryObject = GeoJSON.GeometryObject;
type GeometryCollection = GeoJSON.GeometryCollection;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
type Geoms = LineString | MultiLineString | Polygon | MultiPolygon;

// Not correctly supported in @types/geojson
interface FeatureGeometryCollection extends Feature<any> {
  geometry: GeometryCollection
}

// Input & Output
type Input = Feature<Geoms> | FeatureCollection<Geoms> | Geoms | GeometryCollection | FeatureGeometryCollection;
type Output = FeatureCollection<LineString>;

/**
 * http://turfjs.org/docs/#linesegment
 */
declare function lineSegment(geojson: Input): Output;
declare namespace lineSegment {}
export = lineSegment;
