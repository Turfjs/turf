/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#collect
 */
declare function collect(
    polygons: collect.Polygons,
    points: collect.Points,
    inProperty: string,
    outProperty: string): collect.Polygons;
declare namespace collect {
    type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
}
export = collect;