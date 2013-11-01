var t = {}
var point = require('../lib/point'),
    polygon = require('../lib/polygon')
t.point = point
t.polygon = polygon

module.exports = function(bbox, done){
  var lowLeft = t.point(bbox[0], bbox[1])
  var topLeft = t.point(bbox[0], bbox[3])
  var topRight = t.point(bbox[2], bbox[3])
  var lowRight = t.point(bbox[2], bbox[1])

  var poly = t.polygon([[
    lowLeft.geometry.coordinates, 
    lowRight.geometry.coordinates, 
    topRight.geometry.coordinates, 
    topLeft.geometry.coordinates
  ]])
  done(null, poly)
}