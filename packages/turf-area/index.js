var geometryArea = require('geojson-area').geometry;

/**
 * Takes a one or more features and returns their area
 * in square meters.
 *
 * @param {(Feature|FeatureCollection)} input input features
 * @return {Number} area in square meters
 * @example
 * var polygons = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-67.031021, 10.458102],
 *           [-67.031021, 10.53372],
 *           [-66.929397, 10.53372],
 *           [-66.929397, 10.458102],
 *           [-67.031021, 10.458102]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-66.919784, 10.397325],
 *           [-66.919784, 10.513467],
 *           [-66.805114, 10.513467],
 *           [-66.805114, 10.397325],
 *           [-66.919784, 10.397325]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 *
 * var area = turf.area(polygons);
 *
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
