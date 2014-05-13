// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var _ = require('lodash')
var t = {}
t.union = require('./union')

module.exports = function(polygons, done){

  var merged = _.cloneDeep(polygons.features[0]),
    features = polygons.features;

  done = done || function () {};

  for (var i = 0, len = features.length; i < len; i++) {
    var poly = features[i];

    if(poly.geometry){
      merged = t.union(merged, poly);
    }
  }

  done(null, merged);
  return merged;
}
