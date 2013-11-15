var t = {}
  var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(points, polygons, field, done){
  _.each(points.features, function(pt){
    if(!pt.properties){
      pt.properties = {}
    }
    _.each(polygons.features, function(poly){
      if(!pt.properties[field]){
        t.inside(pt, poly, function(err, isInside){
          if(isInside){
            pt.properties[field] = poly.properties[field]
          }
          else{
            pt.properties[field] = null
          }
        })
      }
    })
  })
  done(null, points)
}