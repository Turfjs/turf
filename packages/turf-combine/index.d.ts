import {
    Point,
    LineString,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon,
    Feature,
    FeatureCollection
} from '@turf/helpers'

/**
 * http://turfjs.org/docs/#combine
 */
declare function combine(features: FeatureCollection<Point>): MultiPoint;
declare function combine(features: FeatureCollection<LineString>): MultiLineString;
declare function combine(features: FeatureCollection<Polygon>): MultiPolygon;
declare function combine(features: FeatureCollection<any>): Feature<any>;

export default combine;
