var t = {}
var extent = require('./extent'),
    bboxPolygon = require('./bboxPolygon')
t.bboxPolygon = bboxPolygon
t.extent = extent

module.exports = function(features, done){
  var poly = t.bboxPolygon(t.extent(features));

  if (typeof poly === 'Error') {
    done(poly);
  } else {
    done(null, poly);
  }

  return poly;
}
