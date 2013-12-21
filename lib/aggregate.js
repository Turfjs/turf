var _ = require('lodash')
var t = {}
t.average = require('./average')
t.sum = require('./sum')

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
    }
  })
  done(null, polygons)
}