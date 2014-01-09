/* 
takes a collection of polygons and returns a collection of donuts.

 foreach poly:
  foreach poly:
    poly1 = poly1.erase(poly2)
*/

var _ = require('lodash')
var t = {}
t.featurecollection = require('./featurecollection')
t.erase = require('./erase')

module.exports = function(polyFC, done){
  donuts = t.featurecollection([])
  _.each(polyFC.features, function(poly1){
    _.each(polyFC.features, function(poly2){
      t.erase
    })
  })

  done(null, donuts)
}