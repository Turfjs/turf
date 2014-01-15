// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var fs = require('fs')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')

module.exports = function(points, done){
  t.tin(points, null, function(err, tinPolys){
    if(err) done(err)
    //console.log(tinPolys)
    fs.writeFileSync('./testOut/tinConvex.geojson', JSON.stringify(tinPolys))
    t.buffer(tinPolys, .05, 'miles', function(err, bufferPolys){
      console.log(bufferPolys)
      fs.writeFileSync('./testOut/bufferConvex.geojson', JSON.stringify(bufferPolys))
      t.merge(bufferPolys, function(err, mergePolys){
        if(err) done(err)
        console.log(JSON.stringify(mergePolys, null, 2))
        done(null, mergePolys)
      })
    })
  })
}