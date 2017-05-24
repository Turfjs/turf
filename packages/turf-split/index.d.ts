/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type LineString = GeoJSON.Feature<GeoJSON.LineString>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#split
 */
declare function split(poly: Polygon, line: LineString): Polygons;
declare namespace split { }
export = split;
