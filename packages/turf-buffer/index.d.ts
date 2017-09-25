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
export type Geoms = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;

interface Options {
    units?: Units;
    steps?: number
}

/**
 * http://turfjs.org/docs/#buffer
 */
declare function buffer<Geom extends Point | LineString | Polygon>(feature: Feature<Geom>|Geom, radius?: number, options?: Options): Feature<Polygon> | undefined;
declare function buffer<Geom extends MultiPoint | MultiLineString | MultiPolygon>(feature: Feature<Geom>|Geom, radius?: number, options?: Options): Feature<MultiPolygon> | undefined;
declare function buffer<Geom extends Point | LineString | Polygon>(feature: FeatureCollection<Geom>, radius?: number, options?: Options): FeatureCollection<Polygon>;
declare function buffer<Geom extends MultiPoint | MultiLineString | MultiPolygon>(feature: FeatureCollection<Geom>, radius?: number, options?: Options): FeatureCollection<MultiPolygon>;
declare function buffer(feature: FeatureCollection<any> | FeatureGeometryCollection | GeometryCollection, radius?: number, options?: Options): FeatureCollection<Polygon | MultiPolygon>;
declare function buffer(feature: Feature<any> | GeometryObject, radius?: number, options?: Options): Feature<Polygon | MultiPolygon> | undefined;

export default buffer;
