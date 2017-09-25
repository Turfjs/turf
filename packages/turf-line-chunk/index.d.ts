/// <reference types="geojson" />

import { Units } from '@turf/helpers'

export type LineString = GeoJSON.LineString;
export type MultiLineString = GeoJSON.MultiLineString;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Geoms = LineString | MultiLineString;
export interface FeatureGeometryCollection extends GeoJSON.Feature<any> {
  geometry: GeometryCollection
}

// Input & Output
export type Input = Feature<Geoms> | FeatureCollection<Geoms> | Geoms | GeometryCollection | FeatureGeometryCollection;
export type Output = FeatureCollection<LineString>;

/**
 * http://turfjs.org/docs/#linechunk
 */
export default function lineChunk(
    geojson: Input,
    segmentLength: number,
    unit?: Units,
    reverse?: boolean): Output;
