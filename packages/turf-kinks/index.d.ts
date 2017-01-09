/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | Array<Array<Array<number>>>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#kinks
 */
declare function kinks(polygon: Polygon): Points;
declare namespace kinks { }
export = kinks;
