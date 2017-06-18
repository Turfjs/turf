var inside = require('@turf/inside');
var helpers = require('@turf/helpers'); //= Remove @turf/helpers at Turf v4.3
var getCoords = require('@turf/invariant').getCoords;
var deepEqual = require('deep-equal');
var lineOverlap = require('@turf/line-overlap');

/**
 * Contains returns True if the second geometry is completely contained by the first geometry.
 *
 * @name contains
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
 * turf.contains(line, point);
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
            return inside(geom2, geom1);
        case 'LineString':
            return isLineInPoly(geom1, geom2);
        case 'Polygon':
            return isPolyInPoly(feature2, feature1);
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
    return foundAMatch > 0;
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

function isMultiPointInPoly(Polygon, MultiPoint) {
    var output = true;
    for (var i = 0; i < MultiPoint.coordinates.length; i++) {
        var isInside = inside(MultiPoint.coordinates[1], Polygon);
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
    //== CHANGE Turf v4.3 - LineOverlap supports Geometry Objects ==//
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
        var isInside = inside(Linestring.coordinates[i], Polygon);
        if (!isInside) {
            output = false;
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
 * @returns {Boolean} true/false
 */
function isPolyInPoly(feature1, feature2) {
    var coords = getCoords(feature1)[0];
    var ring = getCoords(feature2)[0];
    var bbox = feature2.bbox;

    // check if outer coordinates is inside outer ring
    for (var i = 0; i < coords.length; i++) {
        // 3x performance increase if BBox is present
        if (bbox && !inBBox(coords[i], bbox)) return false;
        if (!inRing(coords[i], ring)) return false;
    }
    // Outer geometries cannot be the same
    if (deepEqual(coords, ring)) return false;
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

/**
 * inRing - @turf/inside
 *
 * @private
 * @param {[number, number]} pt [x,y]
 * @param {Array<[number, number]>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) ring = ring.slice(0, ring.length - 1);

    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0], yi = ring[i][1];
        var xj = ring[j][0], yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) return !ignoreBoundary;
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) isInside = !isInside;
    }
    return isInside;
}

/**
 * inBBox - @turf/inside
 *
 * @private
 * @param {[number, number]} pt point [x,y]
 * @param {[number, number, number, number]} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] &&
           bbox[1] <= pt[1] &&
           bbox[2] >= pt[0] &&
           bbox[3] >= pt[1];
}
