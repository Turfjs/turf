import { Points, MultiPolygons } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#isobands
 */
export default function isobands(points: Points, breaks: Array<number>, property?: string): MultiPolygons;
