module.exports = function(bbox, factor, done){
  var xDistance = ((bbox[2] - bbox[0]) / 2) * factor
  var yDistance = ((bbox[3] - bbox[1]) / 2) * factor

  var lowX = bbox[0] - xDistance
  var lowY = bbox[1] - yDistance
  var highX = xDistance + bbox[2]
  var highY = yDistance + bbox[3]

  var sized = [lowX, lowY, highX, highY]
  done(null, sized)
}