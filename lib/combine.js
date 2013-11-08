//this tool takes a feature collection of like geometries and combines them into a single multipoint, multilinestring, or multipolygon
var _ = require('lodash')

module.exports = function(fc, done){
  var type = fc.features[0].type
  var err
  var geometries = _.pluck(fc.features, 'geometry')
  console.log(geometries)
  switch(type){
    case 'Point':
      var multiPoint = {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: []
        }
      }
      multiPoint.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiPoint)
    break
    case 'LineString':
      var multiLineString = {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: []
        }
      }
      multiLineString.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiLineString)
      break
    case 'Polygon':
      var multiPolygon = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: []
        }
      }
      multiPolygon.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiPolygon)
    break
  }
}