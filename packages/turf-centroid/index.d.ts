import {
    Point,
    Polygon,
    Feature,
} from '@turf/helpers';

/**
 * http://turfjs.org/docs/#centroid
 */
declare function centroid(feature: Feature<Polygon>): Feature<Point>;

export default centroid;
