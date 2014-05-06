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
  var unrecognizedError = new Error('"'+agg.aggregation +'" is not a recognized aggregation operation.');

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
    var operation = aggregations[i].aggregation;

    if (isAggregationOperation(operation)) {
      polygons = t[operation](polygons, points, operation.inField, operation.outField);
    } else {
      done(err)
      return err;
    }
  }

  done(null, polygons)
  return polygons;
}
