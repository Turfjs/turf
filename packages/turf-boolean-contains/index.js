var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var deepEqual = require('deep-equal');
var lineOverlap = require('@turf/line-overlap');

/**
 * Contains returns true if the second geometry is completely contained by the first geometry.
 * The contains predicate returns the exact opposite result of the within predicate.
 *
 * @name contains
 * @param {Geometry|Feature<any>} feature1 source
 * @param {Geometry|Feature<any>} feature2 target
 * @returns {Boolean} true/false
 * @example
 * var along = turf.contains(line, point);
 */
module.exports = function (feature1, feature2) {
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);

    switch (geom1.type) {
    case 'Point':
        switch (geom2.type) {
        case 'Point':
            return deepEqual(geom1.coordinates, geom2. coordinates);
        }
        throw new Error('feature2 ' + geom2.type + ' geometry not supported');
    case 'MultiPoint':
        switch (geom2.type) {
        case 'Point':
            return isPointInMultiPoint(feature1, feature2);
        case 'MultiPoint':
            return isMultiPointInMultiPoint(feature1, feature2);
        }
        throw new Error('feature2 ' + geom2.type + ' geometry not supported');
    case 'LineString':
        switch (geom2.type) {
        case 'Point':
            return isPointOnLine(feature1, feature2);
        case 'LineString':
            return isLineOnLine(feature1, feature2);
        case 'MultiPoint':
            return isMultiPointOnLine(feature1, feature2);
        }
        throw new Error('feature2 ' + geom2.type + ' geometry not supported');
    case 'Polygon':
        switch (geom2.type) {
        case 'Point':
            return isPointInPoly(feature1, feature2);
        case 'LineString':
            return isLineInPoly(feature1, feature2);
        case 'Polygon':
            return isPolyInPoly(feature1, feature2);
        case 'MultiPoint':
            return isMultiPointInPoly(feature1, feature2);
        }
        throw new Error('feature2 ' + geom2.type + ' geometry not supported');
    default:
        throw new Error('feature1 ' + geom1.type + ' geometry not supported');
    }
};

function isPointInMultiPoint(MultiPoint, Point) {
    var i;
    var output = false;
    for (i = 0; i < MultiPoint.geometry.coordinates.length; i++) {
        if (deepEqual(MultiPoint.geometry.coordinates[i], Point.geometry.coordinates)) {
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
            if (deepEqual(MultiPoint2.geometry.coordinates[i], MultiPoint1.geometry.coordinates[i2])) {
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

    if (deepEqual(Polygon1.geometry.coordinates, Polygon2.geometry.coordinates)) {
        return false;
    }
    return true;
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
 * Get Geometry from Feature or Geometry Object
 *
 * @private
 * @param {Feature<any>|Geometry<any>} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry<any>} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 */
function getGeom(geojson) {
    if (geojson.geometry) return geojson.geometry;
    if (geojson.coordinates) return geojson;
    throw new Error('geojson must be a feature or geometry object');
}
