var t = {}
var _ = require('lodash'),
  point = require('./point')
t.point = point

module.exports = function(extents, depth, done){
  var xmin = extents[0]
  var ymin = extents[1]
  var xmax = extents[2]
  var ymax = extents[3]
  var interval = (xmax - xmin) / depth
  var coords = []
  var fc = {
    type: 'FeatureCollection',
    features: []
  }

  done = done || function () {};

  for (var x=0; x<=depth; x++){
    for (var y=0;y<=depth; y++){
      fc.features.push(t.point((x * interval) + xmin, (y * interval) + ymin))
    }
  }
  done(null, fc)
  return fc;
}
