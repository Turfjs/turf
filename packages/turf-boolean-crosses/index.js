var inside = require('@turf/inside');
var lineIntersect = require('@turf/line-intersect');
var invariant = require('@turf/invariant');
var flattenEach = require('@turf/meta').flattenEach;
var getGeom = invariant.getGeom;

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
 * @returns {Boolean} true/false
 * @example
 * var cross = turf.booleanCrosses(feature1, feature2);
 */

module.exports = function (feature1, feature2) {
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);

    return crosses(geom1, geom2);
};

/**
 * Crosses boolean operation for simple geometries (exception of MultiPoint)
 *
 * @private
 * @param {Geometry<any>} geom1 GeoJSON Geometry
 * @param {Geometry<any>} geom2 GeoJSON Geometry
 * @returns {Boolean} true/false
 */
function crosses(geom1, geom2) {
    if (geom1.type === 'Point' || geom2.type === 'Point') return false;

    switch (geom1.type) {
    case 'MultiPoint':
        switch (geom2.type) {
        case 'LineString':
            return doMultiPointAndLineStringCross(geom1, geom2);
        case 'Polygon':
            return doesMultiPointCrossPoly(geom1, geom2);
        case 'MultiLineString':
            return doMultiLineStringsCrossMultiPoint(geom2, geom1);
        }
        break;
    case 'LineString':
        switch (geom2.type) {
        case 'MultiPoint': // An inverse operation
            return doMultiPointAndLineStringCross(geom2, geom1);
        case 'LineString':
            return doLineStringsCross(geom1, geom2);
        case 'Polygon':
            return doLineStringsCross(geom1, polyToLine(geom2));
        case 'MultiLineString':
            return doMultiLineStringsCross(geom1, geom2);
        }
        break;
    case 'Polygon':
        switch (geom2.type) {
        case 'MultiPoint': // An inverse operation
            return doesMultiPointCrossPoly(geom2, geom1);
        case 'LineString': // An inverse operation
            return doLineStringsCross(polyToLine(geom1), geom2);
        }
        break;
    case 'MultiLineString':
        switch (geom2.type) {
        case 'MultiPoint':
            return doMultiLineStringsCrossMultiPoint(geom1, geom2);
        case 'LineString':
            return doMultiPointAndLineStringCross(geom1, geom2);
        case 'Polygon':
            return doMultiPointAndLineStringCross(geom1, polyToLine(geom2));
        }
        break;
    }
}

/**
 * Polygon outer ring to LineString Geometry
 *
 * @private
 * @param {Geometry<Polygon>} geom Polygon GeoJSON Geometry
 * @returns {Geometry<LineString>} LineString from outer Polygon
 */
function polyToLine(geom) {
    return {
        type: 'LineString',
        coordinates: geom.coordinates[0]
    };
}

function doMultiLineStringsCross(multiLineString1, multiLineString2) {
    var boolean = false;
    flattenEach(multiLineString1, function (lineString1) {
        flattenEach(multiLineString2, function (lineString2) {
            if (boolean === true) return true;
            boolean = doLineStringsCross(lineString1, lineString2);
        });
    });
    return boolean;
}

function doMultiLineStringsCrossMultiPoint(multiLineString, multiPoint) {
    var boolean;
    flattenEach(multiLineString, function (lineString) {
        if (boolean === true) return true;
        boolean = doMultiPointAndLineStringCross(multiPoint, lineString);
    });
    return boolean;
}

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

function isPointInPoly(polygon, point) {
    return inside(point, polygon);
}

function doesMultiPointCrossPoly(multiPoint, polygon) {
    var foundIntPoint = false;
    var foundExtPoint = false;
    var pointLength = multiPoint.coordinates[0].length;
    var i = 0;
    while (i < pointLength && foundIntPoint && foundExtPoint) {
        if (isPointInPoly(polygon, multiPoint.coordinates[0][i], true)) {
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
 * @param {[number, number]} lineSegmentStart coord pair of start of line
 * @param {[number, number]} lineSegmentEnd coord pair of end of line
 * @param {[number, number]} point coord pair of point to check
 * @param {Boolean} incEnd whether the point is allowed to fall on the line ends
 * @returns {Boolean} true/false
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
    } else if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? lineSegmentStart[0] < point[0] && point[0] < lineSegmentEnd[0] : lineSegmentEnd[0] < point[0] && point[0] < lineSegmentStart[0];
    } else {
        return dyl > 0 ? lineSegmentStart[1] < point[1] && point[1] < lineSegmentEnd[1] : lineSegmentEnd[1] < point[1] && point[1] < lineSegmentStart[1];
    }
}
