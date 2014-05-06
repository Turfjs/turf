var t = {}
var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(polyFC, ptFC, outField, done){

  done = done || function () {};

  _.each(polyFC.features, function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    _.each(ptFC.features, function(pt){
      if (t.inside(pt, poly)) {
        values.push(1)
      }
    })
    poly.properties[outField] = values.length
  })

  done(null, polyFC)
  return polyFC;
}
