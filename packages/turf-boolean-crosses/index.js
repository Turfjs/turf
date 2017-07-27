var helpers = require('@turf/helpers');
var inside = require('@turf/inside');
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');
var invariant = require('@turf/invariant');
var getGeom = invariant.getGeom;
var getGeomType = invariant.getGeomType;

/**
 * Boolean-Crosses returns True if the intersection results in a geometry whose dimension is one less than
 * the maximum dimension of the two source geometries and the intersection set is interior to
 * both source geometries.
 *
 * Boolean-Crosses returns t (TRUE) for only multipoint/polygon, multipoint/linestring, linestring/linestring, linestring/polygon, and linestring/multipolygon comparisons.
 *
 * @name booleanCrosses
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * var line1 = turf.lineString([[-2, 2], [4, 2]]);
 * var line2 = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * var cross = turf.booleanCrosses(line1, line2);
 * //=true
 */
module.exports = function (feature1, feature2) {
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);

    switch (type1) {
    case 'MultiPoint':
        switch (type2) {
        case 'LineString':
            return doMultiPointAndLineStringCross(geom1, geom2);
        case 'Polygon':
            return doesMultiPointCrossPoly(geom1, geom2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    case 'LineString':
        switch (type2) {
        case 'MultiPoint': // An inverse operation
            return doMultiPointAndLineStringCross(geom2, geom1);
        case 'LineString':
            return doLineStringsCross(geom1, geom2);
        case 'Polygon':
            return doLineStringAndPolygonCross(geom1, geom2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    case 'Polygon':
        switch (type2) {
        case 'MultiPoint': // An inverse operation
            return doesMultiPointCrossPoly(geom2, geom1);
        case 'LineString': // An inverse operation
            return doLineStringAndPolygonCross(geom2, geom1);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    default:
        throw new Error('feature1 ' + type1 + ' geometry not supported');
    }
};

function doMultiPointAndLineStringCross(multiPoint, lineString) {
    var foundIntPoint = false;
    var foundExtPoint = false;
    var pointLength = multiPoint.coordinates.length;
    var i = 0;
    while (i < pointLength && !foundIntPoint && !foundExtPoint) {
        for (var i2 = 0; i2 < lineString.coordinates.length - 1; i2++) {
            var incEndVertices = true;
            if (i2 === 0 || i2 === lineString.coordinates.length - 2) {
                incEndVertices = false;
            }
            if (isPointOnLineSegment(lineString.coordinates[i2], lineString.coordinates[i2 + 1], multiPoint.coordinates[i], incEndVertices)) {
                foundIntPoint = true;
            } else {
                foundExtPoint = true;
            }
        }
        i++;
    }
    return foundIntPoint && foundExtPoint;
}

function doLineStringsCross(lineString1, lineString2) {
    var doLinesIntersect = lineIntersect(lineString1, lineString2);
    if (doLinesIntersect.features.length > 0) {
        for (var i = 0; i < lineString1.coordinates.length - 1; i++) {
            for (var i2 = 0; i2 < lineString2.coordinates.length - 1; i2++) {
                var incEndVertices = true;
                if (i2 === 0 || i2 === lineString2.coordinates.length - 2) {
                    incEndVertices = false;
                }
                if (isPointOnLineSegment(lineString1.coordinates[i], lineString1.coordinates[i + 1], lineString2.coordinates[i2], incEndVertices)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function doLineStringAndPolygonCross(lineString, polygon) {
    var doLinesIntersect = lineIntersect(lineString, polyToLinestring(polygon));
    if (doLinesIntersect.features.length > 0) {
        return true;
    }
    return false;
}

function isPointInPoly(polygon, point) {
    return inside(point, polygon);
}

function doesMultiPointCrossPoly(multiPoint, polygon) {
    var foundIntPoint = false;
    var foundExtPoint = false;
    var pointLength = multiPoint.coordinates[0].length;
    var i = 0;
    while (i < pointLength && foundIntPoint && foundExtPoint) {
        if (isPointInPoly(polygon, helpers.point(multiPoint.coordinates[0][i]), true)) {
            foundIntPoint = true;
        } else {
            foundExtPoint = true;
        }
        i++;
    }

    return foundExtPoint && foundExtPoint;
}

/**
 * Is a point on a line segment
 * Only takes into account outer rings
 * See http://stackoverflow.com/a/4833823/1979085
 *
 * @private
 * @param {Array} lineSegmentStart coord pair of start of line
 * @param {Array} lineSegmentEnd coord pair of end of line
 * @param {Array} point coord pair of point to check
 * @param {boolean} incEnd whether the point is allowed to fall on the line ends
 * @returns {boolean} true/false
 */
function isPointOnLineSegment(lineSegmentStart, lineSegmentEnd, point, incEnd) {
    var dxc = point[0] - lineSegmentStart[0];
    var dyc = point[1] - lineSegmentStart[1];
    var dxl = lineSegmentEnd[0] - lineSegmentStart[0];
    var dyl = lineSegmentEnd[1] - lineSegmentStart[1];
    var cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) {
        return false;
    }
    if (incEnd) {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? lineSegmentStart[0] <= point[0] && point[0] <= lineSegmentEnd[0] : lineSegmentEnd[0] <= point[0] && point[0] <= lineSegmentStart[0];
        }
        return dyl > 0 ? lineSegmentStart[1] <= point[1] && point[1] <= lineSegmentEnd[1] : lineSegmentEnd[1] <= point[1] && point[1] <= lineSegmentStart[1];
    } else {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? lineSegmentStart[0] < point[0] && point[0] < lineSegmentEnd[0] : lineSegmentEnd[0] < point[0] && point[0] < lineSegmentStart[0];
        }
        return dyl > 0 ? lineSegmentStart[1] < point[1] && point[1] < lineSegmentEnd[1] : lineSegmentEnd[1] < point[1] && point[1] < lineSegmentStart[1];
    }
}
