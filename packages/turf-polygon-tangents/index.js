var getCoords = require('@turf/invariant').getCoords;
var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;

/**
 * Finds the tangents of a {@link Polygon|(Multi)Polygon} from a {@link Point}.
 *
 * @name polygonTangents
 * @param {Feature<Point>} point to calculate the tangent points from
 * @param {Feature<Polygon|MultiPolygon>} polygon to get tangents from
 * @returns {FeatureCollection<Point>} Feature Collection containing the two tangent points
 * @example
 * var polygon = turf.polygon([[[11, 0], [22, 4], [31, 0], [31, 11], [21, 15], [11, 11], [11, 0]]]);
 * var point = turf.point([61, 5]);
 *
 * var tangents = turf.polygonTangents(point, polygon)
 *
 * //addToMap
 * var addToMap = [tangents, point, polygon];
 */
module.exports = function (point, polygon) {
    var eprev;
    var enext;
    var rtan;
    var ltan;
    var pointCoords = getCoords(point);
    var polyCoords = getCoords(polygon);

    var type = getGeomType(polygon);
    switch (type) {
    case 'Polygon':
        rtan = 0;
        ltan = 0;
        eprev = isLeft(polyCoords[0][0], polyCoords[0][1], pointCoords);
        var out = processPolygon(polyCoords[0], pointCoords, eprev, enext, rtan, ltan);
        rtan = out[0];
        ltan = out[1];
        break;
    case 'MultiPolygon':
        rtan = 0;
        ltan = 0;
        eprev = isLeft(polyCoords[0][0][0], polyCoords[0][0][1], pointCoords);
        polyCoords.forEach(function (ring) {
            var out = processPolygon(ring[0], pointCoords, eprev, enext, rtan, ltan);
            rtan = out[0];
            ltan = out[1];
        });
        break;
    }
    return featureCollection([helpers.point(rtan), helpers.point(ltan)]);
};

function processPolygon(polygonCoords, ptCoords, eprev, enext, rtan, ltan) {
    for (var i = 0; i < polygonCoords.length; i++) {
        var currentCoords = polygonCoords[i];
        var nextCoordPair = polygonCoords[i + 1];
        if (i === polygonCoords.length - 1) {
            nextCoordPair = polygonCoords[0];
        }
        enext = isLeft(currentCoords, nextCoordPair, ptCoords);
        if (eprev <= 0 && enext > 0) {
            if (!isBelow(ptCoords, currentCoords, rtan)) {
                rtan = currentCoords;
            }
        }
        if (eprev > 0 && enext <= 0) {
            if (!isAbove(ptCoords, currentCoords, ltan)) {
                ltan = currentCoords;
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

// will be included in @turf/invariant
function getGeomType(geojson) {
    return (geojson.geometry) ? geojson.geometry.type : geojson.type;
}
