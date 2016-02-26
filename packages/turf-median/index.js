var inside = require('turf-inside');

/**
 * Calculates the median value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
 *
 * @module turf/median
 * @category aggregation
 * @param {FeatureCollection<Polygon>} polygons input polygons
 * @param {FeatureCollection<Point>} points input points
 * @param {String} inField the field in input data to analyze
 * @param {String} outField the field in which to store results
 * @return {FeatureCollection<Polygon>} polygons with properties listed as `outField` values
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
 *           [18.400039, -33.970697],
 *           [18.400039, -33.818518],
 *           [18.665771, -33.818518],
 *           [18.665771, -33.970697],
 *           [18.400039, -33.970697]
 *         ]]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Polygon",
 *         "coordinates": [[
 *           [18.538742, -34.050383],
 *           [18.538742, -33.98721],
 *           [18.703536, -33.98721],
 *           [18.703536, -34.050383],
 *           [18.538742, -34.050383]
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
 *         "coordinates": [18.514022, -33.860152]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 600
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [18.48999, -33.926269]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 100
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [18.583374, -33.905755]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 200
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [18.591613, -34.024778]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {
 *         "population": 300
 *       },
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [18.653411, -34.017949]
 *       }
 *     }
 *   ]
 * };
 *
 * var medians = turf.median(
 *  polygons, points, 'population', 'median');
 *
 * var resultFeatures = points.features.concat(
 *   medians.features);
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
    poly.properties[outField] = median(values);
  });

  return polyFC;
};

function median(x) {
    // The median of an empty list is null
    if (x.length === 0) return null;

    // Sorting the array makes it easy to find the center, but
    // use `.slice()` to ensure the original array `x` is not modified
    var sorted = x.slice().sort(function (a, b) { return a - b; });

    // If the length of the list is odd, it's the central number
    if (sorted.length % 2 === 1) {
        return sorted[(sorted.length - 1) / 2];
    // Otherwise, the median is the average of the two numbers
    // at the center of the list
    } else {
        var a = sorted[(sorted.length / 2) - 1];
        var b = sorted[(sorted.length / 2)];
        return (a + b) / 2;
    }
}
