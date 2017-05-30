var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var lineOverlap = require('@turf/line-overlap');
var polyToLinestring = require('@turf/polygon-to-linestring');
var lineIntersect = require('@turf/line-intersect');
var deepEqual = require('deep-equal');

/**
 * Overlap compares two geometries of the same dimension and returns (TRUE) if their
 * intersection set results in a geometry different from both but of the same dimension.
 *
 * @name overlap
 * @param {feature1} feature1 GeoJSON Feature
 * @param {feature2} feature2 GeoJSON Feature
 * @returns {Boolean} Features overlap
 * @example
 * turf.booleanOverlap(feature1, feature2);
 * //=true/false
 */
module.exports = function (feature1, feature2) {
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'MultiPoint') {
        return doMultiPointsOverlap(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'LineString') {
        return isLineOnLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'Polygon') {
        return isPolyInPoly(feature1, feature2);
    }
};

function doMultiPointsOverlap(multipoint1, multipoint2) {
    if (deepEqual(multipoint1, multipoint2)) {
        return false;
    }
    for (var i = 0; i < multipoint2.geometry.coordinates.length; i++) {
        for (var i2 = 0; i2 < multipoint1.geometry.coordinates.length; i2++) {
            if (deepEqual(multipoint2.geometry.coordinates[i], multipoint1.geometry.coordinates[i2])) {
                return true;
            }
        }
    }
    return false;
}

function isLineOnLine(lineString1, lineString2) {
    if (deepEqual(lineString1, lineString2)) {
        return false;
    }
    var overlappingLine = lineOverlap(lineString1, lineString2);
    if (overlappingLine.features.length !== 0) {
        for (var i = 0; i < lineString1.geometry.coordinates.length; i++) {
            if (!ispointOnLine(lineString2.geometry, lineString1.geometry.coordinates[i])) {
                return true;
            }
        }
    }
    return false;
}

function ispointInPoly(Polygon, point) {
    return inside(point, Polygon);
}

function isPolyInPoly(polygon1, polygon2) {
    for (var i = 0; i < polygon2.geometry.coordinates[0].length; i++) {
        if (ispointInPoly(polygon1, helpers.point(polygon2.geometry.coordinates[0][i]), true)) {
            return true;
        }
    }
    if (doLineStringAndPolygonCross(polygon1, polygon2)) {
        return true;
    }
    return false;
}

function doLineStringAndPolygonCross(polygon1, polygon2) {
    var doLinesIntersect = lineIntersect(polyToLinestring(polygon1), polyToLinestring(polygon2));
    if (doLinesIntersect.features.length > 0) {
        return true;
    }
    return false;
}

function ispointOnLine(lineString, pointCoords) {
    for (var i = 0; i < lineString.coordinates.length - 1; i++) {
        if (ispointOnLineSegment(lineString.coordinates[i], lineString.coordinates[i + 1], pointCoords)) {
            return true;
        }
    }
    return false;
}

function ispointOnLineSegment(LineSegmentStart, LineSegmentEnd, point) {
    var dxc = point[0] - LineSegmentStart[0];
    var dyc = point[1] - LineSegmentStart[1];
    var dxl = LineSegmentEnd[0] - LineSegmentStart[0];
    var dyl = LineSegmentEnd[1] - LineSegmentStart[1];
    var cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
        return false;
    }
    if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? LineSegmentStart[0] <= point[0] && point[0] <= LineSegmentEnd[0] : LineSegmentEnd[0] <= point[0] && point[0] <= LineSegmentStart[0];
    } else {
        return dyl > 0 ? LineSegmentStart[1] <= point[1] && point[1] <= LineSegmentEnd[1] : LineSegmentEnd[1] <= point[1] && point[1] <= LineSegmentStart[1];
    }
}
