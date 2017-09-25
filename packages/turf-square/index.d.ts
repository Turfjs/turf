/// <reference types="geojson" />

export type BBox = [number, number, number, number];

/**
 * http://turfjs.org/docs/#square
 */
export default function square(bbox: BBox): BBox;