/// <reference types="geojson" />

type BBox = Array<number>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#hexgrid
 */
declare function hexGrid(bbox: BBox, cellSize: number, units?: number, triangles?: boolean): Polygons;
declare namespace hexGrid { }
export = hexGrid;
