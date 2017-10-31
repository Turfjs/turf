import length from '@turf/length';
import lineSliceAlong from '@turf/line-slice-along';
import { flattenEach } from '@turf/meta';
import { featureCollection, isObject } from '@turf/helpers';

/**
 * Divides a {@link LineString} into chunks of a specified length.
 * If the line is shorter than the segment length then the original line is returned.
 *
 * @name lineChunk
 * @param {FeatureCollection|Geometry|Feature<LineString|MultiLineString>} geojson the lines to split
 * @param {number} segmentLength how long to make each segment
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] units can be degrees, radians, miles, or kilometers
 * @param {boolean} [options.reverse=false] reverses coordinates to start the first chunked segment at the end
 * @returns {FeatureCollection<LineString>} collection of line segments
 * @example
 * var line = turf.lineString([[-95, 40], [-93, 45], [-85, 50]]);
 *
 * var chunk = turf.lineChunk(line, 15, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [chunk];
 */
function lineChunk(geojson, segmentLength, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units;
    var reverse = options.reverse;

    // Validation
    if (!geojson) throw new Error('geojson is required');
    if (segmentLength <= 0) throw new Error('segmentLength must be greater than 0');

    // Container
    var results = [];

    // Flatten each feature to simple LineString
    flattenEach(geojson, function (feature) {
        // reverses coordinates to start the first chunked segment at the end
        if (reverse) feature.geometry.coordinates = feature.geometry.coordinates.reverse();

        sliceLineSegments(feature, segmentLength, units, function (segment) {
            results.push(segment);
        });
    });
    return featureCollection(results);
}

/**
 * Slice Line Segments
 *
 * @private
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {number} segmentLength how long to make each segment
 * @param {string}[units='kilometers'] units can be degrees, radians, miles, or kilometers
 * @param {Function} callback iterate over sliced line segments
 * @returns {void}
 */
function sliceLineSegments(line, segmentLength, units, callback) {
    var lineLength = length(line, {units: units});

    // If the line is shorter than the segment length then the orginal line is returned.
    if (lineLength <= segmentLength) return callback(line);

    var numberOfSegments = lineLength / segmentLength;

    // If numberOfSegments is integer, no need to plus 1
    if (!Number.isInteger(numberOfSegments)) {
        numberOfSegments = Math.floor(numberOfSegments) + 1;
    }

    for (var i = 0; i < numberOfSegments; i++) {
        var outline = lineSliceAlong(line, segmentLength * i, segmentLength * (i + 1), {units: units});
        callback(outline, i);
    }
}

export default lineChunk;
