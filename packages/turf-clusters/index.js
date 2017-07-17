/**
 * Get Cluster
 *
 * @param {FeatureCollection|Feature[]} geojson GeoJSON Features
 * @param {*} filter Filter used on GeoJSON properties to get Cluster
 * @returns {FeatureCollection} Single Cluster filtered by GeoJSON Properties
 * @example
 * var geojson = turf.featureCollection([
 *     turf.point([0, 0], {cluster: 0, foo: 'null'}),
 *     turf.point([2, 4], {cluster: 1, foo: 'bar'}),
 *     turf.point([3, 6], {cluster: 1}),
 *     turf.point([5, 1], {0: 'foo'}),
 *     turf.point([4, 2], {'bar': 'foo'})
 * ]);
 *
 * // Create a cluster by Object
 * var cluster1 = turf.getCluster(geojson, {cluster: 1});
 *
 * // Create a cluster by String
 * var cluster2 = turf.getCluster(geojson, 'cluster');
 *
 * // Create a cluster by an Array of Strings
 * var cluster3 = turf.getCluster(geojson, ['cluster', 'foo']);
 */
function getCluster(geojson, filter) {
    // Validation
    if (!geojson) throw new Error('geojson is required');
    if (filter === undefined || filter === null) throw new Error('filter is required');
    if (geojson.type === 'FeatureCollection') geojson = geojson.features;
    if (!Array.isArray(geojson)) throw new Error('invalid geojson');

    // Filter
    var features = [];
    for (var i = 0; i < geojson.length; i++) {
        var feature = geojson[i];
        var properties = feature.properties;
        if (applyFilter(properties, filter)) features.push(feature);
    }
    return {
        type: 'FeatureCollection',
        features: features
    };
}

/**
 * Callback for clusterEach
 *
 * @private
 * @callback clusterEachCallback
 * @param {FeatureCollection} cluster The current cluster being processed.
 * @param {*} clusterValue Value used to create cluster being processed.
 * @param {number} currentIndex The index of the current element being processed in the array.Starts at index 0
 * @returns {void}
 */

/**
 * clusterEach
 *
 * @param {FeatureCollection|Feature[]} geojson GeoJSON Features
 * @param {string|number} property GeoJSON property key/value used to create clusters
 * @param {Function} callback a method that takes (cluster, clusterValue, currentIndex)
 * @returns {void}
 * @example
 * var geojson = turf.featureCollection([
 *     turf.point([0, 0], {cluster: 0, foo: 'null'}),
 *     turf.point([2, 4], {cluster: 1, foo: 'bar'}),
 *     turf.point([3, 6], {cluster: 1}),
 *     turf.point([5, 1], {0: 'foo'}),
 *     turf.point([4, 2], {'bar': 'foo'})
 * ]);
 * clusterEach(geojson, 'cluster', function (cluster, clusterValue, currentIndex) {
 *   //= cluster
 *   //= clusterValue
 *   //= currentIndex
 * })
 */
function clusterEach(geojson, property, callback) {
    // Validation
    if (!geojson) throw new Error('geojson is required');
    if (property === undefined || property === null) throw new Error('property is required');
    if (geojson.type === 'FeatureCollection') geojson = geojson.features;
    if (!Array.isArray(geojson)) throw new Error('invalid geojson');

    // Create clusters based on property values
    var bins = createBins(geojson, property);
    var values = Object.keys(bins);
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var bin = bins[value];
        var features = [];
        for (var j = 0; j < bin.length; j++) {
            var id = bin[j];
            features.push(geojson[id]);
        }
        callback({
            type: 'FeatureCollection',
            features: features
        }, value, i);
    }
}

/**
 * Callback for clusterReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @private
 * @callback clusterReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {FeatureCollection} cluster The current cluster being processed.
 * @param {*} clusterValue Value used to create cluster being processed.
 * @param {number} currentIndex The index of the current element being processed in the
 * array. Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 */

