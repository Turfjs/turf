var each = require('@turf/meta').coordEach,
    convexHull = require('convex-hull'),
    polygon = require('@turf/helpers').polygon;

/**
 * Takes a {@link Feature} or a {@link FeatureCollection} and returns a convex hull {@link Polygon}.
 *
 * Internally this uses
 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
 * implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
 *
 * @name convex
 * @param {Feature|FeatureCollection} feature input Feature or FeatureCollection
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
module.exports = function (feature) {
    var points = [];

    // Remove Z in coordinates because it breaks the convexHull algorithm
    each(feature, function (coord) {
        points.push([coord[0], coord[1]]);
    });

    var hull = convexHull(points);

    // Hull should have at least 3 different vertices in order to create a valid polygon
    if (hull.length >= 3) {
        var ring = [];
        for (var i = 0; i < hull.length; i++) {
            ring.push(points[hull[i][0]]);
        }
        ring.push(points[hull[hull.length - 1][1]]);
        return polygon([ring]);
    }
    return undefined;
};
