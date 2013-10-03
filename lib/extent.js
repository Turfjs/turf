_ = require('underscore')

module.exports = function(layer, done){
  var xmin,
      ymin,
      xmax,
      ymax
  for(var i in layer.features){
    var coordinates
    if(layer.features[i].geometry.type === 'Point'){
      coordinates = [layer.features[i].geometry.coordinates]
    }
    else if(layer.features[i].geometry.type === 'LineString'){
      coordinates = layer.features[i].geometry.coordinates
    }
    else if(layer.features[i].geometry.type === 'Polygon'){
      coordinates = layer.features[i].geometry.coordinates
      coordinates = _.flatten(coordinates, true)
    }
    else if(layer.features[i].geometry.type === 'MultiPoint'){
      coordinates = layer.features[i].geometry.coordinates
    }
    else if(layer.features[i].geometry.type === 'MultiLineString'){
      coordinates = layer.features[i].geometry.coordinates
      coordinates = _.flatten(coordinates, true)
    }
    else if(layer.features[i].geometry.type === 'MultiPolygon'){
      coordinates = layer.features[i].geometry.coordinates
      coordinates = _.flatten(coordinates, true)
      coordinates = _.flatten(coordinates, true)
    }
    else if(layer.features[i].properties){
      throw new Error('Unknown Geometry Type')
    }
    
    //coordinates = layer.features[i].geometry.coordinates
    for(var n in coordinates){
      if(xmin > coordinates[n][0] || !xmin){
        xmin = coordinates[n][0]
      }
      if(ymin > coordinates[n][1] || !ymin){
        ymin = coordinates[n][1]
      }
      if(xmax < coordinates[n][0] || !xmax){
        xmax = coordinates[n][0]
      }
      if(ymax < coordinates[n][1] || !ymax){
        ymax = coordinates[n][1]
      }
    }
  }
  var bbox = [xmin, ymin, xmax, ymax]
  done(bbox)
}