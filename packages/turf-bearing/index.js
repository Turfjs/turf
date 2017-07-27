var getCoord = require('@turf/invariant').getCoord;
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

/**
 * Takes two {@link Point|points} and finds the geographic bearing between them,
 * i.e. the angle measured in degrees from the north line (0 degrees)
 *
 * @name bearing
 * @param {Geometry|Feature<Point>|Array<number>} start starting Point
 * @param {Geometry|Feature<Point>|Array<number>} end ending Point
 * @param {boolean} [final=false] calculates the final bearing if true
 * @returns {number} bearing in decimal degrees, between -180 and 180 degrees (positive clockwise)
 * @example
 * var point1 = turf.point([-75.343, 39.984]);
 * var point2 = turf.point([-75.534, 39.123]);
 *
 * var bearing = turf.bearing(point1, point2);
 *
 * //addToMap
 * var addToMap = [point1, point2]
 * point1.properties['marker-color'] = '#f00'
 * point2.properties['marker-color'] = '#0f0'
 * point1.properties.bearing = bearing
 */
function bearing(start, end, final) {
    if (final === true) return calculateFinalBearing(start, end);

    var degrees2radians = Math.PI / 180;
    var radians2degrees = 180 / Math.PI;
    var coordinates1 = getCoord(start);
    var coordinates2 = getCoord(end);

    var lon1 = degrees2radians * coordinates1[0];
    var lon2 = degrees2radians * coordinates2[0];
    var lat1 = degrees2radians * coordinates1[1];
    var lat2 = degrees2radians * coordinates2[1];
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    var bear = radians2degrees * Math.atan2(a, b);

    return bear;
}

/**
 * Calculates Final Bearing
 * @private
 * @param {Feature<Point>} start starting Point
 * @param {Feature<Point>} end ending Point
 * @returns {number} bearing
 */
function calculateFinalBearing(start, end) {
    // Swap start & end
    var bear = bearing(end, start);
    bear = (bear + 180) % 360;
    return bear;
}

module.exports = bearing;
