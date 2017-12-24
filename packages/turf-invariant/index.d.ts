import {
    GeometryObject,
    GeometryCollection,
    Feature,
    FeatureCollection,
    GeometryTypes,
    CollectionTypes,
    Types,
    Point,
    LineString,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon,
    AllGeoJSON,
    Geometries,
    Position
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#getcoords
 */
export function getCoord<P extends Position>(coord: Feature<Point> | Point | P): P;

/**
 * http://turfjs.org/docs/#getcoords
 */
export function getCoords<G extends Point>(obj: Feature<G> | G | Position): Position;
export function getCoords<G extends LineString | MultiPoint>(obj: Feature<G> | G | Position[]): Position[];
export function getCoords<G extends Polygon | MultiLineString>(obj: Feature<G> | G | Position[][]): Position[][];
export function getCoords<G extends MultiPolygon>(obj: Feature<G> | G | Position[][][]): Position[][][];

/**
 * http://turfjs.org/docs/#geojsontype
 */
export function geojsonType(value: AllGeoJSON, type: string, name: string): void;

/**
 * http://turfjs.org/docs/#featureof
 */
export function featureOf(feature: Feature<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/#collectionof
 */
export function collectionOf(featurecollection: FeatureCollection<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/#containsnumber
 */
export function containsNumber(coordinates: any[]): boolean;

/**
 * http://turfjs.org/docs/#getgeom
 */
export function getGeom<T extends Geometries>(geojson: T | Feature<T>): T;
export function getGeom(geojson: GeometryObject | Feature<Geometries>): GeometryObject;
export function getGeom(geojson: Feature<GeometryCollection> | GeometryCollection): GeometryCollection;
export function getGeom(geojson: Feature<any>): GeometryObject | GeometryCollection;

/**
 * http://turfjs.org/docs/#gettype
 */
export function getType(geojson: Feature<Geometries> | Geometries): GeometryTypes;
export function getType(geojson: FeatureCollection<any> | Feature<GeometryCollection> | GeometryCollection): CollectionTypes;
export function getType(geojson: AllGeoJSON): Types;
