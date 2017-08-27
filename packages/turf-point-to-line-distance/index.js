var invariant = require('@turf/invariant');
var featureOf = invariant.featureOf;
var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var distance = require('@turf/distance');
var rhumbDistance = require('@turf/rhumb-distance');
var bearing = require('@turf/bearing');
var turfPoint = helpers.point;
var degrees2radians = helpers.degrees2radians;
var bearingToAngle = helpers.bearingToAngle;
var segmentEach = meta.segmentEach;
var turfLine = helpers.lineString;

/**
 * Returns the minimum distance between a {@link Point} and a {@link LineString}, being the distance from a line the
 * minimum distance between the point and any segment of the `LineString`.
 * (from: https://stackoverflow.com/questions/32771458/distance-from-lat-lng-point-to-minor-arc-segment)
 *
 * @name pointToLineDistance
 * @param {Feature<Point>|Array<number>} point Feature or Geometry
 * @param {Feature<LineString>|Array<<Array<number>>} line GeoJSON Feature or Geometry
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} distance between point and line
 * @param {boolean} [rhumb=false] if distances should be calculated with Rhumb formulae
 * @example
 * var pt = turf.point([0, 0]);
 * var line = turf.lineString([[1, 1],[-1, 1]);
 *
 * var d = pointToLineDistance(point, line, 'degrees');
 * //=1
 */
module.exports = function (point, line, units, rhumb) {
    // validation
    if (!point) throw new Error('point is required');
    if (Array.isArray(point)) point = turfPoint(point);
    else featureOf(point, 'Point', 'point');
    if (!line) throw new Error('line is required');
    if (Array.isArray(line)) line = turfLine(line);
    else featureOf(line, 'LineString', 'line');

    var distance = Infinity;
    var pt = point.geometry.coordinates;
    segmentEach(line, function (segment) {
        var d = distanceToSegment(pt, segment.geometry.coordinates, units, rhumb);
        if (distance > d) distance = d;
    });
    return distance;
};


function distanceToSegment(p, segment, units, rhumb) {
    var a = segment[0];
    var b = segment[1];

    var distanceAP = (rhumb !== true) ? distance(a, p, units) : rhumbDistance(a, p, units);
    var angleAP = bearingToAngle(bearing(a, p));
    var angleAB = bearingToAngle(bearing(a, b));
    var angleA = Math.abs(angleAP - angleAB);
    // if the angle PAB is obtuse its projection on the line extending the segment falls outside the segment
    // thus return distance between P and the start point A
    /*
        P__
        |\ \____
        | \     \____
        |  \         \____
        |   \             \____
        |    \                 \____
        |     \                     \____
        |      \_________________________\
        H      A                          B
     */
    if (angleA > 90) return distanceAP;

    var angleBA = (angleAB + 180) % 360;
    var angleBP = bearingToAngle(bearing(b, p));
    var angleB = Math.abs(angleBP - angleBA);
    // also if the angle ABP is acute the projection of P falls outside the segment, on the other side
    // so return the distance between P and the end point B
    /*
                                        __P
                                   ____/ /|
                              ____/     / |
                         ____/         /  |
                    ____/             /   |
               ____/                 /    |
          ____/                     /     |
         /_________________________/      |
        A                          B      H
    */
    if (angleB > 90) return (rhumb !== true) ? distance(p, b, units) : rhumbDistance(p, b, units);
    // finally if the projection falls inside the segment
    // return the distance between P and the segment
    /*
                            P
                         __/|\
                      __/   | \
                   __/      |  \
                __/         |   \
             __/            |    \
          __/               |     \
         /__________________|______\
        A                   H       B
    */
    // var distancePH = projectionHeight(distanceAP, angleB);
    return distanceAP * Math.sin(degrees2radians(angleA));

}
