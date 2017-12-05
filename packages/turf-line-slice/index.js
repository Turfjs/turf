import { getCoords, getType } from '@turf/invariant';
import { lineString as linestring } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';

/**
 * Takes a {@link LineString|line}, a start {@link Point}, and a stop point
 * and returns a subsection of the line in-between those points.
 * The start & stop points don't need to fall exactly on the line.
 *
 * This can be useful for extracting only the part of a route between waypoints.
 *
 * @name lineSlice
 * @param {Coord} startPt starting point
 * @param {Coord} stopPt stopping point
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
function lineSlice(startPt, stopPt, line) {
    // Validation
    var coords = getCoords(line);
    if (getType(line) !== 'LineString') throw new Error('line must be a LineString');

    var startVertex = nearestPointOnLine(line, startPt);
    var stopVertex = nearestPointOnLine(line, stopPt);
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
}

export default lineSlice;
