import bearing from '@turf/bearing';
import destination from '@turf/destination';
import distance from '@turf/distance';

/**
 * Takes two {@link Point|points} and returns a point midway between them.
 * The midpoint is calculated geodesically, meaning the curvature of the earth is taken into account.
 *
 * @name midpoint
 * @param {Coord} point1 first point
 * @param {Coord} point2 second point
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
function midpoint(point1, point2) {
    var dist = distance(point1, point2);
    var heading = bearing(point1, point2);
    var midpoint = destination(point1, dist / 2, heading);

    return midpoint;
}

export default midpoint;
