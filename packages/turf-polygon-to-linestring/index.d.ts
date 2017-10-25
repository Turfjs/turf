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
 * http://turfjs.org/docs/#polygontolinestring
 *
 * Feature => LineString
 */
declare function polygonToLineString<T extends Polygon | MultiPolygon>(
    polygon: Feature<T> | T,
    options?: {
        properties?: Properties
    }
): Feature<LineString>;

/**
 * http://turfjs.org/docs/#polygontolinestring
 *
 * FeatureCollection => MultiLineString
 */
declare function polygonToLineString<T extends Polygon | MultiPolygon>(
    polygon: FeatureCollection<T> | GeometryCollection | FeatureGeometryCollection,
    options?: {
        properties?: Properties
    }
): Feature<MultiLineString>;

export default polygonToLineString;
