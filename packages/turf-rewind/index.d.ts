/// <reference types="geojson" />

import { Units, FeatureGeometryCollection } from '@turf/helpers';

export { Units, FeatureGeometryCollection }
export type LineString = GeoJSON.LineString;
export type Polygon = GeoJSON.Polygon;
export type MultiLineString = GeoJSON.MultiLineString;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Geoms = LineString|Polygon|MultiLineString|MultiPolygon;
export type Input = FeatureCollection<Geoms> | Feature<Geoms> | Geoms | FeatureGeometryCollection;

/**
 * http://turfjs.org/docs/#rewind
 */
export default function rewind<T extends Input>(geojson: T, reversed?: boolean, mutate?: boolean): T;
