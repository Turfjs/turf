/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A LineIntersector is an algorithm that can both test whether two line
 * segments intersect and compute the intersection point if they do. The
 * intersection point may be computed in a precise or non-precise manner.
 * Computing it precisely involves rounding it to an integer. (This assumes that
 * the input coordinates have been made precise by scaling them to an integer
 * grid.)
 *
 * @constructor
 */
jsts.algorithm.LineIntersector = function() {
  this.inputLines = [[], []];
  this.intPt = [null, null];
  // alias the intersection points for ease of reference
  this.pa = this.intPt[0];
  this.pb = this.intPt[1];
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Indicates that line segments do not intersect
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.NO_INTERSECTION = 0;


/**
 * Indicates that line segments intersect in a single point
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.POINT_INTERSECTION = 1;


/**
 * Indicates that line segments intersect in a line segment
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION = 2;


/**
 * Force computed intersection to be rounded to a given precision model. No
 * getter is provided, because the precision model is not required to be
 * specified.
 *
 * @param precisionModel
 */
jsts.algorithm.LineIntersector.prototype.setPrecisionModel = function(
    precisionModel) {
  this.precisionModel = precisionModel;
};


/**
 * Gets an endpoint of an input segment.
 *
 * @param segmentIndex
 *          the index of the input segment (0 or 1).
 * @param ptIndex
 *          the index of the endpoint (0 or 1).
 * @return the specified endpoint.
 */
jsts.algorithm.LineIntersector.prototype.getEndpoint = function(segmentIndex,
    ptIndex) {
  return this.inputLines[segmentIndex][ptIndex];
};


/**
 * Computes the "edge distance" of an intersection point p along a segment. The
 * edge distance is a metric of the point along the edge. The metric used is a
 * robust and easy to compute metric function. It is <b>not</b> equivalent to
 * the usual Euclidean metric. It relies on the fact that either the x or the y
 * ordinates of the points in the edge are unique, depending on whether the edge
 * is longer in the horizontal or vertical direction.
 * <p>
 * NOTE: This function may produce incorrect distances for inputs where p is not
 * precisely on p1-p2 (E.g. p = (139,9) p1 = (139,10), p2 = (280,1) produces
 * distanct 0.0, which is incorrect.
 * <p>
 * My hypothesis is that the function is safe to use for points which are the
 * result of <b>rounding</b> points which lie on the line, but not safe to use
 * for <b>truncated</b> points.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.computeEdgeDistance = function(p, p0, p1) {
  var dx = Math.abs(p1.x - p0.x);
  var dy = Math.abs(p1.y - p0.y);

  var dist = -1.0; // sentinel value
  if (p.equals(p0)) {
    dist = 0.0;
  } else if (p.equals(p1)) {
    if (dx > dy) {
      dist = dx;
    } else {
      dist = dy;
    }
  } else {
    var pdx = Math.abs(p.x - p0.x);
    var pdy = Math.abs(p.y - p0.y);
    if (dx > dy) {
      dist = pdx;
    } else {
      dist = pdy;
    }
    // <FIX>
    // hack to ensure that non-endpoints always have a non-zero distance
    if (dist === 0.0 && !p.equals(p0)) {
      dist = Math.max(pdx, pdy);
    }
  }
  if (dist === 0.0 && !p.equals(p0)) {
    throw new jsts.error.IllegalArgumentError('Bad distance calculation');
  }
  return dist;
};


/**
 * This function is non-robust, since it may compute the square of large
 * numbers. Currently not sure how to improve this.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.nonRobustComputeEdgeDistance = function(p, p1,
    p2) {
  var dx = p.x - p1.x;
  var dy = p.y - p1.y;
  var dist = Math.sqrt(dx * dx + dy * dy); // dummy value
  if (!(dist === 0.0 && !p.equals(p1))) {
    throw new jsts.error.IllegalArgumentError('Invalid distance calculation');
  }
  return dist;
};


/**
 * @protected
 * @type {int}
 */
jsts.algorithm.LineIntersector.prototype.result = null;


/**
 * @protected
 * @type {Coordinate[][] }
 */
jsts.algorithm.LineIntersector.prototype.inputLines = null;


/**
 * @protected
 * @type {Coordinate[]}
 */
jsts.algorithm.LineIntersector.prototype.intPt = null;


/**
 * The indexes of the endpoints of the intersection lines, in order along the
 * corresponding line
 */
/**
 * @protected
 * @type {int[][]}
 */
jsts.algorithm.LineIntersector.prototype.intLineIndex = null;


/**
 * @protected
 * @type {boolean}
 */
jsts.algorithm.LineIntersector.prototype._isProper = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pa = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pb = null;


/**
 * @protected
 * @type {PrecisionModel}
 */
jsts.algorithm.LineIntersector.prototype.precisionModel = null;


/**
 * Compute the intersection of a point p and the line p1-p2. This function
 * computes the boolean value of the hasIntersection test. The actual value of
 * the intersection (if there is one) is equal to the value of <code>p</code>.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p, p1,
    p2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isCollinear = function() {
  return this.result === jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
};


/**
 * Computes the intersection of the lines p1-p2 and p3-p4. This function
 * computes both the boolean value of the hasIntersection test and the
 * (approximate) value of the intersection point itself (if there is one).
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          p3
 * @param {Coordinate}
 *          p4
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p1, p2,
    p3, p4) {
  this.inputLines[0][0] = p1;
  this.inputLines[0][1] = p2;
  this.inputLines[1][0] = p3;
  this.inputLines[1][1] = p4;
  this.result = this.computeIntersect(p1, p2, p3, p4);
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {int}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntersect = function(p1, p2,
    q1, q2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isEndPoint = function() {
  return this.hasIntersection() && !this._isProper;
};


/**
 * Tests whether the input geometries intersect.
 *
 * @return {boolean} true if the input geometries intersect.
 */
jsts.algorithm.LineIntersector.prototype.hasIntersection = function() {
  return this.result !== jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Returns the number of intersection points found. This will be either 0, 1 or
 * 2.
 *
 * @return {int}
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionNum = function() {
  return this.result;
};


/**
 * Returns the intIndex'th intersection point
 *
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getIntersection = function(intIndex) {
  return this.intPt[intIndex];
};


/**
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function() {
  if (this.intLineIndex === null) {
    this.intLineIndex = [[], []];
    this.computeIntLineIndex(0);
    this.computeIntLineIndex(1);
  }
};


/**
 * Test whether a point is a intersection point of two line segments. Note that
 * if the intersection is a line segment, this method only tests for equality
 * with the endpoints of the intersection segment. It does <b>not</b> return
 * true if the input point is internal to the intersection segment.
 *
 * @param {Coordinate}
 *          pt
 * @return {boolean} true if the input point is one of the intersection points.
 */
jsts.algorithm.LineIntersector.prototype.isIntersection = function(pt) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (this.intPt[i].equals2D(pt)) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of one of the
 * input segments.
 *
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of one of the input segments.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection = function() {
  if (arguments.length === 1) {
    return this.isInteriorIntersection2.apply(this, arguments);
  }

  if (this.isInteriorIntersection(0)) {
    return true;
  }
  if (this.isInteriorIntersection(1)) {
    return true;
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of the specified
 * input segment.
 *
 * @param {[]} inputLineIndex
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of the input segment.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection2 = function(
    inputLineIndex) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (!(this.intPt[i].equals2D(this.inputLines[inputLineIndex][0]) || this.intPt[i]
        .equals2D(this.inputLines[inputLineIndex][1]))) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether an intersection is proper. <br>
 * The intersection between two line segments is considered proper if they
 * intersect in a single point in the interior of both segments (e.g. the
 * intersection is a single point and is not equal to any of the endpoints).
 * <p>
 * The intersection between a point and a line segment is considered proper if
 * the point lies in the interior of the segment (e.g. is not equal to either of
 * the endpoints).
 *
 * @return {boolean} true if the intersection is proper.
 */
jsts.algorithm.LineIntersector.prototype.isProper = function() {
  return this.hasIntersection() && this._isProper;
};


/**
 * Computes the intIndex'th intersection point in the direction of a specified
 * input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point in the direction of
 *         the specified input line segment.
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionAlongSegment = function(
    segmentIndex, intIndex) {
  // lazily compute int line array
  this.computeIntLineIndex();
  return this.intPt[intLineIndex[segmentIndex][intIndex]];
};


/**
 * Computes the index of the intIndex'th intersection point in the direction of
 * a specified input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {int} the index of the intersection point along the segment (0 or 1).
 */
jsts.algorithm.LineIntersector.prototype.getIndexAlongSegment = function(
    segmentIndex, intIndex) {
  this.computeIntLineIndex();
  return this.intLineIndex[segmentIndex][intIndex];
};


/**
 * @param {int}
 *          segmentIndex
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function(
    segmentIndex) {
  var dist0 = this.getEdgeDistance(segmentIndex, 0);
  var dist1 = this.getEdgeDistance(segmentIndex, 1);
  if (dist0 > dist1) {
    this.intLineIndex[segmentIndex][0] = 0;
    this.intLineIndex[segmentIndex][1] = 1;
  } else {
    this.intLineIndex[segmentIndex][0] = 1;
    this.intLineIndex[segmentIndex][1] = 0;
  }
};


/**
 * Computes the "edge distance" of an intersection point along the specified
 * input line segment.
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {double} the edge distance of the intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getEdgeDistance = function(
    segmentIndex, intIndex) {
  var dist = jsts.algorithm.LineIntersector.computeEdgeDistance(
      this.intPt[intIndex], this.inputLines[segmentIndex][0],
      this.inputLines[segmentIndex][1]);
  return dist;
};
