import { Feature, Coord, Polygon, Units, Properties } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#circle
 */
export default function (
    center: Coord,
    radius: number,
    options?: {
        steps?: number;
        units?: Units;
        properties?: Properties;
    }
): Feature<Polygon>;
