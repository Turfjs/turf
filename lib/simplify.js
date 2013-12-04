// use topojson.simplify to simplify points to a given tolerence then convert back to geojson
var topojson = require('topojson')

module.exports = function(fc, quantization, minimumArea, done){
  var options = {
    "quantization" : quantization,
    "minimum-area" : minimumArea,
    "property-transform": function(properties, key, value) {
       //keeps all
      properties[key] = value;
      return true;
    }
  }
  var topo = topojson.topology({name:fc}, options)
  topojson.simplify(topo, options)
  done(null, topojson.feature(topo, topo.objects.name))
}