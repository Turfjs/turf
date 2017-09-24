/// <reference types="geojson" />

import { Units, FeatureGeometryCollection } from '@turf/helpers';

export type Point = GeoJSON.Point;
export type LineString = GeoJSON.LineString;
export type Polygon = GeoJSON.Polygon;
export type MultiPoint = GeoJSON.MultiPoint;
export type MultiLineString = GeoJSON.MultiLineString;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Geoms = Point|LineString|Polygon|MultiPoint|MultiLineString|MultiPolygon;

/**
 * http://turfjs.org/docs/#buffer
 */
declare function buffer<Geom extends Point|LineString|Polygon>(feature: Feature<Geom>|Geom, radius?: number, unit?: Units, steps?: number): Feature<Polygon> | undefined;
declare function buffer<Geom extends MultiPoint|MultiLineString|MultiPolygon>(feature: Feature<Geom>|Geom, radius?: number, unit?: Units, steps?: number): Feature<MultiPolygon> | undefined;
declare function buffer<Geom extends Point|LineString|Polygon>(feature: FeatureCollection<Geom>, radius?: number, unit?: Units, steps?: number): FeatureCollection<Polygon>;
declare function buffer<Geom extends MultiPoint|MultiLineString|MultiPolygon>(feature: FeatureCollection<Geom>, radius?: number, unit?: Units, steps?: number): FeatureCollection<MultiPolygon>;
declare function buffer(feature: FeatureCollection<any>|FeatureGeometryCollection|GeometryCollection, radius?: number, unit?: Units, steps?: number): FeatureCollection<Polygon|MultiPolygon>;
declare function buffer(feature: Feature<any>|GeometryObject, radius?: number, unit?: Units, steps?: number): Feature<Polygon|MultiPolygon> | undefined;

export default buffer;
