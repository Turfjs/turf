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

interface RandomStatic {
    /**
     * http://turfjs.org/docs/#random
     */
    (type?: 'point' | 'points' | undefined, count?: number, options?: Options): Points;
    (type?: 'polygon' | 'polygons', count?: number, options?: Options): Polygons;
    (type?: string, count?: number, options?: Options): Features;
    
}
declare const random: RandomStatic;
declare namespace random { }
export = random;


