/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#unkink-polygon
 */
declare function unkinkPolygon(polygon: Polygon): Polygons;
declare namespace unkinkPolygon { }
export = unkinkPolygon;
