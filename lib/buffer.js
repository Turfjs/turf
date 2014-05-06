//http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
//radians = degrees * (pi/180)

// https://github.com/bjornharrtell/jsts/blob/master/examples/buffer.html

var _ = require('lodash'),
    jsts = require('jsts')
var t = {}
t.featurecollection = require('./featurecollection')
t.polygon = require('./polygon')
t.combine = require('./combine')

module.exports = function(feature, radius, units, done){
  var buffered;

  done = done || function () {};

  switch(units){
    case 'miles':
      radius = radius / 69.047
      break
    case 'kilometers':
      radius = radius / 111.12
      break
    case 'degrees':
      break
  }

  if(feature.type === 'FeatureCollection'){
    var multi = t.combine(feature);
    multi.properties = {}

    buffered = bufferOp(multi, radius);

    done(null, buffered);
    return buffered;
  }
  else{
    buffered = bufferOp(feature, radius);
    
    done(null, buffered);
    return buffered;
  }
}

var bufferOp = function(feature, radius){
  var reader = new jsts.io.GeoJSONReader()
  var geom = reader.read(JSON.stringify(feature.geometry))
  var buffered = geom.buffer(radius);
  var parser = new jsts.io.GeoJSONParser()
  buffered = parser.write(buffered)

  if(buffered.type === 'MultiPolygon'){
    buffered = {
      type: 'Feature',
      geometry: buffered,
      properties: {}
    }
    buffered = t.featurecollection([buffered])
  }
  else{
    buffered = t.featurecollection([t.polygon(buffered.coordinates)])
  }

  return buffered;
}
