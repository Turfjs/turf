import bbox from '@turf/bbox';
import { geomEach, coordEach } from '@turf/meta';
import { point, isNumber, isObject } from '@turf/helpers';

/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the absolute center point of all features.
 *
 * @name center
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional parameters
 * @param {Object} [options.properties={}] an Object that is used as the {@link Feature}'s properties
 * @param {number} [options.weight] the property name used to weight the center
 * @returns {Feature<Point>} a Point feature at the absolute center point of all input features
 * @example
 * var features = turf.featureCollection([
 *   turf.point( [-97.522259, 35.4691]),
 *   turf.point( [-97.502754, 35.463455]),
 *   turf.point( [-97.508269, 35.463245])
 * ]);
 *
 * var center = turf.center(features);
 *
 * //addToMap
 * var addToMap = [features, center]
 * center.properties['marker-size'] = 'large';
 * center.properties['marker-color'] = '#000';
 */
function center(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var properties = options.properties;
    var weight = options.weight;

    // Input validation
    if (!geojson) throw new Error('geojson is required');

    // Mean Center with weights
    if (weight) {
        var sumXs = 0;
        var sumYs = 0;
        var sumNs = 0;
        geomEach(geojson, function (geom, featureIndex, properties) {
            var weightValue = properties[weight] || 1;
            if (!isNumber(weightValue)) throw new Error('weight value must be a number for feature index ' + featureIndex);
            if (weightValue < 0) throw new Error('weight value must be positive for feature index ' + featureIndex);
            coordEach(geom, function (coord) {
                sumXs += coord[0] * weightValue;
                sumYs += coord[1] * weightValue;
                sumNs += weightValue;
            });
        });
        console.log(sumXs);
        console.log(sumYs);
        console.log(sumNs);
        // if (sumNs) sumNs = 1;
        if (sumNs === 0) throw new Error('sum of weights equals zero');
        return point([sumXs / sumNs, sumYs / sumNs], properties);
    // Without weight
    } else {
        var ext = bbox(geojson);
        var x = (ext[0] + ext[2]) / 2;
        var y = (ext[1] + ext[3]) / 2;
        return point([x, y], properties);
    }
}

export default center;
