var geometryArea = require('@mapbox/geojson-area').geometry;

/**
 * Takes one or more features and returns their area in square meters.
 *
 * @param {(Feature|FeatureCollection)} input input features
 * @returns {number} area in square meters
 * @addToMap polygon
 * @example
 * var polygon = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [
 *       [
 *         [125, -15],
 *         [113, -22],
 *         [117, -37],
 *         [130, -33],
 *         [148, -39],
 *         [154, -27],
 *         [144, -15],
 *         [125, -15]
 *       ]
 *     ]
 *   }
 * }
 * var area = turf.area(polygon);
 * //=polygon
 * //=area
 */
function area(input) {
    if (input.type === 'FeatureCollection') {
        for (var i = 0, sum = 0; i < input.features.length; i++) {
            if (input.features[i].geometry) {
                sum += geometryArea(input.features[i].geometry);
            }
        }
        return sum;
    } else if (input.type === 'Feature') {
        return geometryArea(input.geometry);
    } else {
        return geometryArea(input);
    }
}
module.exports = area;
