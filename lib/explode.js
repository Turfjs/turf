var g = {}
var _ = require('lodash'),
    featurecollection = require('./featurecollection'),
    point = require('./point')
g.featurecollection = featurecollection
g.point = point

module.exports = function(features, done){
  var coordinates
  if(features.type === 'FeatureCollection'){
    for(var i in features.features){
      switch(features.features[i].geometry.type){
        case 'Point':
          coordinates = [features.features[i].geometry.coordinates]
          break
        case 'LineString':
          coordinates = features.features[i].geometry.coordinates
          break
        case 'Polygon':
          coordinates = features.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          break
        case 'MultiPoint':
          coordinates = features.features[i].geometry.coordinates
          break
        case 'MultiLineString':
          coordinates = features.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          break
        case 'MultiPolygon':
          coordinates = features.features[i].geometry.coordinates
          coordinates = _.flatten(coordinates, true)
          coordinates = _.flatten(coordinates, true)
          break
      }
      if(!features.features[i].geometry && features.features[i].properties){
        throw new Error('Unknown Geometry Type')
      }
    }
  }
  else{
    var geometry
    if(features.type === 'Feature'){
      geometry = features.geometry
    }
    else{
      geometry = features
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
  }

  var fc = g.featurecollection([])
  _.each(coordinates, function(c){
    fc.features.push(g.point(c[0], c[1]))
  })
  done(null, fc)
}






