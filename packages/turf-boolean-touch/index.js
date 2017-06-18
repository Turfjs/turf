// var inside = require('@turf/inside');
// var getCoords = require('@turf/invariant').getCoords;
var deepEqual = require('deep-equal');
// var lineOverlap = require('@turf/line-overlap');
// var polyToLinestring = require('@turf/polygon-to-linestring');

/**
 * Touch returns True if none of the points common to both geometries intersect the interiors of both geometries.
 * At least one geometry must be a linestring, polygon, multilinestring, or multipolygon.
 *
 * @name touch
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
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
 * turf.touch(point, line);
 * //=true/false
 */
module.exports = function (feature1, feature2) {
    // var geom1 = getGeom(feature1);
    // var geom2 = getGeom(feature2);
    var type1 = getGeomType(feature1);
    var type2 = getGeomType(feature2);
    // var coords1 = getCoords(feature1);
    // var coords2 = getCoords(feature1);

    switch (type1) {
    case 'Point':
        switch (type2) {
        case 'LineString': return isPointAtEndOfLine(feature1, feature2);
        case 'Polygon': return isPointOnPolygon(feature1, feature2);
        default: throw new Error('geometry ' + type2 + ' is not supported');
        }
    case 'MultiPoint':
        switch (type2) {
        case 'LineString': return isMultiPointAtEndOfLine(feature1, feature2);
        case 'Polygon': return isMultiPointOnPolygon(feature1, feature2);
        default: throw new Error('geometry ' + type2 + ' is not supported');
        }
    case 'LineString':
        switch (type2) {
        // case 'LineString': return return isLineStringOnLineString(feature1, feature2);
        // case 'Polygon': return isLineStringOnPolygon(feature1, feature2);
        default: throw new Error('geometry ' + type2 + ' is not supported');
        }
    default: throw new Error('geometry ' + type1 + ' is not supported');
    }
};

function isPointAtEndOfLine(Point, LineString) {
    if (deepEqual(Point.geometry.coordinates, LineString.geometry.coordinates[0])) {
        return true;
    }
    if (deepEqual(Point.geometry.coordinates, LineString.geometry.coordinates[LineString.geometry.coordinates.length - 1])) {
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
        if (deepEqual(MultiPoint.geometry.coordinates[i], LineString.geometry.coordinates[0])) {
            onStartOrEnd++;
            continue;
        }
        if (deepEqual(MultiPoint.geometry.coordinates[i], lastLinestringCoordIndex)) {
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

// // Remove this method when implemented to @turf/invariant
// function getGeom(geojson) {
//     if (geojson.geometry) return geojson.geometry;
//     if (geojson.coordinates) return geojson;
//     throw new Error('geojson must be a feature or geometry object');
// }

// Remove this method when implemented to @turf/invariant
function getGeomType(geojson) {
    if (geojson.geometry) return geojson.geometry.type;
    if (geojson.coordinates) return geojson.type;
    throw new Error('geojson must be a feature or geometry object');
}
