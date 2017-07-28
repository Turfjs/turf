var meta = require('@turf/meta');
var centroid = require('@turf/centroid');
var invariant = require('@turf/invariant');
var rhumbBearing = require('@turf/rhumb-bearing');
var rhumbDistance = require('@turf/rhumb-distance');
var rhumbDestination = require('@turf/rhumb-destination');
var coordEach = meta.coordEach;
var getCoords = invariant.getCoords;

/**
 * Rotates any geojson Feature or Geometry of a specified angle, around its `centroid` or a given `pivot` point;
 * all rotations follow the right-hand rule: https://en.wikipedia.org/wiki/Right-hand_rule
 *
 * @name transformRotate
 * @param {GeoJSON} geojson object to be rotated
 * @param {number} angle of rotation (along the vertical axis), from North in decimal degrees, negative clockwise
 * @param {Geometry|Feature<Point>|Array<number>} [pivot=`centroid`] point around which the rotation will be performed
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} the rotated GeoJSON feature
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var rotatedPoly = turf.transformRotate(poly, 10, [0, 25]);
 *
 * //addToMap
 * var addToMap = [poly, rotatedPoly];
 * rotatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
module.exports = function (geojson, angle, pivot, mutate) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (angle === undefined || angle === null || isNaN(angle)) throw new Error('angle is required');

    // Shortcut no-rotation
    if (angle === 0) return geojson;

    // Use centroid of GeoJSON if pivot is not provided
    if (!pivot) pivot = centroid(geojson);

    // Clone geojson to avoid side effects
    if (mutate === false || mutate === undefined) geojson = JSON.parse(JSON.stringify(geojson));

    // Rotate each coordinate
    coordEach(geojson, function (pointCoords) {
        var initialAngle = rhumbBearing(pivot, pointCoords);
        var finalAngle = initialAngle + angle;
        var distance = rhumbDistance(pivot, pointCoords);
        var newCoords = getCoords(rhumbDestination(pivot, distance, finalAngle));
        pointCoords[0] = newCoords[0];
        pointCoords[1] = newCoords[1];
    });
    return geojson;
};
