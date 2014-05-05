_ = require('lodash')

module.exports = function(layer, done){
  var xmin = Infinity,
      ymin = Infinity,
      xmax = -Infinity,
      ymax = -Infinity
  if(layer.type === 'FeatureCollection'){
    for(var i in layer.features){
      var coordinates
      switch(layer.features[i].geometry.type){
        case 'Point':
          coordinates = [layer.features[i].geometry.coordinates]
          break
        case 'LineString':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'Polygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          break
        case 'MultiPoint':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'MultiLineString':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          break
        case 'MultiPolygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          coordinates = _.flatten(coordinates, true)
          break
      }
      if(!layer.features[i].geometry && layer.features[i].properties){
        throw new Error('Unknown Geometry Type')
      }

      for(var n in coordinates){
        if(xmin > coordinates[n][0]){
          xmin = coordinates[n][0]
        }
        if(ymin > coordinates[n][1]){
          ymin = coordinates[n][1]
        }
        if(xmax < coordinates[n][0]){
          xmax = coordinates[n][0]
        }
        if(ymax < coordinates[n][1]){
          ymax = coordinates[n][1]
        }
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    done(null, bbox)
    return bbox;
  }
  else{
    var coordinates
    var geometry
    if(layer.type === 'Feature'){
      geometry = layer.geometry
    }
    else{
      geometry = layer
    }
    switch(geometry.type){
      case 'Point':
        coordinates = [geometry.coordinates]
        break
      case 'LineString':
        coordinates = geometry.coordinates
        break
      case 'Polygon':
        coordinates = geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        break
      case 'MultiPoint':
        coordinates = geometry.coordinates
        break
      case 'MultiLineString':
        coordinates = geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        break
      case 'MultiPolygon':
        coordinates = geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        coordinates = _.flatten(coordinates, true)
        break
    }
    if(!geometry){
      throw new Error('No Geometry Found')
    }

    for(var n in coordinates){
      if(xmin > coordinates[n][0]){
        xmin = coordinates[n][0]
      }
      if(ymin > coordinates[n][1]){
        ymin = coordinates[n][1]
      }
      if(xmax < coordinates[n][0]){
        xmax = coordinates[n][0]
      }
      if(ymax < coordinates[n][1]){
        ymax = coordinates[n][1]
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    done(null, bbox)
    return bbox
  }
}
