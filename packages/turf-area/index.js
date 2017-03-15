var area = require('@mapbox/geojson-area').geometry;
var geomReduce = require('@turf/meta').geomReduce;

/**
 * Takes one or more features and returns their area in square meters.
 *
 * @name area
 * @param {FeatureCollection|Feature<any>} geojson input GeoJSON feature(s)
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
 * //=area => square meters
 * //=polygon
 */
module.exports = function (geojson) {
    return geomReduce(geojson, function (value, geometry) {
        return value + area(geometry);
    }, 0);
};
