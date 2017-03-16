var distance = require('@turf/distance');
var featureEach = require('@turf/meta').featureEach;
var coordReduce = require('@turf/meta').coordReduce;
var geomEach = require('@turf/meta').geomEach;
var flatten = require('@turf/flatten');
var lineString = require('@turf/helpers').lineString;
var point = require('@turf/helpers').point;

/**
 * Takes a {@link LineString} or {@link Polygon} and measures its length in the specified units.
 *
 * @name lineDistance
 * @param {Feature<(LineString|Polygon)>|FeatureCollection<(LineString|Polygon)>} geojson feature to measure
 * @param {string} [units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} length feature
 * @example
 * var line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [
 *       [-77.031669, 38.878605],
 *       [-77.029609, 38.881946],
 *       [-77.020339, 38.884084],
 *       [-77.025661, 38.885821],
 *       [-77.021884, 38.889563],
 *       [-77.019824, 38.892368]
 *     ]
 *   }
 * };
 *
 * var length = turf.lineDistance(line, 'miles');
 *
 * //=line
 *
 * //=length
 */
module.exports = function lineDistance(geojson, units) {
    // Input Validation
    if (!geojson) throw new Error('geojson is required');
    geomEach(geojson, function (geometry) {
        if (geometry.type === 'Point') throw new Error('geojson cannot be a Point');
        if (geometry.type === 'MultiPoint') throw new Error('geojson cannot be a MultiPoint');
    });

    // Calculate distance from 2-vertex line segements
    return segmentReduce(geojson, function (previousValue, segment) {
        var coords = segment.geometry.coordinates;
        var start = point(coords[0]);
        var end = point(coords[1]);
        return previousValue + distance(start, end, units);
    }, 0);
};

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 *
 * @private
 * @param {FeatureCollection|Feature<any>} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, currentIndex)
 * @returns {void}
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]
 *   }
 * }
 * turf.segmentEach(polygon, function (segment) {
 *   //= segment
 * });
 */
function segmentEach(geojson, callback) {
    var count = 0;
    featureEach(geojson, function (multiFeature) {
        featureEach(flatten(multiFeature), function (feature) {
            coordReduce(feature, function (previousCoords, currentCoords) {
                var line = lineString([previousCoords, currentCoords], feature.properties);
                callback(line, count);
                count++;
                return currentCoords;
            });
        });
    });
}

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 *
 * @private
 * @param {FeatureCollection|Feature<any>} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    segmentEach(geojson, function (currentSegment, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) {
            previousValue = currentSegment;
        } else {
            previousValue = callback(previousValue, currentSegment, currentIndex);
        }
    });
    return previousValue;
}
