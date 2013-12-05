var t = {}
var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  _.each(polyFC.features, function(poly, i){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    _.each(ptFC, function(pt){
      t.inside(pt, poly, function(err, isInside){
        if(isInside){
          values.push(pt.properties[inField])
          console.log(values)
        }
      })
    })
  })

  done(new Error('not implemented'))
}