/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @param {Coordinate}
 *          p00
 * @param {Coordinate}
 *          p01
 * @param {Coordinate}
 *          p10
 * @param {Coordinate}
 *          p11
 * @constructor
 */
jsts.algorithm.CentralEndpointIntersector = function(p00, p01, p10, p11) {
  this.pts = [p00, p01, p10, p11];
  this.compute();
};


/**
 * @param {Coordinate}
 *          p00
 * @param {Coordinate}
 *          p01
 * @param {Coordinate}
 *          p10
 * @param {Coordinate}
 *          p11
 * @return {Coordinate}
 */
jsts.algorithm.CentralEndpointIntersector.getIntersection = function(p00, p01,
    p10, p11) {
  var intor = new jsts.algorithm.CentralEndpointIntersector(p00, p01, p10, p11);
  return intor.getIntersection();
};


/**
 * @type {Coordinate[]}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.pts = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.intPt = null;


/**
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.compute = function() {
  var centroid = jsts.algorithm.CentralEndpointIntersector.average(this.pts);
  this.intPt = this.findNearestPoint(centroid, this.pts);
};


/**
 * @return {Coordinate}
 */
jsts.algorithm.CentralEndpointIntersector.prototype.getIntersection = function() {
  return this.intPt;
};


/**
 * @param {Coordinate[]}
 *          pts
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.average = function(pts) {
  var avg = new jsts.geom.Coordinate();
  var i, n = pts.length;
  for (i = 0; i < n; i++) {
    avg.x += pts[i].x;
    avg.y += pts[i].y;
  }
  if (n > 0) {
    avg.x /= n;
    avg.y /= n;
  }
  return avg;
};


/**
 * Determines a point closest to the given point.
 *
 * @param {Coordinate}
 *          p the point to compare against.
 * @param {Coordinate[]}
 *          pts
 * @return {Coordinate} the point closest to the input point p.
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.findNearestPoint = function(
    p, pts) {
  var minDist = Number.MAX_VALUE;
  var i, result = null, dist;
  for (i = 0; i < pts.length; i++) {
    dist = p.distance(pts[i]);
    if (dist < minDist) {
      minDist = dist;
      result = pts[i];
    }
  }
  return result;
};
