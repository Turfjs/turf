var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var getGeomType = invariant.getGeomType;

/**
 * Removes redundant coordinates from any GeoJSON Geometry.
 *
 * @name cleanCoords
 * @param {Geometry|Feature} geojson Feature or Geometry
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated
 * @returns {Geometry|Feature} the cleaned input Feature/Geometry
 * @example
 * var line = turf.lineString([[0, 0], [0, 2], [0, 5], [0, 8], [0, 8], [0, 10]]);
 * var multiPoint = turf.multiPoint([[0, 0], [0, 0], [2, 2]]);
 *
 * turf.cleanCoords(line).geometry.coordinates;
 * //= [[0, 0], [0, 10]]
 *
 * turf.cleanCoords(multiPoint).geometry.coordinates;
 * //= [[0, 0], [2, 2]]
 */
module.exports = function (geojson, mutate) {
    if (!geojson) throw new Error('geojson is required');
    var type = getGeomType(geojson);

    // Store new "clean" points in this Array
    var newCoords = [];

    switch (type) {
    case 'LineString':
        newCoords = cleanCoords(geojson);
        break;
    case 'MultiLineString':
    case 'Polygon':
        getCoords(geojson).forEach(function (line) {
            newCoords.push(cleanCoords(line));
        });
        break;
    case 'MultiPolygon':
        getCoords(geojson).forEach(function (polygons) {
            var polyPoints = [];
            polygons.forEach(function (ring) {
                polyPoints.push(cleanCoords(ring));
            });
            newCoords.push(polyPoints);
        });
        break;
    case 'Point':
        return geojson;
    case 'MultiPoint':
        var existing = {};
        getCoords(geojson).forEach(function (coord) {
            var key = coord.join('-');
            if (!existing.hasOwnProperty(key)) {
                newCoords.push(coord);
                existing[key] = true;
            }
        });
        break;
    default:
        throw new Error(type + ' geometry not supported');
    }

    // Support input mutation
    if (geojson.coordinates) {
        if (mutate === true) {
            geojson.coordinates = newCoords;
            return geojson;
        }
        return geometry(geojson, type, newCoords);
    } else {
        if (mutate === true) {
            geojson.geometry.coordinates = newCoords;
            return geojson;
        }
        return feature(geojson, type, newCoords);
    }
};

/**
 * Create Geometry from existing Geometry
 *
 * @private
 * @param {Geometry} geojson Existing Geometry
 * @param {string} type Geometry Type
 * @param {Array<number>} coordinates Coordinates
 * @returns {Geometry} Geometry
 */
function geometry(geojson, type, coordinates) {
    var geom = {
        type: type,
        coordinates: coordinates
    };
    if (geojson.bbox) geom.bbox = geojson.bbox;
    return geom;
}

/**
 * Create Feature from existing Feature
 *
 * @private
 * @param {Feature} geojson Existing Feature
 * @param {string} type Feature Type
 * @param {Array<number>} coordinates Coordinates
 * @returns {Feature} Feature
 */
function feature(geojson, type, coordinates) {
    var feat = helpers.feature(geometry(geojson.geometry, type, coordinates), geojson.properties);
    if (geojson.id) feat.id = geojson.id;
    if (geojson.bbox) feat.bbox = geojson.bbox;
    return feat;
}

/**
 * Clean Coords
 *
 * @private
 * @param {Array<number>|LineString} line Line
 * @returns {Array<number>} Cleaned coordinates
 */
function cleanCoords(line) {
    var points = getCoords(line);
    // handle "clean" segment
    if (points.length === 2 && !equals(points[0], points[1])) return points;

    var prevPoint, point, nextPoint;
    var newPoints = [];
    var secondToLast = points.length - 1;

    newPoints.push(points[0]);
    for (var i = 1; i < secondToLast; i++) {
        prevPoint = points[i - 1];
        point = points[i];
        nextPoint = points[i + 1];

        if (!isPointOnLineSegment(prevPoint, nextPoint, point)) {
            newPoints.push(point);
        }
    }
    newPoints.push(nextPoint);
    return newPoints;
}

/**
 * Compares two points and returns if they are equals
 *
 * @private
 * @param {Array<number>} pt1 point
 * @param {Array<number>} pt2 point
 * @returns {boolean} true if they are equals
 */
function equals(pt1, pt2) {
    return pt1[0] === pt2[0] && pt1[1] === pt2[1];
}

/**
 * Returns if `point` is on the segment between `start` and `end`.
 * Borrowed from `@turf/boolean-point-on-line` to speed up the evaluation (instead of using the module as dependency)
 *
 * @private
 * @param {Array<number>} start coord pair of start of line
 * @param {Array<number>} end coord pair of end of line
 * @param {Array<number>} point coord pair of point to check
 * @returns {boolean} true/false
 */
function isPointOnLineSegment(start, end, point) {
    var x = point[0], y = point[1];
    var startX = start[0], startY = start[1];
    var endX = end[0], endY = end[1];

    var dxc = x - startX;
    var dyc = y - startY;
    var dxl = endX - startX;
    var dyl = endY - startY;
    var cross = dxc * dyl - dyc * dxl;

    if (cross !== 0) return false;
    else if (Math.abs(dxl) >= Math.abs(dyl)) return dxl > 0 ? startX <= x && x <= endX : endX <= x && x <= startX;
    else return dyl > 0 ? startY <= y && y <= endY : endY <= y && y <= startY;
}
