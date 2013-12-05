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
        console.log(pt.geometry.coordinates)
        console.log(poly.geometry.coordinates)
        console.log(isInside)
        if(isInside){
          values.push(pt.properties[inField])
        }
      })
    })
    console.log(values)
    console.log(ss.average(values))
    poly.properties[outField] = ss.average(values)
  })

  done(null, polyFC)
}