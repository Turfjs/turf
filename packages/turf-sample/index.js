// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
var featureCollection = require('turf-helpers').featureCollection;

/**
 * Takes a {@link FeatureCollection} and returns a FeatureCollection with given number of {@link Feature|features} at random.
 *
 * @name sample
 * @category data
 * @param {FeatureCollection} features set of input features
 * @param {Number} n number of features to select
 * @return {FeatureCollection} a FeatureCollection with `n` features
 * @example
 * var points = turf.random('points', 1000);
 *
 * //=points
 *
 * var sample = turf.sample(points, 10);
 *
 * //=sample
 */
module.exports = function (fc, num) {
    var outFC = featureCollection(getRandomSubarray(fc.features, num));
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
