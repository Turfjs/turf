var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var clustering = require('density-clustering');
var turfDistance = require('@turf/distance');
var clone = require('@turf/clone');
var coordAll = meta.coordAll;
var collectionOf = invariant.collectionOf;
var convertDistance = helpers.convertDistance;

/**
 * Takes a set of {@link Point|points} and partition them into clusters.
 *
 * @name clustersDistance
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers only)
 * @param {string} [units=kilometers] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
 * @param {number} [minPoints=3] Minimum number of points to generate a single cluster, points will be excluded if the
 *     cluster does not meet the minimum amounts of points.
 * @returns {FeatureCollection<Point>} each Point has two extra properties; `cluster` property with the cluster number it belongs &
 * `dbscan` which is defines the which type of point it has been flagged as ('core'|'edge'|'noise').
 * @example
 * // create random points with random z-values in their properties
 * var points = turf.random('point', 100, {
 *   bbox: [0, 30, 20, 50]
 * });
 * var distance = 100;
 * var clustered = turf.clustersDistance(points, distance);
 *
 * //addToMap
 * var addToMap = featureCollection(clustered.points);
 */
module.exports = function (points, maxDistance, units, minPoints) {
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
    var clusteredIds = dbscan.run(coordAll(points), convertDistance(maxDistance, units), minPoints, turfDistance);

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
        if (noisePoint.properties.cluster) noisePoint.properties.dbscan = 'edge';
        else noisePoint.properties.dbscan = 'noise';
    });

    return points;
};
