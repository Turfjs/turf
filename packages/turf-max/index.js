var inside = require('turf-inside');

/**
 * Calculates the maximum value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/max
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} inField the field in input data to analyze
 * @param {String} outField the field in which to store results
 * @return {FeatureCollection<Polygon>} polygons
 * with properties listed as `outField` values
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
 *           [101.551437, 3.150114],
 *           [101.551437, 3.250208],
 *           [101.742324, 3.250208],
 *           [101.742324, 3.150114],
 *           [101.551437, 3.150114]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [101.659927, 3.011612],
 *           [101.659927, 3.143944],
 *           [101.913986, 3.143944],
 *           [101.913986, 3.011612],
 *           [101.659927, 3.011612]
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
 *         "coordinates": [101.56105, 3.213874]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [101.709365, 3.211817]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [101.645507, 3.169311]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [101.708679, 3.071266]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [101.826782, 3.081551]
 *       }
 *     }
 *   ]
 * };
 *
 * var aggregated = turf.max(
 *   polygons, points, 'population', 'max');
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
    poly.properties[outField] = max(values);
  });

  return polyFC;
};

function max(x) {
    var value;
    for (var i = 0; i < x.length; i++) {
        // On the first iteration of this loop, max is
        // undefined and is thus made the maximum element in the array
        if (x[i] > value || value === undefined) value = x[i];
    }
    return value;
}
