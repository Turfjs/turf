var bbox = require('@turf/bbox');
var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var centroid = require('@turf/centroid');
var invariant = require('@turf/invariant');
var rhumbBearing = require('@turf/rhumb-bearing');
var rhumbDistance = require('@turf/rhumb-distance');
var rhumbDestination = require('@turf/rhumb-destination');
var point = helpers.point;
var coordEach = meta.coordEach;
var getCoords = invariant.getCoords;


/**
 * Moves any geojson Feature or Geometry of a specified distance along a Rhumb Line
 * on the provided direction angle.
 *
 * @name scale
 * @param {GeoJSON} geojson object to be scaled
 * @param {number} factor of scaling, positive values greater than 0
 * @param {boolean} [fromCenter=true] point from which the scaling will occur; it will default to the most
 * south-west point of a `bbox` containing the geojson, if true the scaling will origin from the `centroid` of the geojson
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} the scaled GeoJSON object
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var scaledPoly = turf.scale(poly, 3);
 *
 * //addToMap
 * scaledPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 * var addToMap = [poly, scaledPoly];
 */
module.exports = function (geojson, factor, fromCenter, mutate) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (typeof factor !== 'number' && factor === 0) throw new Error('invalid factor');
    if (!factor) throw new Error('factor is required');

    // Default params
    var isMutate = mutate === false || mutate === undefined;
    var isCenter = fromCenter === true || fromCenter === undefined;
    var origin;

    // Shortcut no-scaling
    if (factor === 1) return geojson;

    // Define origin
    if (isCenter) origin = centroid(geojson);
    else {
        var box = (geojson.bbox) ? geojson.bbox : bbox(geojson); // [ west, south, east, north ]
        origin = point([box[0], box[1]]);
    }

    // Clone geojson to avoid side effects
    if (isMutate) geojson = JSON.parse(JSON.stringify(geojson));

    // Scale each coordinate
    coordEach(geojson, function (coord) {
        var originalDistance = rhumbDistance(origin, coord);
        var bearing = rhumbBearing(origin, coord);
        var newDistance = originalDistance * factor;
        var newCoord = getCoords(rhumbDestination(coord, newDistance, bearing));
        coord[0] = newCoord[0];
        coord[1] = newCoord[1];
        if (coord.length === 3) coord[2] *= factor;
    });

    return geojson;
};
