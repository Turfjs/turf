var bbox = require('@turf/bbox');
var point = require('@turf/helpers').point;

/**
 * Takes a {@link Feature} or {@link FeatureCollection} and returns the absolute center point of all features.
 *
 * @name center
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [properties] an Object that is used as the {@link Feature}'s properties
 * @returns {Feature<Point>} a Point feature at the absolute center point of all input features
 * @example
 * var features = turf.featureCollection([
 *   turf.point( [-97.522259, 35.4691]),
 *   turf.point( [-97.502754, 35.463455]),
 *   turf.point( [-97.508269, 35.463245])
 * ]);
 *
 * var center = turf.center(features);
 *
 * //addToMap
 * var addToMap = [features, center]
 * center.properties['marker-size'] = 'large';
 * center.properties['marker-color'] = '#000';
 */
module.exports = function (geojson, properties) {
    var ext = bbox(geojson);
    var x = (ext[0] + ext[2]) / 2;
    var y = (ext[1] + ext[3]) / 2;
    return point([x, y], properties);
};
