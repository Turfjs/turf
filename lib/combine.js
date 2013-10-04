//this tool takes an array of like geometries and combines them into a single multipoint, multilinestring, or multipolygon
var _ = require('underscore')

module.exports = function(geometries, done){
  var type = geometries[0].type
  var err
  switch(type){
    case 'Point':
      var multiPoint = {
        type: 'MultiPoint',
        coordinates: []
      }
      multiPoint.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiPoint)
    break
    case 'LineString':
      var multiLineString = {
        type: 'MultiLineString',
        coordinates: []
      }
      multiLineString.coordinates = _.pluck(geometries, 'coordinates')
      done(err, multiLineString)
      break
    case 'Polygon':
      var multiPolygon = {
        type: 'MultiPolygon',
        coordinates: []
      }
      multiPolygon.coordinates = _.pluck(geometries, 'coordinates')
      console.log(JSON.stringify(multiPolygon.coordinates))
      done(err, multiPolygon)
    break
  }
}