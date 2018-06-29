"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("@turf/clone");
var helpers_1 = require("@turf/helpers");
var invariant_1 = require("@turf/invariant");
var meta_1 = require("@turf/meta");
var topojson_1 = require("topojson");
/**
 * Dissolves all overlapping (Multi)Polygon
 *
 * @param {FeatureCollection<Polygon|MultiPolygon>} geojson Polygons to dissolve
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.mutate=false] Prevent input mutation
 * @returns {Feature<Polygon|MultiPolygon>} Dissolved Polygons
 */
function polygonDissolve(geojson, options) {
    if (options === void 0) { options = {}; }
    // Validation
    if (invariant_1.getType(geojson) !== "FeatureCollection") {
        throw new Error("geojson must be a FeatureCollection");
    }
    if (!geojson.features.length) {
        throw new Error("geojson is empty");
    }
    // Clone geojson to avoid side effects
    // Topojson modifies in place, so we need to deep clone first
    if (options.mutate === false || options.mutate === undefined) {
        geojson = clone_1.default(geojson);
    }
    var geoms = [];
    meta_1.flattenEach(geojson, function (feature) {
        geoms.push(feature.geometry);
    });
    var topo = topojson_1.topology({ geoms: helpers_1.geometryCollection(geoms).geometry });
    var merged = topojson_1.merge(topo, topo.objects.geoms.geometries);
    return merged;
}
exports.default = polygonDissolve;
