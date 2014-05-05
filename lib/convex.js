// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')

module.exports = function(points, done){
  // TODO: come back to this
  t.tin(points, null, function(err, tinPolys){
    if(err) done(err)
    t.buffer(tinPolys, .05, 'miles', function(err, bufferPolys){
      t.merge(bufferPolys, function(err, mergePolys){
        if(err) done(err)
        done(null, mergePolys)
      })
    })
  })
}
