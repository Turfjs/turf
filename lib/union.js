// look here for help http://svn.osgeo.org/grass/grass/branches/releasebranch_6_4/vector/v.overlay/main.c
//must be array of polygons

// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html

var jsts = require('jsts')
var t = {}
t.featurecollection = require('./featurecollection')

module.exports = function(poly1, poly2, done){
  var reader = new jsts.io.GeoJSONReader()
  var a = reader.read(JSON.stringify(poly1.geometry))
  var b = reader.read(JSON.stringify(poly2.geometry))
  var union = a.union(b);
  var parser = new jsts.io.GeoJSONParser()
  union = parser.write(union)
  union = {
    type: 'Feature',
    geometry: union,
    properties: poly1.properties
  }
  done(null, union)
}