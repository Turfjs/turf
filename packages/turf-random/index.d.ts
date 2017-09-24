/// <reference types="geojson" />

export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
export type Features = GeoJSON.FeatureCollection<any>;
export type BBox = Array<number>;

export interface Options {
    bbox?: BBox
    num_vertices?: number
    max_radial_length?: number
}

/**
 * http://turfjs.org/docs/#random
 */
declare function random(type?: 'point' | 'points', count?: number, options?: Options): Points;
declare function random(type?: 'polygon' | 'polygons', count?: number, options?: Options): Polygons;

export default random;

