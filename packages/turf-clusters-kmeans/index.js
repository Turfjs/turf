import clone from '@turf/clone';
import { collectionOf } from '@turf/invariant';
import { coordAll, featureEach } from '@turf/meta';
import skmeans from 'skmeans';

/**
 * Takes a set of {@link Point|points} and partition them into clusters using the k-mean .
 * It uses the [k-means algorithm](https://en.wikipedia.org/wiki/K-means_clustering)
 *
 * @name clustersKmeans
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.numberOfClusters=Math.sqrt(numberOfPoints/2)] numberOfClusters that will be generated
 * @param {boolean} [options.mutate=false] allows GeoJSON input to be mutated (significant performance increase if true)
 * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
 * - {number} cluster - the associated clusterId
 * - {[number, number]} centroid - Centroid of the cluster [Longitude, Latitude]
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var options = {numberOfClusters: 7};
 * var clustered = turf.clustersKmeans(points, options);
 *
 * //addToMap
 * var addToMap = [clustered];
 */
function clustersKmeans(points, options) {
    // Optional parameters
    options = options || {};
    if (typeof options !== 'object') throw new Error('options is invalid');
    var numberOfClusters = options.numberOfClusters;
    var mutate = options.mutate;

    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');

    // Default Params
    var count = points.features.length;
    numberOfClusters = numberOfClusters || Math.round(Math.sqrt(count / 2));

    // numberOfClusters can't be greater than the number of points
    // fallbacks to count
    if (numberOfClusters > count) numberOfClusters = count;

    // Clone points to prevent any mutations (enabled by default)
    if (mutate === false || mutate === undefined) points = clone(points, true);

    // collect points coordinates
    var data = coordAll(points);

    // create seed to avoid skmeans to drift
    var initialCentroids = data.slice(0, numberOfClusters);

    // create skmeans clusters
    var skmeansResult = skmeans(data, numberOfClusters, initialCentroids);

    // store centroids {clusterId: [number, number]}
    var centroids = {};
    skmeansResult.centroids.forEach(function (coord, idx) {
        centroids[idx] = coord;
    });

    // add associated cluster number
    featureEach(points, function (point, index) {
        var clusterId = skmeansResult.idxs[index];
        point.properties.cluster = clusterId;
        point.properties.centroid = centroids[clusterId];
    });

    return points;
}

export default clustersKmeans;
