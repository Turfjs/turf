/* 
takes a collection of polygons and returns a collection of donuts.

 foreach poly:
  foreach poly:
    poly1 = poly1.erase(poly2)
*/

var _ = require('lodash'),
    extractor = require('poly-extractor')
var t = {}
t.featurecollection = require('./featurecollection')
t.erase = require('./erase')
t.point = require('./point')
t.inside = require('./inside')
t.union = require('./union')

module.exports = function(polyFC, done){
  polyFC
  donuts = t.featurecollection([])
  _.each(polyFC.features, function(poly1){
    _.each(polyFC.features, function(poly2){
      contained(poly1, poly2, function(isContained){
        if(!_.isEqual(poly1, poly2) && isContained){
          if(!_.isEqual(poly1.properties, poly2.properties)){
            t.erase(poly1, poly2, function(err, erased){
              //console.log(erased.geometry.type)
              var duplicate = _.some(donuts.features, erased)
              if(!duplicate && erased.geometry.type != 'GeometryCollection'){
                donuts.features.push(erased)
              }
              else if (erased.geometry.type == 'GeometryCollection'){
                //console.log('GCOLLECTION')
              }
            })
          }
        }
        else if(!_.isEqual(poly1, poly2)){
          var duplicate = _.some(donuts.features, poly1)
          if(!duplicate){
            donuts.features.push(poly1)
          }
          else{
            //console.log('==============================\n\n')
            //console.log(poly1)
            //console.log(poly2)
            //t.union(poly1, poly2, function(err, unioned){
            //  donuts.features.push(unioned)
            //})
          }
        }
      })
    })
  })
  done(null, donuts)
}

function contained(poly1, poly2, done){
  var sampleVertex = t.point(poly2.geometry.coordinates[0][0][0], poly2.geometry.coordinates[0][0][1])
  t.inside(sampleVertex, poly1, function(err, isInside){
    done(isInside)
  })
}