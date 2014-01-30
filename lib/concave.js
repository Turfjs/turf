// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results

var async = require('async')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')
t.distance = require('./distance')
t.point = require('./point')

module.exports = function(points, maxEdge, done){
  t.tin(points, null, function(err, tinPolys){
    if(err) done(err)
    filterTriangles(tinPolys.features, maxEdge, function(filteredPolys){
      tinPolys.features = filteredPolys
      t.buffer(tinPolys, 1, 'miles', function(err, bufferPolys){
        if(err) done(err)
        t.merge(bufferPolys, function(err, mergePolys){
          if(err) done(err)
          done(null, mergePolys)
        })
      })
    })
  })
}

var filterTriangles = function(triangles, maxEdge, cb){
  filteredTriangles = []
  async.each(triangles, 
    function(triangle, asyncCB){
      var pt1 = t.point(triangle.geometry.coordinates[0][0][0], triangle.geometry.coordinates[0][0][1])
      var pt2 = t.point(triangle.geometry.coordinates[0][1][0], triangle.geometry.coordinates[0][1][1])
      var pt3 = t.point(triangle.geometry.coordinates[0][2][0], triangle.geometry.coordinates[0][2][1])
      t.distance(pt1, pt2, 'miles', function(err, dist1){
        t.distance(pt2, pt3, 'miles', function(err, dist2){
          t.distance(pt1, pt3, 'miles', function(err, dist3){
            if(dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge){
              filteredTriangles.push(triangle)
            }
            asyncCB()
          })
        })
      })
    },
    function(err){
      cb(filteredTriangles)
    }
  )
}