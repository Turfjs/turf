/// <reference types="geojson" />

type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#lineoverlap
 */
declare function lineOverlap(
  source: Feature<Geoms> | Geoms,
  target: Feature<Geoms> | Geoms,
  tolerance?: number
): LineStrings;

declare namespace lineOverlap {}
export = lineOverlap;
