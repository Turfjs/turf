module.exports = function(bbox, factor, done){
  var lowX = (((bbox[2] - bbox[0]) / 2) * factor) + bbox[0]
  var lowY = (((bbox[3] - bbox[1]) / 2) * factor) + bbox[1]
  var highX = (((bbox[2] - bbox[0]) / 2) * factor) + bbox[2]
  var highY = (((bbox[3] - bbox[1]) / 2) * factor) + bbox[3]

  var sized = [lowX, lowY, highX, highY]
  done(null, sized)
}