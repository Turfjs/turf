//http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
//radians = degrees * (pi/180)

var _ = require('underscore')

module.exports = function(point, radius, done){
  var geometry = point.geometry
  var type = geometry.type
  var polygon = {
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": []
    }
  }

  switch(type){
      case 'Point':
        var coordinates = []
        var x = geometry.coordinates[0]
        var y = geometry.coordinates[1]
        var range = _.range(-180, 180, 1)
        for(var i in _.range(0, 360)){
          var xC = x + radius * Math.cos(range[i] * (Math.PI / 180))
          var yC = y + radius * Math.sin(range[i] * (Math.PI / 180))
          coordinates.push([xC, yC])
        }
        polygon.geometry.coordinates = [coordinates]
        done(null, polygon)
        break
      case 'LineString':
        done(new Error('LineString not implemented'))
        break
      case 'Polygon':
        done(new Error('Polygon not implemented'))
        break
    }
}