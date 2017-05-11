var getCoords = require('@turf/invariant').getCoords;
var coordEach = require('@turf/meta').coordEach;
var intersection = require('intersection');
var helpers = require('@turf/helpers');
var lineString = helpers.lineString;
var distanceToDegrees = helpers.distanceToDegrees;

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString>} line input line
 * @param {number} offset distance to offset the line
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
    var segments = [];
    var offsetDegrees = distanceToDegrees(offset, units);
    var coords = getCoords(line);

    coordEach(line, function (currentCoords, currentIndex) {
        if (currentIndex !== coords.length - 1) {
            var outCoords = processSegment(currentCoords, coords[currentIndex + 1], offsetDegrees);
            segments.push(outCoords);
        }
    });
    segments.forEach(function (segment, index) {
        if (index !== segments.length - 1) {
            var seg2Coords = segments[index + 1];
            var seg1 = {start: {x: segment[0][0], y: segment[0][1]}, end: {x: segment[1][0], y: segment[1][1]}};
            var seg2 = {start: {x: seg2Coords[0][0], y: seg2Coords[0][1]}, end: {x: seg2Coords[1][0], y: seg2Coords[1][1]}};
            var int = intersection.intersect(seg1, seg2);
            segment[1][0] = int.x;
            segment[1][1] = int.y;
            seg2Coords[0][0] = int.x;
            seg2Coords[0][1] = int.y;
        }
    });
    var finalCoords = segments.map(function (segment) {
        return segment[0];
    });
    finalCoords.push(segments[segments.length - 1][1]);
    return lineString(finalCoords, line.properties);
};

// Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
function processSegment(point1, point2, offset) {
    var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));

    var out1x = point1[0] + offset * (point2[1] - point1[1]) / L;
    var out2x = point2[0] + offset * (point2[1] - point1[1]) / L;
    var out1y = point1[1] + offset * (point1[0] - point2[0]) / L;
    var out2y = point2[1] + offset * (point1[0] - point2[0]) / L;
    return [[out1x, out1y], [out2x, out2y]];
}
