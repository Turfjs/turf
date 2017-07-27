var inside = require('@turf/inside');
var calcBbox = require('@turf/bbox');
var invariant = require('@turf/invariant');
var getGeom = invariant.getGeom;
var getCoords = invariant.getCoords;
var getGeomType = invariant.getGeomType;

/**
 * Boolean-contains returns True if the second geometry is completely contained by the first geometry.
 * The interiors of both geometries must intersect and, the interior and boundary of the secondary (geometry b)
 * must not intersect the exterior of the primary (geometry a).
 * Boolean-contains returns the exact opposite result of the `@turf/boolean-within`.
 *
 * @name booleanContains
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {boolean} true/false
 * @example
 * const line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 * const point = turf.point([1, 2]);
 *
 * turf.booleanContains(line, point);
 * //=true
 */
module.exports = function (feature1, feature2) {
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);
    var coords1 = getCoords(feature1);
    var coords2 = getCoords(feature2);

    switch (type1) {
    case 'Point':
        switch (type2) {
        case 'Point':
            return compareCoords(coords1, coords2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    case 'MultiPoint':
        switch (type2) {
        case 'Point':
            return isPointInMultiPoint(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointInMultiPoint(geom1, geom2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    case 'LineString':
        switch (type2) {
        case 'Point':
            return isPointOnLine(geom1, geom2, true);
        case 'LineString':
            return isLineOnLine(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointOnLine(geom1, geom2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    case 'Polygon':
        switch (type2) {
        case 'Point':
            return inside(geom2, geom1, true);
        case 'LineString':
            return isLineInPoly(geom1, geom2);
        case 'Polygon':
            return isPolyInPoly(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointInPoly(geom1, geom2);
        default:
            throw new Error('feature2 ' + type2 + ' geometry not supported');
        }
    default:
        throw new Error('feature1 ' + type1 + ' geometry not supported');
    }
};

function isPointInMultiPoint(multiPoint, point) {
    var i;
    var output = false;
    for (i = 0; i < multiPoint.coordinates.length; i++) {
        if (compareCoords(multiPoint.coordinates[i], point.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointInMultiPoint(multiPoint1, multiPoint2) {
    var foundAMatch = 0;
    for (var i = 0; i < multiPoint2.coordinates.length; i++) {
        var anyMatch = false;
        for (var i2 = 0; i2 < multiPoint1.coordinates.length; i2++) {
            if (compareCoords(multiPoint2.coordinates[i], multiPoint1.coordinates[i2])) {
                foundAMatch++;
                anyMatch = true;
                break;
            }
        }
        if (!anyMatch) {
            return false;
        }
    }
    return foundAMatch > 0;
}

// http://stackoverflow.com/a/11908158/1979085
function isPointOnLine(lineString, point, excEndPoints) {
    var output = false;
    for (var i = 0; i < lineString.coordinates.length - 1; i++) {
        var incEndVertices = true;
        if ((i === 0 || i === lineString.coordinates.length - 2) && excEndPoints) {
            incEndVertices = false;
        }
        if (isPointOnLineSegment(lineString.coordinates[i], lineString.coordinates[i + 1], point.coordinates, incEndVertices)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointOnLine(lineString, multiPoint) {
    var output = true;
    var foundAnInteriorPoint = false;
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
        var pointIsOnLine = false;
        for (var i2 = 0; i2 < lineString.coordinates.length - 1; i2++) {
            if (isPointOnLineSegment(lineString.coordinates[i2], lineString.coordinates[i2 + 1], multiPoint.coordinates[i], true)) {
                if (!foundAnInteriorPoint && isPointOnLineSegment(lineString.coordinates[i2], lineString.coordinates[i2 + 1], multiPoint.coordinates[i], false)) {
                    foundAnInteriorPoint = true;
                }
                pointIsOnLine = true;
                break;
            }
        }
        if (!pointIsOnLine) {
            output = false;
            break;
        }
    }
    return output && foundAnInteriorPoint;
}

function isMultiPointInPoly(polygon, multiPoint) {
    var output = true;
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
        var isInside = inside(multiPoint.coordinates[1], polygon, true);
        if (!isInside) {
            output = false;
            break;
        }
    }
    return output;
}

function isLineOnLine(lineString1, lineString2) {
    var output = true;
    for (var i = 0; i < lineString2.coordinates.length; i++) {
        var checkLineCoords = isPointOnLine(lineString1, {type: 'Point', coordinates: lineString2.coordinates[i]}, false);
        if (!checkLineCoords) {
            output = false;
            break;
        }
    }
    return output;
}

function isLineInPoly(polygon, linestring) {
    var output = false;
    var i = 0;
    var lineLength = linestring.coordinates.length;

    var polyBbox = calcBbox(polygon);
    var lineBbox = calcBbox(linestring);
    if (!doBBoxOverlap(polyBbox, lineBbox)) {
        return false;
    }
    for (i; i < lineLength - 1; i++) {
        var midPoint = getMidpoint(linestring.coordinates[i], linestring.coordinates[i + 1]);
        if (inside({type: 'Point', coordinates: midPoint}, polygon, true)) {
            output = true;
            break;
        }
    }
    return output;
}

/**
 * Is Polygon (geom1) in Polygon (geom2)
 * Only takes into account outer rings
 * See http://stackoverflow.com/a/4833823/1979085
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {boolean} true/false
 */
function isPolyInPoly(feature1, feature2) {
    var poly1Bbox = calcBbox(feature1);
    var poly2Bbox = calcBbox(feature2);
    if (!doBBoxOverlap(poly1Bbox, poly2Bbox)) {
        return false;
    }
    return true;
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

function doBBoxOverlap(bbox1, bbox2) {
    if (bbox1[0] > bbox2[0]) return false;
    if (bbox1[2] < bbox2[2]) return false;
    if (bbox1[1] > bbox2[1]) return false;
    if (bbox1[3] < bbox2[3]) return false;
    return true;
}

/**
 * compareCoords
 *
 * @private
 * @param {[number, number]} pair1 point [x,y]
 * @param {[number, number]} pair2 point [x,y]
 * @returns {boolean} true/false if coord pairs match
 */
function compareCoords(pair1, pair2) {
    return pair1[0] === pair2[0] && pair1[1] === pair2[1];
}

function getMidpoint(pair1, pair2) {
    return [(pair1[0] + pair2[0]) / 2, (pair1[1] + pair2[1]) / 2];
}
