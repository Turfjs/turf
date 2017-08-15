var simplify = require('simplify-js');
var helpers = require('@turf/helpers');
var cleanCoords = require('@turf/clean-coords');
var feature = helpers.feature;

/**
 * Takes a {@link GeoJSON} object and returns a simplified version. Internally uses
 * [simplify-js](http://mourner.github.io/simplify-js/) to perform simplification.
 *
 * @name simplify
 * @param {GeoJSON} geojson object to be simplified
 * @param {number} [tolerance=1] simplification tolerance
 * @param {boolean} [highQuality=false] whether or not to spend more time to create a higher-quality simplification with a different algorithm
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
module.exports = function (geojson, tolerance, highQuality) {
    if (!geojson) throw new Error('geojson is required');
    if (tolerance && tolerance < 0) throw new Error('invalid tolerance');

    var output;

    switch (geojson.type) {
    case 'Feature':
        return feature(simplifyHelper(cleanCoords(geojson), tolerance, highQuality), geojson.properties);
    case 'FeatureCollection':
        output = {
            type: 'FeatureCollection',
            features: geojson.features.map(function (f) {
                return feature(simplifyHelper(cleanCoords(f), tolerance, highQuality), f.properties);
            })
        };
        if (geojson.properties) output.properties = geojson.properties;
        return output;
    case 'GeometryCollection':
        output = {
            type: 'GeometryCollection',
            geometries: geojson.geometries.map(function (g) {
                return simplifyHelper({
                    type: 'Feature',
                    geometry: cleanCoords(g)
                }, tolerance, highQuality);
            })
        };
        if (geojson.properties) output.properties = geojson.properties;
        return output;
    default:
        return geojson;
    }
};

/**
 * Simplifies a feature's coordinates
 *
 * @private
 * @param {Feature} feature to be simplified
 * @param {number} [tolerance=1] simplification tolerance
 * @param {boolean} [highQuality=false] whether or not to spend more time to create a higher-quality simplification with a different algorithm
 * @returns {Geometry} output
 */
function simplifyHelper(feature, tolerance, highQuality) {
    var type = feature.geometry.type;
    // "unsimplyfiable" geometry types
    if (type === 'Point' || type === 'MultiPoint') return feature.geometry;

    var coordinates = feature.geometry.coordinates;
    var simplified;
    switch (type) {
    case 'LineString':
        simplified = simplifyLine(coordinates, tolerance, highQuality);
        break;
    case 'MultiLineString':
        simplified = coordinates.map(function (lines) {
            return simplifyLine(lines, tolerance, highQuality);
        });
        break;
    case 'Polygon':
        simplified = simplifyPolygon(coordinates, tolerance, highQuality);
        break;
    case 'MultiPolygon':
        simplified = coordinates.map(function (rings) {
            return simplifyPolygon(rings, tolerance, highQuality);
        });
    }

    return {
        type: type,
        coordinates: simplified
    };
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
    return simplify(coordinates.map(function (coord) {
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
        var simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
            return [coords.x, coords.y];
        });
        //remove 1 percent of tolerance until enough points to make a triangle
        while (!checkValidity(simpleRing)) {
            tolerance -= tolerance * 0.01;
            simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
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
