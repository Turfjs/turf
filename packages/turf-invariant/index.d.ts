import {
    GeometryObject,
    GeometryCollection,
    Feature,
    FeatureCollection,
    GeometryTypes,
    CollectionTypes,
    Types,
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
export function getGeom(geojson: Feature<GeometryCollection> | GeometryCollection): GeometryCollection;
export function getGeom(geojson: Feature<any>): GeometryObject | GeometryCollection;

/**
 * http://turfjs.org/docs/#gettype
 */
export function getType(geojson: Feature<Geometries> | Geometries): GeometryTypes;
export function getType(geojson: FeatureCollection<any> | Feature<GeometryCollection> | GeometryCollection): CollectionTypes;
export function getType(geojson: AllGeoJSON): Types;
