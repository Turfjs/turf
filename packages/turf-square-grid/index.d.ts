import { Units, BBox, Polygon, Properties, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
export default function squareGrid(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: Properties
    }
): FeatureCollection<Polygon>;
