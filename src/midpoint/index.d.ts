import { Feature, Point, Coord } from '../helpers'

/**
 * http://turfjs.org/docs/#midpoint
 */
export default function midpoint(
    point1: Coord,
    point2: Coord
): Feature<Point>;