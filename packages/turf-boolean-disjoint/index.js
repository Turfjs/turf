var inside = require('@turf/inside');
var invariant = require('@turf/invariant');
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');
var getGeom = invariant.getGeom;
var getCoords = invariant.getCoords;
var getGeomType = invariant.getGeomType;

/**
 * Boolean-disjoint returns (TRUE) if the intersection of the two geometries is an empty set.
 *
 * @name booleanDisjoint
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false
 * @example
 * const point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [2, 2]
 *   }
 * }
 * const line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[1, 1], [1, 2], [1, 3], [1, 4]]
 *   }
 * }
 * turf.booleanDisjoint(line, point);
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
            return !compareCoords(coords1, coords2);
        case 'MultiPoint':
            return !isPointInMultiPoint(geom2, geom1);
        case 'LineString':
            return !isPointOnLine(geom2, geom1);
        case 'Polygon':
            return !inside(geom1, geom2);
        }
        break;
    case 'MultiPoint':
        switch (type2) {
        case 'Point':
            return !isPointInMultiPoint(coords1, coords2);
        case 'MultiPoint':
            return !isMultiPointInMultiPoint(geom1, geom2);
        case 'LineString':
            return !isMultiPointOnLine(geom2, geom1);
        case 'Polygon':
            return !isMultiPointInPoly(geom2, geom1);
        }
        break;
    case 'LineString':
        switch (type2) {
        case 'Point':
            return !isPointOnLine(geom1, geom2);
        case 'MultiPoint':
            return !isMultiPointOnLine(geom1, geom2);
        case 'LineString':
            return !isLineOnLine(geom1, geom2);
        case 'Polygon':
            return !isLineInPoly(geom2, geom1);
        }
        break;
    case 'Polygon':
        switch (type2) {
        case 'Point':
            return !inside(geom2, geom1);
        case 'MultiPoint':
            return !isMultiPointInPoly(geom1, geom2);
        case 'LineString':
            return !isLineInPoly(geom1, geom2);
        case 'Polygon':
            return !isPolyInPoly(geom2, geom1);
        }
        break;
    }
};

function isPointInMultiPoint(multiPoint, point) {
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
        if (compareCoords(multiPoint.coordinates[i], point.coordinates)) {
            return true;
        }
    }
    return false;
}

function isMultiPointInMultiPoint(multiPoint1, multiPoint2) {
    for (var i = 0; i < multiPoint2.coordinates.length; i++) {
        for (var i2 = 0; i2 < multiPoint1.coordinates.length; i2++) {
            if (compareCoords(multiPoint2.coordinates[i], multiPoint1.coordinates[i2])) {
                return true;
            }
        }
    }
    return false;
}

// http://stackoverflow.com/a/11908158/1979085
function isPointOnLine(lineString, point) {
    for (var i = 0; i < lineString.coordinates.length - 1; i++) {
        if (isPointOnLineSegment(lineString.coordinates[i], lineString.coordinates[i + 1], point.coordinates)) {
            return true;
        }
    }
    return false;
}

function isMultiPointOnLine(lineString, multiPoint) {
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
        for (var i2 = 0; i2 < lineString.coordinates.length - 1; i2++) {
            if (isPointOnLineSegment(lineString.coordinates[i2], lineString.coordinates[i2 + 1], multiPoint.coordinates[i])) {
                return true;
            }
        }
    }
    return false;
}

function isMultiPointInPoly(polygon, multiPoint) {
    for (var i = 0; i < multiPoint.coordinates.length; i++) {
        if (inside(multiPoint.coordinates[i], polygon)) {
            return true;
        }
    }
    return false;
}

function isLineOnLine(lineString1, lineString2) {
    var doLinesIntersect = lineIntersect(lineString1, lineString2);
    if (doLinesIntersect.features.length > 0) {
        return true;
    }
    return false;
}

function isLineInPoly(polygon, lineString) {
    var doLinesIntersect = lineIntersect(lineString, polyToLinestring(polygon));
    if (doLinesIntersect.features.length > 0) {
        return true;
    }
    return false;
}

/**
 * Is Polygon (geom1) in Polygon (geom2)
 * Only takes into account outer rings
 * See http://stackoverflow.com/a/4833823/1979085
 *
 * @private
 * @param {Geometry|Feature<Polygon>} feature1 Polygon1
 * @param {Geometry|Feature<Polygon>} feature2 Polygon2
 * @returns {Boolean} true/false
 */
function isPolyInPoly(feature1, feature2) {
    for (var i = 0; i < feature1.coordinates[0].length; i++) {
        if (inside(feature1.coordinates[0][i], feature2)) {
            return true;
        }
    }
    return false;
}

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
