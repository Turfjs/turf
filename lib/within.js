var t = {}
var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(polyFC, ptFC, outField, done){
  _.each(polyFC.features, function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    _.each(ptFC.features, function(pt){
      t.inside(pt, poly, function(err, isInside){
        if(isInside){
          values.push(1)
        }
      })
    })
    poly.properties[outField] = values.length
  })
  done(null, polyFC)
}