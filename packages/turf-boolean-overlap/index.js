var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var deepEqual = require('deep-equal');
var lineOverlap = require('@turf/line-overlap');
var lineIntersect = require('@turf/line-intersect');
var polyToLinestring = require('@turf/polygon-to-linestring');

/**
 * Compares two geometries of the same dimension and returns (TRUE) if their
 * intersection set results in a geometry different from both but of the same dimension.
 *
 * @name booleanOverlap
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false
 * @example
 * turf.booleanOverlap(feature1, feature2);
 * //=true/false
 */
module.exports = function (feature1, feature2) {
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    var geom1 = getGeom(feature1);
    var geom2 = getGeom(feature2);

    switch (type1) {
    case 'MultiPoint':
        switch (type2) {
        case 'MultiPoint':
            return doMultiPointsOverlap(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    case 'LineString':
        switch (type2) {
        case 'LineString':
            return isLineOnLine(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    case 'Polygon':
        switch (type2) {
        case 'Polygon':
            return isPolyInPoly(geom1, geom2);
        }
        throw new Error('feature2 ' + type2 + ' geometry not supported');
    default:
        throw new Error('feature1 ' + type1 + ' geometry not supported');
    }
};

function doMultiPointsOverlap(multipoint1, multipoint2) {
    var foundMatch = false;
    var foundMismatch = false;
    for (var i = 0; i < multipoint2.coordinates.length; i++) {
        var pointHasMatch = false;
        for (var i2 = 0; i2 < multipoint1.coordinates.length; i2++) {
            if (deepEqual(multipoint2.coordinates[i], multipoint1.coordinates[i2])) {
                foundMatch = true;
                pointHasMatch = true;
                break;
            }
        }
        if (!pointHasMatch) {
            foundMismatch = true;
        }
        if (foundMatch && foundMismatch) {
            return true;
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
        for (var i = 0; i < lineString1.coordinates.length; i++) {
            if (!ispointOnLine(lineString2, lineString1.coordinates[i])) {
                return true;
            }
        }
    }
    return false;
}

function ispointInPoly(polygon, point, ignoreBoundary) {
    return inside(point, polygon, ignoreBoundary);
}

function isPolyInPoly(polygon1, polygon2) {
    for (var i = 0; i < polygon1.coordinates[0].length; i++) {
        if (ispointInPoly(polygon2, helpers.point(polygon1.coordinates[0][i]), true)) {
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
