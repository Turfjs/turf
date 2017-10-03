import {
    GeometryObject,
    GeometryCollection,
    Feature,
    FeatureCollection,
    Geometry,
    Types
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
export function geojsonType(value: FeatureCollection<any>, type: string, name: string): void;

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
export function getGeom(geojson: GeometryCollection | GeometryObject | Feature<any>): GeometryObject;

/**
 * http://turfjs.org/docs/#gettype
 */
export function getType(geojson: GeometryObject | Feature<any>): Geometry;
export function getType(geojson: GeometryCollection | GeometryObject | Feature<any> | FeatureCollection<any>): Types;
