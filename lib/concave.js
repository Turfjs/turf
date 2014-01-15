// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results

var fs = require('fs'),
    async = require('async')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')
t.distance = require('./distance')
t.point = require('./distance')

module.exports = function(points, done){
  t.tin(points, null, function(err, tinPolys){
    if(err) done(err)
    filterTriangles(tinPolys.features, function(filteredPolys){
      tinPolys.features = filteredPolys
      fs.writeFileSync('./testOut/filteredConvcave.geojson', JSON.stringify(tinPolys))
      t.buffer(tinPolys, .05, 'miles', function(err, bufferPolys){
        console.log(bufferPolys)
        fs.writeFileSync('./testOut/bufferConvcave.geojson', JSON.stringify(bufferPolys))
        t.merge(bufferPolys, function(err, mergePolys){
          if(err) done(err)
          console.log(JSON.stringify(mergePolys, null, 2))
          done(null, mergePolys)
        })
      })
    })
  })
}

var filterTriangles = function(triangles, cb){
  async.each(triangles, 
    function(triangle, asyncCB){
      console.log(triangle)
      console.log(triangle.geometry.coordinates[0][0][0])
      console.log(triangle.geometry.coordinates[0][0][1])
      var pt1 = t.point(triangle.geometry.coordinates[0][0][0], triangle.geometry.coordinates[0][0][1])
      var pt2 = t.point(triangle.geometry.coordinates[0][1][0], triangle.geometry.coordinates[0][1][1])
      var pt3 = t.point(triangle.geometry.coordinates[0][2][0], triangle.geometry.coordinates[0][2][1])
      t.distance(pt1, pt2, 'miles', function(err, dist1){
        t.distance(pt2, pt3, 'miles', function(err, dist2){
          t.distance(pt1, pt3, 'miles', function(err, dist3){
            console.log(dist1+' '+dist2+' '+dist3)
            asyncCB()  
          })
        })
      })
    },
    function(err){
      console.log('tri complete')
      cb(triangles)
    }
  )
}