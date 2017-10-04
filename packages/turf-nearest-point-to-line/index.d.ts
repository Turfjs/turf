import {
  Units,
  LineString,
  Feature,
  FeatureCollection,
  FeatureGeometryCollection,
  GeometryCollection,
  Coord,
  Point
} from '@turf/helpers'

export interface NearestPointToLine extends Feature<Point> {
  properties: {
    dist: number
    [key: string]: any
  }
}

/**
 * http://turfjs.org/docs/#nearestpointtoline
 */
export default function nearestPointToLine(
    points: FeatureCollection<Point> | FeatureGeometryCollection | GeometryCollection,
    line: Feature<LineString> | LineString,
    options?: {
      units?: Units
    }
): NearestPointToLine;
