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

/*module.exports = function(polyFC, done){
  donuts = t.featurecollection([])
  _.each(polyFC.features, function(poly1){
    _.each(polyFC.features, function(poly2){
      contained(poly1, poly2, function(isContained){
        if(!_.isEqual(poly1, poly2) && isContained){
          if(!_.isEqual(poly1.properties, poly2.properties)){
            t.erase(poly1, poly2, function(err, erased){
              console.log(erased.geometry.type)
              var duplicate = _.some(donuts.features, erased)
              if(!duplicate && erased.geometry.type != 'GeometryCollection'){
                donuts.features.push(erased)
              }
              else if (erased.geometry.type == 'GeometryCollection'){
                console.log('GCOLLECTION')
              }
            })
          }
        }
        else if(!_.isEqual(poly1, poly2)){
          console.log('t')
          var duplicate = _.some(donuts.features, poly1)
          if(!duplicate){
            console.log('R')
            donuts.features.push(poly1)
          }
          else{
            console.log('X')
            //console.log('==============================\n\n')
            //console.log(poly1)
            //console.log(poly2)
            //console.log(poly1)
            t.union(poly1, poly2, function(err, unioned){
              donuts.features.push(unioned)
            })
          }
        }
      })
    })
  })
  done(null, donuts)
}*/

module.exports = function(fc, done){
  donuts = t.featurecollection([])
  _.each(fc.features, function(poly1){
    _.each(fc.features, function(poly2){
      // if the polys are identical
      if(_.isEqual(poly1, poly2)){
        // if polygon is not in donuts yet, add it
        if(!_.some(donuts.features, poly1)){
         // donuts.features.push(poly1)
        }
      }
      else{
        //check to see if poly2 is inside of poly1
        contained(poly1, poly2, function(isContained){
          // if it is contained and has different properties, erase poly2 from poly1
          if(isContained && !_.isEqual(poly1.properties, poly2.properties)){
            // erase poly2 from poly1
            t.erase(poly1, poly2, function(err, erased){
              if(!_.some(donuts.features, erased)){
                poly1 = erased
              }
            })
          }
          // if it is contained and has the same properties, merge poly1 and poly2
          if(isContained && _.isEqual(poly1.properties, poly2.properties)){
            // merge poly1 and poly2
            t.union(poly1, poly2, function(err, unioned){
              if(!_.some(donuts.features, unioned)){
                poly1 = unioned
              }
            })
          }
        })
      }
    })
    // push transformed poly1 to donuts
    donuts.features.push(poly1)
  })
  done(null, donuts)
}

function contained(poly1, poly2, done){
  var sampleVertex = t.point(poly2.geometry.coordinates[0][0][0], poly2.geometry.coordinates[0][0][1])
  t.inside(sampleVertex, poly1, function(err, isInside){
    done(isInside)
  })
}