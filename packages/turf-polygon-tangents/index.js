var coordEach = require('@turf/meta').coordEach;
var helpers = require('@turf/helpers');
var turfPoint = helpers.point;
var turfFc = helpers.featureCollection;

/**
 * Finds the tangents of a {@link Polygon} from a {@link Point}.
 *
 * @name polygonTangents
 * @param {Feature<Point>} point to calculate the tangent points from
 * @param {Feature<Polygon>} polygon to get tangents from
 * @returns {FeatureCollection|Feature<Point>} Feature Collection containing the two tangent points
 * @example
 * var poly = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [
 *        [
 *          [11, 0],
 *          [22, 4],
 *          [31, 0],
 *          [31, 11],
 *          [21, 15],
 *          [11, 11],
 *          [11, 0]
 *        ]
 *      ]
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
    var rtan = 0;
    var ltan = 0;

    coordEach(polygon, function (currentCoords, currentIndex) {
        if (currentIndex === 0) {
            eprev = isLeft(polygon.geometry.coordinates[0][0],  polygon.geometry.coordinates[0][1], point.geometry.coordinates);
        }
        var nextCoordPair = polygon.geometry.coordinates[0][currentIndex + 1];
        if (currentIndex === polygon.geometry.coordinates[0].length - 1) {
            nextCoordPair = polygon.geometry.coordinates[0][0];
        }
        enext = isLeft(currentCoords, nextCoordPair, point.geometry.coordinates);
        if (eprev <= 0 && enext > 0) {
            if (!isBelow(point.geometry.coordinates, currentCoords, polygon.geometry.coordinates[0][rtan])) {
                rtan = currentIndex;
            }
        }
        if (eprev > 0 && enext <= 0) {
            if (!isAbove(point.geometry.coordinates, currentCoords, polygon.geometry.coordinates[0][ltan])) {
                ltan = currentIndex;
            }
        }
        eprev = enext;
    });
    return turfFc([turfPoint(polygon.geometry.coordinates[0][rtan]), turfPoint(polygon.geometry.coordinates[0][ltan])]);
};

function isAbove(Point1, Point2, Point3) {
    return isLeft(Point1, Point2, Point3) >= 0;
}

function isBelow(Point1, Point2, Point3) {
    return isLeft(Point1, Point2, Point3) <= 0;
}

function isLeft(Point1, Point2, Point3) {
    return (Point2[0] - Point1[0]) * (Point3[1] - Point1[1]) - (Point3[0] - Point1[0]) * (Point2[1] - Point1[1]);
}
