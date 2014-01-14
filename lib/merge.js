// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var async = require('async'),
    _ = require('lodash')
var t = {}
t.union = require('./union')

module.exports = function(polygons, done){
  var merged = _.cloneDeep(polygons.features[0])
  async.eachSeries(polygons.features, 
    function(poly, cb){
      t.union(merged, poly, function(err, mergedPolys){
        merged = mergedPolys
        cb()
      })
    },
    function(){
      console.log('completed')
      done(null, merged)
    }
  )
}