var along = require('@turf/along');
var lineDistance = require('@turf/line-distance');
var helpers = require('@turf/helpers');
var flatten = require('@turf/flatten');
var linestring = helpers.lineString;
var point = helpers.point;
var fc = helpers.featureCollection;

/**
 * Divides a {@link LineString} into chunks of a specified length.
 * If the line is shorter than the segment length then the orginal line is returned.
 * @name lineChunk
 * @param {Feature<LineString>} line the line to split
 * @param {Number} segment_length how long to make each segment
 * @param {String} units can be degrees, radians, miles, or kilometers
 * @param {Boolean} [asPoints=false] return points instead of linestring segrments
 * @return {FeatureCollection<LineString>|FeatureCollection<Point>} collection of line segments or points
 * @example
 * var line = {
 *   'type': 'Feature',
 *   'properties': {},
 *   'geometry': {
 *     'type': 'LineString',
 *     'coordinates': [
 *       [
 *         -86.28524780273438,
 *         40.250184183819854
 *       ],
 *       [
 *         -85.98587036132812,
 *         40.17887331434696
 *       ],
 *       [
 *         -85.97213745117188,
 *         40.08857859823707
 *       ],
 *       [
 *         -85.77987670898438,
 *         40.15578608609647
 *       ]
 *     ]
 *   }
 * };
 * //=line
 * var result = turf.lineChunk(line, 15, 'miles');
 * result.features.forEach(function(ft, ind) {
 *   ft.properties.stroke = (ind % 2 === 0) ? '#f40' : '#389979';
 * });
 *
 * //=result
 */
module.exports = function (line, segment_length, units, asPoints) {
    if (line.type === 'LineString') {
        line = {'type': 'Feature', 'properties': {}, 'geometry': line};
    }

    if (lineDistance(line, units) <= segment_length) {
        return fc([line]);
    }

    var coordinates = line.geometry.coordinates.slice();
    var result = [];


    while (coordinates.length > 1) {
        var endpt = along(linestring(coordinates), segment_length, units);
        var tempcoords = [];
        for (var i = 0; i < coordinates.length; i++) {
            tempcoords.push(coordinates[i]);

            if (lineDistance(linestring(tempcoords), units) >= segment_length) {
                tempcoords.pop();
                tempcoords.push(endpt.geometry.coordinates);
                coordinates = coordinates.slice(i);
                coordinates.unshift(endpt.geometry.coordinates);
                result.push(tempcoords);
                break;
            }

            if (i === coordinates.length - 1) {
                coordinates = [];
                result.push(tempcoords);
            }
        }
    }

    return fc(result.map(function (coords) {
        if (!asPoints) {
            return linestring(coords);
        } else {
            return point(coords[0]);
        }
    }));
};
