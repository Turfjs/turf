var inside = require('@turf/inside');
var lineOverlap = require('@turf/line-overlap');
var polyToLinestring = require('@turf/polygon-to-linestring');

var internalHelpers = require('./helpers');
var checkIfCoordArraysMatch = internalHelpers.checkIfCoordArraysMatch;
var isPointOnLineSegment = internalHelpers.isPointOnLineSegment;

module.exports = function (feature1, feature2) {
    if (feature1.geometry.type === 'Point' && feature2.geometry.type === 'LineString') {
        return isPointAtEndOfLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'LineString') {
        return isMultiPointAtEndOfLine(feature1, feature2);
    }
    if (feature1.geometry.type === 'Point' && feature2.geometry.type === 'Polygon') {
        return isPointOnPolygon(feature1, feature2);
    }
    if (feature1.geometry.type === 'MultiPoint' && feature2.geometry.type === 'Polygon') {
        return isMultiPointOnPolygon(feature1, feature2);
    }
    // if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'LineString') {
    //     return isLineStringOnLineString(feature1, feature2);
    // }
    // if (feature1.geometry.type === 'LineString' && feature2.geometry.type === 'Polygon') {
    //     return isLineStringOnPolygon(feature1, feature2);
    // }
};

function isPointAtEndOfLine(Point, LineString) {
    if (checkIfCoordArraysMatch(Point.geometry.coordinates, LineString.geometry.coordinates[0])) {
        return true;
    }
    if (checkIfCoordArraysMatch(Point.geometry.coordinates, LineString.geometry.coordinates[LineString.geometry.coordinates.length - 1])) {
        return true;
    }
    return false;
}

function isMultiPointAtEndOfLine(MultiPoint, LineString) {
    var i;
    var onStartOrEnd = 0;
    var pointIsSomewhereOnLine = 0;
    var lastLinestringCoordIndex = LineString.geometry.coordinates.length - 1;
    for (i = 0; i < MultiPoint.geometry.coordinates.length; i++) {
        if (checkIfCoordArraysMatch(MultiPoint.geometry.coordinates[i], LineString.geometry.coordinates[0])) {
            onStartOrEnd++;
            continue;
        }
        if (checkIfCoordArraysMatch(MultiPoint.geometry.coordinates[i], lastLinestringCoordIndex)) {
            onStartOrEnd++;
            continue;
        }
        for (var lineI = 0; lineI < LineString.geometry.coordinates.length - 1; lineI++) {
            if (isPointOnLineSegment(LineString.geometry.coordinates[lineI], LineString.geometry.coordinates[lineI + 1], MultiPoint.geometry.coordinates[i])) {
                pointIsSomewhereOnLine++;
            }
        }
    }
    return onStartOrEnd === 1 && pointIsSomewhereOnLine === 0;
}

function isPointOnPolygon(Point, Polygon) {
    var output = false;
    var i;
    for (i = 0; i < Polygon.geometry.coordinates[0].length - 1; i++) {
        if (isPointOnLineSegment(Polygon.geometry.coordinates[0][i], Polygon.geometry.coordinates[0][i + 1], Point.geometry.coordinates)) {
            output = true;
            break;
        }
    }
    return output;
}

function isMultiPointOnPolygon(MultiPoint, Polygon) {
    var i = 0;
    var numberMatches = 0;
    for (i; i < MultiPoint.geometry.coordinates.length; i++) {
        var i2 = 0;
        for (i2; i2 < Polygon.geometry.coordinates[0].length - 1; i2++) {
            if (isPointOnLineSegment(Polygon.geometry.coordinates[0][i2], Polygon.geometry.coordinates[0][i2 + 1],  MultiPoint.geometry.coordinates[i])) {
                numberMatches++;
                break;
            }
        }
    }
    return numberMatches === 1;
}

// function isLineStringOnPolygon (LineString, Polygon) {
//     for (var lineI = 0; lineI < LineString.geometry.coordinates.length; lineI++) {
//         var isVerticeInside = inside(LineString.geometry.coordinates[lineI], Polygon);
//         if (!isVerticeInside) {
//             return false;
//         }
//     }
//     var overLappingLines = lineOverlap(LineString, polyToLinestring(Polygon)).features[0];
// }
