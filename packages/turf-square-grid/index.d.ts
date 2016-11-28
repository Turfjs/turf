/// <reference types="geojson" />

type BBox = Array<number>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#squaregrid
 */
declare function squareGrid(bbox: BBox, cellSize: number, units?: string): Polygons;
declare namespace squareGrid { }
export = squareGrid;
