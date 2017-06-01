var helpers = require('@turf/helpers');
var inside = require('@turf/inside');
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');

/**
 * Cross returns True if the intersection results in a geometry whose dimension is one less than
 * the maximum dimension of the two source geometries and the intersection set is interior to
 * both source geometries.
 *
 * Cross returns t (TRUE) for only multipoint/polygon, multipoint/linestring, linestring/linestring, linestring/polygon, and linestring/multipolygon comparisons.
 *
 * @name cross
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false
 * @example
 * var cross = turf.cross(feature1, feature2);
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

// Shall be removed in favor of @turf/boolean-helpers
function isPointOnLineSegment(LineSegmentStart, LineSegmentEnd, Point) {
    var dxc = Point[0] - LineSegmentStart[0];
    var dyc = Point[1] - LineSegmentStart[1];
    var dxl = LineSegmentEnd[0] - LineSegmentStart[0];
    var dyl = LineSegmentEnd[1] - LineSegmentStart[1];
    var cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
        return false;
    }
    if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? LineSegmentStart[0] <= Point[0] && Point[0] <= LineSegmentEnd[0] : LineSegmentEnd[0] <= Point[0] && Point[0] <= LineSegmentStart[0];
    } else {
        return dyl > 0 ? LineSegmentStart[1] <= Point[1] && Point[1] <= LineSegmentEnd[1] : LineSegmentEnd[1] <= Point[1] && Point[1] <= LineSegmentStart[1];
    }
}
