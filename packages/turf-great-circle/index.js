var arc = require('./arc');
var getCoord = require('@turf/invariant').getCoord;

/**
 * Calculate great circles routes as {@link LineString}
 *
 * @name greatCircle
 * @param {Geometry|Feature<Point>|Array<number>} start source point feature
 * @param {Geometry|Feature<Point>|Array<number>} end destination point feature
 * @param {Object} [properties={}] line feature properties
 * @param {number} [npoints=100] number of points
 * @param {number} [offset=10] offset controls the likelyhood that lines will
 * be split which cross the dateline. The higher the number the more likely.
 * @returns {Feature<LineString>} great circle line feature
 * @example
 * var start = turf.point([-122, 48]);
 * var end = turf.point([-77, 39]);
 *
 * var greatCircle = turf.greatCircle(start, end, {'name': 'Seattle to DC'});
 *
 * //addToMap
 * var addToMap = [start, end, greatCircle]
 */
module.exports = function (start, end, properties, npoints, offset) {
    start = getCoord(start);
    end = getCoord(end);
    properties = properties || {};
    npoints = npoints || 100;
    offset = offset || 10;

    var generator = new arc.GreatCircle({x: start[0], y: start[1]}, {x: end[0], y: end[1]}, properties);
    /* eslint-disable */
    var line = generator.Arc(npoints, {offset: offset});
    /* eslint-enable */

    return line.json();
};
