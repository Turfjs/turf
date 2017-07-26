var bearing = require('@turf/bearing');
var destination = require('@turf/destination');
var distance = require('@turf/distance');

/**
 * Takes two {@link Point|points} and returns a point midway between them.
 * The midpoint is calculated geodesically, meaning the curvature of the earth is taken into account.
 *
 * @name midpoint
 * @param {Geometry|Feature<Point>|Array<number>} point1 first point
 * @param {Geometry|Feature<Point>|Array<number>} point2 second point
 * @returns {Feature<Point>} a point midway between `pt1` and `pt2`
 * @example
 * var point1 = turf.point([144.834823, -37.771257]);
 * var point2 = turf.point([145.14244, -37.830937]);
 *
 * var midpoint = turf.midpoint(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2, midpoint];
 * midpoint.properties['marker-color'] = '#f00';
 */
module.exports = function (point1, point2) {
    var dist = distance(point1, point2, 'miles');
    var heading = bearing(point1, point2);
    var midpoint = destination(point1, dist / 2, heading, 'miles');

    return midpoint;
};
