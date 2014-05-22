// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results

var async = require('async')
var _ = require('lodash')
var t = {}
t.tin = require('./tin')
t.merge = require('./merge')
t.buffer = require('./buffer')
t.distance = require('./distance')
t.point = require('./point')

module.exports = function(points, maxEdge, done){
  var tinPolys,
    filteredPolys,
    bufferPolys,
    mergePolys;

  done = done || function () {};

  tinPolys = t.tin(points, null);

  if (typeof tinPolys === 'Error') {
    done(err)
    return tinPolys;
  }

  filteredPolys = filterTriangles(tinPolys.features, maxEdge)
  tinPolys.features = filteredPolys

  bufferPolys = t.buffer(tinPolys, 1, 'miles')

  if (typeof bufferPolys === 'Error') {
    done(err);
    return bufferPolys;
  }

  mergePolys = t.merge(bufferPolys);

  if (typeof mergePolys === 'Error') {
    done(err);
    return mergePolys;
  }

  done(null, mergePolys)
  return mergePolys;
}

var filterTriangles = function(triangles, maxEdge, cb){
  filteredTriangles = []

  _.each(triangles, function (triangle) {
    var pt1 = t.point(triangle.geometry.coordinates[0][0][0], triangle.geometry.coordinates[0][0][1])
    var pt2 = t.point(triangle.geometry.coordinates[0][1][0], triangle.geometry.coordinates[0][1][1])
    var pt3 = t.point(triangle.geometry.coordinates[0][2][0], triangle.geometry.coordinates[0][2][1])
    var dist1 = t.distance(pt1, pt2, 'miles');
    var dist2 = t.distance(pt2, pt3, 'miles');
    var dist3 = t.distance(pt1, pt3, 'miles');

    if(dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge){
      filteredTriangles.push(triangle)
    }
  })

  return filteredTriangles;
}
