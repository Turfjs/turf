var meta = require('@turf/meta');
var invariant = require('@turf/invariant');
var rhumbDestination = require('@turf/rhumb-destination');
var coordEach = meta.coordEach;
var getCoords = invariant.getCoords;

/**
 * Moves any geojson Feature or Geometry of a specified distance along a Rhumb Line
 * on the provided direction angle.
 *
 * @name transformTranslate
 * @param {GeoJSON} geojson object to be translated
 * @param {number} distance length of the motion; negative values determine motion in opposite direction
 * @param {number} direction of the motion; angle from North in decimal degrees, positive clockwise
 * @param {string} [units=kilometers] in which `distance` will be express; miles, kilometers, degrees, or radians
 * @param {number} [zTranslation=0] length of the vertical motion, same unit of distance
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} the translated GeoJSON object
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var translatedPoly = turf.transformTranslate(poly, 100, 35);
 *
 * //addToMap
 * var addToMap = [poly, translatedPoly];
 * translatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
module.exports = function (geojson, distance, direction, units, zTranslation, mutate) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    if (zTranslation && typeof zTranslation !== 'number' && isNaN(zTranslation)) throw new Error('zTranslation is not a number');

    // Shortcut no-motion
    zTranslation = (zTranslation !== undefined) ? zTranslation : 0;
    if (distance === 0 && zTranslation === 0) return geojson;

    if (direction === undefined || direction === null || isNaN(direction)) throw new Error('direction is required');

    // Invert with negative distances
    if (distance < 0) {
        distance = -distance;
        direction = -direction;
    }

    // Clone geojson to avoid side effects
    if (mutate === false || mutate === undefined) geojson = JSON.parse(JSON.stringify(geojson));

    // Translate each coordinate
    coordEach(geojson, function (pointCoords) {
        var newCoords = getCoords(rhumbDestination(pointCoords, distance, direction, units));
        pointCoords[0] = newCoords[0];
        pointCoords[1] = newCoords[1];
        if (zTranslation && pointCoords.length === 3) pointCoords[2] += zTranslation;
    });
    return geojson;
};
