import {
    Units,
    BBox,
    Polygon,
    FeatureCollection
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#hexgrid
 */
export default function hexGrid(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        triangles?: boolean,
        properties?: object,
    }
): FeatureCollection<Polygon>;
