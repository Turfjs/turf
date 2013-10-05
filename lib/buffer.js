var _ = require('underscore')

module.exports = function(geometry, radius, done){
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
        for(var i in _.range(0, 10)){
          var xC = x + radius * Math.cos(i)
          var yC = y + radius * Math.sin(i)
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