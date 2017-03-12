import {LineString, MultiLineString, Polygon, MultiPolygon, Points} from '@turf/helpers'

type FeatureIn = LineString | MultiLineString | Polygon | MultiPolygon

/**
 * http://turfjs.org/docs/#kinks
 */
declare function kinks(featureIn: FeatureIn): Points;
declare namespace kinks {}
export = kinks;
