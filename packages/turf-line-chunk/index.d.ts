/// <reference types="geojson" />

import {Units} from '@turf/helpers'

type LineString = GeoJSON.LineString;
type MultiLineString = GeoJSON.MultiLineString;
type GeometryObject = GeoJSON.GeometryObject;
type GeometryCollection = GeoJSON.GeometryCollection;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
type Geoms = LineString | MultiLineString;
interface FeatureGeometryCollection extends GeoJSON.Feature<any> {
  geometry: GeometryCollection
}

// Input & Output
type Input = Feature<Geoms> | FeatureCollection<Geoms> | Geoms | GeometryCollection | FeatureGeometryCollection;
type Output = FeatureCollection<LineString>;

/**
 * http://turfjs.org/docs/#linechunk
 */
declare function lineChunk(geojson: Input, segmentLength: number, unit?: Units, reverse?: boolean): Output;
declare namespace lineChunk {}
export = lineChunk;
