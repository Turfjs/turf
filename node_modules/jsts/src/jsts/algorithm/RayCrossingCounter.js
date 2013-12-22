/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Counts the number of segments crossed by a horizontal ray extending to the
 * right from a given point, in an incremental fashion. This can be used to
 * determine whether a point lies in a {@link Polygonal} geometry. The class
 * determines the situation where the point lies exactly on a segment. When
 * being used for Point-In-Polygon determination, this case allows
 * short-circuiting the evaluation.
 * <p>
 * This class handles polygonal geometries with any number of shells and holes.
 * The orientation of the shell and hole rings is unimportant. In order to
 * compute a correct location for a given polygonal geometry, it is essential
 * that <b>all</b> segments are counted which
 * <ul>
 * <li>touch the ray
 * <li>lie in in any ring which may contain the point
 * </ul>
 * The only exception is when the point-on-segment situation is detected, in
 * which case no further processing is required. The implication of the above
 * rule is that segments which can be a priori determined to <i>not</i> touch
 * the ray (i.e. by a test of their bounding box or Y-extent) do not need to be
 * counted. This allows for optimization by indexing.
 *
 * @constructor
 */
jsts.algorithm.RayCrossingCounter = function(p) {
  this.p = p;
};


/**
 * Determines the {@link Location} of a point in a ring. This method is an
 * exemplar of how to use this class.
 *
 * @param {Coordinate}
 *          p the point to test.
 * @param {Coordinate[]}
 *          ring an array of Coordinates forming a ring.
 * @return {int} the location of the point in the ring.
 */
jsts.algorithm.RayCrossingCounter.locatePointInRing = function(p, ring) {
  var counter = new jsts.algorithm.RayCrossingCounter(p);

  for (var i = 1; i < ring.length; i++) {
    var p1 = ring[i];
    var p2 = ring[i - 1];
    counter.countSegment(p1, p2);
    if (counter.isOnSegment())
      return counter.getLocation();
  }
  return counter.getLocation();
};


/**
 * @type {Coordinate}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.p = null;


/**
 * @type {int}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.crossingCount = 0;


/**
 * true if the test point lies on an input segment
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointOnSegment = false;


/**
 * Counts a segment
 *
 * @param {Coordinate}
 *          p1 an endpoint of the segment.
 * @param {Coordinate}
 *          p2 another endpoint of the segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.countSegment = function(p1, p2) {
  /**
   * For each segment, check if it crosses a horizontal ray running from the
   * test point in the positive x direction.
   */

  // check if the segment is strictly to the left of the test point
  if (p1.x < this.p.x && p2.x < this.p.x)
    return;

  // check if the point is equal to the current ring vertex
  if (this.p.x == p2.x && this.p.y === p2.y) {
    this.isPointOnSegment = true;
    return;
  }
  /**
   * For horizontal segments, check if the point is on the segment. Otherwise,
   * horizontal segments are not counted.
   */
  if (p1.y === this.p.y && p2.y === this.p.y) {
    var minx = p1.x;
    var maxx = p2.x;
    if (minx > maxx) {
      minx = p2.x;
      maxx = p1.x;
    }
    if (this.p.x >= minx && this.p.x <= maxx) {
      this.isPointOnSegment = true;
    }
    return;
  }
  /**
   * Evaluate all non-horizontal segments which cross a horizontal ray to the
   * right of the test pt. To avoid double-counting shared vertices, we use the
   * convention that
   * <ul>
   * <li>an upward edge includes its starting endpoint, and excludes its final
   * endpoint
   * <li>a downward edge excludes its starting endpoint, and includes its final
   * endpoint
   * </ul>
   */
  if (((p1.y > this.p.y) && (p2.y <= this.p.y)) || ((p2.y > this.p.y) && (p1.y <= this.p.y))) {
    // translate the segment so that the test point lies on the origin
    var x1 = p1.x - this.p.x;
    var y1 = p1.y - this.p.y;
    var x2 = p2.x - this.p.x;
    var y2 = p2.y - this.p.y;

    /**
     * The translated segment straddles the x-axis. Compute the sign of the
     * ordinate of intersection with the x-axis. (y2 != y1, so denominator will
     * never be 0.0)
     */
    // double xIntSign = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) / (y2
    // - y1);
    // MD - faster & more robust computation?
    var xIntSign = jsts.algorithm.RobustDeterminant.signOfDet2x2(x1, y1, x2, y2);
    if (xIntSign === 0.0) {
      this.isPointOnSegment = true;
      return;
    }
    if (y2 < y1)
      xIntSign = -xIntSign;
    // xsave = xInt;

    // System.out.println("xIntSign(" + x1 + ", " + y1 + ", " + x2 + ", " + y2
    // + " = " + xIntSign);
    // The segment crosses the ray if the sign is strictly positive.
    if (xIntSign > 0.0) {
      this.crossingCount++;
    }
  }
};


/**
 * Reports whether the point lies exactly on one of the supplied segments. This
 * method may be called at any time as segments are processed. If the result of
 * this method is <tt>true</tt>, no further segments need be supplied, since
 * the result will never change again.
 *
 * @return {boolean} true if the point lies exactly on a segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.isOnSegment = function() {
  return jsts.geom.isPointOnSegment;
};


/**
 * Gets the {@link Location} of the point relative to the ring, polygon or
 * multipolygon from which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {int} the Location of the point.
 */
jsts.algorithm.RayCrossingCounter.prototype.getLocation = function() {
  if (this.isPointOnSegment)
    return jsts.geom.Location.BOUNDARY;

  // The point is in the interior of the ring if the number of X-crossings is
  // odd.
  if ((this.crossingCount % 2) === 1) {
    return jsts.geom.Location.INTERIOR;
  }
  return jsts.geom.Location.EXTERIOR;
};


/**
 * Tests whether the point lies in or on the ring, polygon or multipolygon from
 * which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {boolean} true if the point lies in or on the supplied polygon.
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointInPolygon = function() {
  return this.getLocation() !== jsts.geom.Location.EXTERIOR;
};
