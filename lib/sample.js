var t = {}
var _ = require('lodash'),
    featurecollection = require('./featurecollection')
t.featurecollection = featurecollection

module.exports = function(fc, num, done){
  var outFC = t.featurecollection(_.sample(fc.features, num))

  done = done || function () {};

  done(null, outFC)
  return outFC;
}
