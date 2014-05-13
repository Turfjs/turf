var _ = require('lodash')

var t = {}
t.featurecollection = require('./featurecollection')
t.erase = require('./erase')
t.point = require('./point')
t.inside = require('./inside')
t.union = require('./union')

module.exports = function(fc, done){
  done = done || function () {};

  donuts = t.featurecollection([])
  _.each(fc.features, function(poly1){
    _.each(fc.features, function(poly2){
      // if the polys are identical
      if(_.isEqual(poly1, poly2)){
        // do nothing
      }
      else{
        //check to see if poly2 is inside of poly1
        var isContained = contained(poly1, poly2);

        // if it is contained and has different properties, erase poly2 from poly1
        if(isContained && !_.isEqual(poly1.properties, poly2.properties)){
          // erase poly2 from poly1
          var erased = t.erase(poly1, poly2);
          if(!_.some(donuts.features, erased)){
            poly1 = erased
          }
        }
        // if it is contained and has the same properties, merge poly1 and poly2
        if(isContained && _.isEqual(poly1.properties, poly2.properties)){
          // merge poly1 and poly2
          var unioned = t.union(poly1, poly2);
          if(!_.some(donuts.features, unioned)){
            poly1 = unioned
          }
        }
      }
    })
    // push transformed poly1 to donuts
    donuts.features.push(poly1)
  })
  done(null, donuts)
  return donuts;
}

function contained(poly1, poly2){
  var sampleVertex = t.point(poly2.geometry.coordinates[0][0][0], poly2.geometry.coordinates[0][0][1])

  return t.inside(sampleVertex, poly1);
}
