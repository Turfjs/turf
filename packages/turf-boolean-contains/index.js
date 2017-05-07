var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var getCoords = require('@turf/invariant').getCoords;
var deepEqual = require('deep-equal');
var lineOverlap = require('@turf/line-overlap');

/**
 * Contains returns True if the second geometry is completely contained by the first geometry.
 *
 * @name contains
 * @param {Geometry|Feature<any>} feature1 first geometry
 * @param {Geometry|Feature<any>} feature2 second geometry
 * @returns {Boolean} true/false
 * @example
 * const point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [1, 1]
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
 * turf.contains(line, point);
 * //=true
 */
module.exports = function (feature1, feature2) {
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);
    var coords1 = getCoords(feature1);
    var coords2 = getCoords(feature1);

    switch (type1) {
    case 'Point':
        switch (type2) {
        case 'Point':
            return deepEqual(coords1, coords2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    case 'MultiPoint':
        switch (type2) {
        case 'Point':
            return isPointInMultiPoint(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointInMultiPoint(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    case 'LineString':
        switch (type2) {
        case 'Point':
            return isPointOnLine(geom1, geom2);
        case 'LineString':
            return isLineOnLine(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointOnLine(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    case 'Polygon':
        switch (type2) {
        case 'Point':
            return isPointInPoly(geom1, geom2);
        case 'LineString':
            return isLineInPoly(geom1, geom2);
        case 'Polygon':
            return isPolyInPoly(geom1, geom2);
        case 'MultiPoint':
            return isMultiPointInPoly(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    default:
        throw new Error('feature1 ' + type1 + ' geometry not supported');
    }
};

function isPointInMultiPoint(MultiPoint, Point) {
    var i;
    var output = false;
    for (i = 0; i < MultiPoint.coordinates.length; i++) {
        if (deepEqual(MultiPoint.coordinates[i], Point.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointInMultiPoint(MultiPoint1, MultiPoint2) {
    var foundAMatch = 0;
    for (var i = 0; i < MultiPoint2.coordinates.length; i++) {
        var anyMatch = false;
        for (var i2 = 0; i2 < MultiPoint1.coordinates.length; i2++) {
            if (deepEqual(MultiPoint2.coordinates[i], MultiPoint1.coordinates[i2])) {
                foundAMatch++;
                anyMatch = true;
                break;
            }
        }
        if (!anyMatch) {
            return false;
        }
    }
    return foundAMatch > 0 && foundAMatch < MultiPoint1.coordinates.length;
}

// http://stackoverflow.com/a/11908158/1979085
function isPointOnLine(LineString, Point) {
    var output = false;
    for (var i = 0; i < LineString.coordinates.length - 1; i++) {
        if (isPointOnLineSegment(LineString.coordinates[i], LineString.coordinates[i + 1], Point.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointOnLine(LineString, MultiPoint) {
    var output = true;
    for (var i = 0; i < MultiPoint.coordinates.length; i++) {
        var pointIsOnLine = false;
        for (var i2 = 0; i2 < LineString.coordinates.length - 1; i2++) {
            if (isPointOnLineSegment(LineString.coordinates[i2], LineString.coordinates[i2 + 1], MultiPoint.coordinates[i])) {
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
    for (var i = 0; i < MultiPoint.coordinates.length; i++) {
        var isInside = isPointInPoly(Polygon, helpers.point(MultiPoint.coordinates[1]));
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
    var overlappingLine = lineOverlap(helpers.feature(LineString1), helpers.feature(LineString2)).features[0];
    if (!overlappingLine) return false;
    overlappingLine = getGeom(overlappingLine);
    if (overlappingLine.coordinates[0] === LineString1.coordinates[0] &&
        overlappingLine.coordinates[overlappingLine.coordinates.length - 1] === LineString1.coordinates[LineString1.coordinates.length - 1]) {
        output = false;
    }
    return output;
}

function isLineInPoly(Polygon, Linestring) {
    var output = true;
    for (var i = 0; i < Linestring.coordinates.length; i++) {
        var isInside = isPointInPoly(Polygon, Linestring.coordinates[i]);
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
    for (var i = 0; i < Polygon2.coordinates[0].length; i++) {
        if (!isPointInPoly(Polygon1, helpers.point(Polygon2.coordinates[0][i]))) {
            return false;
        }
    }

    if (deepEqual(Polygon1.coordinates, Polygon2.coordinates)) {
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
 * //!! Remove this method when implemented to @turf/invariant
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

// Remove this method when implemented to @turf/invariant
function getGeomType(geojson) {
    if (geojson.geometry) return geojson.geometry.type;
    if (geojson.coordinates) return geojson.type;
    throw new Error('geojson must be a feature or geometry object');
}
