/// <reference types="geojson" />

export type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>
export type FeatureCollection = GeoJSON.FeatureCollection<any>
export type Feature = GeoJSON.Feature<any>

/***
 * http://turfjs.org/docs/
 */
export function getCoord(obj: any): Array<number>;

/***
 * http://turfjs.org/docs/
 */
export function geojsonType(value: Features, type: string, name: string): void;

/***
 * http://turfjs.org/docs/
 */
export function featureOf(feature: Feature, type: string, name: string): void

/***
 * http://turfjs.org/docs/
 */
export function collectionOf(featurecollection: FeatureCollection, type: string, name: string): void
