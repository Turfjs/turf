/// <reference types="geojson" />

export type GeometryObject = GeoJSON.GeometryObject;
export type GeometryCollection = GeoJSON.GeometryCollection;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;
export type FeatureCollection<Geom extends GeometryObject> = GeoJSON.FeatureCollection<Geom>;
export type StringGeomTypes = 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection'
export type StringTypes = StringGeomTypes | 'Feature' | 'FeatureCollection'


/**
 * http://turfjs.org/docs/
 */
export function getCoord(obj: Feature<any> | GeometryObject | any[]): number[];

/**
 * http://turfjs.org/docs/
 */
export function getCoords(obj: Feature<any> | GeometryObject | any[]): any[];

/**
 * http://turfjs.org/docs/
 */
export function geojsonType(value: FeatureCollection<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function featureOf(feature: Feature<any>, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function collectionOf(featurecollection: FeatureCollection<any>, type: string, name: string): void;

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
export function getGeomType(geojson: GeometryCollection | GeometryObject | Feature<any>): StringGeomTypes;

/**
 * http://turfjs.org/docs/
 */
export function getType(geojson: GeometryCollection | GeometryObject | Feature<any> | FeatureCollection<any>): StringTypes;
