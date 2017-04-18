var helpers = require('@turf/helpers');
var featureCollection = helpers.featureCollection;
var geometryCollection = helpers.geometryCollection;

/**
 * Takes a GeoJSON Feature or FeatureCollection and truncates the precision of the geometry.
 *
 * @name truncate
 * @param {FeatureCollection|Feature<any>} geojson any GeoJSON Feature, FeatureCollection, Geometry or GeometryCollection.
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates=2] maximum number of coordinates (primarly used to remove z coordinates)
 * @returns {FeatureCollection|Feature<any>} layer with truncated geometry
 * @example
 * var point = {
 *     "type": "Feature",
 *     "properties": {}
 *     "geometry": {
 *         "type": "Point",
 *         "coordinates": [
 *             70.46923055566859,
 *             58.11088890802906,
 *             1508
 *         ]
 *     }
 * };
 * var truncated = turf.truncate(point);
 * //= truncated
 */
module.exports = function (geojson, precision, coordinates) {
    // validation
    if (!geojson) throw new Error('geojson is required');

    // default params
    precision = (precision !== undefined) ? precision : 6;
    coordinates = (coordinates !== undefined) ? coordinates : 2;

    switch (geojson.type) {
    case 'GeometryCollection':
        var geometries = geojson.geometries.map(function (geometry) {
            return truncateGeometry(geometry, precision, coordinates);
        });
        return geometryCollection(geometries);
    case 'FeatureCollection':
        var features = geojson.features.map(function (feature) {
            return truncate(feature, precision, coordinates);
        });
        return featureCollection(features);
    case 'Feature':
        return truncate(geojson, precision, coordinates);
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
        return truncateGeometry(geojson, precision, coordinates);
    default:
        throw new Error('invalid type');
    }
};

/**
 * Truncate Feature
 *
 * @private
 * @param {Feature<any>} feature GeoJSON Feature
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates=2] maximum number of coordinates (primarly used to remove z coordinates)
 * @returns {Feature<any>} truncated Feature
 */
function truncate(feature, precision, coordinates) {
    var geometry = truncateGeometry(feature.geometry, precision, coordinates);
    return helpers.feature(geometry, feature.properties);
}

/**
 * Truncate Geometry
 *
 * @private
 * @param {Geometry<any>} geometry GeoJSON Geometry Object
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates=2] maximum number of coordinates (primarly used to remove z coordinates)
 * @returns {Geometry<any>} truncated Geometry Object
 */
function truncateGeometry(geometry, precision, coordinates) {
    var coords = geometry.coordinates;
    if (coordinates !== undefined) coords = deepSlice(coords, 0, coordinates);
    coords = toFix(coords, precision);

    return {type: geometry.type, coordinates: coords};
}

/**
 * toFix
 *
 * @private
 * @param {Array<number>} array Array of numbers
 * @param {number} precision Decimal precision
 * @returns {Array<number>} array of fixed numbers
 */
function toFix(array, precision) {
    return array.map(function (value) {
        if (typeof value === 'object') { return toFix(value, precision); }
        return Number(value.toFixed(precision));
    });
}

/**
 * Recursive Array.prototype.slice()
 * https://github.com/DenisCarriere/deep-slice
 *
 * @private
 * @param {Array} items Array input
 * @param {number} start The beginning of the specified portion of the array.
 * @param {number} end The end of the specified portion of the array.
 * @returns {Array} Returns a section of an array.
 * @example
 * deepSlice([[10, 20, 30], [40, 50, 60]], 0, 2)
 * //=[[10, 20], [40, 50]]
 */
function deepSlice(items, start, end) {
    if (typeof items[0] !== 'object') {
        return items.slice(start, end);
    }
    return items.map(function (item) {
        return deepSlice(item, start, end);
    });
}
