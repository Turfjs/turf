var meta = require('@turf/meta');
var helpers = require('@turf/helpers');
var invariant = require('@turf/invariant');
var clustering = require('density-clustering');
var centerOfMass = require('@turf/center-of-mass');
var turfDistance = require('@turf/distance');
var coordAll = meta.coordAll;
var collectionOf = invariant.collectionOf;
var convertDistance = helpers.convertDistance;
var featureCollection = helpers.featureCollection;

/**
 * Takes a set of {@link Point|points} and partition them into clusters.
 *
 * @name clustersDistance
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance between any point of the cluster to generate the clusters (kilometers
 *     only)
 * @param {string} [units=kilometers] in which `maxDistance` is expressed, can be degrees, radians, miles, or
 *     kilometers
 * @param {number} [minPoints=1] Minimum number of points to generate a single cluster, points will be excluded if the
 *     cluster does not meet the minimum amounts of points.
 * @returns {Object} an object containing a `points` FeatureCollection, the input points where each Point
 *     has given a `cluster` property with the cluster number it belongs, a `centroids` FeatureCollection of
 *     Points, collecting all the cluster centroids each with its own `cluster` property, and a `noise` FeatureCollection
 *     collecting (if any) the points not belonging to any cluster.
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

    // Defaults
    minPoints = minPoints || 1;
    var maxDistanceKm = convertDistance(maxDistance, units);

    // collect points coordinates
    var pointsCoords = coordAll(points);
    // create clustered ids
    var dbscan = new clustering.DBSCAN();
    var clusteredIds = dbscan.run(pointsCoords, maxDistanceKm, minPoints, turfDistance);

    var centroids = [];
    var noise = [];
    var clusterId = -1;
    clusteredIds.forEach(function (clusterIds) {
        var cluster = [];
        clusterId++;
        // assign cluster ids to input points
        clusterIds.forEach(function (idx) {
            var clusterPoint = points.features[idx];
            if (clusterPoint.properties) clusterPoint.properties.cluster = clusterId;
            else clusterPoint.properties = {cluster: clusterId};
            cluster.push(clusterPoint);
        });
        var centroid = centerOfMass(featureCollection(cluster), {cluster: clusterId});
        centroids.push(centroid);
    });
    // handle noise points, if any
    dbscan.noise.forEach(function (noiseId) {
        noise.push(points.features[noiseId]);
    });

    return {
        points: points,
        centroids: featureCollection(centroids),
        noise: featureCollection(noise)
    };
};
