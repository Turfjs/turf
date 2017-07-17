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
 * // Create a cluster by Object
 * var cluster1 = getCluster(geojson, {cluster: 1});
 * // Create a cluster by String
 * var cluster2 = getCluster(geojson, 'cluster');
 * // Create a cluster by an Array of Strings
 * var cluster3 = getCluster(geojson, ['cluster', 'foo']);
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
    applyFilter: applyFilter, // Only exposed for testing purposes
    propertiesContainsFilter: propertiesContainsFilter, // Only exposed for testing purposes
    filterProperties: filterProperties // Only exposed for testing purposes
};
