/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>
type Features = GeoJSON.FeatureCollection<any>

declare class RBush {
    insert(item: Feature): RBush;
    load(items: Features): RBush;
    remove(item: Feature, equals?: (a: Feature, b: Feature) => boolean): RBush;
    clear(): RBush;
    search(bbox: Feature): Features;
    all(): Features;
    collides(bbox: Feature): boolean;
    toJSON(): any;
    fromJSON(data: any): RBush;
}

/**
 * http://turfjs.org/docs/#rbush
 */
declare function rbush(maxEntries?: number): RBush;
declare namespace rbush {}
export = rbush;
