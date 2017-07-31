var getCoords = require('@turf/invariant').getCoords;
var coordEach = require('@turf/meta').coordEach;
var helpers = require('@turf/helpers');
var bearingToAngle = helpers.bearingToAngle;
var polygon = helpers.polygon;
var point = helpers.point;
var distanceToDegrees = helpers.distanceToDegrees;
var bearing = require('@turf/bearing');
var lineArc = require('@turf/line-arc');

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString>} feature input line
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] can be degrees, radians, miles, kilometers, inches, yards, meters
 * @param {number} steps number of steps on a rounded corner
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
 * var offsetLine = turf.buffer(line, 2, 'miles');
 *
 * //addToMap
 * var addToMap = [offsetLine, line]
 */
module.exports = function (feature, distance, units, steps) {
    if (!feature) throw new Error('line is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    var numSteps = steps ? steps : 64;

    var offsetDegrees = distanceToDegrees(distance, units);
    switch (feature.geometry.type) {
    case 'Polygon':
        return bufferPolygon(feature, offsetDegrees, numSteps);
    case 'LineString':
        return bufferLineString(feature, offsetDegrees, numSteps);
    }
};

function bufferPolygon(feature, offsetDegrees, steps) {
    var coords = getCoords(feature);
    var finalCoords = [];
    var prevCoords = coords[0][coords[0].length - 2];
    var nextCoords = null;

    coordEach(feature, function (currentCoords, index) {
        if (index !== 0) {
            prevCoords = coords[0][index - 1];
        }
        if (index === coords[0].length - 1) {
            nextCoords = coords[0][1];
        } else {
            nextCoords = coords[0][index + 1];
        }
        var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords));
        var bearingNextCoords = bearing(point(currentCoords), point(nextCoords));
        var angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords));

        if (index > 0) {
            var segment = processSegment(currentCoords, nextCoords, offsetDegrees);
            var prevSegment = processSegment(prevCoords, currentCoords, offsetDegrees);
            if (angleInDegs < 180) {
                var outsector = createRounded(currentCoords, offsetDegrees, bearingNextCoords, bearingPrevCoords, steps);
                finalCoords = finalCoords.concat(outsector.geometry.coordinates.reverse());
            } else {
                var intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1]);
                finalCoords.push([intersects.x, intersects.y]);
            }
        }
    });
    finalCoords.push(finalCoords[0]);
    return polygon([finalCoords], polygon.properties);
}

function bufferLineString(feature, offsetDegrees, steps) {
    var coords = getCoords(feature);
    var finalCoords = [];
    var otherSideCoords = [];
    var prevCoords = coords[coords.length - 2];
    var nextCoords = null;
    var finalRounded = null;
    coordEach(feature, function (currentCoords, index) {
        if (index === 0) {
            nextCoords = coords[index + 1];
            var bearingNextCoords = bearing(point(currentCoords), point(nextCoords));
            var outsector = createRounded(currentCoords, offsetDegrees, bearingNextCoords, bearingNextCoords, steps);
            finalCoords = finalCoords.concat(outsector.geometry.coordinates.reverse());
        } else if (index === coords.length - 1) {
            prevCoords = coords[index - 1];
            var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords));
            var outsector = createRounded(currentCoords, offsetDegrees, bearingPrevCoords, bearingPrevCoords, steps);
            finalRounded = outsector.geometry.coordinates.reverse();
        } else {
            prevCoords = coords[index - 1];
            nextCoords = coords[index + 1];
            var bearingPrevCoords = bearing(point(currentCoords), point(prevCoords));
            var bearingNextCoords = bearing(point(currentCoords), point(nextCoords));
            var angleInDegs = bearingToAngle(bearingToAngle(bearingNextCoords) - bearingToAngle(bearingPrevCoords));

            var segment = processSegment(currentCoords, nextCoords, offsetDegrees);
            var prevSegment = processSegment(prevCoords, currentCoords, offsetDegrees);

            if (angleInDegs < 180) {
                var outsector = createRounded(currentCoords, offsetDegrees, bearingNextCoords, bearingPrevCoords, steps);
                finalCoords = finalCoords.concat(outsector.geometry.coordinates.reverse());
                var segmentRev = processSegment(currentCoords, nextCoords, -Math.abs(offsetDegrees));
                var prevSegmentRev = processSegment(prevCoords, currentCoords, -Math.abs(offsetDegrees));
                var intersects = checkLineIntersection(segmentRev[0][0], segmentRev[0][1], segmentRev[1][0], segmentRev[1][1], prevSegmentRev[0][0], prevSegmentRev[0][1], prevSegmentRev[1][0], prevSegmentRev[1][1]);
                otherSideCoords.push([intersects.x, intersects.y]);
            } else {
                var intersects = checkLineIntersection(segment[0][0], segment[0][1], segment[1][0], segment[1][1], prevSegment[0][0], prevSegment[0][1], prevSegment[1][0], prevSegment[1][1]);
                finalCoords.push([intersects.x, intersects.y]);
                var outsector = createRounded(currentCoords, offsetDegrees, bearingPrevCoords, bearingNextCoords, steps);
                otherSideCoords = otherSideCoords.concat(outsector.geometry.coordinates);
            }
        }
    });
    finalCoords = finalCoords.concat(finalRounded);
    finalCoords = finalCoords.concat(otherSideCoords.reverse());
    finalCoords.push(finalCoords[0]);
    return polygon([finalCoords], feature.properties);
}


function createRounded(coords, offsetDegrees, bearingNextCoords, bearingPrevCoords, numSteps) {
    return lineArc(point(coords), offsetDegrees, bearingNextCoords + 90, bearingPrevCoords - 90, numSteps, 'degrees');
}

function createBevel() {

}

function createMitre() {

}

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
 * Check if lines intersect
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @returns {Array<Array<number>>} offset points
 */
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    return result;
}
