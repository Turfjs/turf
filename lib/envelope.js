var t = {}
var extent = require('./extent'),
    bboxPolygon = require('./bboxPolygon')
t.bboxPolygon = bboxPolygon
t.extent = extent

module.exports = function(features, done){
  // TODO: come back to this
  t.extent(features, function(err, bbox){
    t.bboxPolygon(bbox, function(err, poly){
      done(err, poly)
    })
  })
}
