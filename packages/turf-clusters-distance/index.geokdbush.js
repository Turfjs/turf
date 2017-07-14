var Set = require('es6-set');
var Map = require('es6-map');
var kdbush = require('kdbush');
var geokdbush = require('geokdbush');
var collectionOf = require('@turf/invariant').collectionOf;
var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;
var convertDistance = helpers.convertDistance;

/**
 * Takes a set of {@link Point|points} and partition them into clusters.
 *
 * @name clustersDistance
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance to generate the clusters (kilometers only)
 * @param {string} [units=kilometers] in which `maxDistance` is expressed, can be degrees, radians, miles, or kilometers
 * @param {number} [minPoints=1] Minimum number of points to generate a single cluster, points will be excluded if the cluster does not meet the minimum amounts of points.
 * @returns {FeatureCollection<Point>} clustered points
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

    // Default values
    minPoints = minPoints || 1;
    var maxDistanceKm = convertDistance(maxDistance, units);

    // Generate IDs - 11,558,342 ops/sec
    points = generateUniqueIds(points);

    // Create KDBush Tree - 3,305,155 ops/sec
    var tree = kdbush(points.features, getX, getY);

    // Create Clusters - 13,041 ops/sec
    var clusters = createClusters(tree, maxDistanceKm);

    // Join Clusters - 4,435 ops/sec
    var joined = joinClusters(clusters);

    // Remove Clusters based on minPoints
    var removed = removeClusters(joined, minPoints);

    // Clusters To Features -
    var features = clustersToFeatures(removed, points, minPoints);

    return {
        points: features,
        centroids: featureCollection([]),
        noise: featureCollection([])
    };
};

function getX(p) {
    return p.geometry.coordinates[0];
}

function getY(p) {
    return p.geometry.coordinates[1];
}

/**
 * Create Clusters - Set of indexes
 *
 * @param {KDBush} tree KDBush Tree
 * @param {number} maxDistance Maximum Distance (in kilometers)
 * @returns {Map<number, Set<number>>} Map<clusterId, cluster> A Map which contains a Set of Feature ids which are 'around' by maxDistance
 * @example
 * createClusters(tree, maxDistance)
 * //= Map {
 *   0 => Set { 0, 2, 1, 5, 4, 3 },
 *   1 => Set { 1, 2, 0, 5, 4, 3 },
 *   ...
 *   25 => Set { 25 },
 *   26 => Set { 26, 23, 21, 24, 22, 11, 8, 7, 10, 6, 9, 13 }
 * }
 */
function createClusters(tree, maxDistance) {
    var clusters = new Map();
    var clusterId = 0;
    tree.ids.forEach(function (id) {
        // Cluster contains a Set of Feature IDs
        var cluster = new Set();
        var feature = tree.points[id];

        // Find points around Max Distance
        var around = geokdbush.around(tree, getX(feature), getY(feature), Infinity, maxDistance);
        around.forEach(function (feature) {
            cluster.add(feature.id);
        });
        clusters.set(clusterId, cluster);
        clusterId++;
    });
    return clusters;
}

/**
 * Joins clusters together
 *
 * @param {Map<number, Set<number>>} clusters Created Clusters
 * @returns {Map<number, Set<number>>} Map<clusterId, cluster> joined clusters
 * joinClusters(clusters)
 * //= Map {
 *   0 => Set { 0, 2, 1, 5, 4, 3 },
 *   1 => Set { 6, 10, 13, 8, 12, 9, 11, 7, 22, 24, 21, 23, 26 },
 *   2 => Set { 14, 20, 18, 19, 16, 15, 17 },
 *   3 => Set { 25 }
 * }
 */
function joinClusters(clusters) {
    var totalClusters = clusters.size;
    var newClusterId = 0;
    var newClusters = new Map();

    // Iterate over cluster and join clusters together
    clusters.forEach(function (clusterOuter, clusterOuterId) {
        clusters.forEach(function (clusterInner, clusterInnerId) {
            if (!clusters.has(clusterOuterId) || !clusters.has(clusterInnerId)) return;
            if (clusterOuterId === clusterInnerId) return;
            if (setContains(clusterOuter, clusterInner)) {
                newClusters.set(newClusterId, setJoin(clusterOuter, clusterInner));
                clusters.delete(clusterOuterId);
                clusters.delete(clusterInnerId);
                newClusterId++;
            }
        });
    });
    // Add remaining clusters which did not need to be merged
    clusters.forEach(function (cluster) {
        newClusters.set(newClusterId, cluster);
        newClusterId++;
    });

    // Restart Join operation if cluster size changes
    // Happens when multiple small clusters are joined by narrow edges
    if (newClusters.size < totalClusters) return joinClusters(newClusters);
    else return newClusters;
}

/**
 * Set Contains
 *
 * @param {Set<number>} set1 Set
 * @param {Set<number>} set2 Set
 * @returns {boolean} (true) if Set1 contains a number in Set2
 */
function setContains(set1, set2) {
    var boolean = false;
    set1.forEach(function (value) {
        if (set2.has(value)) boolean = true;
    });
    return boolean;
}

/**
 * Set Join
 *
 * @param {Set<number>} set1 Set
 * @param {Set<number>} set2 Set
 * @returns {Set<number>} Joins two Sets together
 */
function setJoin(set1, set2) {
    var join = new Set();
    set1.forEach(function (value) {
        join.add(value);
    });
    set2.forEach(function (value) {
        join.add(value);
    });
    return join;
}

/**
 * Generates new Unique IDs for all features inside FeatureCollection
 * 2,790,204 ops/sec ±1.40% (89 runs sampled)
 *
 * @param {FeatureCollection<any>} geojson GeoJSON FeatureCollection
 * @returns {FeatureCollection<any>} mutated GeoJSON FeatureCollection
 */
function generateUniqueIds(geojson) {
    for (var i = 0; i < geojson.features.length; i++) {
        geojson.features[i].id = i;
    }
    return geojson;
}

/**
 * Remove Clusters based on Minimum Points allowed
 *
 * @param {Map<number, Set<number>>} clusters Clusters
 * @param {number} minPoints Minimum Points
 * @returns {Map<number, Set<number>>} removed clusters
 */
function removeClusters(clusters, minPoints) {
    var clusterId = 0;
    var newClusters = new Map();
    clusters.forEach(function (cluster) {
        if (cluster.size >= minPoints) {
            newClusters.set(clusterId, cluster);
            clusterId++;
        }
    });
    return newClusters;
}

/**
 * Clusters to Features
 *
 * @param {Map<number, Set<number>>} clusters Clusters
 * @param {FeatureCollection<Point>} points Points
 * @returns {GeoJSON.FeatureCollection<GeoJSON.Point>} FeatureCollection of Points with 'cluster' added to properties
 */
function clustersToFeatures(clusters, points) {
    var features = [];
    clusters.forEach(function (cluster, clusterId) {
        cluster.forEach(function (id) {
            var feature = points.features[id];
            if (feature.properties) feature.properties.cluster = clusterId;
            else feature.properties = {cluster: clusterId};
            features.push(feature);
        });
    });
    return featureCollection(features);
}
