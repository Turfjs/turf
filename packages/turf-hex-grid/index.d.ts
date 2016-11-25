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
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
}
export = hexGrid;
