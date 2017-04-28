var coordEach = require('@turf/meta').coordEach;

module.exports = function (point, polygon) {
    var eprev = isLeft(polygon.geometry.coordinates[0][0], polygon.geometry.coordinates[0][1], point.geometry.coordinates);
    var enext;
    var rtan = 0;
    var ltan = 0;
    coordEach(polygon, function (currentCoords, coordsIndex) {
        var nextCoordPair;
        if (coordsIndex === polygon.geometry.coordinates[0].length - 1) {
            nextCoordPair = polygon.geometry.coordinates[0][0];
        } else {
            nextCoordPair = polygon.geometry.coordinates[0][coordsIndex + 1];
        }
        enext = isLeft(currentCoords, nextCoordPair, point.geometry.coordinates);
        if (eprev <= 0 && enext > 0) {
            if (!isBelow(point, currentCoords, polygon.geometry.coordinates[0][rtan])) {
                rtan = coordsIndex;
            }
        }
        if (eprev > 0 && enext <= 0) {
            if (!isAbove(point, currentCoords, polygon.geometry.coordinates[0][ltan])) {
                ltan = coordsIndex;
            }
        }
        eprev = enext;
    });
    return [polygon.geometry.coordinates[0][rtan], polygon.geometry.coordinates[0][ltan]];
};

function isAbove(Point1, Point2, Point3) {
    return isLeft(Point1, Point2, Point3) > 0;
}

function isBelow(Point1, Point2, Point3) {
    return isLeft(Point1, Point2, Point3) < 0;
}

function isLeft(Point1, Point2, Point3) {
    return (Point2[0] - Point1[0]) * (Point3[1] - Point1[1]) - (Point3[0] - Point1[0]) * (Point2[1] - Point1[1]);
}
