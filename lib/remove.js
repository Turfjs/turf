var t = {}
var featurecollection = require('./featurecollection')
t.featurecollection = featurecollection

module.exports = function(collection, key, val, done) {
  var newFC = t.featurecollection([]);

  done = done || function () {};

  for(var i = 0; i < collection.features.length; i++) {
    if(collection.features[i].properties[key] != val) {
      newFC.features.push(collection.features[i])
    }
  }
  
  done(null, newFC)
  return newFC;
}
