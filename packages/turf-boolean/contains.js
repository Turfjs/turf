var helpers = require('@turf/helpers');
var inside = require('@turf/inside');
var internalHelpers = require('./helpers');
var lineOverlap = require('@turf/line-overlap');
var isPointOnLineSegment = internalHelpers.isPointOnLineSegment;
var checkIfCoordArraysMatch = internalHelpers.checkIfCoordArraysMatch;
var checkIfDeepCoordArraysMatch = internalHelpers.checkIfDeepCoordArraysMatch;


/**
* Contains returns true if the second geometry is completely contained by the first geometry.
* The contains predicate returns the exact opposite result of the within predicate.
*
* @name contains
* @param {feature1} feature1
* @param {feature2} feature2
* @returns {Boolean}
* @example
* var along = turf.contains(line, point);
*/

module.exports = function (feature1, feature2) {
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'Point') {
        return isPointInMultiPoint(feature1, feature2);
    }
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'MultiPoint') {
        return isMultiPointInMultiPoint(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'Point') {
        return isPointOnLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'MultiPoint') {
        return isMultiPointOnLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'Point') {
        return isPointInPoly(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'MultiPoint') {
        return isMultiPointInPoly(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'LineString') {
        return isLineOnLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'LineString') {
        return isLineInPoly(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'Polygon') {
        return isPolyInPoly(feature1, feature2);
    }
};

function isPointInMultiPoint(MultiPoint, Point) {
    var i;
    var output = false;
    for (i = 0; i < MultiPoint.geometry.coordinates.length; i++) {
        if (checkIfCoordArraysMatch(MultiPoint.geometry.coordinates[i], Point.geometry.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointInMultiPoint(MultiPoint1, MultiPoint2) {
    var foundAMatch = 0;
    for (var i = 0; i < MultiPoint2.geometry.coordinates.length; i++) {
        var anyMatch = false;
        for (var i2 = 0; i2 < MultiPoint1.geometry.coordinates.length; i2++) {
            if (checkIfCoordArraysMatch(MultiPoint2.geometry.coordinates[i], MultiPoint1.geometry.coordinates[i2])) {
                foundAMatch++;
                anyMatch = true;
                break;
            }
        }
        if (!anyMatch) {
            return false;
        }
    }
    return foundAMatch > 0 && foundAMatch < MultiPoint1.geometry.coordinates.length;
}

// http://stackoverflow.com/a/11908158/1979085
function isPointOnLine(LineString, Point) {
    var output = false;
    for (var i = 0; i < LineString.geometry.coordinates.length - 1; i++) {
        if (isPointOnLineSegment(LineString.geometry.coordinates[i], LineString.geometry.coordinates[i + 1], Point.geometry.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointOnLine(LineString, MultiPoint) {
    var output = true;
    for (var i = 0; i < MultiPoint.geometry.coordinates.length; i++) {
        var pointIsOnLine = false;
        for (var i2 = 0; i2 < LineString.geometry.coordinates.length - 1; i2++) {
            if (isPointOnLineSegment(LineString.geometry.coordinates[i2], LineString.geometry.coordinates[i2 + 1], MultiPoint.geometry.coordinates[i])) {
                pointIsOnLine = true;
                break;
            }
        }
        if (!pointIsOnLine) {
            output = false;
            break;
        }
    }
    return output;
}

function isPointInPoly(Polygon, Point) {
    return inside(Point, Polygon);
}

function isMultiPointInPoly(Polygon, MultiPoint) {
    var output = true;
    for (var i = 0; i < MultiPoint.geometry.coordinates.length; i++) {
        var isInside = isPointInPoly(Polygon, helpers.point(MultiPoint.geometry.coordinates[1]));
        if (!isInside) {
            output = false;
            break;
        }
    }
    return output;
}

// TO DO - Work out how to check if line is in line (can potentially use line overlap module)
// Also need to make sure lines are exactly the same, eg the second must be smaller than the first
function isLineOnLine(LineString1, LineString2) {
    var output = true;
    var overlappingLine = lineOverlap(LineString1, LineString2).features[0];
    if (overlappingLine.geometry.coordinates[0] === LineString1.geometry.coordinates[0] &&
        overlappingLine.geometry.coordinates[overlappingLine.geometry.coordinates.length - 1] === LineString1.geometry.coordinates[LineString1.geometry.coordinates.length - 1]) {
        output = false;
    }
    return output;
}

function isLineInPoly(Polygon, Linestring) {
    var output = true;
    for (var i = 0; i < Linestring.geometry.coordinates.length; i++) {
        var isInside = isPointInPoly(Polygon, Linestring.geometry.coordinates[i]);
        if (!isInside) {
            output = false;
            break;
        }
    }
    return output;
}

// See http://stackoverflow.com/a/4833823/1979085
// TO DO - Need to handle if the polys are the same, eg there must be some outer coordinates different
function isPolyInPoly(Polygon1, Polygon2) {
    for (var i = 0; i < Polygon2.geometry.coordinates[0].length; i++) {
        if (!isPointInPoly(Polygon1, helpers.point(Polygon2.geometry.coordinates[0][i]))) {
            return false;
        }
    }

    if (checkIfDeepCoordArraysMatch(Polygon1.geometry.coordinates, Polygon2.geometry.coordinates)) {
        return false;
    }
    return true;
}
