var simplifyJS = require('simplify-js');
var cleanCoords = require('@turf/clean-coords');
var geomEach = require('@turf/meta').geomEach;
var clone = require('@turf/clone');

/**
 * Takes a {@link GeoJSON} object and returns a simplified version. Internally uses
 * [simplify-js](http://mourner.github.io/simplify-js/) to perform simplification.
 *
 * @name simplify
 * @param {GeoJSON} geojson object to be simplified
 * @param {number} [tolerance=1] simplification tolerance
 * @param {boolean} [highQuality=false] whether or not to spend more time to create a higher-quality simplification with a different algorithm
 * @param {boolean} [mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {GeoJSON} a simplified GeoJSON
 * @example
 * var geojson = turf.polygon([[
 *   [-70.603637, -33.399918],
 *   [-70.614624, -33.395332],
 *   [-70.639343, -33.392466],
 *   [-70.659942, -33.394759],
 *   [-70.683975, -33.404504],
 *   [-70.697021, -33.419406],
 *   [-70.701141, -33.434306],
 *   [-70.700454, -33.446339],
 *   [-70.694274, -33.458369],
 *   [-70.682601, -33.465816],
 *   [-70.668869, -33.472117],
 *   [-70.646209, -33.473835],
 *   [-70.624923, -33.472117],
 *   [-70.609817, -33.468107],
 *   [-70.595397, -33.458369],
 *   [-70.587158, -33.442901],
 *   [-70.587158, -33.426283],
 *   [-70.590591, -33.414248],
 *   [-70.594711, -33.406224],
 *   [-70.603637, -33.399918]
 * ]]);
 * var tolerance = 0.01;
 *
 * var simplified = turf.simplify(geojson, tolerance, false);
 *
 * //addToMap
 * var addToMap = [geojson, simplified]
 */
module.exports = function (geojson, tolerance, highQuality, mutate) {
    if (!geojson) throw new Error('geojson is required');
    if (tolerance && tolerance < 0) throw new Error('invalid tolerance');

    // Clone geojson to avoid side effects
    if (mutate !== true) geojson = clone(geojson);

    geomEach(geojson, function (geom) {
        simplify(geom, tolerance, highQuality);
    });
    return geojson;
};

/**
 * Simplifies a feature's coordinates
 *
 * @private
 * @param {Geometry} geometry to be simplified
 * @param {number} [tolerance=1] simplification tolerance
 * @param {boolean} [highQuality=false] whether or not to spend more time to create a higher-quality simplification with a different algorithm
 * @returns {Geometry} output
 */
function simplify(geometry, tolerance, highQuality) {
    var type = geometry.type;

    // "unsimplyfiable" geometry types
    if (type === 'Point' || type === 'MultiPoint') return geometry;

    // Remove any extra coordinates
    cleanCoords(geometry, true);

    var coordinates = geometry.coordinates;
    switch (type) {
    case 'LineString':
        geometry['coordinates'] = simplifyLine(coordinates, tolerance, highQuality);
        break;
    case 'MultiLineString':
        geometry['coordinates'] = coordinates.map(function (lines) {
            return simplifyLine(lines, tolerance, highQuality);
        });
        break;
    case 'Polygon':
        geometry['coordinates'] = simplifyPolygon(coordinates, tolerance, highQuality);
        break;
    case 'MultiPolygon':
        geometry['coordinates'] = coordinates.map(function (rings) {
            return simplifyPolygon(rings, tolerance, highQuality);
        });
    }
    return geometry;
}


/**
 * Simplifies the coordinates of a LineString with simplify-js
 *
 * @private
 * @param {Array<number>} coordinates to be processed
 * @param {number} tolerance simplification tolerance
 * @param {boolean} highQuality whether or not to spend more time to create a higher-quality
 * @returns {Array<Array<number>>} simplified coords
 */
function simplifyLine(coordinates, tolerance, highQuality) {
    return simplifyJS(coordinates.map(function (coord) {
        return {x: coord[0], y: coord[1], z: coord[2]};
    }), tolerance, highQuality).map(function (coords) {
        return (coords.z) ? [coords.x, coords.y, coords.z] : [coords.x, coords.y];
    });
}


/**
 * Simplifies the coordinates of a Polygon with simplify-js
 *
 * @private
 * @param {Array<number>} coordinates to be processed
 * @param {number} tolerance simplification tolerance
 * @param {boolean} highQuality whether or not to spend more time to create a higher-quality
 * @returns {Array<Array<Array<number>>>} simplified coords
 */
function simplifyPolygon(coordinates, tolerance, highQuality) {
    return coordinates.map(function (ring) {
        var pts = ring.map(function (coord) {
            return {x: coord[0], y: coord[1]};
        });
        if (pts.length < 4) {
            throw new Error('invalid polygon');
        }
        var simpleRing = simplifyJS(pts, tolerance, highQuality).map(function (coords) {
            return [coords.x, coords.y];
        });
        //remove 1 percent of tolerance until enough points to make a triangle
        while (!checkValidity(simpleRing)) {
            tolerance -= tolerance * 0.01;
            simpleRing = simplifyJS(pts, tolerance, highQuality).map(function (coords) {
                return [coords.x, coords.y];
            });
        }
        if (
            (simpleRing[simpleRing.length - 1][0] !== simpleRing[0][0]) ||
            (simpleRing[simpleRing.length - 1][1] !== simpleRing[0][1])) {
            simpleRing.push(simpleRing[0]);
        }
        return simpleRing;
    });
}


/**
 * Returns true if ring has at least 3 coordinates and its first coordinate is the same as its last
 *
 * @private
 * @param {Array<number>} ring coordinates to be checked
 * @returns {boolean} true if valid
 */
function checkValidity(ring) {
    if (ring.length < 3) return false;
    //if the last point is the same as the first, it's not a triangle
    return !(ring.length === 3 && ((ring[2][0] === ring[0][0]) && (ring[2][1] === ring[0][1])));
}
