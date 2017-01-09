/// <reference types="geojson" />

type BBox = Array<number>;
type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#pointgrid
 */
declare function pointGrid(bbox: BBox, cellSize: number, units?: string): Points;
declare namespace pointGrid { }
export = pointGrid;
