import { getCoord, getGeom } from '@turf/invariant';

/**
 * Takes a triangular plane as a {@link Polygon}
 * and a {@link Point} within that triangle and returns the z-value
 * at that point. The Polygon should have properties `a`, `b`, and `c`
 * that define the values at its three corners. Alternatively, the z-values
 * of each triangle point can be provided by their respective 3rd coordinate
 * if their values are not provided as properties.
 *
 * @name planepoint
 * @param {Coord} point the Point for which a z-value will be calculated
 * @param {Feature<Polygon>} triangle a Polygon feature with three vertices
 * @returns {number} the z-value for `interpolatedPoint`
 * @example
 * var point = turf.point([-75.3221, 39.529]);
 * // "a", "b", and "c" values represent the values of the coordinates in order.
 * var triangle = turf.polygon([[
 *   [-75.1221, 39.57],
 *   [-75.58, 39.18],
 *   [-75.97, 39.86],
 *   [-75.1221, 39.57]
 * ]], {
 *   "a": 11,
 *   "b": 122,
 *   "c": 44
 * });
 *
 * var zValue = turf.planepoint(point, triangle);
 * point.properties.zValue = zValue;
 *
 * //addToMap
 * var addToMap = [triangle, point];
 */
function planepoint(point, triangle) {
    // Normalize input
    var coord = getCoord(point);
    var geom = getGeom(triangle);
    var coords = geom.coordinates;
    var outer = coords[0];
    if (outer.length < 4) throw new Error('OuterRing of a Polygon must have 4 or more Positions.');
    var properties = triangle.properties || {};
    var a = properties.a;
    var b = properties.b;
    var c = properties.c;

    // Planepoint
    var x = coord[0];
    var y = coord[1];
    var x1 = outer[0][0];
    var y1 = outer[0][1];
    var z1 = (a !== undefined ? a : outer[0][2]);
    var x2 = outer[1][0];
    var y2 = outer[1][1];
    var z2 = (b !== undefined ? b : outer[1][2]);
    var x3 = outer[2][0];
    var y3 = outer[2][1];
    var z3 = (c !== undefined ? c : outer[2][2]);
    var z = (z3 * (x - x1) * (y - y2) + z1 * (x - x2) * (y - y3) + z2 * (x - x3) * (y - y1) -
             z2 * (x - x1) * (y - y3) - z3 * (x - x2) * (y - y1) - z1 * (x - x3) * (y - y2)) /
           ((x - x1) * (y - y2) + (x - x2) * (y - y3) + (x - x3) * (y - y1) -
            (x - x1) * (y - y3) - (x - x2) * (y - y1) - (x - x3) * (y - y2));

    return z;
}

export default planepoint;
