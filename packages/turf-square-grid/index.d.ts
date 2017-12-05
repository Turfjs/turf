import { Units, BBox, Polygon, Feature, MultiPolygon, Properties, FeatureCollection } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#squaregrid
 */
export default function squareGrid<P = Properties>(
    bbox: BBox,
    cellSide: number,
    options?: {
        units?: Units,
        properties?: P,
        mask?: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
    }
): FeatureCollection<Polygon, P>;
