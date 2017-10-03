import { Units, BBox, FeatureCollection, Polygon } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#trianglegrid
 */
export default function triangleGrid(
    bbox: BBox,
    cellSize: number,
    options?: {
        units?: Units
    }
): FeatureCollection<Polygon>;
