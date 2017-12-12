import {
    Polygon,
    MultiPolygon,
    Feature,
    FeatureCollection,
    LineString,
    MultiLineString,
    GeometryCollection,
    Properties
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#polygontoline
 *
 * Feature => LineString
 */
declare function polygonToLine<G extends Polygon | MultiPolygon, P = Properties>(
    polygon: Feature<G> | G,
    options?: {
        properties?: P
    }
): Feature<LineString, P>;

/**
 * http://turfjs.org/docs/#polygontoline
 *
 * FeatureCollection => MultiLineString
 */
declare function polygonToLine<G extends Polygon | MultiPolygon, P = Properties>(
    polygon: FeatureCollection<G> | GeometryCollection | Feature<GeometryCollection>,
    options?: {
        properties?: P
    }
): Feature<MultiLineString, P>;

export default polygonToLine;
