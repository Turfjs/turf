/// <reference types="geojson" />

import {Units} from '@turf/helpers';

type Point = GeoJSON.Point;
type LineString = GeoJSON.LineString;
type Polygon = GeoJSON.Polygon;
type MultiPoint = GeoJSON.MultiPoint;
type MultiLineString = GeoJSON.MultiLineString;
type MultiPolygon = GeoJSON.MultiPolygon;
type GeometryObject = GeoJSON.GeometryObject;
type GeometryCollection = GeoJSON.GeometryCollection;
type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
type Geoms = Point|LineString|Polygon|MultiPoint|MultiLineString|MultiPolygon|;

// Feature Geometry Collection not supported by @types/geojson
interface GeometryCollectionFeature extends Feature<any> {
    geometries: GeometryObject[]
}

interface Buffer {
    /**
     * http://turfjs.org/docs/#buffer
     */
    <Geom extends Point|LineString|Polygon>(feature: Feature<Geom>|Geom, radius?: number, unit?: Units, steps?: number): Feature<Polygon>;
    <Geom extends MultiPoint|MultiLineString|MultiPolygon>(feature: Feature<Geom>|Geom, radius?: number, unit?: Units, steps?: number): Feature<MultiPolygon>;
    <Geom extends Point|LineString|Polygon>(feature: FeatureCollection<Geom>, radius?: number, unit?: Units, steps?: number): FeatureCollection<Polygon>;
    <Geom extends MultiPoint|MultiLineString|MultiPolygon>(feature: FeatureCollection<Geom>, radius?: number, unit?: Units, steps?: number): FeatureCollection<MultiPolygon>;
    (feature: Feature<any>|GeometryObject, radius?: number, unit?: Units, steps?: number): Feature<Polygon|MultiPolygon>;
    (feature: FeatureCollection<any>|GeometryCollectionFeature|GeometryCollection, radius?: number, unit?: Units, steps?: number): FeatureCollection<Polygon|MultiPolygon>;
}
declare const buffer: Buffer;
declare namespace buffer {}
export = buffer;
