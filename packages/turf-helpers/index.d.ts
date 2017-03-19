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
export type Features = GeoJSON.FeatureCollection<any>;
export type Feature = GeoJSON.Feature<any>;
export type Position = GeoJSON.Position;
export type LineStringFeatures = LineString | LineStrings | MultiLineString | MultiLineStrings | GeoJSON.LineString | GeoJSON.MultiLineString
export type PolygonFeatures = Polygon | Polygons | MultiPolygon | MultiPolygons | GeoJSON.Polygon | GeoJSON.MultiPolygon
export type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
export type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#feature
 */
export function feature(geometry: GeoJSON.GeometryObject, properties?: any): Feature;

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
export const featureCollection: {
    (features: Array<Point>): Points;
    (features: Array<LineString>): LineStrings;
    (features: Array<Polygon>): Polygons;
    (features: Array<MultiPoint>): MultiPoints;
    (features: Array<MultiLineString>): MultiLineStrings;
    (features: Array<MultiPolygon>): MultiPolygons;
    (features: Array<Feature>): Features;
};

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
export function geometryCollection(geometries: Array<GeoJSON.GeometryObject>, properties?: any): GeoJSON.GeometryCollection;

/**
 * http://turfjs.org/docs/
 */
export function radiansToDistance(radians: number, units?: Units): number

/**
 * http://turfjs.org/docs/
 */
export function distanceToRadians(distance: number, units?: Units): number

/**
 * http://turfjs.org/docs/
 */
export function distanceToDegrees(distance: number, units?: Units): number
