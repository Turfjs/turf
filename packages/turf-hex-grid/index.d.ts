/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#hexgrid
 */
declare function hexGrid(
    bbox: hexGrid.BBox,
    cellSize: number,
    units?: number,
    triangles?: boolean): hexGrid.Polygons;
declare namespace hexGrid {
    type BBox = Array<number>;
    type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
}
export = hexGrid;
