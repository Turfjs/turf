_ = require('underscore')

module.exports = function(layer, done){
  var xmin,
      ymin,
      xmax,
      ymax
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
  else{
    var coordinates 
    switch(layer.geometry.type){
      case 'Point':
        coordinates = [layer.geometry.coordinates]
        break
      case 'LineString':
        coordinates = layer.geometry.coordinates
        break
      case 'Polygon':
        coordinates = layer.geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        break
      case 'MultiPoint':
        coordinates = layer.geometry.coordinates
        break
      case 'MultiLineString':
        coordinates = layer.geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        break
      case 'MultiPolygon':
        coordinates = layer.geometry.coordinates
        coordinates = _.flatten(coordinates, true)
        coordinates = _.flatten(coordinates, true)
        break
    }
    if(!layer.geometry){
      throw new Error('No Geometry Found')
    }
    
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
    var bbox = [xmin, ymin, xmax, ymax]
    done(bbox)
  }
}