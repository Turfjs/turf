import distance from '@turf/distance';
import { segmentReduce } from '@turf/meta';
import { isObject } from '@turf/helpers';

/**
 * Takes a {@link GeoJSON} and measures its length in the specified units, {@link (Multi)Point|Point}'s distance are ignored.
 *
 * @name lineDistance
 * @param {FeatureCollection|Feature|Geometry} geojson GeoJSON to measure
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units=kilometers] can be degrees, radians, miles, or kilometers
 * @returns {number} length of GeoJSON
 * @example
 * var line = turf.lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
 * var length = turf.lineDistance(line, 'miles');
 *
 * //addToMap
 * var addToMap = [line];
 * line.properties.distance = length;
 */
function lineDistance(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units;

    // Input Validation
    if (!geojson) throw new Error('geojson is required');

    // Calculate distance from 2-vertex line segements
    return segmentReduce(geojson, function (previousValue, segment) {
        var coords = segment.geometry.coordinates;
        return previousValue + distance(coords[0], coords[1], units);
    }, 0);
}

export default lineDistance;
