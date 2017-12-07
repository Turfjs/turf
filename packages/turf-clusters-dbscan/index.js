import clone from '@turf/clone';
import distance from '@turf/distance';
import { coordAll } from '@turf/meta';
import { convertLength } from '@turf/helpers';
import { collectionOf } from '@turf/invariant';
import clustering from 'density-clustering';

/**
 * Takes a set of {@link Point|points} and partition them into clusters according to {@link DBSCAN's|https://en.wikipedia.org/wiki/DBSCAN} data clustering algorithm.
 *
 * @name clustersDbscan
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers only)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units=kilometers] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
 * @param {number} [options.minPoints=3] Minimum number of points to generate a single cluster,
 * points which do not meet this requirement will be classified as an 'edge' or 'noise'.
 * @returns {FeatureCollection<Point>} Clustered Points with an additional two properties associated to each Feature:
 * - {number} cluster - the associated clusterId
 * - {string} dbscan - type of point it has been classified as ('core'|'edge'|'noise')
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var maxDistance = 100;
 * var clustered = turf.clustersDbscan(points, maxDistance);
 *
 * //addToMap
 * var addToMap = [clustered];
 */
function clustersDbscan(points, maxDistance, options) {
    // Optional parameters
    options = options || {};
    if (typeof options !== 'object') throw new Error('options is invalid');
    var minPoints = options.minPoints;
    var units = options.units;

    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');
    if (maxDistance === null || maxDistance === undefined) throw new Error('maxDistance is required');
    if (!(Math.sign(maxDistance) > 0)) throw new Error('Invalid maxDistance');
    if (!(minPoints === undefined || minPoints === null || Math.sign(minPoints) > 0)) throw new Error('Invalid minPoints');

    // Clone points to prevent any mutations
    points = clone(points, true);

    // Defaults
    minPoints = minPoints || 3;

    // create clustered ids
    var dbscan = new clustering.DBSCAN();
    var clusteredIds = dbscan.run(coordAll(points), convertLength(maxDistance, units), minPoints, distance);

    // Tag points to Clusters ID
    var clusterId = -1;
    clusteredIds.forEach(function (clusterIds) {
        clusterId++;
        // assign cluster ids to input points
        clusterIds.forEach(function (idx) {
            var clusterPoint = points.features[idx];
            if (!clusterPoint.properties) clusterPoint.properties = {};
            clusterPoint.properties.cluster = clusterId;
            clusterPoint.properties.dbscan = 'core';
        });
    });

    // handle noise points, if any
    // edges points are tagged by DBSCAN as both 'noise' and 'cluster' as they can "reach" less than 'minPoints' number of points
    dbscan.noise.forEach(function (noiseId) {
        var noisePoint = points.features[noiseId];
        if (!noisePoint.properties) noisePoint.properties = {};
        if (noisePoint.properties.cluster) noisePoint.properties.dbscan = 'edge';
        else noisePoint.properties.dbscan = 'noise';
    });

    return points;
}

export default clustersDbscan;
