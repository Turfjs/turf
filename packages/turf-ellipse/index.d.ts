import { Feature, Coord, Polygon, Units, Properties } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#ellipse
 */
export default function (
    center: Coord,
    xRadius: number,
    yRadius: number,
    options?: {
        steps?: number;
        units?: Units;
        properties?: Properties;
    }
): Feature<Polygon>;
