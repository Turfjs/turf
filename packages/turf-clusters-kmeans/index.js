var meta = require('@turf/meta');
var skmeans = require('skmeans');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var point = helpers.point;
var coordEach = meta.coordEach;
var featureEach = meta.featureEach;
var collectionOf = invariant.collectionOf;
var featureCollection = helpers.featureCollection;

/**
 * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
 * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
 *
 * @name clustersKmeans
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} [numberOfClusters=Math.sqrt(numberOfPoints/2)] numberOfClusters that will be generated
 * @returns {Object} an object containing a `points` FeatureCollection, the input points where each Point
 *     has given a `cluster` property with the cluster number it belongs, and a `centroids` FeatureCollection of
 *     Points, collecting all the cluster centroids each with its own `cluster` property.
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.random('point', 100, {
 *   bbox: [0, 30, 20, 50]
 * });
 * var numberOfClusters = 7;
 * var clustered = turf.clustersKmeans(points, numberOfClusters);
 *
 * //addToMap
 * var addToMap = featureCollection(clustered.points);
 */
module.exports = function (points, numberOfClusters) {
    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');
    // Default Params
    var count = points.features.length;
    if (numberOfClusters > count) throw new Error('numberOfClusters can\'t be grated than the number of points');
    numberOfClusters = numberOfClusters || Math.round(Math.sqrt(count / 2));

    // collect points coordinates
    var data = [];
    coordEach(points, function (coord) {
        data.push(coord);
    });

    // create seed to avoid skmeans to drift
    var initialCentroids = data.slice(0, numberOfClusters);

    // create clusters
    var clastersResult = skmeans(data, numberOfClusters, initialCentroids);
    var centroids = [];
    clastersResult.centroids.forEach(function (coord, idx) {
        centroids.push(point(coord, {cluster: idx}));
    });
    featureEach(points, function (pt, i) {
        pt.properties.cluster = clastersResult.idxs[i];
    });

    return {
        points: points,
        centroids: featureCollection(centroids)
    };
};
