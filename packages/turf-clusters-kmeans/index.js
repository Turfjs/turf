var meta = require('@turf/meta');
var clone = require('clone');
var skmeans = require('skmeans');
var invariant = require('@turf/invariant');
var coordAll = meta.coordAll;
var featureEach = meta.featureEach;
var collectionOf = invariant.collectionOf;

/**
 * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
 * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
 *
 * @name clustersKmeans
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} [numberOfClusters=Math.sqrt(numberOfPoints/2)] numberOfClusters that will be generated
 * @returns {FeatureCollection<Point>} a collection of points with an added property `cluster` which associates which cluster it belongs to
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.random('point', 100, {
 *   bbox: [0, 30, 20, 50]
 * });
 * var numberOfClusters = 7;
 * var clustered = turf.clustersKmeans(points, numberOfClusters);
 *
 * //addToMap
 * var addToMap = clustered;
 */
module.exports = function (points, numberOfClusters) {
    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');

    // Default Params
    var count = points.features.length;
    numberOfClusters = numberOfClusters || Math.round(Math.sqrt(count / 2));

    // numberOfClusters can't be greater than the number of points
    // fallbacks to count
    if (numberOfClusters > count) numberOfClusters = count;

    // Clone points to prevent any mutations
    points = clone(points, true);

    // collect points coordinates
    var data = coordAll(points);

    // create seed to avoid skmeans to drift
    var initialCentroids = data.slice(0, numberOfClusters);

    // create clusters
    var clustered = skmeans(data, numberOfClusters, initialCentroids);

    // add associated cluster number
    featureEach(points, function (point, index) {
        point.properties.cluster = clustered.idxs[index];
    });

    return points;
};
