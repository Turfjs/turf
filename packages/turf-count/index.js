var inside = require('turf-inside');

/**
 * Takes a set of {@link Point|points} and a set of {@link Polygon|polygons} and calculates the number of points that fall within the set of polygons.
 *
 * @module turf/count
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} countField a field to append to the attributes of the Polygon features representing Point counts
 * @return {FeatureCollection<Polygon>} polygons with `countField` appended
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
 *           [-112.072391,46.586591],
 *           [-112.072391,46.61761],
 *           [-112.028102,46.61761],
 *           [-112.028102,46.586591],
 *           [-112.072391,46.586591]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-112.023983,46.570426],
 *           [-112.023983,46.615016],
 *           [-111.966133,46.615016],
 *           [-111.966133,46.570426],
 *           [-112.023983,46.570426]
 *         ]]
 *       }
 *     }
 *   ]
 * };
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-112.0372, 46.608058]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-112.045955, 46.596264]
 *       }
 *     }
 *   ]
 * };
 *
 * var counted = turf.count(polygons, points, 'pt_count');
 *
 * var resultFeatures = points.features.concat(counted.features);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

module.exports = function(polyFC, ptFC, outField) {
  for (var i = 0; i < polyFC.features.length; i++) {
    var poly = polyFC.features[i];
    if(!poly.properties) poly.properties = {};
    var values = 0;
    for (var j = 0; j < ptFC.features.length; j++) {
      var pt = ptFC.features[j];
      if (inside(pt, poly)) {
        values++;
      }
    }
    poly.properties[outField] = values;
  }

  return polyFC;
};
