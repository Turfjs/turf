var cleanCoords = require('@turf/clean-coords');
var bearing = require('@turf/bearing');
var lineSegment = require('@turf/line-segment');
var helpers = require('@turf/helpers');
var bearingToAngle = helpers.bearingToAngle;


/**
 * <DESCRIPTION>
 *
 * @name booleanParallel
 * @param {Geometry|Feature<LineString>} line1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<LineString>} line2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false if the lines are parallel
 * @example
 * var line1 = turf.lineString([[0, 0], [0, 1]]);
 * var line2 = turf.lineString([[1, 0], [1, 1]]);
 *
 * turf.booleanParallel(line1, line2);
 * //=true
 */
module.exports = function (line1, line2) {
    // validation
    if (!line1) throw new Error('line1 is required');
    if (!line2) throw new Error('line2 is required');
    var type1 = getType(line1, 'line1');
    if (type1.indexOf('LineString') < 0) throw new Error('line1 must be a LineString or MultiLineString');
    var type2 = getType(line2, 'line2');
    if (type2.indexOf('LineString') < 0) throw new Error('line2 must be a LineString or MultiLineString');

    var segments1 = lineSegment(cleanCoords(line1));
    var segments2 = lineSegment(cleanCoords(line2));

    for (var i = 0; i < segments1.length; i++) {
        var segment1 = segments1[i];
        var segment2 = segments2[i];
        if (!segment2) break;
        if (!isParallel(segment1, segment2)) return false;
    }
    return true;
};

/**
 * Compares slopes
 *
 * @private
 * @param {Geometry|Feature<LineString>} segment1 Geometry or Feature
 * @param {Geometry|Feature<LineString>} segment2 Geometry or Feature
 * @returns {boolean} if segments are parallel
 */
function isParallel(segment1, segment2) {
    var slope1 = bearingToAngle(bearing(segment1[0], segment1[1]));
    var slope2 = bearingToAngle(bearing(segment2[0], segment2[1]));
    return slope1 === slope2;
}


/**
 * Returns Feature's type
 *
 * @private
 * @param {Geometry|Feature<any>} geojson Geometry or Feature
 * @param {string} name of the variable
 * @returns {string} Feature's type
 */
function getType(geojson, name) {
    if (geojson.geometry && geojson.geometry.type) return geojson.geometry.type;
    if (geojson.type) return geojson.type; // if GeoJSON geometry
    throw new Error('Invalid GeoJSON type for ' + name);
}


// /**
//  * Is Parallel
//  *
//  * @private
//  * @param {Array<number>} a coordinates [x, y]
//  * @param {Array<number>} b coordinates [x, y]
//  * @returns {boolean} true if a and b are parallel (or co-linear)
//  */
// function isParallel(a, b) {
//     var r = ab(a);
//     var s = ab(b);
//     return (crossProduct(r, s) === 0);
// }
//
// /**
//  * AB
//  *
//  * @private
//  * @param {Array<Array<number>>} segment - 2 vertex line segment
//  * @returns {Array<number>} coordinates [x, y]
//  */
// function ab(segment) {
//     var start = segment[0];
//     var end = segment[1];
//     return [end[0] - start[0], end[1] - start[1]];
// }
//
// /**
//  * Cross Product
//  *
//  * @private
//  * @param {Array<number>} v1 coordinates [x, y]
//  * @param {Array<number>} v2 coordinates [x, y]
//  * @returns {Array<number>} Cross Product
//  */
// function crossProduct(v1, v2) {
//     return (v1[0] * v2[1]) - (v2[0] * v1[1]);
// }

