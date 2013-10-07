//http://en.wikipedia.org/wiki/Haversine_formula
// expects a feature collection of points

module.exports = function(point1, point2, units, done){
  var toRad = function(degree){
    return degree * Math.PI / 180
  }

  var coordinates1 = point1.geometry.coordinates
  var coordinates2 = point2.geometry.coordinates

  var dLat = toRad(coordinates2[1] - coordinates1[1])
  var dLon = toRad(coordinates2[0] - coordinates2[0])
  var lat1 = toRad(coordinates1[1])
  var lat2 = toRad(coordinates2[1])
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  var R = 3960
  switch(R){
    case 'miles':
      R = 3960
    case 'kilometers':
      R = 6373
  }
  var distance = R * c
  console.log(coordinates1)
  done(null, distance)
}

