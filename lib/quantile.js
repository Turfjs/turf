var ss = require('simple-statistics'),
    _ = require('lodash')

module.exports = function(fc, field, percentiles, done){
  var vals = []
  var quantiles = []

  done = done || function () {};

  _.each(fc.features, function(feature){
    vals.push(feature.properties[field])
  })
  _.each(percentiles, function(percentile){
    quantiles.push(ss.quantile(vals, percentile * .01))
  })
  
  done(null, quantiles)
  return quantiles;
}
