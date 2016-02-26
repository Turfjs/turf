// http://cs.selu.edu/~rbyrd/math/midpoint/
// ((x1+x2)/2), ((y1+y2)/2)
var point = require('turf-helpers').point;

/**
 * Takes two {@link Point|points} and returns a point midway between them.
 *
 * @module turf/midpoint
 * @category measurement
 * @param {Feature<Point>} pt1 first point
 * @param {Feature<Point>} pt2 second point
 * @return {Feature<Point>} a point midway between `pt1` and `pt2`
 * @example
 * var pt1 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [144.834823, -37.771257]
 *   }
 * };
 * var pt2 = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [145.14244, -37.830937]
 *   }
 * };
 *
 * var midpointed = turf.midpoint(pt1, pt2);
 * midpointed.properties['marker-color'] = '#f00';
 *
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [pt1, pt2, midpointed]
 * };
 *
 * //=result
 */
module.exports = function(point1, point2) {
  if (point1 === null || point2 === null) {
    throw new Error('Less than two points passed.');
  }

  var x1 = point1.geometry.coordinates[0];
  var x2 = point2.geometry.coordinates[0];
  var y1 = point1.geometry.coordinates[1];
  var y2 = point2.geometry.coordinates[1];

  var x3 = x1 + x2;
  var midX = x3/2;
  var y3 = y1 + y2;
  var midY = y3/2;

  return point([midX, midY]);
};
