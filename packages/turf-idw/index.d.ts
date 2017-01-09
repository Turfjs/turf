/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/
 */
declare function idw(controlPoints: Points, valueField: string, b: number, cellWidth: boolean, units?: string): Polygons;
declare namespace idw { }
export = idw;
