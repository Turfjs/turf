/// <reference types="geojson" />

type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs.html#dissolve
 */
declare function dissolve(featureCollection: Polygons, propertyName?: string): Polygons;
declare namespace dissolve { }
export = dissolve;