import { geomEach, coordEach } from '@turf/meta';
import { point, isNumber, isObject } from '@turf/helpers';

/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the mean center. Can be weighted.
 *
 * @name centerMean
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] an Object that is used as the {@link Feature}'s properties
 * @param {number} [options.weight] the property name used to weight the center
 * @returns {Feature<Point>} a Point feature at the mean center point of all input features
 * @example
 * var features = turf.featureCollection([
 *   turf.point([-97.522259, 35.4691], {weight: 10}),
 *   turf.point([-97.502754, 35.463455], {weight: 3}),
 *   turf.point([-97.508269, 35.463245], {weight: 5})
 * ]);
 *
 * var options = {weight: "weight"}
 * var mean = turf.centerMean(features, options);
 *
 * //addToMap
 * var addToMap = [features, mean]
 * mean.properties['marker-size'] = 'large';
 * mean.properties['marker-color'] = '#000';
 */
function centerMean(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var properties = options.properties;
    var weightTerm = options.weight;

    // Input validation
    if (!geojson) throw new Error('geojson is required');

    var sumXs = 0;
    var sumYs = 0;
    var sumNs = 0;
    geomEach(geojson, function (geom, featureIndex, properties) {
        var weight = properties[weightTerm];
        weight = (weight === undefined || weight === null) ? 1 : weight;
        if (!isNumber(weight)) throw new Error('weight value must be a number for feature index ' + featureIndex);
        weight = Number(weight);
        if (weight > 0) {
            coordEach(geom, function (coord) {
                sumXs += coord[0] * weight;
                sumYs += coord[1] * weight;
                sumNs += weight;
            });
        }
    });
    return point([sumXs / sumNs, sumYs / sumNs], properties);
}

export default centerMean;
