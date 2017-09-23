import { featureEach } from '@turf/meta';

/**
 * Create Bins
 *
 * @private
 * @param {FeatureCollection} geojson GeoJSON Features
 * @param {string|number} property Property values are used to create bins
 * @returns {Object} bins with Feature IDs
 * @example
 * const geojson = turf.featureCollection([
 *     turf.point([0, 0], {cluster: 0, foo: 'null'}),
 *     turf.point([2, 4], {cluster: 1, foo: 'bar'}),
 *     turf.point([5, 1], {0: 'foo'}),
 *     turf.point([3, 6], {cluster: 1}),
 * ]);
 * createBins(geojson, 'cluster');
 * //= { '0': [ 0 ], '1': [ 1, 3 ] }
 */
export function createBins(geojson, property) {
    var bins = {};

    featureEach(geojson, function (feature, i) {
        var properties = feature.properties || {};
        if (properties.hasOwnProperty(property)) {
            var value = properties[property];
            if (bins.hasOwnProperty(value)) bins[value].push(i);
            else bins[value] = [i];
        }
    });
    return bins;
}

/**
* Apply Filter
*
* @private
* @param {*} properties Properties
* @param {*} filter Filter
* @returns {boolean} applied Filter to properties
*/
export function applyFilter(properties, filter) {
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
* @returns {boolean} does filter equal Properties
* @example
* propertiesContainsFilter({foo: 'bar', cluster: 0}, {cluster: 0})
* //= true
* propertiesContainsFilter({foo: 'bar', cluster: 0}, {cluster: 1})
* //= false
*/
export function propertiesContainsFilter(properties, filter) {
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
export function filterProperties(properties, keys) {
    if (!keys) return {};
    if (!keys.length) return {};

    var newProperties = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (properties.hasOwnProperty(key)) newProperties[key] = properties[key];
    }
    return newProperties;
}
