import { polygon, checkIfOptionsExist } from '../helpers';
import { coordEach } from '../meta';
import { convexHull } from './lib/convexHull';

/**
 * Takes a {@link Feature} or a {@link FeatureCollection} and returns a convex hull {@link Polygon}.
 *
 * Internally this uses
 * the [convexhull-js](https://github.com/indy256/convexhull-js) module that implements a
 * [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {GeoJSON} geojson input Feature or FeatureCollection
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] Translate Properties to Feature
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
export default function convex(geojson, options) {
    options = checkIfOptionsExist(options);

    // Default parameters
    options.properties = options.properties || {};

    // Container
    const points = [];

    // Convert all points to flat 2D coordinate Array
    coordEach(geojson, (coord) => {
        points.push([coord[0], coord[1]]);
    });
    if (!points.length) { return null; }

    const outHull = convexHull(points);

    // Convex hull should have at least 3 different vertices in order to create a valid polygon
    if (outHull.length > 3) {
        outHull.push(outHull[0]);
        return polygon([outHull], options.properties);
    }
    return null;
}

