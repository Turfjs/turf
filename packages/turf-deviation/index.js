var ss = require('simple-statistics');
var inside = require('turf-inside');

/**
 * Calculates the standard deviation value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/deviation
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} inField the field in `points` from which to aggregate
 * @param {String} outField the field to append to `polygons` representing deviation
 * @return {FeatureCollection<Polygon>} polygons with appended field representing deviation
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
 *           [-97.807159, 30.270335],
 *           [-97.807159, 30.369913],
 *           [-97.612838, 30.369913],
 *           [-97.612838, 30.270335],
 *           [-97.807159, 30.270335]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-97.825698, 30.175405],
 *           [-97.825698, 30.264404],
 *           [-97.630691, 30.264404],
 *           [-97.630691, 30.175405],
 *           [-97.825698, 30.175405]
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
 *         "population": 500
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.709655, 30.311245]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 400
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.766647, 30.345028]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.765274, 30.294646]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 500
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.753601, 30.216355]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.667083, 30.208047]
 *       }
 *     }
 *   ]
 * };
 *
 * var inField = "population";
 * var outField = "pop_deviation";
 *
 * var deviated = turf.deviation(
 *   polygons, points, inField, outField);
 *
 * var resultFeatures = points.features.concat(
 *   deviated.features);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */

module.exports = function(polyFC, ptFC, inField, outField) {
  polyFC.features.forEach(function(poly) {
    if(!poly.properties) {
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt) {
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    });
    poly.properties[outField] = ss.standard_deviation(values);
  });

  return polyFC;
};
