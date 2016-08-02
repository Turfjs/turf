/**
 * Takes a triangular plane as a {@link Polygon}
 * and a {@link Point} within that triangle and returns the z-value
 * at that point. The Polygon needs to have properties `a`, `b`, and `c`
 * that define the values at its three corners.
 *
 * @name planepoint
 * @param {Feature<Point>} point the Point for which a z-value will be calculated
 * @param {Feature<Polygon>} triangle a Polygon feature with three vertices
 * @return {Number} the z-value for `interpolatedPoint`
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-75.3221, 39.529]
 *   }
 * };
 * var point = turf.point([-75.3221, 39.529]);
 * // triangle is a polygon with "a", "b",
 * // and "c" values representing
 * // the values of the coordinates in order.
 * var triangle = {
 *   "type": "Feature",
 *   "properties": {
 *     "a": 11,
 *     "b": 122,
 *     "c": 44
 *   },
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-75.1221, 39.57],
 *       [-75.58, 39.18],
 *       [-75.97, 39.86],
 *       [-75.1221, 39.57]
 *     ]]
 *   }
 * };
 *
 * var features = {
 *   "type": "FeatureCollection",
 *   "features": [triangle, point]
 * };
 *
 * var zValue = turf.planepoint(point, triangle);
 *
 * //=features
 *
 * //=zValue
 */
module.exports = function (point, triangle) {
    var x = point.geometry.coordinates[0],
        y = point.geometry.coordinates[1],
        x1 = triangle.geometry.coordinates[0][0][0],
        y1 = triangle.geometry.coordinates[0][0][1],
        z1 = triangle.properties.a,
        x2 = triangle.geometry.coordinates[0][1][0],
        y2 = triangle.geometry.coordinates[0][1][1],
        z2 = triangle.properties.b,
        x3 = triangle.geometry.coordinates[0][2][0],
        y3 = triangle.geometry.coordinates[0][2][1],
        z3 = triangle.properties.c;

    var z = (z3 * (x - x1) * (y - y2) + z1 * (x - x2) * (y - y3) + z2 * (x - x3) * (y - y1) -
      z2 * (x - x1) * (y - y3) - z3 * (x - x2) * (y - y1) - z1 * (x - x3) * (y - y2)) /
      ((x - x1) * (y - y2) + (x - x2) * (y - y3) + (x - x3) * (y - y1) -
       (x - x1) * (y - y3) - (x - x2) * (y - y1) - (x - x3) * (y - y2));

    return z;
};
