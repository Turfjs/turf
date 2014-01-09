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
    console.log('polyFC')
    _.each(polyFC.features, function(poly2){
      if(!_.isEqual(poly1, poly2)){
        t.erase(poly1, poly2, function(err, erased){
          var duplicate = _.some(donuts.features, erased)

          if(!duplicate){
            donuts.features.push(erased)
          }
        })
      }
    })
  })

  done(null, donuts)
}