import {
    Feature,
    FeatureCollection,
    MultiLineString,
    LineString,
    Polygon,
    MultiPolygon,
    GeometryCollection,
    Properties
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#linestringtopolygon
 *
 * Feature => Polygon
 */
declare function lineToPolygon<T extends LineString | MultiLineString>(
    lines: Feature<T> | T,
    options?: {
        properties?: Properties,
        autoComplete?: boolean,
        orderCoords?: boolean
    }
): Feature<Polygon>;

/**
 * http://turfjs.org/docs/#linestringtopolygon
 *
 * FeatureCollection => MultiPolygon
 */
declare function lineToPolygon<T extends LineString | MultiLineString>(
    lines: FeatureCollection<T> | GeometryCollection | Feature<GeometryCollection>,
    options?: {
        properties?: Properties,
        autoComplete?: boolean,
        orderCoords?: boolean
    }
): Feature<MultiPolygon>

export default lineToPolygon;