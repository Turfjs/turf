/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
type Lines = GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;

declare function polygonToLineString(polygon: Polygon): Lines;
declare namespace polygonToLineString {}
export = polygonToLineString;
