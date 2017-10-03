import { Point, Feature, FeatureCollection, MultiPolygon, Polygon, Units} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#concave
 */
export default function concave(
    points: FeatureCollection<Point>,
    maxEdge: number,
    options?: {
      units?: Units
    }
): Feature<Polygon | MultiPolygon>;
