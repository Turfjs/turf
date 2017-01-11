/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Features = GeoJSON.FeatureCollection<any>;
type BBox = Array<number>;

interface Options {
    bbox?: BBox
    num_vertices?: number
    max_radial_length?: number
}

interface Random {
    /**
     * http://turfjs.org/docs/#random
     */
    (type?: 'point' | 'points', count?: number, options?: Options): Points;
    (type?: 'polygon' | 'polygons', count?: number, options?: Options): Polygons;
}
declare const random: Random;
declare namespace random { }
export = random;


