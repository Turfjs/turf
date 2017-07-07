var kdbush = require('kdbush');
var geokdbush = require('geokdbush');
var collectionOf = require('@turf/invariant').collectionOf;

/**
 * Takes a set of {@link Point|points} and partition them into clusters.
 *
 * @name clustersDistance
 * @param {FeatureCollection<Point>} points to be clustered
 * @param {number} maxDistance Maximum Distance to generate the clusters (kilometers only)
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
module.exports = function (points, maxDistance) {
    // Input validation
    collectionOf(points, 'Point', 'Input must contain Points');

    // Create index
    const tree = kdbush(points.features, getX, getY);

    // Iterate over each untagged Feature
    let clusterId = -1;
    tree.ids.forEach(function (id) {
        const feature = tree.points[id];

        // Define new clusterId
        if (feature.properties.cluster === undefined) {
            clusterId++;
            feature.properties.cluster = clusterId;
        // Don't process feature that has already been associated by a clusterId
        } else return;

        // Find features around untagged cluster
        const around = geokdbush.around(tree, getX(feature), getY(feature), Infinity, maxDistance);
        around.forEach(function (feature) {
            feature.properties.cluster = clusterId;
        });
    });
    return {
        type: 'FeatureCollection',
        features: tree.points
    };
};

function getX(p) {
    return p.geometry.coordinates[0];
}

function getY(p) {
    return p.geometry.coordinates[1];
}
