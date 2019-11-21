import clone from '@turf/clone';
import { coordAll, featureEach } from '@turf/meta';
import { FeatureCollection, Coord, Point, Properties } from '@turf/helpers';
import * as skmeans from 'skmeans';

export interface KmeansProps extends Properties {
    cluster?: number;
    centroid?: [number, number];
}

function getInitialCentroids(coordinates: Coord[], count: number) {
    const results: { [name: string]: Coord } = {};
    const clen = coordinates.length;
    for (let i = 0; i < clen; ++i) {
        const coord = coordinates[i];
        results[`${coord[0]},${coord[1]}`] = coord;
        if (Object.keys(results).length == count) break;
    }
    return Object.keys(results).map(k => results[k]);
}

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
function clustersKmeans(points: FeatureCollection<Point>, options: {
    numberOfClusters?: number,
    mutate?: boolean
} = {}): FeatureCollection<Point, KmeansProps> {
    // Default Params
    var count = points.features.length;
    options.numberOfClusters = options.numberOfClusters || Math.round(Math.sqrt(count / 2));

    // Clone points to prevent any mutations (enabled by default)
    if (options.mutate !== true) points = clone(points);

    // collect points coordinates
    var data = coordAll(points);

    // create seed to avoid skmeans to drift
    var initialCentroids = getInitialCentroids(data, options.numberOfClusters);
    options.numberOfClusters = initialCentroids.length;

    // create skmeans clusters
    var skmeansResult = skmeans(data, options.numberOfClusters, initialCentroids);

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
