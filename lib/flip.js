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

        break
    }
  }
  else if(fc.type === 'FeatureCollection'){

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