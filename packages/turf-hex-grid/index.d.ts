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
    cellDiameter: number,
    units?: Units,
    triangles?: boolean
): FeatureCollection<Polygon>;
