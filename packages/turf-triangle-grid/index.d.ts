/// <reference types="geojson" />

type BBox = Array<number>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#trianglegrid
 */
declare function triangleGrid(bbox: BBox, cellSize: number, units?: string): Polygons;
declare namespace triangleGrid { }
export = triangleGrid;
