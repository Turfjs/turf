/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>
type Features = GeoJSON.FeatureCollection<any>

/**
 * http://turfjs.org/docs/
 */
export function getCoord(obj: any): Array<number>;

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
