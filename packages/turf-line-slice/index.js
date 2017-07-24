var linestring = require('@turf/helpers').lineString;
var pointOnLine = require('@turf/point-on-line');

/**
 * Takes a {@link LineString|line}, a start {@link Point}, and a stop point
 * and returns a subsection of the line in-between those points.
 * The start & stop points don't need to fall exactly on the line.
 *
 * This can be useful for extracting only the part of a route between waypoints.
 *
 * @name lineSlice
 * @param {Feature<Point>} startPt starting point
 * @param {Feature<Point>} stopPt stopping point
 * @param {Feature<LineString>|LineString} line line to slice
 * @returns {Feature<LineString>} sliced line
 * @example
 * var line = turf.lineString([
 *     [-77.031669, 38.878605],
 *     [-77.029609, 38.881946],
 *     [-77.020339, 38.884084],
 *     [-77.025661, 38.885821],
 *     [-77.021884, 38.889563],
 *     [-77.019824, 38.892368]
 * ]);
 * var start = turf.point([-77.029609, 38.881946]);
 * var stop = turf.point([-77.021884, 38.889563]);
 *
 * var sliced = turf.lineSlice(start, stop, line);
 *
 * //addToMap
 * var addToMap = [start, stop, line]
 */
module.exports = function lineSlice(startPt, stopPt, line) {
    var coords;
    if (line.type === 'Feature') {
        coords = line.geometry.coordinates;
    } else if (line.type === 'LineString') {
        coords = line.coordinates;
    } else {
        throw new Error('input must be a LineString Feature or Geometry');
    }

    var startVertex = pointOnLine(line, startPt);
    var stopVertex = pointOnLine(line, stopPt);
    var ends;
    if (startVertex.properties.index <= stopVertex.properties.index) {
        ends = [startVertex, stopVertex];
    } else {
        ends = [stopVertex, startVertex];
    }
    var clipCoords = [ends[0].geometry.coordinates];
    for (var i = ends[0].properties.index + 1; i < ends[1].properties.index + 1; i++) {
        clipCoords.push(coords[i]);
    }
    clipCoords.push(ends[1].geometry.coordinates);
    return linestring(clipCoords, line.properties);
};
