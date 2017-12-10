import { getCoord } from '@turf/invariant';
import { GreatCircle } from './lib/arc';

/**
 * Calculate great circles routes as {@link LineString}
 *
 * @name greatCircle
 * @param {Coord} start source point feature
 * @param {Coord} end destination point feature
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] line feature properties
 * @param {number} [options.npoints=100] number of points
 * @param {number} [options.offset=10] offset controls the likelyhood that lines will
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
function greatCircle(start, end, options) {
    // Optional parameters
    options = options || {};
    if (typeof options !== 'object') throw new Error('options is invalid');
    var properties = options.properties;
    var npoints = options.npoints;
    var offset = options.offset;

    start = getCoord(start);
    end = getCoord(end);
    properties = properties || {};
    npoints = npoints || 100;
    offset = offset || 10;

    var generator = new GreatCircle({x: start[0], y: start[1]}, {x: end[0], y: end[1]}, properties);

    /* eslint-disable */
    var line = generator.Arc(npoints, {offset: offset});
    /* eslint-enable */

    return line.json();
}

export default greatCircle;
