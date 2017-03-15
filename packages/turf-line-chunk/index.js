var lineSliceAlong = require('@turf/line-slice-along');
var lineDistance = require('@turf/line-distance');
var featureCollection = require('@turf/helpers').featureCollection;
var featureEach = require('@turf/meta').featureEach;
var flatten = require('@turf/flatten');

/**
 * Divides a {@link LineString} into chunks of a specified length.
 * If the line is shorter than the segment length then the original line is returned.
 *
 * @name lineChunk
 * @param {FeatureCollection|Feature<LineString|MultiLineString>} featureIn the lines to split
 * @param {number} segmentLength how long to make each segment
 * @param {string}[units='kilometers'] units can be degrees, radians, miles, or kilometers
 * @param {boolean}[reverse=false] reverses coordinates to start the first chunked segment at the end
 * @returns {FeatureCollection<LineString>} collection of line segments
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-95, 40],
 *       [-93, 45],
 *       [-85, 50]
 *     ]
 *   }
 * };
 * var result = turf.lineChunk(line, 15, 'miles');
 * //=result
 */
module.exports = function (featureIn, segmentLength, units, reverse) {
    var outFeatures = [];
    var debug = arguments['4']; // Hidden @param {boolean} Enable debug mode

    // Handles FeatureCollection
    featureEach(featureIn, function (multiFeature) {

        // Handles MultiLineString
        if (multiFeature.geometry.type === 'MultiLineString') {
            multiFeature = flatten(multiFeature);
        }

        // All features are simple LineString
        featureEach(multiFeature, function (feature) {
            if (reverse) {
                feature.geometry.coordinates = feature.geometry.coordinates.reverse();
            }
            var lineSegments = sliceLineSegments(feature, segmentLength, units);
            lineSegments.forEach(function (segment, index) {
                if (debug === true) {
                    var r = (index % 2 === 0) ? 'F' : '0';
                    var g = (index % 2 === 0) ? '0' : '0';
                    var b = (index % 2 === 0) ? '0' : 'F';
                    segment.properties['stroke'] = '#' + r + g + b;
                    segment.properties['stroke-width'] = 6;
                }
                outFeatures.push(segment);
            });
        });
    });
    return featureCollection(outFeatures);
};

/**
 * Slice Line Segments
 *
 * @private
 * @param {Feature<LineString>} line GeoJSON LineString
 * @param {number} segmentLength how long to make each segment
 * @param {string}[units='kilometers'] units can be degrees, radians, miles, or kilometers
 * @returns {Array<Feature<LineString>>} sliced lines
 */
function sliceLineSegments(line, segmentLength, units) {
    var lineSegments = [];
    var lineLength = lineDistance(line, units);

    // If the line is shorter than the segment length then the orginal line is returned.
    if (lineLength <= segmentLength) {
        return [line];
    }

    var numberOfSegments = Math.floor(lineLength / segmentLength) + 1;

    for (var i = 0; i < numberOfSegments; i++) {
        var outline = lineSliceAlong(line, segmentLength * i, segmentLength * (i + 1), units);
        lineSegments.push(outline);
    }
    return lineSegments;
}
