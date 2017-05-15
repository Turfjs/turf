var inside = require('@turf/inside');
var helpers = require('@turf/helpers');
var lineOverlap = require('@turf/line-overlap');
var deepEqual = require('deep-equal');

/**
 * Overlap compares two geometries of the same dimension and returns (TRUE) if their
 * intersectionset resultsin a geometry different from both but of the same dimension.
 *
 * @name overlap
 * @param {feature1} feature1 GeoJSON Feature
 * @param {feature2} feature2 GeoJSON Feature
 * @returns {Boolean} Features overlap
 * @example
 * turf.overlap(feature1, feature2);
 * //=true/false
 */
module.exports = function (feature1, feature2) {
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'MultiPoint') {
        return doMultiPointsOverlap(feature1, feature2);
    }
    if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'LineString') {
        return isLineOnLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'Polygon' && feature2.geometry.type === 'Polygon') {
        return isPolyInPoly(feature1, feature2);
    }
};

function doMultiPointsOverlap(MultiPoint1, MultiPoint2) {
    for (var i = 0; i < MultiPoint2.geometry.coordinates.length; i++) {
        for (var i2 = 0; i2 < MultiPoint1.geometry.coordinates.length; i2++) {
            if (deepEqual(MultiPoint2.geometry.coordinates[i], MultiPoint1.geometry.coordinates[i2])) {
                return true;
            }
        }
    }
    return false;
}

// TO DO - Work out how to check if line is in line (can potentially use line overlap module)
// Also need to make sure lines are exactly the same, eg the second must be smaller than the first
function isLineOnLine(LineString1, LineString2) {
    var overlappingLine = lineOverlap(LineString1, LineString2);
    if (overlappingLine.features.length !== 0) {
        return true;
    }
    return false;
}

function isPointInPoly(Polygon, Point) {
    return inside(Point, Polygon);
}

// TO DO HANDLE IF THERE ARE NO POINTS INSIDE THE OTHER POLY BY LINES OVERLAP
function isPolyInPoly(Polygon1, Polygon2) {
    for (var i = 0; i < Polygon2.geometry.coordinates[0].length; i++) {
        if (isPointInPoly(Polygon1, helpers.point(Polygon2.geometry.coordinates[0][i]), true)) {
            return true;
        }
    }

    return true;
}
