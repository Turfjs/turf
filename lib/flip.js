var t = {}
t.featurecollection = require('./featurecollection')

module.exports = function(fc, done){
  if(fc.type === 'Feature'){
    switch(fc.geometry.type){
      case 'Point':
        fc.geometry.coordinates = flipCoordinate(fc.geometry.coordinates)
        done(null, fc)
        break
      case 'LineString':
        _.each(fc.geometry.coordinates, function(coordinates, i){
          coordinates = flipCoordinate(coordinates)
          fc.geometry.coordinates[i] = coordinates
        })
        done(null, fc)
        break
      case 'Polygon':
        _.each(fc.geometry.coordinates, function(ring, i){
          _.each(ring, function(coordinates, k){
            coordinates = flipCoordinate(coordinates)
            fc.geometry.coordinates[i][k] = coordinates
          })
        })
        done(null, fc)
        break
    }
  }
  else if(fc.type === 'FeatureCollection'){
    _.each(fc.features, function(feature){
      switch(feature.geometry.type){
        case 'Point':
          feature.geometry.coordinates = flipCoordinate(feature.geometry.coordinates)
          break
        case 'LineString':
          _.each(feature.geometry.coordinates, function(coordinates, i){
            coordinates = flipCoordinate(coordinates)
            feature.geometry.coordinates[i] = coordinates
          })
          break
        case 'Polygon':
          _.each(feature.geometry.coordinates, function(ring, i){
            _.each(ring, function(coordinates, k){
              coordinates = flipCoordinate(coordinates)
              feature.geometry.coordinates[i][k] = coordinates
            })
          })
          break
      }
    })
    done(null, fc)
  }
  else {
    done(new Error('Unknown geometry type'), null)
  }
}

var flipCoordinate = function(coordinates){
  x = coordinates[0]
  y = coordinates[1]
  return([y, x])
}