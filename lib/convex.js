// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')

module.exports = function(points, done){
  t.tin(points, null, function(err, tinPolys){
    if(err) done(err)
    //console.log(tinPolys)
    t.buffer(tinPolys, .0001, 'miles', function(err, bufferPolys){
      console.log(bufferPolys)
      t.merge(bufferPolys, function(err, mergePolys){
        if(err) done(err)
        console.log(JSON.stringify(mergePolys, null, 2))
        done(null, mergePolys)
      })
    })
  })
}