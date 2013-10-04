var g = {}
var extent = require('./extent')
g.extent = extent

module.exports = function(layer, done){
  g.extent(layer, function(extent){
    var x = (extent[0] +extent[2])/2
    var y = (extent[1] + extent[3])/2
    var center = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [x, y]
      }
    }
    done(center)
  })
}