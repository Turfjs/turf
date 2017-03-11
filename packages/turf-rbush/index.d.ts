/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any> | GeoJSON.GeometryObject
type Features = GeoJSON.FeatureCollection<any> | GeoJSON.GeometryCollection

declare class RBush {
    insert(feature: Feature): RBush;
    load(features: Features): RBush;
    remove(feature: Feature, equals?: (a: Feature, b: Feature) => boolean): RBush;
    clear(): RBush;
    search(geojson: Feature | Features): Features;
    all(): Features;
    collides(geosjon: Feature | Features): boolean;
    toJSON(): any;
    fromJSON(data: any): RBush;
}

/**
 * http://turfjs.org/docs/#rbush
 */
declare function rbush(maxEntries?: number): RBush;
declare namespace rbush {}
export = rbush;
