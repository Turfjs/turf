var inside = require('turf-inside');

/**
 * Calculates the average value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/average
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons polygons with values on which to average
 * @param {FeatureCollection<Point>} points points from which to calculate the average
 * @param {String} field the field in the `points` features from which to pull values to average
 * @param {String} outputField the field in `polygons` to put results of the averages
 * @return {FeatureCollection<Polygon>} polygons with the value of `outField` set to the calculated averages
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
 *           [10.666351, 59.890659],
 *           [10.666351, 59.936784],
 *           [10.762481, 59.936784],
 *           [10.762481, 59.890659],
 *           [10.666351, 59.890659]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [10.764541, 59.889281],
 *           [10.764541, 59.937128],
 *           [10.866165, 59.937128],
 *           [10.866165, 59.889281],
 *           [10.764541, 59.889281]
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
 *         "coordinates": [10.724029, 59.926807]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.715789, 59.904778]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.746002, 59.908566]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.806427, 59.908910]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [10.79544, 59.931624]
 *       }
 *     }
 *   ]
 * };
 *
 * var averaged = turf.average(
 *  polygons, points, 'population', 'pop_avg');
 *
 * var resultFeatures = points.features.concat(
 *   averaged.features);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */
module.exports = function(polyFC, ptFC, inField, outField) {
  polyFC.features.forEach(function(poly) {
    if(!poly.properties) poly.properties = {};
    var values = [];
    ptFC.features.forEach(function(pt) {
      if (inside(pt, poly)) values.push(pt.properties[inField]);
    });
    poly.properties[outField] = average(values);
  });

  return polyFC;
};

function average(values) {
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
}
