import {
    Polygon,
    MultiPolygon,
    Feature,
    FeatureCollection,
    LineString,
    MultiLineString,
    GeometryCollection,
    FeatureGeometryCollection,
    Properties
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#polygontoline
 *
 * Feature => LineString
 */
declare function polygonToLine<T extends Polygon | MultiPolygon>(
    polygon: Feature<T> | T,
    options?: {
        properties?: Properties
    }
): Feature<LineString>;

/**
 * http://turfjs.org/docs/#polygontoline
 *
 * FeatureCollection => MultiLineString
 */
declare function polygonToLine<T extends Polygon | MultiPolygon>(
    polygon: FeatureCollection<T> | GeometryCollection | FeatureGeometryCollection,
    options?: {
        properties?: Properties
    }
): Feature<MultiLineString>;

export default polygonToLine;
