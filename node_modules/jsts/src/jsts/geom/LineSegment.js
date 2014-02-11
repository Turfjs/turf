/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Coordinate.js
 */

/**
 * Represents a line segment defined by two {@link Coordinate}s. Provides
 * methods to compute various geometric properties and relationships of line
 * segments.
 * <p>
 * This class is designed to be easily mutable (to the extent of having its
 * contained points public). This supports a common pattern of reusing a single
 * LineSegment object as a way of computing segment properties on the segments
 * defined by arrays or lists of {@link Coordinate}s.
 *
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @constructor
 */
jsts.geom.LineSegment = function(p0, p1) {
  if (p0 === undefined) {
    this.p0 = new jsts.geom.Coordinate();
    this.p1 = new jsts.geom.Coordinate();
    return;
  }

  this.p0 = p0;
  this.p1 = p1;
};


/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p0 = null;


/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p1 = null;

/**
 * Computes the length of the line segment.
 *
 * @return {number} the length of the line segment.
 */
jsts.geom.LineSegment.prototype.getLength = function() {
  return this.p0.distance(p1);
};

/**
 * Tests whether the segment is horizontal.
 *
 * @return {boolean} <code>true</code> if the segment is horizontal.
 */
jsts.geom.LineSegment.prototype.isHorizontal = function() {
  return this.p0.y === this.p1.y;
};
/**
 * Tests whether the segment is vertical.
 *
 * @return {boolean} <code>true</code> if the segment is vertical.
 */
jsts.geom.LineSegment.prototype.isVertical = function() {
  return this.p0.x === this.p1.x;
};


/**
 * Reverses the direction of the line segment.
 */
jsts.geom.LineSegment.prototype.reverse = function()
{
  var temp = this.p0;
  this.p0 = this.p1;
  this.p1 = temp;
};

/**
 * Computes the Projection Factor for the projection of the point p onto this
 * LineSegment. The Projection Factor is the constant r by which the vector for
 * this segment must be multiplied to equal the vector for the projection of
 * <tt>p<//t> on the line
 * defined by this segment.
 * <p>
 * The projection factor returned will be in the range <tt>(-inf, +inf)</tt>.
 *
 * @param {Coordinate} p the point to compute the factor for.
 * @return {double} the projection factor for the point.
 */
jsts.geom.LineSegment.prototype.projectionFactor = function(p) {
  if (p.equals(this.p0))
    return 0.0;
  if (p.equals(this.p1))
    return 1.0;
  // Otherwise, use comp.graphics.algorithms Frequently Asked Questions method
  /*            AC dot AB
                 r = ---------
                       ||AB||^2
              r has the following meaning:
              r=0 P = A
              r=1 P = B
              r<0 P is on the backward extension of AB
              r>1 P is on the forward extension of AB
              0<r<1 P is interior to AB
      */
  var dx = this.p1.x - this.p0.x;
  var dy = this.p1.y - this.p0.y;
  var len2 = dx * dx + dy * dy;
  var r = ((p.x - this.p0.x) * dx + (p.y - this.p0.y) * dy) / len2;
  return r;
};


/**
 * Computes the closest point on this line segment to another point.
 *
 * @param {Coordinate}
 *          p the point to find the closest point to.
 * @return {Coordinate} a Coordinate which is the closest point on the line
 *         segment to the point p.
 */
jsts.geom.LineSegment.prototype.closestPoint = function(p) {
  var factor = this.projectionFactor(p);
  if (factor > 0 && factor < 1) {
    return this.project(p);
  }
  var dist0 = this.p0.distance(p);
  var dist1 = this.p1.distance(p);
  if (dist0 < dist1)
    return this.p0;
  return this.p1;
};


/**
 * Computes the closest points on two line segments.
 *
 * @param {LineSegment}
 *          line the segment to find the closest point to.
 * @return {[]} a pair of Coordinates which are the closest points on the line
 *         segments.
 */
jsts.geom.LineSegment.prototype.closestPoints = function(line) {
  // test for intersection
  var intPt = this.intersection(line);
  if (intPt !== null) {
    return [intPt, intPt];
  }

  /**
   * if no intersection closest pair contains at least one endpoint. Test each
   * endpoint in turn.
   */
  var closestPt = [];
  var minDistance = Number.MAX_VALUE;
  var dist;

  var close00 = this.closestPoint(line.p0);
  minDistance = close00.distance(line.p0);
  closestPt[0] = close00;
  closestPt[1] = line.p0;

  var close01 = this.closestPoint(line.p1);
  dist = close01.distance(line.p1);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = close01;
    closestPt[1] = line.p1;
  }

  var close10 = line.closestPoint(this.p0);
  dist = close10.distance(this.p0);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = this.p0;
    closestPt[1] = close10;
  }

  var close11 = line.closestPoint(this.p1);
  dist = close11.distance(this.p1);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = this.p1;
    closestPt[1] = close11;
  }

  return closestPt;
};


/**
 * Computes an intersection point between two line segments, if there is one.
 * There may be 0, 1 or many intersection points between two segments. If there
 * are 0, null is returned. If there is 1 or more, exactly one of them is
 * returned (chosen at the discretion of the algorithm). If more information is
 * required about the details of the intersection, the
 * {@link RobustLineIntersector} class should be used.
 *
 * @param {LineSegment}
 *          line a line segment.
 * @return {Coordinate} an intersection point, or <code>null</code> if there
 *         is none.
 *
 * @see RobustLineIntersector
 */
jsts.geom.LineSegment.prototype.intersection = function(line) {
  var li = new jsts.algorithm.RobustLineIntersector();
  li.computeIntersection(this.p0, this.p1, line.p0, line.p1);
  if (li.hasIntersection())
    return li.getIntersection(0);
  return null;
};


/**
 * Compute the projection of a point onto the line determined by this line
 * segment.
 * <p>
 * Note that the projected point may lie outside the line segment. If this is
 * the case, the projection factor will lie outside the range [0.0, 1.0].
 *
 * @param {Coordinate}
 *          p
 * @return {Coordinate}
 */
jsts.geom.LineSegment.prototype.project = function(p) {
  if (p.equals(this.p0) || p.equals(this.p1))
    return new jsts.geom.Coordinate(p);

  var r = this.projectionFactor(p);
  var coord = new jsts.geom.Coordinate();
  coord.x = this.p0.x + r * (this.p1.x - this.p0.x);
  coord.y = this.p0.y + r * (this.p1.y - this.p0.y);
  return coord;
};

jsts.geom.LineSegment.prototype.setCoordinates = function(ls) {
  if (ls instanceof jsts.geom.Coordinate) {
    this.setCoordinates2.apply(this, arguments);
    return;
  }

  this.setCoordinates2(ls.p0, ls.p1);
};

jsts.geom.LineSegment.prototype.setCoordinates2 = function(p0, p1) {
  this.p0.x = p0.x;
  this.p0.y = p0.y;
  this.p1.x = p1.x;
  this.p1.y = p1.y;
};

/**
 * Computes the distance between this line segment and a given point.
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate.
 * @return {number}
 *          the distance from this segment to the given point.
 */
jsts.geom.LineSegment.prototype.distance = function(p)
{
  return jsts.algorithm.CGAlgorithms.distancePointLine(p, this.p0, this.p1);
};

// TODO: port rest
