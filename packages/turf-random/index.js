var random = require('geojson-random');

/**
 * Generates random {@link GeoJSON} data, including {@link Point|Points} and {@link Polygon|Polygons}, for testing
 * and experimentation.
 *
 * @name random
 * @param {string} [type='point'] type of features desired: 'points' or 'polygons'
 * @param {number} [count=1] how many geometries should be generated.
 * @param {Object} options options relevant to the feature desired. Can include:
 * @param {Array<number>} options.bbox a bounding box inside of which geometries
 * are placed. In the case of {@link Point} features, they are guaranteed to be within this bounds,
 * while {@link Polygon} features have their centroid within the bounds.
 * @param {number} [options.num_vertices=10] options.vertices the number of vertices added
 * to polygon features.
 * @param {Number} [options.max_radial_length=10] the total number of decimal
 * degrees longitude or latitude that a polygon can extent outwards to
 * from its center.
 * @returns {FeatureCollection} generated random features
 * @example
 * var points = turf.random('points', 100, {
 *   bbox: [-70, 40, -60, 60]
 * });
 *
 * var polygons = turf.random('polygons', 4, {
 *   bbox: [-70, 40, -60, 60]
 * });
 *
 * //addToMap
 * var addToMap = [points, polygons]
 */
module.exports = function (type, count, options) {
    options = options || {};
    count = count || 1;
    switch (type) {
    case 'point':
    case 'points':
    case undefined:
        return random.point(count, options.bbox);
    case 'polygon':
    case 'polygons':
        return random.polygon(
                count,
                options.num_vertices,
                options.max_radial_length,
                options.bbox);
    default:
        throw new Error('Unknown type given: valid options are points and polygons');
    }
};
