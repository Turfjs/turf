var t = {}
var extent = require('./extent')
t.extent = extent

module.exports = function(layer, done){
  var extent = t.extent(layer);
  var x = (extent[0] +extent[2])/2
  var y = (extent[1] + extent[3])/2
  var center = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [x, y]
    }
  }

  done = done || function () {};

  done(center)
  return center;
}
