import concaveman from 'concaveman';
import { coordEach } from '@turf/meta';
import { polygon, isObject } from '@turf/helpers';

/**
 * Takes a {@link Feature} or a {@link FeatureCollection} and returns a convex hull {@link Polygon}.
 *
 * Internally this uses
 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
 * implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {GeoJSON} geojson input Feature or FeatureCollection
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.concavity=Infinity] 1 - thin shape. Infinity - convex hull.
 * @returns {Feature<Polygon>} a convex hull
 * @example
 * var points = turf.featureCollection([
 *   turf.point([10.195312, 43.755225]),
 *   turf.point([10.404052, 43.8424511]),
 *   turf.point([10.579833, 43.659924]),
 *   turf.point([10.360107, 43.516688]),
 *   turf.point([10.14038, 43.588348]),
 *   turf.point([10.195312, 43.755225])
 * ]);
 *
 * var hull = turf.convex(points);
 *
 * //addToMap
 * var addToMap = [points, hull]
 */
function convex(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var concavity = options.concavity || Infinity;
    var points = [];

    // Convert all points to flat 2D coordinate Array
    coordEach(geojson, function (coord) {
        points.push([coord[0], coord[1]]);
    });
    if (!points.length) return null;

    var convexHull = concaveman(points, concavity);

    // Convex hull should have at least 3 different vertices in order to create a valid polygon
    if (convexHull.length > 3) {
        return polygon([convexHull]);
    }
    return null;
}

export default convex;
