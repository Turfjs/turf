import clone from '@turf/clone';
import { merge } from 'topojson-client';
import { getType } from '@turf/invariant';
import { topology } from 'topojson-server';
import { flattenEach } from '@turf/meta';
import { isObject, geometryCollection } from '@turf/helpers';

/**
 * Dissolves all overlapping (Multi)Polygon
 *
 * @param {FeatureCollection<Polygon|MultiPolygon>} geojson Polygons to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<Polygon|MultiPolygon>} Dissolved Polygons
 */
function polygonDissolve(geojson, options) {
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

    var geoms = [];
    flattenEach(geojson, function (feature) {
        geoms.push(feature.geometry);
    });
    var topo = topology({geoms: geometryCollection(geoms).geometry});
    return merge(topo, topo.objects.geoms.geometries);
}

export default polygonDissolve;
