//this tool takes a feature collection of like geometries and combines them into a single multipoint, multilinestring, or multipolygon
var _ = require('lodash')

module.exports = function(fc, done){
  var type = fc.features[0].geometry.type
  var err
  var geometries = _.pluck(fc.features, 'geometry')

  done = done || function () {};

  switch(type){
    case 'Point':
      var multiPoint = {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: []
        }
      }
      multiPoint.geometry.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiPoint)
      return multiPoint;
    break
    case 'LineString':
      var multiLineString = {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: []
        }
      }
      multiLineString.geometry.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiLineString)
      return multiLineString;
      break
    case 'Polygon':
      var multiPolygon = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: []
        }
      }
      multiPolygon.geometry.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiPolygon)
      return multiPolygon;
    break
  }
}
