// 1. run tin on points
// 2. merge the tin
//var topojson = require('')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')

module.exports = function(points, done){
  var tinPolys = t.tin(points, null),
    mergePolys;

  done = done || function () {};

  if (typeof tinPolys === 'Error') {
    done(tinPolys);
    return tinPolys;
  }

  mergePolys = t.merge(t.buffer(tinPolys, .05, 'miles'));

  if (typeof mergePolys === 'Error') {
    done(mergePolys);
  } else {
    done(null, mergePolys);
  }

  return mergePolys;
}
