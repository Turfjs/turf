var _ = require('lodash')
var t = {}
t.average = require('./average')
t.sum = require('./sum')
t.median = require('./median')
t.min = require('./min')
t.max = require('./max')
t.deviation = require('./deviation')

module.exports = function(polygons, points, aggregations, done){
  _.each(aggregations, function(agg){
    switch(agg.aggregation){
      case 'average':
        t.average(polygons, points, agg.inField, agg.outField, function(err, averaged){
          polygons = averaged
        })
        break
      case 'sum':
        t.sum(polygons, points, agg.inField, agg.outField, function(err, summed){
          polygons = summed
        })
        break
      case 'median':
        t.median(polygons, points, agg.inField, agg.outField, function(err, medianed){
          polygons = medianed
        })
        break
      case 'min':
        t.min(polygons, points, agg.inField, agg.outField, function(err, mined){
          polygons = mined
        })
        break
      case 'max':
        t.max(polygons, points, agg.inField, agg.outField, function(err, maxed){
          polygons = maxed
        })
        break
      case 'deviation':
        t.deviation(polygons, points, agg.inField, agg.outField, function(err, deviated){
          polygons = deviated
        })
        break
      default:
        done(new Error('"'+agg.aggregation +'" is not a recognized aggregation operation.'))
    }
  })
  done(null, polygons)
}