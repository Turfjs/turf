var getCoords = require('@turf/invariant').getCoords;
var coordEach = require('@turf/meta').coordEach;
var helpers = require('@turf/helpers');
var lineString = helpers.lineString;
var distanceToDegrees = helpers.distanceToDegrees;

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString>} line input line
 * @param {number} offset distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] can be degrees, radians, miles, kilometers, inches, yards, meters
 * @returns {Feature<LineString>} Line offset from the input line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[-83, 30], [-84, 36], [-78, 41]]
 *   }
 * };
 *
 * var offsetLine = turf.lineOffset(line, 2, 'miles');
 *
 * //addToMap
 * var addToMap = [offsetLine, line]
 */
module.exports = function (line, offset, units) {
    if (!line) throw new Error('line is required');
    if (offset === undefined || offset === null || isNaN(offset)) throw new Error('offset is required');

    var segments = [];
    var offsetDegrees = distanceToDegrees(offset, units);
    var coords = getCoords(line);
    var result = [];
    coordEach(line, function (currentCoords, index) {
        if (index !== coords.length - 1) {
            var segment = processSegment(currentCoords, coords[index + 1], offsetDegrees);
            segments.push(segment);
            if (index > 0) {
                var seg2Coords = segments[index - 1];
                var intersects = intersection(segment, seg2Coords);

                // Handling for line segments that aren't straight
                if (intersects !== false) {
                    seg2Coords[1] = intersects;
                    segment[0] = intersects;
                }

                result.push(seg2Coords[0]);
                if (index === coords.length - 2) {
                    result.push(segment[0]);
                    result.push(segment[1]);
                }
            }
            // Handling for lines that only have 1 segment
            if (coords.length === 2) {
                result.push(segment[0]);
                result.push(segment[1]);
            }
        }
    });
    return lineString(result, line.properties);
};

/**
 * Process Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
function processSegment(point1, point2, offset) {
    var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));

    var out1x = point1[0] + offset * (point2[1] - point1[1]) / L;
    var out2x = point2[0] + offset * (point2[1] - point1[1]) / L;
    var out1y = point1[1] + offset * (point1[0] - point2[0]) / L;
    var out2y = point2[1] + offset * (point1[0] - point2[0]) / L;
    return [[out1x, out1y], [out2x, out2y]];
}

/**
 * AB
 *
 * @private
 * @param {Array<Array<number>>} segment - 2 vertex line segment
 * @returns {Array<number>} coordinates [x, y]
 */
function ab(segment) {
    var start = segment[0];
    var end = segment[1];
    return [end[0] - start[0], end[1] - start[1]];
}

/**
 * Cross Product
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Cross Product
 */
function crossProduct(v1, v2) {
    return (v1[0] * v2[1]) - (v2[0] * v1[1]);
}

/**
 * Add
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Add
 */
function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

/**
 * Sub
 *
 * @private
 * @param {Array<number>} v1 coordinates [x, y]
 * @param {Array<number>} v2 coordinates [x, y]
 * @returns {Array<number>} Sub
 */
function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}

/**
 * scalarMult
 *
 * @private
 * @param {number} s scalar
 * @param {Array<number>} v coordinates [x, y]
 * @returns {Array<number>} scalarMult
 */
function scalarMult(s, v) {
    return [s * v[0], s * v[1]];
}

/**
 * Intersect Segments
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>} intersection
 */
function intersectSegments(a, b) {
    var p = a[0];
    var r = ab(a);
    var q = b[0];
    var s = ab(b);

    var cross = crossProduct(r, s);
    var qmp = sub(q, p);
    var numerator = crossProduct(qmp, s);
    var t = numerator / cross;
    var intersection = add(p, scalarMult(t, r));
    return intersection;
}

/**
 * Is Parallel
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {boolean} true if a and b are parallel (or co-linear)
 */
function isParallel(a, b) {
    var r = ab(a);
    var s = ab(b);
    return (crossProduct(r, s) === 0);
}

/**
 * Intersection
 * https://github.com/rook2pawn/node-intersection/blob/master/index.js
 *
 * @private
 * @param {Array<number>} a coordinates [x, y]
 * @param {Array<number>} b coordinates [x, y]
 * @returns {Array<number>|boolean} true if a and b are parallel (or co-linear)
 */
function intersection(a, b) {
    if (isParallel(a, b)) return false;
    return intersectSegments(a, b);
}
