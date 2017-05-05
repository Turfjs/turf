var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var turfPoint = helpers.point;
var turfFc = helpers.featureCollection;

/**
 * Finds the tangents of a {@link Polygon|(Multi)Polygon} from a {@link Point}.
 *
 * @name polygonTangents
 * @param {Feature<Point>} point to calculate the tangent points from
 * @param {Feature<Polygon|MultiPolygon>} polygon to get tangents from
 * @returns {FeatureCollection<Point>} Feature Collection containing the two tangent points
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]
 *   }
 * }
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [61, 5]
 *   }
 * }
 * var tangents = turf.polygonTangents(point, poly)
 * //addToMap
 * var addToMap = [tangents];
 */

module.exports = function (point, polygon) {
    var eprev;
    var enext;
    var pointCoords = getCoords(point);
    var polyCoords = getCoords(polygon);
    var rtan = polyCoords[0][0].slice(0, 2);
    var ltan = polyCoords[0][0].slice(0, 2);
    var geomType = (polygon.geometry) ? polygon.geometry.type : polygon.type;

    if (geomType === 'Polygon') {
        eprev = isLeft(polyCoords[0][0], polyCoords[0][1], pointCoords);
        var out = processPolygon(polyCoords[0], pointCoords, eprev, enext, rtan, ltan);
        rtan = out[0];
        ltan = out[1];
    }
    if (geomType === 'MultiPolygon') {
        eprev = isLeft(polyCoords[0][0][0], polyCoords[0][0][1], pointCoords);
        rtan = polyCoords[0][0][0].slice(0, 1);
        ltan = polyCoords[0][0][0].slice(0, 1);
        polyCoords.forEach(function (singlePoly) {
            var out = processPolygon(singlePoly[0], pointCoords, eprev, enext, rtan, ltan);
            rtan = out[0];
            ltan = out[1];
        });
    }
    return turfFc([turfPoint(rtan), turfPoint(ltan)]);
};

function processPolygon(polygonCoords, point, eprev, enext, rtan, ltan) {
    for (var i = 0; i < polygonCoords.length; i++) {
        var currentCoords = polygonCoords[i];
        var nextCoordPair = polygonCoords[i + 1];
        if (i === polygonCoords.length - 1) {
            nextCoordPair = polygonCoords[0];
        }
        enext = isLeft(currentCoords, nextCoordPair, point);
        if (eprev <= 0 && enext > 0) {
            if (!isBelow(point, currentCoords, rtan)) {
                rtan = polygonCoords[i].slice(0, 2);
            }
        }
        if (eprev > 0 && enext <= 0) {
            if (!isAbove(point, currentCoords, ltan)) {
                ltan = polygonCoords[i].slice(0, 2);
            }
        }
        eprev = enext;
    }
    return [rtan, ltan];
}

function isAbove(point1, point2, point3) {
    return isLeft(point1, point2, point3) >= 0;
}

function isBelow(point1, point2, point3) {
    return isLeft(point1, point2, point3) <= 0;
}

function isLeft(point1, point2, point3) {
    return (point2[0] - point1[0]) * (point3[1] - point1[1]) - (point3[0] - point1[0]) * (point2[1] - point1[1]);
}
