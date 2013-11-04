var t = {}
var extent = require('./extent'),
    bboxPolygon = require('./bboxPolygon')
t.bboxPolygon = bboxPolygon
t.extent = extent

module.exports = function(features, done){
  t.extent(features, function(err, bbox){
    t.bboxPolygon(bbox, function(err, poly){
      done(err, poly)
    })
  })
}