import {
    Polygon,
    MultiPolygon,
    Feature,
    FeatureCollection,
    LineString,
    MultiLineString,
    GeometryCollection,
    FeatureGeometryCollection
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#polygontolinestring
 *
 * Feature => LineString
 */
declare function polygonToLineString<T extends Polygon | MultiPolygon>(
    polygon: Feature<T> | T,
    options?: {
        properties?: object
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
        properties?: object
    }
): Feature<MultiLineString>;

export default polygonToLineString;
