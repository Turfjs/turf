import { Units, BBox, Polygon, Feature, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
export default function squareGrid(
    bbox: BBox | Feature<any> | FeatureCollection<any>,
    cellSize: number,
    units?: Units,
    completelyWithin?: boolean
): FeatureCollection<Polygon>;
