/// <reference types='geojson' />

// GeoJSON Foreign Members
export type Id = string | number;
export type Properties = {[key: string]: any};
export type BBox = [number, number, number, number];

// TurfJS String Types
export type Units = 'miles' | 'nauticalmiles' | 'degrees' | 'radians' | 'inches' | 'yards' | 'meters' | 'metres' | 'kilometers' | 'kilometres';
export type Geometry = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
export type Grid = 'point' | 'square' | 'hex' | 'triangle';

// GeoJSON Geometry Types
export type Position = GeoJSON.Position;
export type Point = GeoJSON.Point;
export type MultiPoint = GeoJSON.MultiPoint;
export type MultiLineString = GeoJSON.MultiLineString;
export type LineString = GeoJSON.LineString;
export type Polygon = GeoJSON.Polygon;
export type MultiPolygon = GeoJSON.MultiPolygon;
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;

// GeoJSON Feature Objects
export type FeatureCollection<T extends GeometryObject> = GeoJSON.FeatureCollection<T>;
export type Feature<T extends GeometryObject> = GeoJSON.Feature<T>;
export interface FeatureGeometryCollection extends Feature<any> {
    geometry: GeometryCollection;
}

/**
 * http://turfjs.org/docs/#feature
 */
export function feature<T extends GeometryObject>(geometry: T, properties?: Properties, bbox?: BBox, id?: Id): Feature<T>;

/**
 * http://turfjs.org/docs/#featurecollection
 */
export function featureCollection<T extends GeometryObject>(features: Feature<T>[], bbox?: BBox, id?: Id): FeatureCollection<T>;
export function featureCollection(features: Feature<any>[], bbox?: BBox, id?: Id): FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#geometry
 */
export function geometry(type: 'Point', coordinates: Position, bbox?: BBox): Point;
export function geometry(type: 'LineString', coordinates: Position[], bbox?: BBox): LineString;
export function geometry(type: 'Polygon', coordinates: Position[][], bbox?: BBox): Polygon;
export function geometry(type: 'MultiPoint', coordinates: Position[], bbox?: BBox): MultiPoint;
export function geometry(type: 'MultiLineString', coordinates: Position[][], bbox?: BBox): MultiLineString;
export function geometry(type: 'MultiPolygon', coordinates: Position[][][], bbox?: BBox): MultiPolygon;
export function geometry(type: Geometry | string, coordinates: any[], bbox?: BBox): GeometryObject;

/**
 * http://turfjs.org/docs/#point
 */
export function point(coordinates: Position, properties?: Properties, bbox?: BBox, id?: Id): Feature<Point>;

/**
 * http://turfjs.org/docs/#polygon
 */
export function polygon(coordinates: Position[][], properties?: Properties, bbox?: BBox, id?: Id): Feature<Polygon>;

/**
 * http://turfjs.org/docs/#linestring
 */
export function lineString(coordinates: Position[], properties?: Properties, bbox?: BBox, id?: Id): Feature<LineString>;

/**
 * http://turfjs.org/docs/#multilinestring
 */
export function multiLineString(coordinates: Position[][], properties?: Properties, bbox?: BBox, id?: Id): Feature<MultiLineString>;

/**
 * http://turfjs.org/docs/#multipoint
 */
export function multiPoint(coordinates: Position[], properties?: Properties, bbox?: BBox, id?: Id): Feature<MultiPoint>;

/**
 * http://turfjs.org/docs/#multipolygon
 */
export function multiPolygon(coordinates: Position[][][], properties?: Properties, bbox?: BBox, id?: Id): Feature<MultiPolygon>;

/**
 * http://turfjs.org/docs/#geometrycollection
 */
export function geometryCollection(geometries: GeometryObject[], properties?: Properties, bbox?: BBox, id?: Id): FeatureGeometryCollection;

/**
 * http://turfjs.org/docs/#radianstodistance
 */
export function radiansToDistance(radians: number, units?: Units): number

/**
 * http://turfjs.org/docs/#distancetoradians
 */
export function distanceToRadians(distance: number, units?: Units): number

/**
 * http://turfjs.org/docs/#distancetodegrees
 */
export function distanceToDegrees(distance: number, units?: Units): number

/**
 * http://turfjs.org/docs/#bearingtoangle
 */
export function bearingToAngle(bearing: number): number

/**
 * http://turfjs.org/docs/#radians2degrees
 */
export function radians2degrees(radians: number): number

/**
 * http://turfjs.org/docs/#degrees2radians
 */
export function degrees2radians(degrees: number): number

/**
 * http://turfjs.org/docs/#round
 */
export function round(num: number, precision?: number): number

/**
 * http://turfjs.org/docs/#convertdistance
 */
export function convertDistance(distance: number, originalUnit: Units, finalUnit?: Units): number

/**
 * http://turfjs.org/docs/#convertarea
 */
export function convertArea(area: number, originalUnit?: Units, finalUnit?: Units): number

/**
 * http://turfjs.org/docs/#isnumber
 */
export function isNumber(num: any): boolean

/**
 * http://turfjs.org/docs/#isobject
 */
export function isObject(input: any): boolean

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 */
export const earthRadius: number;
