var t = {}
  var _ = require('lodash')
t.inside = require('./inside')

module.exports = function(points, polygons, field, outField, done){
  done = done || function () {};

  _.each(points.features, function(pt){
    if(!pt.properties){
      pt.properties = {}
    }
    _.each(polygons.features, function(poly){
      if(!pt.properties[outField]){
        if (t.inside(pt, poly)) {
          pt.properties[outField] = poly.properties[field]
        } else {
          pt.properties[outField] = null
        }
      }
    })
  })
  
  done(null, points)
  return points;
}
