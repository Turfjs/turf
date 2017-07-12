/// <reference types="geojson" />

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
export type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
export type BBox = [number, number, number, number];
export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Geoms = GeoJSON.Point | GeoJSON.LineString | GeoJSON.Polygon | GeoJSON.MultiPoint | GeoJSON.MultiLineString | GeoJSON.MultiPolygon;

export interface FeatureGeometryCollection extends GeoJSON.Feature<any> {
  geometry: GeometryCollection
}

/**
 * http://turfjs.org/docs/#feature
 */
export function feature<Geom extends GeometryObject>(geometry: Geom, properties?: any): Feature<Geom>;

/**
 * http://turfjs.org/docs/#point
 */
export function point(coordinates: Position, properties?: any): Point;

/**
 * http://turfjs.org/docs/#polygon
 */
export function polygon(coordinates: Position[][], properties?: any): Polygon;

/**
 * http://turfjs.org/docs/#linestring
 */
export function lineString(coordinates: Position[], properties?: any): LineString;

/**
 * http://turfjs.org/docs/#featurecollection
 */
interface featureCollection {
  <Geom extends Geoms>(features: Feature<Geom>[]): Features<Geom>;
  (features: Feature<any>[]): Features<any>;
}
export const featureCollection: featureCollection;

/**
 * http://turfjs.org/docs/#multilinestring
 */
export function multiLineString(coordinates: Position[][], properties?: any): MultiLineString;

/**
 * http://turfjs.org/docs/#multipoint
 */
export function multiPoint(coordinates: Position[], properties?: any): MultiPoint;

/**
 * http://turfjs.org/docs/#multipolygon
 */
export function multiPolygon(coordinates: Position[][][], properties?: any): MultiPolygon;

/**
 * http://turfjs.org/docs/#geometrycollection
 */
export function geometryCollection(geometries: GeometryObject[], properties?: any): FeatureGeometryCollection;

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
