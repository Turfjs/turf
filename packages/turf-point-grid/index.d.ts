/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(
    bbox: pointGrid.BBox,
    cellSize: number,
    units?: number): pointGrid.Points;
declare namespace pointGrid {
    type BBox = Array<number>;
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
}
export = pointGrid;
