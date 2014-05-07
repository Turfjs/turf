var t = {}
var _ = require('lodash')
t.inside = require('./inside')
t.featurecollection = require('./featurecollection')

module.exports = function(ptFC, polyFC, done){
  var pointsWithin = t.featurecollection([])

  done = done || function () {};

  _.each(polyFC.features, function(poly){
    _.each(ptFC.features, function(pt){
      if (t.inside(pt, poly)) {
        pointsWithin.features.push(pt)
      }
    })
  })
  
  done(null, pointsWithin)
  return pointsWithin;
}
