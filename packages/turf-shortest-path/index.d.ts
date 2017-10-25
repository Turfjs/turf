import { Polygon, Feature, FeatureCollection, Coord, LineString, Units } from '@turf/helpers'

/**
 * http://turfjs.org/docs/#shortestpath
 */
export default function shortestPath(
    start: Coord,
    end: Coord,
    obstacles: FeatureCollection<Polygon>,
    options?: {
        units?: Units
        resolution?: number
    }
): Feature<LineString>;
