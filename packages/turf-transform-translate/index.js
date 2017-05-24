var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var rhumbDestination = require('@turf/rhumb-destination');
var point = helpers.point;
var feature = helpers.feature;
var polygon = helpers.polygon;
var multiPoint = helpers.multiPoint;
var lineString = helpers.lineString;
var multiPolygon = helpers.multiPolygon;
var multiLineString = helpers.multiLineString;
var getCoords = invariant.getCoords;

/**
 * Moves any geojson Feature or Geometry of a specified distance on the provided direction angle.
 *
 * @name translate
 * @param {Geometry|Feature<any>} geojson object to be translated
 * @param {number} distance length of the motion; negative values determine motion in opposite direction
 * @param {number} direction of the motion; angle from North between -180 and 180 decimal degrees, positive clockwise
 * @param {string} [units=kilometers] in which `distance` will be express; miles, kilometers, degrees, or radians
 * @param {number} [zTranslation=0] length of the vertical motion, same unit of distance
 * @returns {Feature<any>} the translated GeoJSON feature
 * @example
 * var poly = turf.polygon([[0,29],[3.5,29],[2.5,32],[0,29]]);
 * var translatedPoly = turf.translate(poly, 100, 35);
 *
 * //addToMap
 * translatedPoly.properties = {stroke: '#F00', 'stroke-width': 4};
 * var addToMap = [poly, translatedPoly];
 */
module.exports = function (geojson, distance, direction, units, zTranslation) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    if (zTranslation && typeof zTranslation !== 'number' && isNaN(zTranslation)) throw new Error('zTranslation is not a number');

    // shortcut no-motion
    if (distance === 0 && zTranslation === 0) return (geojson.type === 'Feature') ? geojson : feature(geojson);

    if (direction === undefined || direction === null || isNaN(direction)) throw new Error('direction is required');

    if (distance < 0) {
        distance = -distance;
        direction = -direction;
    }

    // copy properties to avoid reference issues
    var properties = {};
    Object.keys(geojson.properties).forEach(function (key) {
        properties[key] = geojson.properties[key];
    });

    var motionVector = getCoords(rhumbDestination([0, 0], distance, direction, units));
    // probes
    // var motionV = rhumbDestination([0, 0], distance, direction, units);
    // var d = dist([0, 0], motionV, units);
    // var rd = rhumbDistance([0, 0], motionV, units);

    motionVector.push(zTranslation || 0);

    var translationMatrix = [
        [1, 0, 0, motionVector[0]],
        [0, 1, 0, motionVector[1]],
        [0, 0, 1, motionVector[2]],
        [0, 0, 0, 1]
    ];

    var translatedCoords;

    var type = (geojson.type === 'Feature') ? geojson.geometry.type : geojson.type;
    switch (type) {
    case 'Point':
        translatedCoords = translate([getCoords(geojson)], translationMatrix, zTranslation);
        // probes
        // d = dist(getCoords(geojson), translatedCoords[0], units);
        // rd = rhumbDistance(getCoords(geojson), translatedCoords[0], units);
        return point(translatedCoords[0], properties);
    case 'MultiPoint':
        translatedCoords = translate(getCoords(geojson), translationMatrix, zTranslation);
        return multiPoint(translatedCoords, properties);
    case 'LineString':
        translatedCoords = translate(getCoords(geojson), translationMatrix, zTranslation);
        return lineString(translatedCoords, properties);
    case 'MultiLineString':
        translatedCoords = getCoords(geojson).map(function (lineCoords) {
            return translate(lineCoords, translationMatrix, zTranslation);
        });
        return multiLineString(translatedCoords, properties);
    case 'Polygon':
        translatedCoords = getCoords(geojson).map(function (ringCoords) {
            return translate(ringCoords, translationMatrix, zTranslation);
        });
        return polygon(translatedCoords, properties);
    case 'MultiPolygon':
        translatedCoords = getCoords(geojson).map(function (polyCoords) {
            return polyCoords.map(function (ringCoords) {
                return translate(ringCoords, translationMatrix, zTranslation);
            });
        });
        return multiPolygon(translatedCoords, properties);
    default:
        throw new Error('geometry ' + type + ' is not supported');
    }
};

/**
 * Applies translation matrix to each coordinate of the input array
 *
 * @private
 * @param {Array<Array<number>>} featureCoords coordinates of the points of a feature
 * @param {Array<Array<number>>} translationMatrix defining the motion for each point
 * @param {number} [zTranslation=0] length of the vertical motion
 * @returns {Array<Array<number>>} translated coordinates
 */
function translate(featureCoords, translationMatrix, zTranslation) {
    return featureCoords.map(function (pointCoords) {
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
        var translatedCoords = [].concat.apply([], resultVector); // flatten translated vector
        return translatedCoords;
    });
}

/**
 * Returns the product of the two matrices; supports vectors as well.
 * from: http://jsfiddle.net/FloydPink/babopxq8/
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
