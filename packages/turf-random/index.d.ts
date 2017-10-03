import { BBox, FeatureCollection, Feature, Point, LineString, Polygon, Position } from '@turf/helpers';

/**
 * http://turfjs.org/docs/#randomposition
 */
export function randomPosition(bbox?: BBox | {bbox?: BBox}): Position

/**
 * http://turfjs.org/docs/#randompoint
 */
export function randomPoint(
    count?: number,
    options?: {
        bbox?: BBox
    }
): FeatureCollection<Point>

/**
 * http://turfjs.org/docs/#randomlinestring
 */
export function randomLineString(
    count?: number,
    options?: {
        bbox?: BBox,
        num_vertices?: number,
        max_length?: number,
        max_rotation?: number
    }
): FeatureCollection<LineString>

/**
 * http://turfjs.org/docs/#randompolygon
 */
export function randomPolygon(
    count?: number,
    options?: {
        bbox?: BBox,
        num_vertices?: number,
        max_radial_length?: number
    }
): FeatureCollection<LineString>