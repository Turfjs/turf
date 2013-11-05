var ss = require('simple-statistics'),
    _ = require('lodash')

module.exports = function(fc, field, percentiles, done){
  var vals = []
  var quantiles = []

  _.each(fc.features, function(feature){
    vals.push(feature.properties[field])
  })
  console.log(vals)
  _.each(percentiles, function(percentile){
    quantiles.push(ss.quantile(vals, percentile * .01))
  })
  console.log(quantiles)
  done(null, quantiles)
}