import {LineString, MultiLineString, Polygon, MultiPolygon, LineStrings} from '@turf/helpers'

type FeatureIn = LineString | MultiLineString | Polygon | MultiPolygon

/**
 * http://turfjs.org/docs/#linesegment
 */
declare function lineSegment(featureIn: FeatureIn): LineStrings;
declare namespace lineSegment {}
export = lineSegment;
