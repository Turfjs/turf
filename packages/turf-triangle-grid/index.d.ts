import { Units, BBox, Polygon, Feature, MultiPolygon, Properties, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaretriangle
 */
export default function triangleGrid<P = Properties>(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: P,
        mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
    }
): FeatureCollection<Polygon, P>;
