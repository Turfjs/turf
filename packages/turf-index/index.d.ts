/// <reference types="geojson" />

type Feature = GeoJSON.Feature<any>
type Features = GeoJSON.FeatureCollection<any>

declare class RBush {
    insert(item: Feature): RBush;
    load(items: Feature[]): RBush;
    remove(item: Feature, equals?: (a: Feature, b: Feature) => boolean): RBush;
    clear(): RBush;
    search(bbox: Feature): Features;
    all(): Features;
    collides(bbox: Feature): boolean;
    toJSON(): any;
    fromJSON(data: any): RBush;
}

/**
 * http://turfjs.org/docs/#index
 */
declare function index(features: Feature | Features): RBush;
declare namespace index {}
export = index;
