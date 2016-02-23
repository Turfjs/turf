var inside = require('turf-inside');

/**
* Calculates the minimum value of a field for a set of {@link Point|points} within a set of {@link Polygon|polygons}.
*
* @module turf/min
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
*           [72.809658, 18.961818],
*           [72.809658, 18.974805],
*           [72.827167, 18.974805],
*           [72.827167, 18.961818],
*           [72.809658, 18.961818]
*         ]]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {},
*       "geometry": {
*         "type": "Polygon",
*         "coordinates": [[
*           [72.820987, 18.947043],
*           [72.820987, 18.95922],
*           [72.841243, 18.95922],
*           [72.841243, 18.947043],
*           [72.820987, 18.947043]
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
*         "coordinates": [72.814464, 18.971396]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 600
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [72.820043, 18.969772]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 100
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [72.817296, 18.964253]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 200
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [72.83575, 18.954837]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {
*         "population": 300
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [72.828197, 18.95094]
*       }
*     }
*   ]
* };
*
* var minimums = turf.min(
*   polygons, points, 'population', 'min');
*
* var resultFeatures = points.features.concat(
*   minimums.features);
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
    poly.properties[outField] = min(values);
  });

  return polyFC;
};

function min(x) {
    var value;
    for (var i = 0; i < x.length; i++) {
        // On the first iteration of this loop, min is
        // undefined and is thus made the minimum element in the array
        if (x[i] < value || value === undefined) value = x[i];
    }
    return value;
}
