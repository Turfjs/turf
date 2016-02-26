// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var t = {};
t.tin = require('turf-tin');
t.merge = require('turf-merge');
t.distance = require('turf-distance');
t.point = require('turf-helpers').point;

/**
 * Takes a set of {@link Point|points} and returns a concave hull polygon.
 *
 * Internally, this uses [turf-tin](https://github.com/Turfjs/turf-tin) to generate geometries.
 *
 * @module turf/concave
 * @category transformation
 * @param {FeatureCollection<Point>} points input points
 * @param {Number} maxEdge the size of an edge necessary for part of the
 * hull to become concave (in miles)
 * @param {String} units used for maxEdge distance (miles or kilometers)
 * @returns {Feature<Polygon>} a concave hull
 * @throws {Error} if maxEdge parameter is missing
 * @example
 * var points = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.601226, 44.642643]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.591442, 44.651436]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.580799, 44.648749]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.573589, 44.641788]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.587665, 44.64533]
 *       }
 *     }, {
 *       "type": "Feature",
 *       "properties": {},
 *       "geometry": {
 *         "type": "Point",
 *         "coordinates": [-63.595218, 44.64765]
 *       }
 *     }
 *   ]
 * };
 *
 * var hull = turf.concave(points, 1, 'miles');
 *
 * var resultFeatures = points.features.concat(hull);
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": resultFeatures
 * };
 *
 * //=result
 */


module.exports = function(points, maxEdge, units) {
  if (typeof maxEdge !== 'number') throw new Error('maxEdge parameter is required');
  if (typeof units !== 'string') throw new Error('units parameter is required');

  var tinPolys = t.tin(points);
  var filteredPolys = tinPolys.features.filter(filterTriangles);
  tinPolys.features = filteredPolys;

  function filterTriangles(triangle) {
    var pt1 = t.point(triangle.geometry.coordinates[0][0]);
    var pt2 = t.point(triangle.geometry.coordinates[0][1]);
    var pt3 = t.point(triangle.geometry.coordinates[0][2]);
    var dist1 = t.distance(pt1, pt2, units);
    var dist2 = t.distance(pt2, pt3, units);
    var dist3 = t.distance(pt1, pt3, units);
    return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
  }

  return t.merge(tinPolys);
};
