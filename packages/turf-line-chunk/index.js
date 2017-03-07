var lineSliceAlong = require('@turf/line-slice-along');
var lineDistance = require('@turf/line-distance');
var helpers = require('@turf/helpers');
var meta = require('@turf/meta');
var flatten = require('@turf/flatten');
var lineString = helpers.lineString;
var featureCollection = helpers.featureCollection;

/**
 * Divides a {@link linestring} into chunks of a specified length.
 * If the line is shorter than the segment length then the orginal line is returned.
 * @name lineChunk
 * @param {Feature<linestring>} line the line to split
 * @param {number} segmentLength how long to make each segment
 * @param {string}[units='kilometers'] units can be degrees, radians, miles, or kilometers
 * @return {FeatureCollection<linestring>} collection of line segments
 * @example
 * var line = {
 *   'type': 'Feature',
 *   'properties': {},
 *   'geometry': {
 *     'type': 'lineString',
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
 * var result = turf.lineChunk(line, 15, 'miles');
 * //=result
 */

module.exports = function (line, segmentLength, units) {
    if (line.type === 'LineString') {
        line = lineString(line.coordinates, line.properties);
    }
    if (line.type === 'MultiLineString') {
        line = flatten(line);
    }
    var fc = null;
    if (line.type === 'FeatureCollection') {
        fc = line;
    } else {
        fc = featureCollection([line]);
    }
    var outFeatures = [];

    meta.featureEach(fc, function (feature) {
        var lineLength = lineDistance(feature, units);
        if (lineLength <= segmentLength) {
            return outFeatures.push(feature);
        }

        var numberOfSegments = Math.floor(lineLength / segmentLength) + 1;

        for (var i = 0; i < numberOfSegments; i++) {
            var outline = lineSliceAlong(feature, segmentLength * i, segmentLength * (i + 1), units);
            outFeatures.push(outline);
        }
    });

    return featureCollection(outFeatures);
};