/**
 * Reduce clusters in GeoJSON Features, similar to Array.reduce()
 *
 * @name clusterReduce
 * @param {FeatureCollection|Feature[]} geojson GeoJSON Features
 * @param {string|number} property GeoJSON property key/value used to create clusters
 * @param {Function} callback a method that takes (previousValue, cluster, clusterValue, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var geojson = turf.featureCollection([
 *     turf.point([0, 0], {cluster: 0, foo: 'null'}),
 *     turf.point([2, 4], {cluster: 1, foo: 'bar'}),
 *     turf.point([3, 6], {cluster: 1}),
 *     turf.point([5, 1], {0: 'foo'}),
 *     turf.point([4, 2], {'bar': 'foo'})
 * ]);
 * turf.clusterReduce(geojson, 'cluster', function (previousValue, cluster, clusterValue, currentIndex) {
 *   //=previousValue
 *   //=cluster
 *   //=clusterValue
 *   //=currentIndex
 *   return cluster;
 * });
 */
function clusterReduce(geojson, property, callback, initialValue) {
    var previousValue = initialValue;
    clusterEach(geojson, property, function (cluster, clusterValue, currentIndex) {
        if (currentIndex === 0 && initialValue === undefined) previousValue = cluster;
        else previousValue = callback(previousValue, cluster, clusterValue, currentIndex);
    });
    return previousValue;
}

/**
 * Create Bins
 *
 * @private
 * @param {Feature[]} features GeoJSON Features
 * @param {string} property Property values are used to create bins
 * @returns {Object} bins with Feature IDs
 * @example
 * const features = [
 *     point([0, 0], {cluster: 0, foo: 'null'}),
 *     point([2, 4], {cluster: 1, foo: 'bar'}),
 *     point([5, 1], {0: 'foo'}),
 *     point([3, 6], {cluster: 1}),
 * ];
 * createBins(features, 'cluster');
 * //= { '0': [ 0 ], '1': [ 1, 3 ] }
 */
function createBins(features, property) {
    var bins = {};

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        var properties = feature.properties || {};
        if (properties.hasOwnProperty(property)) {
            var value = properties[property];
            if (bins.hasOwnProperty(value)) bins[value].push(i);
            else bins[value] = [i];
        }
    }
    return bins;
}

/**
 * Apply Filter
 *
 * @private
 * @param {*} properties Properties
 * @param {*} filter Filter
 * @returns {Boolean} applied Filter to properties
 */
function applyFilter(properties, filter) {
    if (properties === undefined) return false;
    var filterType = typeof filter;

    // String & Number
    if (filterType === 'number' || filterType === 'string') return properties.hasOwnProperty(filter);
    // Array
    else if (Array.isArray(filter)) {
        for (var i = 0; i < filter.length; i++) {
            if (!applyFilter(properties, filter[i])) return false;
        }
        return true;
    // Object
    } else {
        return propertiesContainsFilter(properties, filter);
    }
}

/**
 * Properties contains filter (does not apply deepEqual operations)
 *
 * @private
 * @param {*} properties Properties
 * @param {Object} filter Filter
 * @returns {Boolean} does filter equal Properties
 * @example
 * propertiesContainsFilter({foo: 'bar', cluster: 0}, {cluster: 0})
 * //= true
 * propertiesContainsFilter({foo: 'bar', cluster: 0}, {cluster: 1})
 * //= false
 */
function propertiesContainsFilter(properties, filter) {
    var keys = Object.keys(filter);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (properties[key] !== filter[key]) return false;
    }
    return true;
}

/**
 * Filter Properties
 *
 * @private
 * @param {*} properties Properties
 * @param {string[]} keys Used to filter Properties
 * @returns {*} filtered Properties
 * @example
 * filterProperties({foo: 'bar', cluster: 0}, ['cluster'])
 * //= {cluster: 0}
 */
function filterProperties(properties, keys) {
    if (!keys) return {};
    if (!keys.length) return {};

    var newProperties = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (properties.hasOwnProperty(key)) newProperties[key] = properties[key];
    }
    return newProperties;
}

module.exports = {
    getCluster: getCluster,
    clusterEach: clusterEach,
    clusterReduce: clusterReduce,
    createBins: createBins, // Only exposed for testing purposes
    applyFilter: applyFilter, // Only exposed for testing purposes
    propertiesContainsFilter: propertiesContainsFilter, // Only exposed for testing purposes
    filterProperties: filterProperties // Only exposed for testing purposes
};
