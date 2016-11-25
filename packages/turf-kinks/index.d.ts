/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#kinks
 */
declare function kinks(polygon: kinks.Polygon): kinks.Points;
declare namespace kinks {
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | Array<Array<Array<number>>>;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>; 
}
export = kinks;
