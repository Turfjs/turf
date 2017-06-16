var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var clusterMaker = require('clusters');
var point = helpers.point;
var getCoords = invariant.getCoords;
var collectionOf = invariant.collectionOf;
var featureReduce = meta.featureReduce;
var featureCollection = helpers.featureCollection;

/**
 * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
 * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
 *
 * @name cluster
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
 * var clustered = turf.cluster(points, numberOfClusters);
 *
 * //addToMap
 * var addToMap = featureCollection(clustered.points);
 */
module.exports = function (points, numberOfClusters) {
    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');
    // Default Params
    var count = points.features.length;
    numberOfClusters = numberOfClusters || Math.sqrt(count / 2);

    // collect points coordinates
    var data = featureReduce(points, function (prevValue, currentFeature) {
        var coord = getCoords(currentFeature);
        return prevValue.concat([coord]);
    }, []);

    // create clusters
    clusterMaker.k(numberOfClusters);
    clusterMaker.data(data);
    var clusters = clusterMaker.clusters();

    // create output
    var outputPoints = [];
    var centroids = [];
    clusters.forEach(function (cluster, idx) {
        cluster.points.forEach(function (coord) {
            outputPoints.push(point(coord, {cluster: idx}));
        });
        centroids.push(point(cluster.centroid, {cluster: idx}));
    });

    return {
        points: featureCollection(outputPoints),
        centroids: featureCollection(centroids)
    };
};
