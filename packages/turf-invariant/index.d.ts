/// <reference types="geojson" />

export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type Features<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;

/**
 * http://turfjs.org/docs/
 */
export function getCoord(obj: Feature<any> | GeometryObject | any[]): Array<any>;

/**
 * http://turfjs.org/docs/
 */
export function getCoords(obj: Feature<any> | GeometryObject | any[]): Array<any>;

/**
 * http://turfjs.org/docs/
 */
export function geojsonType(value: Features<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function featureOf(feature: Feature<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function collectionOf(featurecollection: Features<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function containsNumber(coordinates: any[]): boolean;

/**
 * http://turfjs.org/docs/
 */
export function getGeom(geojson: GeometryCollection | GeometryObject | Feature<any>): GeometryObject;

/**
 * http://turfjs.org/docs/
 */
export function getGeomType(geojson: GeometryCollection | GeometryObject | Feature<any>): string;
