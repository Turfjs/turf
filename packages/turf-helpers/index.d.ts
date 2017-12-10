import {
    Id, Properties, BBox, Position,
    Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon,
    GeometryObject, GeoJSONObject, GeometryCollection, Geometry,
    GeometryTypes, Types, CollectionTypes, Geometries,
    Feature, FeatureCollection
} from './lib/geojson'
export {
    Id, Properties, BBox, Position,
    Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon,
    GeometryObject, GeoJSONObject, GeometryCollection, Geometry,
    GeometryTypes, Types, CollectionTypes, Geometries,
    Feature, FeatureCollection
}

// TurfJS Combined Types
export type Coord = Feature<Point> | Point | Position;

// TurfJS String Types
export type Units = 'miles' | 'nauticalmiles' | 'degrees' | 'radians' | 'inches' | 'yards' | 'meters' | 'metres' | 'kilometers' | 'kilometres';
export type Grid = 'point' | 'square' | 'hex' | 'triangle';
export type Corners = 'sw' | 'se' | 'nw' | 'ne' | 'center' | 'centroid';

export type Lines = LineString | MultiLineString | Polygon | MultiPolygon;
export type AllGeoJSON = Feature | FeatureCollection | Geometry | GeometryCollection;

interface FeatureOptions {
    id?: Id;
    bbox?: BBox;
}

interface GeometryOptions {
    bbox?: BBox;
}

/**
 * http://turfjs.org/docs/#feature
 */
export function feature<G extends Geometry | GeometryCollection, P = Properties>(geometry: G, properties?: P, options?: FeatureOptions): Feature<G, P>;

/**
 * http://turfjs.org/docs/#featurecollection
 */
export function featureCollection<G extends Geometry, P = Properties>(features: Feature<G, P>[], options?: FeatureOptions): FeatureCollection<G, P>;
export function featureCollection(features: Feature<any>[], options?: FeatureOptions): FeatureCollection<any>;

/**
 * http://turfjs.org/docs/#geometry
 */
export function geometry(type: 'Point', coordinates: Position, options?: GeometryOptions): Point;
export function geometry(type: 'LineString', coordinates: Position[], options?: GeometryOptions): LineString;
export function geometry(type: 'Polygon', coordinates: Position[][], options?: GeometryOptions): Polygon;
export function geometry(type: 'MultiPoint', coordinates: Position[], options?: GeometryOptions): MultiPoint;
export function geometry(type: 'MultiLineString', coordinates: Position[][], options?: GeometryOptions): MultiLineString;
export function geometry(type: 'MultiPolygon', coordinates: Position[][][], options?: GeometryOptions): MultiPolygon;
export function geometry(type: string, coordinates: any[], options?: GeometryOptions): Geometry;

/**
 * http://turfjs.org/docs/#point
 */
export function point<P = Properties>(coordinates: Position, properties?: P, options?: FeatureOptions): Feature<Point, P>;

/**
 * http://turfjs.org/docs/#points
 */
export function points<P = Properties>(coordinates: Position[], properties?: P, options?: FeatureOptions): FeatureCollection<Point, P>;

/**
 * http://turfjs.org/docs/#polygon
 */
export function polygon<P = Properties>(coordinates: Position[][], properties?: P, options?: FeatureOptions): Feature<Polygon, P>;

/**
 * http://turfjs.org/docs/#polygons
 */
export function polygons<P = Properties>(coordinates: Position[][][], properties?: P, options?: FeatureOptions): FeatureCollection<Polygon, P>;

/**
 * http://turfjs.org/docs/#linestring
 */
export function lineString<P = Properties>(coordinates: Position[], properties?: P, options?: FeatureOptions): Feature<LineString, P>;

/**
 * http://turfjs.org/docs/#linestrings
 */
export function lineStrings<P = Properties>(coordinates: Position[][], properties?: P, options?: FeatureOptions): FeatureCollection<LineString, P>;


/**
 * http://turfjs.org/docs/#multilinestring
 */
export function multiLineString<P = Properties>(coordinates: Position[][], properties?: P, options?: FeatureOptions): Feature<MultiLineString, P>;

/**
 * http://turfjs.org/docs/#multipoint
 */
export function multiPoint<P = Properties>(coordinates: Position[], properties?: P, options?: FeatureOptions): Feature<MultiPoint, P>;

/**
 * http://turfjs.org/docs/#multipolygon
 */
export function multiPolygon<P = Properties>(coordinates: Position[][][], properties?: P, options?: FeatureOptions): Feature<MultiPolygon, P>;

/**
 * http://turfjs.org/docs/#geometrycollection
 */
export function geometryCollection<P = Properties>(geometries: Geometries[], properties?: P, options?: FeatureOptions): Feature<GeometryCollection, P>;

/**
 * http://turfjs.org/docs/#radianstolength
 */
export function radiansToLength(radians: number, units?: Units): number;

/**
 * http://turfjs.org/docs/#lengthtoradians
 */
export function lengthToRadians(distance: number, units?: Units): number;

/**
 * http://turfjs.org/docs/#lengthtodegrees
 */
export function lengthToDegrees(distance: number, units?: Units): number;

/**
 * http://turfjs.org/docs/#bearingtoazimuth
 */
export function bearingToAzimuth(bearing: number): number;

/**
 * http://turfjs.org/docs/#radianstodegrees
 */
export function radiansToDegrees(radians: number): number;

/**
 * http://turfjs.org/docs/#degreestoradians
 */
export function degreesToRadians(degrees: number): number;

/**
 * http://turfjs.org/docs/#round
 */
export function round(num: number, precision?: number): number;

/**
 * http://turfjs.org/docs/#convertlength
 */
export function convertLength(length: number, originalUnit: Units, finalUnit?: Units): number;

/**
 * http://turfjs.org/docs/#convertarea
 */
export function convertArea(area: number, originalUnit?: Units, finalUnit?: Units): number;

/**
 * http://turfjs.org/docs/#isnumber
 */
export function isNumber(num: any): boolean;

/**
 * http://turfjs.org/docs/#isobject
 */
export function isObject(input: any): boolean;

/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 */
export const earthRadius: number;

/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 */
export const factors: {
    meters: number;
    millimeters: number;
    centimeters: number;
    kilometers: number;
    miles: number;
    nauticalmiles: number;
    inches: number;
    yards: number;
    feet: number;
}

/**
 * Units of measurement factors based on 1 meter.
 */
export const unitsFactors: {
    meters: number;
    millimeters: number;
    centimeters: number;
    kilometers: number;
    miles: number;
    nauticalmiles: number;
    inches: number;
    yards: number;
    feet: number;
    radians: number;
    degrees: number;
};

/**
 * Area of measurement factors based on 1 square meter.
 */
export const areaFactors: {
    meters: number;
    millimeters: number;
    centimeters: number;
    kilometers: number;
    acres: number;
    miles: number;
    yards: number;
    feet: number;
    inches: number;
};

/**
 * Validate Id
 */
export function validateId(id: Id): void;

/**
 * Validate BBox
 */
export function validateBBox(bbox: BBox): void;
