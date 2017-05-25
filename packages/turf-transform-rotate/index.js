var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var centroid = require('@turf/centroid');
var invariant = require('@turf/invariant');
var rhumbBearing = require('@turf/rhumb-bearing');
var rhumbDistance = require('@turf/rhumb-distance');
var rhumbDestination = require('@turf/rhumb-destination');
var coordEach = meta.coordEach;
var getCoord = invariant.getCoord;
var getCoords = invariant.getCoords;
var point = helpers.point;
var feature = helpers.feature;

/**
 * Rotates any geojson Feature or Geometry of a specified angle, around its `centroid` or a given `pivot` point;
 * all rotations follow the right-hand rule: https://en.wikipedia.org/wiki/Right-hand_rule
 *
 * @name rotate
 * @param {Geometry|Feature<any>} geojson object to be rotated
 * @param {number} angle of rotation (along the vertical axis), from North in decimal degrees, negative clockwise
 * @param {Geometry|Feature<Point>|Array<number>} [pivot=`centroid`] point around which the rotation will be performed
 * @returns {Feature<any>} the rotated GeoJSON feature
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var rotatedPoly = turf.rotate(poly, 100, [15, 15]);
 *
 * //addToMap
 * rotatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 * var addToMap = [poly, rotatedPoly];
 */
module.exports = function (geojson, angle, pivot) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (angle === undefined || angle === null || isNaN(angle)) throw new Error('angle is required');

    if (geojson.type === 'FeatureCollection') throw new Error('FeatureCollection is not supported');
    if (geojson.type === 'GeometryCollection') throw new Error('GeometryCollection is not supported');
    if (geojson.type !== 'Feature') geojson = feature(geojson);

    // Shortcut no-rotation
    if (angle === 0) return geojson;

    // Handle pivot
    if (pivot) pivot = point(getCoord(pivot));
    else pivot = centroid(geojson);

    // Clone geojson to avoid side effects
    var geojsonCopy = JSON.parse(JSON.stringify(geojson));

    coordEach(geojsonCopy, function (pointCoords) {
        var initialAngle = rhumbBearing(pivot, pointCoords);
        var finalAngle = initialAngle + angle;
        var distance = rhumbDistance(pivot, pointCoords);
        var newCoords = getCoords(rhumbDestination(pivot, distance, finalAngle));
        pointCoords[0] = newCoords[0];
        pointCoords[1] = newCoords[1];
    });

    return geojsonCopy;
};

