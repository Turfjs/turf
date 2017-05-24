var helpers = require('@turf/helpers');
var point = helpers.point;
var multiPoint = helpers.multiPoint;
var lineString = helpers.lineString;
var multiLineString = helpers.multiLineString;
var polygon = helpers.polygon;
var multiPolygon = helpers.multiPolygon;
var feature = helpers.feature;
var invariant = require('@turf/invariant');
var getCoords = invariant.getCoords;
var centroid = require('@turf/centroid');
var rhumbBearing = require('@turf/rhumb-bearing');
var rhumbDestination = require('@turf/rhumb-destination');
var rhumbDistance = require('@turf/rhumb-distance');

/**
 * Rotates any geojson Feature or Geometry of a specified angle, around its `centroid` or a given `pivot` point;
 * all rotations follow the right-hand rule: https://en.wikipedia.org/wiki/Right-hand_rule
 *
 * @name rotate
 * @param {Geometry|Feature<any>} geojson object to be rotated
 * @param {number} angle of rotation (along the vertical axis), from North in decimal degrees, negative clockwise
 * @param {Geometry|Feature<Point>|Array<number>} [pivot=`centroid`] point around which the rotation will be performed
 * @param {number} [xRotation=0] angle of rotation, respect to the horizontal (x,y) plain, about the x axis;
 * @param {number} [yRotation=0] angle of rotation, respect to the horizontal (x,y) plain, about the y axis;
 * @returns {Feature<any>} the rotated GeoJSON feature
 * @example
 * var poly = turf.polygon([[0,29],[3.5,29],[2.5,32],[0,29]]);
 * var rotatedPoly = turf.rotate(poly, 100, 35);
 *
 * //addToMap
 * var addToMap = [rotatedPoly];
 */
module.exports = function (geojson, angle, pivot, xRotation, yRotation) {
    // Input validation
    if (!geojson) throw new Error('geojson is required');
    if (angle === undefined || angle === null || isNaN(angle)) throw new Error('angle is required');
    if (pivot && !Array.isArray(pivot) && pivot.geometry.type !== 'Point' && pivot.type !== 'Point') throw new Error('invalid pivot');
    // if (yRotation && typeof yRotation !== 'number' && isNaN(yRotation)) throw new Error('yRotation is not a number');
    // if (xRotation && typeof xRotation !== 'number' && isNaN(xRotation)) throw new Error('xRotation is not a number');

    if (geojson.type !== 'Feature') geojson = feature(geojson);

    // shortcut no-rotation
    if (angle === 0 && yRotation === 0) return geojson;

    if (!pivot) {
        pivot = centroid(geojson);
    } else if (Array.isArray(pivot)) {
        pivot = point(pivot);
    }

    // copy properties to avoid reference issues
    var properties = {};
    Object.keys(geojson.properties).forEach(function (key) {
        properties[key] = geojson.properties[key];
    });

    var rotatedCoords;

    var type = geojson.geometry.type;
    switch (type) {
    case 'Point':
        if (!pivot) return geojson;
        rotatedCoords = rotate([getCoords(geojson)], angle, pivot);
        return point(rotatedCoords[0], properties);
    case 'MultiPoint':
        rotatedCoords = rotate(getCoords(geojson), angle, pivot);
        return multiPoint(rotatedCoords, properties);
    case 'LineString':
        rotatedCoords = rotate(getCoords(geojson), angle, pivot);
        return lineString(rotatedCoords, properties);
    case 'MultiLineString':
        rotatedCoords = getCoords(geojson).map(function (lineCoords) {
            return rotate(lineCoords, angle, pivot);
        });
        return multiLineString(rotatedCoords, properties);
    case 'Polygon':
        rotatedCoords = getCoords(geojson).map(function (ringCoords) {
            return rotate(ringCoords, angle, pivot);
        });
        return polygon(rotatedCoords, properties);
    case 'MultiPolygon':
        rotatedCoords = getCoords(geojson).map(function (polyCoords) {
            return polyCoords.map(function (ringCoords) {
                return rotate(ringCoords, angle, pivot);
            });
        });
        return multiPolygon(rotatedCoords, properties);
    default:
        throw new Error('geometry ' + type + ' is not supported');
    }
};

/**
 * Perform rotation to each coordinate of the input array using Rhumb modules
 *
 * @private
 * @param {Array<Array<number>>} featureCoords coordinates of the points of a feature
 * @param {number} rotationAngle of rotation on the plain
 * @param {Feature<Point>} pivot defining the origin of the rotation
 * @returns {Array<Array<number>>} rotated coordinates
 */
function rotate(featureCoords, rotationAngle, pivot) {
    return featureCoords.map(function (pointCoords) {
        var initialAngle = rhumbBearing(pivot, pointCoords);
        var finalAngle = initialAngle + rotationAngle;
        var distance = rhumbDistance(pivot, pointCoords);

        var rotatedCoords = getCoords(rhumbDestination(pivot, distance, finalAngle));
        return rotatedCoords;
    });
}

