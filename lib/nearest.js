var t = {}
var _ = require('lodash'),
 distance = require('./distance')
t.distance = distance

module.exports = function(targetPoint, points, done){
  var nearestPoint
  var count = 0
  var dist = Infinity

  function complete(nPt){
    delete nPt.properties.distance
    done(null, nPt)
  }

  done = done || function () {};

  _.forEach(points.features, function(pt){
    if(!nearestPoint){
      nearestPoint = pt
      nearestPoint.properties.distance = t.distance(targetPoint, pt, 'miles');
    }
    else{
      dist = t.distance(targetPoint, pt, 'miles');

      if(dist < nearestPoint.properties.distance){
        nearestPoint = pt
        nearestPoint.properties.distance = dist
      }
      if(points.features.length === count + 1){
        complete(nearestPoint)
      }
    }
    count++
  })

  return nearestPoint;
}
