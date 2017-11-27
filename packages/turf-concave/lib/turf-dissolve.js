import clone from '@turf/clone';
import { getType } from '@turf/invariant';
import { isObject } from '@turf/helpers';
import { flattenEach } from '@turf/meta';
import lineDissolve from './turf-line-dissolve';
import polygonDissolve from './turf-polygon-dissolve';

/**
 * Transform function: attempts to dissolve geojson objects where possible
 * [GeoJSON] -> GeoJSON geometry
 *
 * @private
 * @param {FeatureCollection<LineString|MultiLineString|Polygon|MultiPolygon>} geojson Features to dissolved
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<MultiLineString|MultiPolygon>} Dissolved Features
 */
function dissolve(geojson, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var mutate = options.mutate;

    // Validation
    if (getType(geojson) !== 'FeatureCollection') throw new Error('geojson must be a FeatureCollection');
    if (!geojson.features.length) throw new Error('geojson is empty');

    // Clone geojson to avoid side effects
    // Topojson modifies in place, so we need to deep clone first
    if (mutate === false || mutate === undefined) geojson = clone(geojson);

    // Assert homogenity
    var type = getHomogenousType(geojson);
    if (!type) throw new Error('geojson must be homogenous');

    switch (type) {
    case 'LineString':
        return lineDissolve(geojson, options);
    case 'Polygon':
        return polygonDissolve(geojson, options);
    default:
        throw new Error(type + ' is not supported');
    }
}

/**
 * Checks if GeoJSON is Homogenous
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON
 * @returns {string|null} Homogenous type or null if multiple types
 */
function getHomogenousType(geojson) {
    var types = {};
    flattenEach(geojson, function (feature) {
        types[feature.geometry.type] = true;
    });
    var keys = Object.keys(types);
    if (keys.length === 1) return keys[0];
    return null;
}

export default dissolve;
