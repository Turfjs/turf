import {
    Feature,
    FeatureCollection,
    MultiLineString,
    LineString,
    Polygon,
    MultiPolygon,
    GeometryCollection,
    FeatureGeometryCollection
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#linestringtopolygon
 *
 * Feature => Polygon
 */
declare function lineStringToPolygon<T extends LineString | MultiLineString>(
    lines: Feature<T> | T,
    properties?: any,
    autoComplete?: boolean,
    orderCoords?: boolean
): Feature<Polygon>;

/**
 * http://turfjs.org/docs/#linestringtopolygon
 *
 * FeatureCollection => MultiPolygon
 */
declare function lineStringToPolygon<T extends LineString | MultiLineString>(
    lines: FeatureCollection<T> | GeometryCollection | FeatureGeometryCollection,
    properties?: any,
    autoComplete?: boolean,
    orderCoords?: boolean
): Feature<MultiPolygon>

export default lineStringToPolygon;