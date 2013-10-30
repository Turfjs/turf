var t = {}
var _ = require('lodash'),
 distance = require('./distance')
t.distance = distance

module.exports = function(targetPoint, points, done){
  var nearestPoint
  var count = 0
  var dist = Infinity
  _.forEach(points.features, function(pt){
    if(!nearestPoint){
      nearestPoint = pt
      t.distance(targetPoint, pt, 'miles', function(err, dist){
        nearestPoint.properties.distance = dist 
      })
    }
    else{
      t.distance(targetPoint, pt, 'miles', function(err, dist){
        if(dist < nearestPoint.properties.distance){
          nearestPoint = pt
          nearestPoint.properties.distance = dist
        }
        if(points.features.length === count + 1){
          complete(nearestPoint)
        }
      })
    }
    count++
  })

  function complete(nPt){
    delete nPt.properties.distance
    done(null, nPt)
  }
}