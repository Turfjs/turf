var _ = require('lodash')
var t = {}
t.featurecollection = require('./featurecollection')

module.exports = function(fc, field, value, done){
  var newFC = t.featurecollection([]);

  done = done || function () {};

  for(var i = 0; i < fc.features.length; i++) {
    if(fc.features[i].properties[field] === value) {
      newFC.features.push(fc.features[i])
    }
  }

  done(null, newFC)
  return newFC;
}
