var t = {}
var _ = require('lodash'),
    ss = require('simple-statistics')
t.inside = require('./inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  _.each(polyFC.features, function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    _.each(ptFC.features, function(pt){
      t.inside(pt, poly, function(err, isInside){
        if(isInside){
          values.push(pt.properties[inField])
        }
      })
    })
    poly.properties[outField] = ss.max(values)
  })
  done(null, polyFC)
}