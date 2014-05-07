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
  var horizontalDistance = t.distance(lowLeft, lowRight, 'miles');
  var verticalDistance = t.distance(lowLeft, topLeft, 'miles');
  var verticalMidpoint
  var horizontalMidpoint

  done = done || function () {};

  if(horizontalDistance >= verticalDistance){
    squareBbox[0] = bbox[0]
    squareBbox[2] = bbox[2]

    verticalMidpoint = t.midpoint(lowLeft, topLeft);

    squareBbox[1] = verticalMidpoint.geometry.coordinates[1] - ((bbox[2] - bbox[0]) / 2)
    squareBbox[3] = verticalMidpoint.geometry.coordinates[1] + ((bbox[2] - bbox[0]) / 2)
  }
  else {
    squareBbox[1] = bbox[1]
    squareBbox[3] = bbox[3]

    horizontalMidpoint = t.midpoint(lowLeft, lowRight);

    squareBbox[0] = horizontalMidpoint.geometry.coordinates[0] - ((bbox[3] - bbox[1]) / 2)
    squareBbox[2] = horizontalMidpoint.geometry.coordinates[0] + ((bbox[3] - bbox[1]) / 2)
  }

  done(null, squareBbox)
  return squareBbox;
  //t.midpoint(t.point(bbox[0,]), bbox)
  //squareBbox[0] =
}
