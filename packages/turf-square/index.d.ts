/// <reference types="geojson" />

type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#square
 */
declare function square(bbox: BBox): BBox;
declare namespace square { }
export = square;
