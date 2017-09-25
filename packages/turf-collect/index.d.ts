/// <reference types="geojson" />

export type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
export type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#collect
 */
export default function (polygons: Polygons, points: Points, inProperty: string, outProperty: string): Polygons;
