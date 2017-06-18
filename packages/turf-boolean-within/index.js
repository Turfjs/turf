var contains = require('../turf-boolean-contains');

/**
 * Within returns True if the first geometry is completely within the second geometry.
 *
 * @name within
 * @param {Geometry|Feature<any>} feature1 GeoJSON Feature or Geometry
 * @param {Geometry|Feature<any>} feature2 GeoJSON Feature or Geometry
 * @returns {Boolean} true/false
 * @example
 * const point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [1, 1]
 *   }
 * }
 * const line = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "LineString",
 *     "coordinates": [[1, 1], [1, 2], [1, 3], [1, 4]]
 *   }
 * }
 * var within = turf.within(point, line);
 * //=true
 */
module.exports = function (feature1, feature2) {
    return contains(feature2, feature1);
};
