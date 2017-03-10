/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>
type Features = GeoJSON.FeatureCollection<any>
type GetCoord = Feature | any[] | GeoJSON.GeometryObject

/**
 * http://turfjs.org/docs/
 */
export function getCoord(obj: GetCoord): Array<any>;

/**
 * http://turfjs.org/docs/
 */
export function getCoords(obj: GetCoord): Array<any>;

/**
 * http://turfjs.org/docs/
 */
export function geojsonType(value: Features, type: string, name: string): void;

/**
 * http://turfjs.org/docs/
 */
export function featureOf(feature: Feature, type: string, name: string): void

/**
 * http://turfjs.org/docs/
 */
export function collectionOf(featurecollection: Features, type: string, name: string): void
