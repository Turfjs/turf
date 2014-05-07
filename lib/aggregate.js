var _ = require('lodash')
var t = {}
t.average = require('./average')
t.sum = require('./sum')
t.median = require('./median')
t.min = require('./min')
t.max = require('./max')
t.deviation = require('./deviation')
t.variance = require('./variance')
t.count = require('./count')

module.exports = function(polygons, points, aggregations, done){
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

  done = done || function () {};

  for (var i = 0, len = aggregations.length; i < len; i++) {
    var agg = aggregations[i],
      operation = agg.aggregation,
      unrecognizedError;

    if (isAggregationOperation(operation)) {
      if (operation === 'count') {
        polygons = t[operation](polygons, points, agg.outField);
      } else {
        polygons = t[operation](polygons, points, agg.inField, agg.outField);
      }
    } else {
      unrecognizedError = new Error('"'+ operation +'" is not a recognized aggregation operation.');
      done(err)
      return err;
    }
  }

  done(null, polygons)
  return polygons;
}
