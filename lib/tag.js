var t = {}
  var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(points, polygons, field, outField, done){
  _.each(points.features, function(pt){
    if(!pt.properties){
      pt.properties = {}
    }
    _.each(polygons.features, function(poly){
      if(!pt.properties[outField]){
        t.inside(pt, poly, function(err, isInside){
          if(isInside){
            console.log('in')
            pt.properties[outField] = poly.properties[field]
          }
          else{
            pt.properties[outField] = null
          }
        })
      }
    })
  })
  done(null, points)
}