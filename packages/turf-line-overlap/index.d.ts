/// <reference types="geojson" />

export type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
export type Geoms = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
export type Feature<Geom extends GeoJSON.GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#lineoverlap
 */
export default function lineOverlap(
  source: Feature<Geoms> | Geoms,
  target: Feature<Geoms> | Geoms,
  tolerance?: number
): LineStrings;
