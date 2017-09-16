var meta = require('@turf/meta');
var invariant = require('@turf/invariant');
var pointToLineDistance = require('@turf/point-to-line-distance');
var featureOf = invariant.featureOf;
var featureEach = meta.featureEach;
var collectionOf = invariant.collectionOf;

/**
 * Returns the closest {@link Point|point}, of a {@link FeatureCollection|collection} of points, to a {@link LineString|line}.
 * The returned point has a `dist` property indicating its distance to the line.
 *
 * @name nearestPointToLine
 * @param {FeatureCollection<Point>} points Point Collection
 * @param {Feature<LineString>|LineString} line Line Feature
 * @param {string} [units=kilometers] unit of the output distance property, can be degrees, radians, miles, or kilometer
 * @returns {Feature<Point>} the closest point
 * @example
 * var points = featureCollection([point([0, 0]), point([0.5, 0.5])]);
 * var line = lineString([[1,1], [-1,1]]);
 *
 * var nearest = turf.nearestPointToLine(points, line);
 *
 * //addToMap
 * var addToMap = [nearest, line];
 */
module.exports = function (points, line, units) {
    // validation
    if (!points) throw new Error('points is required');
    else collectionOf(points, 'Point', 'points');

    if (!line) throw new Error('line is required');
    else if (line.type === 'LineString') line = {type: 'Feature', geometry: line};
    else featureOf(line, 'LineString', 'line');

    var dist = Infinity;
    var pt = null;
    featureEach(points, function (point) {
        var d = pointToLineDistance(point, line, units);
        if (d < dist) {
            dist = d;
            pt = point;
        }
    });

    pt.properties.dist = dist;
    return pt;
};
