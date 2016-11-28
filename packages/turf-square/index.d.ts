/// <reference types="geojson" />

type BBox = Array<number>;

/**
 * http://turfjs.org/docs/#square
 */
declare function square(bbox: BBox): BBox;
declare namespace square { }
export = square;
