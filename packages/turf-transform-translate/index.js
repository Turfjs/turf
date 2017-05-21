var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var meta = require('@turf/meta');
var coordEach = meta.coordEach;
var point = helpers.point;
var multiPoint = helpers.multiPoint;
var lineString = helpers.lineString;
var multiLineString = helpers.multiLineString;
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var featureCollection = helpers.featureCollection;
var getCoords = invariant.getCoords;
// var collectionOf = invariant.collectionOf;
var rhumbDestination = require('@turf/rhumb-destination');
var dist = require('@turf/distance');
var rhumbDistance = require('@turf/rhumb-distance');

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


    var motionVector = getCoords(rhumbDestination([0, 0], distance, direction, units));
    var motionV = rhumbDestination([0, 0], distance, direction, units);
    var d = dist([0, 0], motionV, units);
    var rd = rhumbDistance([0, 0], motionV, units);

    motionVector.push(zTranslation || 0);

    var translationMatrix = [
        [1, 0, 0, motionVector[0]],
        [0, 1, 0, motionVector[1]],
        [0, 0, 1, motionVector[2]],
        [0, 0, 0, 1]
    ];

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
        d = dist(getCoords(geojson), translatedCoords[0], units);
        rd = rhumbDistance(getCoords(geojson), translatedCoords[0], units);
        return point(translatedCoords[0], properties);
    // case 'MultiPoint':
    //     return lineOffset(geojson, distance, units);
    // case 'LineString':
    //     return lineOffset(geojson, distance, units);
    // case 'MultiLineString':
    //     return lineOffset(geojson, distance, units);
    case 'Polygon':
        translatedCoords.push(translatedCoords[0]);
        return polygon([translatedCoords], properties);
    // case 'MultiPolygon':
    //     return lineOffset(geojson, distance, units);
    // default:
    //     throw new Error('geometry ' + type + ' is not supported');
    }

    // return featureCollection(multipolygons);
};

/**
 * Returns the product of the two matrices; supports vectors as well.
 * original: http://jsfiddle.net/FloydPink/babopxq8/
 *
 * @private
 * @param {Array<Array>} a matrix1
 * @param {Array<Array>} b matrix2
 * @returns {Array<Array>} product
 */
function multiplyMatrices(a, b) {
    if (!a || !b) {
        throw new Error('both matrices are required');
    }
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
    }

    var aRows = a.length,
        aCols = a[0].length,
        bRows = b.length,
        bCols = b[0].length;

    if (bRows !== aCols) {
        throw new Error('columns in first matrix mismatch rows in second one');
    }

    var product = [];
    for (var i = 0; i < aRows; i++) {
        product[i] = [];
        for (var j = 0; j < bCols; j++) {
            for (var k = 0; k < aCols; k++) {
                if (product[i][j] === undefined) {
                    product[i][j] = 0;
                }
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}
