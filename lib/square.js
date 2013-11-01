var t = {}
var midpoint = require('../lib/midpoint'),
    point = require('../lib/point'),
    distance = require('../lib/distance')
t.midpoint = midpoint
t.point = point
t.distance = distance

module.exports = function(bbox, done) {
  var squareBbox = [0,0,0,0]
  var lowLeft = t.point(bbox[0], bbox[1])
  var topLeft = t.point(bbox[0], bbox[3])
  var topRight = t.point(bbox[2], bbox[3])
  var lowRight = t.point(bbox[2], bbox[1])

  t.distance(lowLeft, lowRight, 'miles', function(err, horizontalDistance){
    t.distance(lowLeft, topLeft, 'miles', function(err, verticalDistance){
      if(horizontalDistance >= verticalDistance){
        squareBbox[0] = bbox[0]
        squareBbox[2] = bbox[2]
        t.midpoint(lowLeft, topLeft, function(err, verticalMidpoint){
          squareBbox[1] = verticalMidpoint.geometry.coordinates[1] - ((bbox[2] - bbox[0]) / 2)
          squareBbox[3] = verticalMidpoint.geometry.coordinates[1] + ((bbox[2] - bbox[0]) / 2)
          done(err, squareBbox)
        })
      }
      else {
        squareBbox[1] = bbox[1]
        squareBbox[3] = bbox[3]
        t.midpoint(lowLeft, lowRight, function(err, horzontalMidpoint){
          squareBbox[0] = horzontalMidpoint.geometry.coordinates[0] - ((bbox[3] - bbox[1]) / 2)
          squareBbox[2] = horzontalMidpoint.geometry.coordinates[0] + ((bbox[3] - bbox[1]) / 2)
          done(err, squareBbox)
        })
      }
    })
  })
  //t.midpoint(t.point(bbox[0,]), bbox)
  //squareBbox[0] = 
}