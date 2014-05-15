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

  if (tinPolys instanceof Error) {
    done(tinPolys);
    return tinPolys;
  }

  //mergePolys = t.merge(t.buffer(tinPolys, .05, 'miles'));
  mergePolys = t.merge(tinPolys);

  if (mergePolys instanceof Error) {
    done(mergePolys);
  } else {
    done(null, mergePolys);
  }

  return mergePolys;
}
