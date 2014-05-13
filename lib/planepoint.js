http://stackoverflow.com/a/13916669/461015

module.exports = function(point, triangle, done){
  var x = point.geometry.coordinates[0]
      y = point.geometry.coordinates[1]
      x1 = triangle.geometry.coordinates[0][0][0],
      y1 = triangle.geometry.coordinates[0][0][1],
      z1 = triangle.properties.a
      x2 = triangle.geometry.coordinates[0][1][0],
      y2 = triangle.geometry.coordinates[0][1][1],
      z2 = triangle.properties.b
      x3 = triangle.geometry.coordinates[0][2][0],
      y3 = triangle.geometry.coordinates[0][2][1],
      z3 = triangle.properties.c

  var z = (z3 * (x-x1) * (y-y2) + z1 * (x-x2) * (y-y3) + z2 * (x-x3) * (y-y1)
      - z2 * (x-x1) * (y-y3) - z3 * (x-x2) * (y-y1) - z1 * (x-x3) * (y-y2)) /
      ((x-x1) * (y-y2) + (x-x2) * (y-y3) +(x-x3) * (y-y1) -
       (x-x1) * (y-y3) - (x-x2) * (y-y1) - (x-x3) * (y-y2))

  done = done || function () {};

  done(null, z)

  return z;
}
