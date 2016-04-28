var distance = require('turf-distance');
var point = require('turf-helpers').point;
var linestring = require('turf-helpers').lineString;
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
 * Takes a {@link LineString|line}, a start {@link Point}, and a stop point
 * and returns a subsection of the line in-between those points.
 * The start & stop points don't need to fall exactly on the line.
 *
 * This can be useful for extracting only the part of a route between waypoints.
 *
 * @name lineSlice
 * @category misc
 * @param {Feature<Point>} point1 starting point
 * @param {Feature<Point>} point2 stopping point
 * @param {Feature<LineString>|LineString} line line to slice
 * @return {Feature<LineString>} sliced line
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 * var start = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-77.029609, 38.881946]
 *   }
 * };
 * var stop = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [-77.021884, 38.889563]
 *   }
 * };
 *
 * var sliced = turf.lineSlice(start, stop, line);
 *
 * //=line
 *
 * //=sliced
 */

module.exports = function lineSlice(startPt, stopPt, line) {
    var coords;
    if (line.type === 'Feature') {
        coords = line.geometry.coordinates;
    } else if (line.type === 'LineString') {
        coords = line.coordinates;
    } else {
        throw new Error('input must be a LineString Feature or Geometry');
    }

    var startVertex = pointOnLine(startPt, coords);
    var stopVertex = pointOnLine(stopPt, coords);
    var ends;
    if (startVertex.properties.index <= stopVertex.properties.index) {
        ends = [startVertex, stopVertex];
    } else {
        ends = [stopVertex, startVertex];
    }
    var clipLine = linestring([ends[0].geometry.coordinates], {});
    for (var i = ends[0].properties.index + 1; i < ends[1].properties.index + 1; i++) {
        clipLine.geometry.coordinates.push(coords[i]);
    }
    clipLine.geometry.coordinates.push(ends[1].geometry.coordinates);
    return clipLine;
};

function pointOnLine(pt, coords) {
    var units = 'miles';
    var closestPt = point([Infinity, Infinity], {
        dist: Infinity
    });
    for (var i = 0; i < coords.length - 1; i++) {
        var start = point(coords[i]);
        var stop = point(coords[i + 1]);
        //start
        start.properties.dist = distance(pt, start, units);
        //stop
        stop.properties.dist = distance(pt, stop, units);
        //perpendicular
        var direction = bearing(start, stop);
        var perpendicularPt = destination(pt, 1000, direction + 90, units); // 1000 = gross
        var intersect = lineIntersects(
      pt.geometry.coordinates[0],
      pt.geometry.coordinates[1],
      perpendicularPt.geometry.coordinates[0],
      perpendicularPt.geometry.coordinates[1],
      start.geometry.coordinates[0],
      start.geometry.coordinates[1],
      stop.geometry.coordinates[0],
      stop.geometry.coordinates[1]
    );
        if (!intersect) {
            perpendicularPt = destination(pt, 1000, direction - 90, units); // 1000 = gross
            intersect = lineIntersects(
        pt.geometry.coordinates[0],
        pt.geometry.coordinates[1],
        perpendicularPt.geometry.coordinates[0],
        perpendicularPt.geometry.coordinates[1],
        start.geometry.coordinates[0],
        start.geometry.coordinates[1],
        stop.geometry.coordinates[0],
        stop.geometry.coordinates[1]
      );
        }
        perpendicularPt.properties.dist = Infinity;
        var intersectPt;
        if (intersect) {
            intersectPt = point(intersect);
            intersectPt.properties.dist = distance(pt, intersectPt, units);
        }

        if (start.properties.dist < closestPt.properties.dist) {
            closestPt = start;
            closestPt.properties.index = i;
        }
        if (stop.properties.dist < closestPt.properties.dist) {
            closestPt = stop;
            closestPt.properties.index = i;
        }
        if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
            closestPt = intersectPt;
            closestPt.properties.index = i;
        }
    }

    return closestPt;
}

// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2,
        result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        if (result.x !== null && result.y !== null) {
            return result;
        } else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    if (result.onLine1 && result.onLine2) {
        return [result.x, result.y];
    } else {
        return false;
    }
}
