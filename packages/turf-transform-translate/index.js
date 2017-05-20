var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var meta = require('@turf/meta');
var coordEach = meta.coordEach;
var point = helpers.point;
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var featureCollection = helpers.featureCollection;
var getCoords = invariant.getCoords;
var collectionOf = invariant.collectionOf;
var destination = require('@turf/rhumb-destination');
var matrix = require('matrix-js');

/**
 * Moves any geojson Feature or Geometry of a specified distance on the provided direction angle.
 *
 * @name translate
 * @param {Geometry|Feature<any>} geojson object to be translated
 * @param {number} distance length of the motion; negative values determine motion in opposite direction
 * @param {number} direction of the motion; angle from North in decimal degrees, positive clockwise
 * @param {string} [units=kilometers] in which `distance` will be express; miles, kilometers, degrees, or radians
 *     (optional, default `kilometers`)
 * @param {number} [zTranslation=0] length of the vertical motion, same unit of distance
 * @returns {FeatureCollection<MultiPolygon>} a FeatureCollection of {@link MultiPolygon} features representing
 *     isobands
 * @example
 * var poly = turf.polygon([[0,29],[3.5,29],[2.5,32],[0,29]]);
 * var translatedPoly = turf.translate(poly, 100, 35);
 *
 * //addToMap
 * var addToMap = [translatedPoly];
 */
module.exports = function (geojson, distance, direction, units, zTranslation) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    if (direction === undefined || direction === null || isNaN(direction)) throw new Error('direction is required');
    var type = (geojson.type === 'Feature') ? geojson.geometry.type : geojson.type;

    // copy properties to avoid reference issues
    var properties = {};
    Object.keys(geojson.properties).forEach(function (key) {
        properties[key] = geojson.properties[key];
    });

    var motionVector = getCoords(destination(point([0, 0]), distance, direction, units));
    motionVector.push(zTranslation || 0);

    var translationMatrix = [
        [1, 0, 0, motionVector[0]],
        [0, 1, 0, motionVector[1]],
        [0, 0, 1, motionVector[2]],
        [0, 0, 0, 1]
    ];

    // var a = [
    //     [1, 2, 3],
    //     [4, 5, 6]
    // ];
    // var b = [
    //     [7, 8],
    //     [9, 10],
    //     [11, 12]
    // ];
    // var B = matrix(b);
    // var A = matrix(a);
    // var P = multiplyMatrices(a, b);
    // = [[58, 64], [139, 154]]

    var translatedCoords = [];
    coordEach(geojson, function (pointCoords) {
        var coordsVector = [
            [pointCoords[0]],
            [pointCoords[1]],
            [pointCoords[2] || 0],
            [1]
        ];
        var resultVector = multiplyMatrices(translationMatrix, coordsVector);
        resultVector.pop(); // remove last element
        if (!zTranslation) {
            resultVector.pop(); // remove z value
        }
        var coords = [].concat.apply([], resultVector); // flatten vector
        translatedCoords.push(coords);
    });

    switch (type) {
    case 'Point':
        return point(translatedCoords[0], properties);
    // case 'MultiPoint':
    //     return lineOffset(geojson, distance, units);
    // case 'LineString':
    //     return lineOffset(geojson, distance, units);
    // case 'MultiLineString':
    //     return lineOffset(geojson, distance, units);
    // case 'Polygon':
    //     return lineOffset(geojson, distance, units);
    // case 'MultiPolygon':
    //     return lineOffset(geojson, distance, units);
    // default:
    //     throw new Error('geometry ' + type + ' is not supported');
    }

    // return featureCollection(multipolygons);
};

/**
 *
 * from: http://jsfiddle.net/FloydPink/babopxq8/
 * @param a
 * @param b
 * @return {Array}
 */
function multiplyMatrices(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
    }

    var x = a.length,
        z = a[0].length,
        y = b[0].length;

    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }

    var productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    var product = new Array(x);
    for (var p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }

    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            for (var k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return product;
}
