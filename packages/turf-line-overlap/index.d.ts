import { Feature, FeatureCollection, LineString, MultiLineString, Polygon, MultiPolygon } from '@turf/helpers'

type Geoms = LineString | MultiLineString | Polygon | MultiPolygon;

/**
 * http://turfjs.org/docs/#lineoverlap
 */
export default function lineOverlap(
    source: Feature<Geoms> | Geoms,
    target: Feature<Geoms> | Geoms,
    options?: {
        tolerance?: number
    }
): FeatureCollection<LineString>;
