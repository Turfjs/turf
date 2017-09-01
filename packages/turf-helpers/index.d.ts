/// <reference types='geojson' />

export type Id = string|number
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Point = GeoJSON.Feature<GeoJSON.Point>;
export type MultiPoints = GeoJSON.FeatureCollection<GeoJSON.MultiPoint>;
export type MultiPoint = GeoJSON.Feature<GeoJSON.MultiPoint>;
export type LineStrings = GeoJSON.FeatureCollection<GeoJSON.LineString>;
export type LineString = GeoJSON.Feature<GeoJSON.LineString>;
export type MultiLineStrings = GeoJSON.FeatureCollection<GeoJSON.MultiLineString>;
export type MultiLineString = GeoJSON.Feature<GeoJSON.MultiLineString>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
export type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;
export type MultiPolygon = GeoJSON.Feature<GeoJSON.MultiPolygon>;
export type Position = GeoJSON.Position;
export type LineStringFeatures = LineString | LineStrings | MultiLineString | MultiLineStrings | GeoJSON.LineString | GeoJSON.MultiLineString
export type PolygonFeatures = Polygon | Polygons | MultiPolygon | MultiPolygons | GeoJSON.Polygon | GeoJSON.MultiPolygon
export type Features<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type Units = 'miles' | 'nauticalmiles' | 'degrees' | 'radians' | 'inches' | 'yards' | 'meters' | 'metres' | 'kilometers' | 'kilometres';
export type BBox = [number, number, number, number];
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Geoms = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon | GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon;
export type GeometryTypes = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';

export interface FeatureGeometryCollection extends GeoJSON.Feature<any> {
  geometry: GeometryCollection
}

export interface FeatureCollection {
  <Geom extends Geoms>(features: Feature<Geom>[], bbox?: BBox, id?: Id): Features<Geom>;
  (features: Feature<any>[], bbox?: BBox, id?: Id): Features<any>;
}

export interface Properties {
  [key: string]: any
}

/**
 * http://turfjs.org/docs/#feature
 */
export function feature<Geom extends GeometryObject>(geometry: Geom, properties?: Properties, bbox?: BBox, id?: Id): Feature<Geom>;

/**
 * http://turfjs.org/docs/#geometry
 */
export function geometry(type: GeometryTypes, coordinates: any[], bbox?: BBox): GeometryObject;

/**
 * http://turfjs.org/docs/#point
 */
export function point(coordinates: Position, properties?: Properties, bbox?: BBox, id?: Id): Point;

/**
 * http://turfjs.org/docs/#polygon
 */
export function polygon(coordinates: Position[][], properties?: Properties, bbox?: BBox, id?: Id): Polygon;

/**
 * http://turfjs.org/docs/#linestring
 */
export function lineString(coordinates: Position[], properties?: Properties, bbox?: BBox, id?: Id): LineString;

/**
 * http://turfjs.org/docs/#featurecollection
 */
export const featureCollection: FeatureCollection;

/**
 * http://turfjs.org/docs/#multilinestring
 */
export function multiLineString(coordinates: Position[][], properties?: Properties, bbox?: BBox, id?: Id): MultiLineString;

/**
 * http://turfjs.org/docs/#multipoint
 */
export function multiPoint(coordinates: Position[], properties?: Properties, bbox?: BBox, id?: Id): MultiPoint;

/**
 * http://turfjs.org/docs/#multipolygon
 */
export function multiPolygon(coordinates: Position[][][], properties?: Properties, bbox?: BBox, id?: Id): MultiPolygon;

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
