import { LineString, MultiLineString, Polygon, MultiPolygon, Points } from '@turf/helpers'

export type FeatureIn = LineString | MultiLineString | Polygon | MultiPolygon

/**
 * http://turfjs.org/docs/#kinks
 */
export default function kinks(featureIn: FeatureIn): Points;
