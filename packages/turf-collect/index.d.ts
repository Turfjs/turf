/// <reference types="geojson" />

type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#collect
 */
declare function collect(polygons: Polygons, points: Points, inProperty: string, outProperty: string): Polygons;
declare namespace collect { }
export = collect;