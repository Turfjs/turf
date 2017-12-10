import {
  FeatureCollection,
  Feature,
  Point,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  GeometryCollection
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#linesegment
 */
export default function lineSegment<T extends LineString | MultiLineString | Polygon | MultiPolygon>(
    geojson: Feature<T> | FeatureCollection<T> | T | Feature<GeometryCollection> | GeometryCollection
): FeatureCollection<LineString>;
