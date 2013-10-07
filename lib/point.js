module.exports = function(x, y, properties){
  if(x === null || y === null) throw new Error('Invalid coordinates')
  var point = { 
    "type": "Feature",
    "geometry": {
      "type": "Point", 
      "coordinates": [x, y]}
    },
    "properties": properties
  }
  return point
}