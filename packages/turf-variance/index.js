var ss = require('simple-statistics');
var inside = require('turf-inside');

/**
 * Calculates the variance value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/variance
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} inField the field in input data to analyze
 * @param {String} outField the field in which to store results
 * @return {FeatureCollection<Polygon>} polygons
 * with properties listed as `outField`
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
 *           [-97.414398, 37.684092],
 *           [-97.414398, 37.731353],
 *           [-97.332344, 37.731353],
 *           [-97.332344, 37.684092],
 *           [-97.414398, 37.684092]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [-97.333717, 37.606072],
 *           [-97.333717, 37.675397],
 *           [-97.237586, 37.675397],
 *           [-97.237586, 37.606072],
 *           [-97.333717, 37.606072]
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
 *         "coordinates": [-97.401351, 37.719676]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.355346, 37.706639]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.387962, 37.70012]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.301788, 37.66507]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-97.265052, 37.643325]
 *       }
 *     }
 *   ]
 * };
 *
 * var aggregated = turf.variance(
 *   polygons, points, 'population', 'variance');
 *
 * var resultFeatures = points.features.concat(
 *   aggregated.features);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function (polyFC, ptFC, inField, outField) {
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
    poly.properties[outField] = ss.variance(values);
  });

  return polyFC;
};
