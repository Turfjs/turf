import { BBox, Feature, Polygon, Properties, Id } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#bboxpolygon
 */
export default function bboxPolygon<P = Properties>(
    bbox: BBox,
    options?: {
        properties?: P,
        id?: Id
    }
): Feature<Polygon, P>;
