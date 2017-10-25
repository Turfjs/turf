import {
    GeometryObject,
    GeometryCollection,
    FeatureGeometryCollection,
    Feature,
    FeatureCollection,
    Geometry,
    Types,
    Collection,
    AllGeoJSON,
    Geometries
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#getcoords
 */
export function getCoord(obj: Feature<any> | GeometryObject | any[]): number[];

/**
 * http://turfjs.org/docs/#getcoords
 */
export function getCoords(obj: Feature<any> | GeometryObject | any[]): any[];

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
export function getGeom(geojson: FeatureGeometryCollection | GeometryCollection): GeometryCollection;
export function getGeom(geojson: Feature<any>): GeometryObject | GeometryCollection;

/**
 * http://turfjs.org/docs/#gettype
 */
export function getType(geojson: GeometryObject | Feature<Geometries>): Geometry;
export function getType(geojson: FeatureCollection<any> | FeatureGeometryCollection | GeometryCollection): Collection;
export function getType(geojson: AllGeoJSON): Types;
