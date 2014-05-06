var t = {}
var featurecollection = require('./featurecollection')
t.featurecollection = featurecollection

module.exports = function(fc, inField, outField, translations, done){
  var reclassed = t.featurecollection([])

  done = done || function () {};

  _.each(fc.features, function(feature){
    var reclassedFeature
    var found = false
    for(var i = 0; i < translations.length; i++){
      if(feature.properties[inField] >= translations[i][0] && feature.properties[inField] <= translations[i][1]) {
        reclassedFeature = _.clone(feature, true)
        reclassedFeature.properties[outField] = translations[i][2]
      }
    }
    reclassed.features.push(reclassedFeature)
  })

  done(null, reclassed)
  return reclassed;
}
