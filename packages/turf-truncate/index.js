const deepSlice = require('deep-slice');

/**
 * Takes a GeoJSON Feature or FeatureCollection and truncates the precision of the geometry.
 *
 * @name truncate
 * @param {Feature|FeatureCollection} layer any GeoJSON Feature or FeatureCollection
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates] maximum number of coordinates
 * @returns {Feature|FeatureCollection} layer with truncated geometry
 * @example
 * var point = {
 *     "type": "Feature",
 *     "geometry": {
 *         "type": "Point",
 *         "coordinates": [
 *             70.46923055566859,
 *             58.11088890802906
 *         ]
 *     },
 *     "properties": {}
 * };
 * var pointTrunc = turf.truncate(point, 6);
 * //= pointTrunc
 */
module.exports = function (layer, precision = 6, coordinates) {
    if (layer === undefined) { throw new Error('layer is required'); }
    switch (layer.type) {
    case 'FeatureCollection': {
        const collection = [];
        for (const feature of layer.features) {
            collection.push(truncate(feature, precision, coordinates));
        }
        layer.features = collection;
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
    return array.map(value => {
        if (typeof (value) === 'object') { return toFix(value, precision); }
        return Number(value.toFixed(precision));
    });
}
