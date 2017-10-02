import { Feature, Point, Polygon, Units, Position } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#circle
 */
export default function (
  center: Feature<Point> | Point | Position,
  radius: number,
  options?: {
    steps?: number;
    units?: Units;
    properties?: object;
  }
): Feature<Polygon>;
