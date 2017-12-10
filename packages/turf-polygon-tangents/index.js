import { getCoords, getType } from '@turf/invariant';
import { point, featureCollection } from '@turf/helpers';

/**
 * Finds the tangents of a {@link Polygon|(Multi)Polygon} from a {@link Point}.
 *
 * @name polygonTangents
 * @param {Coord} pt to calculate the tangent points from
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
function polygonTangents(pt, polygon) {
    var pointCoords = getCoords(pt);
    var polyCoords = getCoords(polygon);

    var rtan;
    var ltan;
    var enext;
    var eprev;

    var type = getType(polygon);
    switch (type) {
    case 'Polygon':
        rtan = polyCoords[0][0];
        ltan = polyCoords[0][0];
        eprev = isLeft(polyCoords[0][0], polyCoords[0][polyCoords[0].length - 1], pointCoords);
        var out = processPolygon(polyCoords[0], pointCoords, eprev, enext, rtan, ltan);
        rtan = out[0];
        ltan = out[1];
        break;
    case 'MultiPolygon':
        rtan = polyCoords[0][0][0];
        ltan = polyCoords[0][0][0];
        eprev = isLeft(polyCoords[0][0][0], polyCoords[0][0][polyCoords[0][0].length - 1], pointCoords);
        polyCoords.forEach(function (ring) {
            var out = processPolygon(ring[0], pointCoords, eprev, enext, rtan, ltan);
            rtan = out[0];
            ltan = out[1];
        });
        break;
    }
    return featureCollection([point(rtan), point(ltan)]);
}

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
        } else if (eprev > 0 && enext <= 0) {
            if (!isAbove(ptCoords, currentCoords, ltan)) {
                ltan = currentCoords;
            }
        }
        eprev = enext;
    }
    return [rtan, ltan];
}

function isAbove(point1, point2, point3) {
    return isLeft(point1, point2, point3) > 0;
}

function isBelow(point1, point2, point3) {
    return isLeft(point1, point2, point3) < 0;
}

function isLeft(point1, point2, point3) {
    return (point2[0] - point1[0]) * (point3[1] - point1[1]) - (point3[0] - point1[0]) * (point2[1] - point1[1]);
}

export default polygonTangents;
