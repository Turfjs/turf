var inside = require('@turf/inside');
var flattenEach = require('@turf/meta').flattenEach;
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');

/**
 * Boolean-disjoint returns (TRUE) if the intersection of the two geometries is an empty set.
 *
 * @name booleanDisjoint
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false
 * @example
 * const point = turf.point([2, 2]);
 * const line = turf.lineString([[1, 1], [1, 2], [1, 3], [1, 4]]);
 *
 * turf.booleanDisjoint(line, point);
 * //=true
 */
module.exports = function (feature1, feature2) {
    var boolean;
    flattenEach(feature1, function (flatten1) {
        flattenEach(feature2, function (flatten2) {
            if (boolean === false) return false;
            boolean = disjoint(flatten1.geometry, flatten2.geometry);
        });
    });
    return boolean;
};

/**
 * Disjoint operation for simple Geometries (Point/LineString/Polygon)
 *
 * @private
 * @param {Geometry<any>} geom1 GeoJSON Geometry
 * @param {Geometry<any>} geom2 GeoJSON Geometry
 * @returns {Boolean} true/false
 */
function disjoint(geom1, geom2) {
    switch (geom1.type) {
    case 'Point':
        switch (geom2.type) {
        case 'Point':
            return !compareCoords(geom1.coordinates, geom2.coordinates);
        case 'LineString':
            return !isPointOnLine(geom2, geom1);
        case 'Polygon':
            return !inside(geom1, geom2);
        }
        /* istanbul ignore next */
        break;
    case 'LineString':
        switch (geom2.type) {
        case 'Point':
            return !isPointOnLine(geom1, geom2);
        case 'LineString':
            return !isLineOnLine(geom1, geom2);
        case 'Polygon':
            return !isLineInPoly(geom2, geom1);
        }
        /* istanbul ignore next */
        break;
    case 'Polygon':
        switch (geom2.type) {
        case 'Point':
            return !inside(geom2, geom1);
        case 'LineString':
            return !isLineInPoly(geom1, geom2);
        case 'Polygon':
            return !isPolyInPoly(geom2, geom1);
        }
    }
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
        if (dxl > 0) {
            return LineSegmentStart[0] <= Point[0] && Point[0] <= LineSegmentEnd[0];
        } else {
            return LineSegmentEnd[0] <= Point[0] && Point[0] <= LineSegmentStart[0];
        }
    } else if (dyl > 0) {
        return LineSegmentStart[1] <= Point[1] && Point[1] <= LineSegmentEnd[1];
    } else {
        return LineSegmentEnd[1] <= Point[1] && Point[1] <= LineSegmentStart[1];
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
