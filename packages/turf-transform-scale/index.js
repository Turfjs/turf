var meta = require('@turf/meta');
var center = require('@turf/center');
var helpers = require('@turf/helpers');
var centroid = require('@turf/centroid');
var turfBBox = require('@turf/bbox');
var invariant = require('@turf/invariant');
var rhumbBearing = require('@turf/rhumb-bearing');
var rhumbDistance = require('@turf/rhumb-distance');
var rhumbDestination = require('@turf/rhumb-destination');
var point = helpers.point;
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var getCoord = invariant.getCoord;
var getCoords = invariant.getCoords;


/**
 * Scale a GeoJSON from a given point by a factor of scaling (ex: factor=2 would make the GeoJSON 200% larger).
 * If a FeatureCollection is provided, the origin point will be calculated based on each individual Feature.
 *
 * @name transformScale
 * @param {GeoJSON} geojson GeoJSON to be scaled
 * @param {number} factor of scaling, positive or negative values greater than 0
 * @param {string|Geometry|Feature<Point>|Array<number>} [origin="centroid"] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} scaled GeoJSON
 * @example
 * var poly = turf.polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
 * var scaledPoly = turf.transformScale(poly, 3);
 *
 * //addToMap
 * var addToMap = [poly, scaledPoly];
 * scaledPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 */
module.exports = function (geojson, factor, origin, mutate) {
    // Input validation
    if (!geojson) throw new Error('geojson required');
    if (typeof factor !== 'number' || factor === 0) throw new Error('invalid factor');
    var originIsPoint = Array.isArray(origin) || typeof origin === 'object';

    // Clone geojson to avoid side effects
    if (mutate !== true) geojson = JSON.parse(JSON.stringify(geojson));

    // Scale each Feature separately
    if (geojson.type === 'FeatureCollection' && !originIsPoint) {
        featureEach(geojson, function (feature, index) {
            geojson.features[index] = scale(feature, factor, origin);
        });
        return geojson;
    }
    // Scale Feature/Geometry
    return scale(geojson, factor, origin);
};

/**
 * Scale Feature/Geometry
 *
 * @private
 * @param {Feature|Geometry} geojson GeoJSON Feature/Geometry
 * @param {number} factor of scaling, positive or negative values greater than 0
 * @param {string|Geometry|Feature<Point>|Array<number>} [origin="centroid"] Point from which the scaling will occur (string options: sw/se/nw/ne/center/centroid)
 * @returns {Feature|Geometry} scaled GeoJSON Feature/Geometry
 */
function scale(geojson, factor, origin) {
    // Default params
    var isPoint = (geojson.type === 'Point' || geojson.geometry && geojson.geometry.type === 'Point');
    origin = defineOrigin(geojson, origin);

    // Shortcut no-scaling
    if (factor === 1 || isPoint) return geojson;

    // Scale each coordinate
    coordEach(geojson, function (coord) {
        var originalDistance = rhumbDistance(origin, coord);
        var bearing = rhumbBearing(origin, coord);
        var newDistance = originalDistance * factor;
        var newCoord = getCoords(rhumbDestination(origin, newDistance, bearing));
        coord[0] = newCoord[0];
        coord[1] = newCoord[1];
        if (coord.length === 3) coord[2] *= factor;
    });

    return geojson;
}

/**
 * Define Origin
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON
 * @param {string|Geometry|Feature<Point>|Array<number>} origin sw/se/nw/ne/center/centroid
 * @returns {Feature<Point>} Point origin
 */
function defineOrigin(geojson, origin) {
    // Default params
    if (origin === undefined || origin === null) origin = 'centroid';

    // Input Geometry|Feature<Point>|Array<number>
    if (Array.isArray(origin) || typeof origin === 'object') return getCoord(origin);

    // Define BBox
    var bbox = (geojson.bbox) ? geojson.bbox : turfBBox(geojson);
    var west = bbox[0];
    var south = bbox[1];
    var east = bbox[2];
    var north = bbox[3];

    switch (origin) {
    case 'sw':
    case 'southwest':
    case 'westsouth':
    case 'bottomleft':
        return point([west, south]);
    case 'se':
    case 'southeast':
    case 'eastsouth':
    case 'bottomright':
        return point([east, south]);
    case 'nw':
    case 'northwest':
    case 'westnorth':
    case 'topleft':
        return point([west, north]);
    case 'ne':
    case 'northeast':
    case 'eastnorth':
    case 'topright':
        return point([east, north]);
    case 'center':
        return center(geojson);
    case undefined:
    case null:
    case 'centroid':
        return centroid(geojson);
    default:
        throw new Error('invalid origin');
    }
}
