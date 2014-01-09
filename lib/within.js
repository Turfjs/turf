var t = {}
var _ = require('lodash')
t.inside = require('./inside')
t.featurecollection = require('./featurecollection')

module.exports = function(ptFC, polyFC, done){
  pointsWithin = t.featurecollection([])
  _.each(polyFC.features, function(poly){
    _.each(ptFC.features, function(pt){
      t.inside(pt, poly, function(err, isInside){
        if(isInside){
          pointsWithin.features.push(pt)
        }
      })
    })
  })
  done(null, pointsWithin)
}