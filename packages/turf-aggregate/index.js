var average = require('turf-average');
var sum = require('turf-sum');
var median = require('turf-median');
var min = require('turf-min');
var max = require('turf-max');
var deviation = require('turf-deviation');
var variance = require('turf-variance');
var count = require('turf-count');
var operations = {};
operations.average = average;
operations.sum = sum;
operations.median = median;
operations.min = min;
operations.max = max;
operations.deviation = deviation;
operations.variance = variance;
operations.count = count;

/**
* Calculates a series of aggregations for a set of {@link Point|points} within a set of {@link Polygon|polygons}. Sum, average, count, min, max, and deviation are supported.
*
* @module turf/aggregate
* @category aggregation
* @param {FeatureCollection<Polygon>} polygons polygons with values on which to aggregate
* @param {FeatureCollection<Point>} points points to be aggregated
* @param {Array} aggregations an array of aggregation objects
* @return {FeatureCollection<Polygon>} polygons with properties listed based on `outField` values in `aggregations`
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
*           [1.669921, 48.632908],
*           [1.669921, 49.382372],
*           [3.636474, 49.382372],
*           [3.636474, 48.632908],
*           [1.669921, 48.632908]
*         ]]
*       }
*     }, {
*       "type": "Feature",
*       "properties": {},
*       "geometry": {
*         "type": "Polygon",
*         "coordinates": [[
*           [2.230224, 47.85003],
*           [2.230224, 48.611121],
*           [4.361572, 48.611121],
*           [4.361572, 47.85003],
*           [2.230224, 47.85003]
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
*         "coordinates": [2.054443,49.138596]
*       }
*     },
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 600
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [3.065185,48.850258]
*       }
*     },
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 100
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [2.329101,48.79239]
*       }
*     },
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 200
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [2.614746,48.334343]
*       }
*     },
*     {
*       "type": "Feature",
*       "properties": {
*         "population": 300
*       },
*       "geometry": {
*         "type": "Point",
*         "coordinates": [3.416748,48.056053]
*       }
*     }
*   ]
* };
* var aggregations = [
*   {
*     aggregation: 'sum',
*     inField: 'population',
*     outField: 'pop_sum'
*   },
*   {
*     aggregation: 'average',
*     inField: 'population',
*     outField: 'pop_avg'
*   },
*   {
*     aggregation: 'median',
*     inField: 'population',
*     outField: 'pop_median'
*   },
*   {
*     aggregation: 'min',
*     inField: 'population',
*     outField: 'pop_min'
*   },
*   {
*     aggregation: 'max',
*     inField: 'population',
*     outField: 'pop_max'
*   },
*   {
*     aggregation: 'deviation',
*     inField: 'population',
*     outField: 'pop_deviation'
*   },
*   {
*     aggregation: 'variance',
*     inField: 'population',
*     outField: 'pop_variance'
*   },
*   {
*     aggregation: 'count',
*     inField: '',
*     outField: 'point_count'
*   }
* ];
*
* var aggregated = turf.aggregate(
*   polygons, points, aggregations);
*
* var result = turf.featurecollection(
*   points.features.concat(aggregated.features));
*
* //=result
*/

module.exports = function(polygons, points, aggregations) {
  for (var i = 0, len = aggregations.length; i < len; i++) {
    var agg = aggregations[i],
      operation = agg.aggregation;

    if (isAggregationOperation(operation)) {
      if (operation === 'count') {
        polygons = operations[operation](polygons, points, agg.outField);
      } else {
        polygons = operations[operation](polygons, points, agg.inField, agg.outField);
      }
    } else {
      throw new Error('"'+ operation +'" is not a recognized aggregation operation.');
    }
  }

  return polygons;
};

function isAggregationOperation(operation) {
  return operation === 'average' ||
    operation === 'sum' ||
    operation === 'median' ||
    operation === 'min' ||
    operation === 'max' ||
    operation === 'deviation' ||
    operation === 'variance' ||
    operation === 'count';
}
