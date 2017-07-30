var clone = require('@turf/clone');
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var getGeomType = invariant.getGeomType;

/**
 * Removes redundant coordinates from a (Multi)LineString or (Multi)Polygon; ignores (Multi)Point.
 *
 * @name cleanCoords
 * @param {Geometry|Feature<any>} geojson Feature or Geometry
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated
 * @returns {Geometry|Feature<any>} the cleaned input Feature/Geometry
 * @example
 * var line = trf.lineString([[0, 0], [0, 2], [0, 5], [0, 8], [0, 8], [0, 10]]);
 *
 * var cleaned = turf.cleanCoords(line).geometry.coordinates;
 * //= [[0, 0], [0, 10]]
 */
module.exports = function (geojson, mutate) {
    if (!geojson) throw new Error('geojson is required');
    var type = getGeomType(geojson);
    var newPoints = [];

    var coords = getCoords(geojson);

    switch (type) {
    case 'LineString':
        newPoints = cleanCoords(geojson, mutate);
        break;
    case 'MultiLineString':
    case 'Polygon':
        for (var i = 0; i < coords.length; i++) {
            var line = coords[i];
            newPoints.push(cleanCoords(line));
        }
        break;
    case 'MultiPolygon':
        for (var j = 0; j < coords.length; j++) {
            var polys = coords[j];
            var polyPoints = [];
            for (var p = 0; p < polys.length; p++) {
                var ring = polys[p];
                polyPoints.push(cleanCoords(ring));
            }
            newPoints.push(polyPoints);
        }
        break;
    case 'Point':
    case 'MultiPoint':
        newPoints = coords;
        break;
    default:
        throw new Error(type + ' geometry not supported');
    }

    var output = (mutate === true) ? geojson : clone(geojson, true);

    if (output.coordinates) output.coordinates = newPoints;
    else output.geometry.coordinates = newPoints;

    return output;
};

function cleanCoords(line) {
    var points = getCoords(line);

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
 * Returns if `point` is on the segment between `start` and `end`.
 * Borrowed from `@turf/boolean-point-on-line` to speed up the evaluation
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
