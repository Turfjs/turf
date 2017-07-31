// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
var featureCollection = require('@turf/helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection} and returns a FeatureCollection with given number of {@link Feature|features} at random.
 *
 * @name sample
 * @param {FeatureCollection} featurecollection set of input features
 * @param {number} num number of features to select
 * @returns {FeatureCollection} a FeatureCollection with `n` features
 * @example
 * var points = turf.random('points', 100, {
 *   bbox: [-80, 30, -60, 60]
 * });
 *
 * var sample = turf.sample(points, 5);
 *
 * //addToMap
 * var addToMap = [points, sample]
 * turf.featureEach(sample, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
module.exports = function (featurecollection, num) {
    var outFC = featureCollection(getRandomSubarray(featurecollection.features, num));
    return outFC;
};

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
