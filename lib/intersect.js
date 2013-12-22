// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts')
var t = {}
t.featurecollection = require('./featurecollection')

module.exports = function(polys1, polys2, done){
  var reader = new jsts.io.GeoJSONReader()
  var a = reader.read(JSON.stringify(polys1.features[0].geometry))
  var b = reader.read(JSON.stringify(polys2.features[0].geometry))
  var intersection = a.intersection(b)
  var parser = new jsts.io.GeoJSONParser()
  intersection = parser.write(intersection)
  intersection = t.featurecollection([intersection])
  done(null, intersection)
}