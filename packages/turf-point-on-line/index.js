var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var bearing = require('@turf/bearing');
var distance = require('@turf/distance');
var invariant = require('@turf/invariant');
var destination = require('@turf/destination');
var lineIntersects = require('@turf/line-intersect');
var point = helpers.point;
var getCoords = invariant.getCoords;
var lineString = helpers.lineString;
var flattenEach = meta.flattenEach;

/**
 * Takes a {@link Point} and a {@link LineString} and calculates the closest Point on the (Multi)LineString.
 *
 * @name pointOnLine
 * @param {Geometry|Feature<LineString|MultiLineString>} lines lines to snap to
 * @param {Geometry|Feature<Point>|number[]} pt point to snap from
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {Feature<Point>} closest point on the `line` to `point`. The properties object will contain three values: `index`: closest point was found on nth line part, `dist`: distance between pt and the closest point, `location`: distance along the line between start and the closest point.
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var pt = turf.point([-77.037076, 38.884017]);
 *
 * var snapped = turf.pointOnLine(line, pt, 'miles');
 *
 * //addToMap
 * var addToMap = [line, pt, snapped];
 * snapped.properties['marker-color'] = '#00f';
 */
module.exports = function (lines, pt, units) {
    // validation
    var type = (lines.geometry) ? lines.geometry.type : lines.type;
    if (type !== 'LineString' && type !== 'MultiLineString') {
        throw new Error('lines must be LineString or MultiLineString');
    }

    var closestPt = point([Infinity, Infinity], {
        dist: Infinity
    });

    var length = 0.0;
    flattenEach(lines, function (line) {
        var coords = getCoords(line);

        for (var i = 0; i < coords.length - 1; i++) {
            //start
            var start = point(coords[i]);
            start.properties.dist = distance(pt, start, units);
            //stop
            var stop = point(coords[i + 1]);
            stop.properties.dist = distance(pt, stop, units);
            // sectionLength
            var sectionLength = distance(start, stop, units);
            //perpendicular
            var heightDistance = Math.max(start.properties.dist, stop.properties.dist);
            var direction = bearing(start, stop);
            var perpendicularPt1 = destination(pt, heightDistance, direction + 90, units);
            var perpendicularPt2 = destination(pt, heightDistance, direction - 90, units);
            var intersect = lineIntersects(lineString([perpendicularPt1.geometry.coordinates, perpendicularPt2.geometry.coordinates]), lineString([start.geometry.coordinates, stop.geometry.coordinates]));
            var intersectPt = null;
            if (intersect.features.length > 0) {
                intersectPt = intersect.features[0];
                intersectPt.properties.dist = distance(pt, intersectPt, units);
                intersectPt.properties.location = length + distance(start, intersectPt, units);
            }

            if (start.properties.dist < closestPt.properties.dist) {
                closestPt = start;
                closestPt.properties.index = i;
                closestPt.properties.location = length;
            }
            if (stop.properties.dist < closestPt.properties.dist) {
                closestPt = stop;
                closestPt.properties.index = i + 1;
                closestPt.properties.location = length + sectionLength;
            }
            if (intersectPt && intersectPt.properties.dist < closestPt.properties.dist) {
                closestPt = intersectPt;
                closestPt.properties.index = i;
            }
            // update length
            length += sectionLength;
        }

    });

    return closestPt;
};
