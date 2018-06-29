"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = require("@turf/clone");
var helpers_1 = require("@turf/helpers");
var invariant_1 = require("@turf/invariant");
var meta_1 = require("@turf/meta");
var turf_line_dissolve_1 = require("./turf-line-dissolve");
var turf_polygon_dissolve_1 = require("./turf-polygon-dissolve");
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
    if (options === void 0) { options = {}; }
    // Optional parameters
    options = options || {};
    if (!helpers_1.isObject(options)) {
        throw new Error("options is invalid");
    }
    var mutate = options.mutate;
    // Validation
    if (invariant_1.getType(geojson) !== "FeatureCollection") {
        throw new Error("geojson must be a FeatureCollection");
    }
    if (!geojson.features.length) {
        throw new Error("geojson is empty");
    }
    // Clone geojson to avoid side effects
    // Topojson modifies in place, so we need to deep clone first
    if (mutate === false || mutate === undefined) {
        geojson = clone_1.default(geojson);
    }
    // Assert homogenity
    var type = getHomogenousType(geojson);
    if (!type) {
        throw new Error("geojson must be homogenous");
    }
    // Data => Typescript hack
    var data = geojson;
    switch (type) {
        case "LineString":
            return turf_line_dissolve_1.default(data, options);
        case "Polygon":
            return turf_polygon_dissolve_1.default(data, options);
        default:
            throw new Error(type + " is not supported");
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
    meta_1.flattenEach(geojson, function (feature) {
        types[feature.geometry.type] = true;
    });
    var keys = Object.keys(types);
    if (keys.length === 1) {
        return keys[0];
    }
    return null;
}
exports.default = dissolve;
