var ss = require('simple-statistics'),
    _ = require('lodash')

module.exports = function(fc, field, num, done){
  var vals = []
  var breaks = []

  _.each(fc.features, function(feature){
    if(!(feature.properties[field]===undefined)){
      vals.push(feature.properties[field])
    }
  })
  breaks = ss.jenks(vals, num)

  done(null, breaks)
}