/**
 * Takes a GeoJSON Feature or FeatureCollection and truncates the precision of the geometry.
 *
 * @name truncate
 * @param {(Feature|FeatureCollection)} layer any GeoJSON Feature or FeatureCollection
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates=2] maximum number of coordinates (primarly used to remove z coordinates)
 * @returns {(Feature|FeatureCollection)} layer with truncated geometry
 * @example
 * var point = {
 *     "type": "Feature",
 *     "geometry": {
 *         "type": "Point",
 *         "coordinates": [
 *             70.46923055566859,
 *             58.11088890802906,
 *             1508
 *         ]
 *     },
 *     "properties": {}
 * };
 * var pointTrunc = turf.truncate(point);
 * //= pointTrunc
 */
module.exports = function (layer, precision, coordinates) {
    precision = (precision !== undefined) ? precision : 6;
    coordinates = (coordinates !== undefined) ? coordinates : 2;

    if (layer === undefined) throw new Error('layer is required');

    switch (layer.type) {
    case 'FeatureCollection': {
        layer.features = layer.features.map(function (feature) {
            return truncate(feature, precision, coordinates);
        });
        return layer;
    }
    case 'Feature':
        return truncate(layer, precision, coordinates);
    default:
        throw new Error('invalid type');
    }
};

function truncate(feature, precision, coordinates) {
    if (coordinates !== undefined) { feature.geometry.coordinates = deepSlice(feature.geometry.coordinates, 0, coordinates); }
    feature.geometry.coordinates = toFix(feature.geometry.coordinates, precision);
    return feature;
}

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
