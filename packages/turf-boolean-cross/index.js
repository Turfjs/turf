var helpers = require('@turf/helpers');
var inside = require('@turf/inside');
var internalHelpers = require('./helpers');
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');
var isPointOnLineSegment = internalHelpers.isPointOnLineSegment;

/**
* Contains returns true if the second geometry is completely contained by the first geometry.
* The contains predicate returns the exact opposite result of the within predicate.
*
* @name overlap
* @param {feature1} feature1
* @param {feature2} feature2
* @returns {Boolean}
* @example
* var along = turf.contains(line, point);
*/

module.exports = function (feature1, feature2) {
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'LineString') {
        return doMultiPointAndLineStringCross(feature1, feature2);
    }
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'Polygon') {
        return doesMultiPointCrossPoly(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'LineString') {
        return doLineStringsCross(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'Polygon') {
        return doLineStringAndPolygonCross(feature1, feature2);
    }
};

function doMultiPointAndLineStringCross(MultiPoint, LineString) {
    var foundIntPoint = false;
    var foundExtPoint = false;
    var pointLength = MultiPoint.geometry.coordinates.length;
    var i = 0;
    while (i < pointLength && !foundIntPoint && !foundExtPoint) {
        for (var i2 = 0; i2 < LineString.geometry.coordinates.length - 1; i2++) {
            if (isPointOnLineSegment(LineString.geometry.coordinates[i2], LineString.geometry.coordinates[i2 + 1], MultiPoint.geometry.coordinates[i])) {
                foundIntPoint = true;
            } else {
                foundExtPoint = true;
            }
        }
        i++;
    }
    return foundIntPoint && foundExtPoint;
}

function doLineStringsCross(LineString1, LineString2) {
    var doLinesIntersect = lineIntersect(LineString1, LineString2);
    if (doLinesIntersect.features.length > 0) {
        // Check that one of the points doesn't lie on the line
        for (var i = 0; i < LineString1.geometry.coordinates.length - 1; i++) {
            for (var i2 = 0; i2 < LineString2.geometry.coordinates.length - 1; i2++) {
                if (!isPointOnLineSegment(LineString1.geometry.coordinates[i], LineString1.geometry.coordinates[i + 1], LineString2.geometry.coordinates[i2])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function doLineStringAndPolygonCross(LineString, Polygon) {
    var doLinesIntersect = lineIntersect(LineString, polyToLinestring(Polygon));
    if (doLinesIntersect.features.length > 0) {
        return true;
    }
    return false;
}

function isPointInPoly(Polygon, Point) {
    return inside(Point, Polygon);
}

function doesMultiPointCrossPoly(MultiPoint, Polygon) {
    var foundIntPoint = false;
    var foundExtPoint = false;
    var pointLength = MultiPoint.geometry.coordinates[0].length;
    var i = 0;
    while (i < pointLength && foundIntPoint && foundExtPoint) {
        if (isPointInPoly(Polygon, helpers.point(MultiPoint.geometry.coordinates[0][i]), true)) {
            foundIntPoint = true;
        } else {
            foundExtPoint = true;
        }
        i++;
    }

    return foundExtPoint && foundExtPoint;
}
