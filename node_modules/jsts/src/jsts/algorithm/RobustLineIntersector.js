/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/algorithm/LineIntersector.js
 */



/**
 * A robust version of {@LineIntersector}.
 *
 * @constructor
 * @augments jsts.algorithm.LineIntersector
 */
jsts.algorithm.RobustLineIntersector = function() {
  jsts.algorithm.RobustLineIntersector.prototype.constructor.call(this);
};

jsts.algorithm.RobustLineIntersector.prototype = new jsts.algorithm.LineIntersector();


/**
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersection = function(
    p, p1, p2) {

  if (arguments.length === 4) {
    jsts.algorithm.LineIntersector.prototype.computeIntersection.apply(this, arguments);
    return;
  }

  this._isProper = false;
  // do between check first, since it is faster than the orientation test
  if (jsts.geom.Envelope.intersects(p1, p2, p)) {
    if ((jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, p) === 0) &&
        (jsts.algorithm.CGAlgorithms.orientationIndex(p2, p1, p) === 0)) {
      this._isProper = true;
      if (p.equals(p1) || p.equals(p2)) {
        this._isProper = false;
      }
      this.result = jsts.algorithm.LineIntersector.POINT_INTERSECTION;
      return;
    }
  }
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
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
 * @return {Number}
 * @protected
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersect = function(p1,
    p2, q1, q2) {
  this._isProper = false;

  // first try a fast test to see if the envelopes of the lines intersect
  if (!jsts.geom.Envelope.intersects(p1, p2, q1, q2)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  // for each endpoint, compute which side of the other segment it lies
  // if both endpoints lie on the same side of the other segment,
  // the segments do not intersect
  var Pq1 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q1);
  var Pq2 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q2);

  if ((Pq1 > 0 && Pq2 > 0) || (Pq1 < 0 && Pq2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var Qp1 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p1);
  var Qp2 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p2);

  if ((Qp1 > 0 && Qp2 > 0) || (Qp1 < 0 && Qp2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var collinear = Pq1 === 0 && Pq2 === 0 && Qp1 === 0 && Qp2 === 0;
  if (collinear) {
    return this.computeCollinearIntersection(p1, p2, q1, q2);
  }

  /**
   * At this point we know that there is a single intersection point (since the
   * lines are not collinear).
   */

  /**
   * Check if the intersection is an endpoint. If it is, copy the endpoint as
   * the intersection point. Copying the point rather than computing it ensures
   * the point has the exact value, which is important for robustness. It is
   * sufficient to simply check for an endpoint which is on the other line,
   * since at this point we know that the inputLines must intersect.
   */
  if (Pq1 === 0 || Pq2 === 0 || Qp1 === 0 || Qp2 === 0) {
    this._isProper = false;

    /**
     * Check for two equal endpoints. This is done explicitly rather than by the
     * orientation tests below in order to improve robustness.
     *
     * [An example where the orientation tests fail to be consistent is the
     * following (where the true intersection is at the shared endpoint POINT
     * (19.850257749638203 46.29709338043669)
     *
     * LINESTRING ( 19.850257749638203 46.29709338043669, 20.31970698357233
     * 46.76654261437082 ) and LINESTRING ( -48.51001596420236
     * -22.063180333403878, 19.850257749638203 46.29709338043669 )
     *
     * which used to produce the INCORRECT result: (20.31970698357233,
     * 46.76654261437082, NaN)
     *
     */
    if (p1.equals2D(q1) || p1.equals2D(q2)) {
      this.intPt[0] = p1;
    } else if (p2.equals2D(q1) || p2.equals2D(q2)) {
      this.intPt[0] = p2;
    }

    /**
     * Now check to see if any endpoint lies on the interior of the other
     * segment.
     */
    else if (Pq1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q1);
    } else if (Pq2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q2);
    } else if (Qp1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p1);
    } else if (Qp2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p2);
    }
  } else {
    this._isProper = true;
    this.intPt[0] = this.intersection(p1, p2, q1, q2);
  }
  return jsts.algorithm.LineIntersector.POINT_INTERSECTION;
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
 * @return {Number}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.computeCollinearIntersection = function(
    p1, p2, q1, q2) {
  var p1q1p2 = jsts.geom.Envelope.intersects(p1, p2, q1);
  var p1q2p2 = jsts.geom.Envelope.intersects(p1, p2, q2);
  var q1p1q2 = jsts.geom.Envelope.intersects(q1, q2, p1);
  var q1p2q2 = jsts.geom.Envelope.intersects(q1, q2, p2);

  if (p1q1p2 && p1q2p2) {
    this.intPt[0] = q1;
    this.intPt[1] = q2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (q1p1q2 && q1p2q2) {
    this.intPt[0] = p1;
    this.intPt[1] = p2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p1q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p1;
    return q1.equals(p1) && !p1q2p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p2q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p2;
    return q1.equals(p2) && !p1q2p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p1q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p1;
    return q2.equals(p1) && !p1q1p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p2q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p2;
    return q2.equals(p2) && !p1q1p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  return jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * This method computes the actual value of the intersection point. To obtain
 * the maximum precision from the intersection calculation, the coordinates are
 * normalized by subtracting the minimum ordinate values (in absolute value).
 * This has the effect of removing common significant digits from the
 * calculation to maintain more bits of precision.
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersection = function(p1, p2,
    q1, q2) {
  var intPt = this.intersectionWithNormalization(p1, p2, q1, q2);

  /**
   * Due to rounding it can happen that the computed intersection is outside the
   * envelopes of the input segments. Clearly this is inconsistent. This code
   * checks this condition and forces a more reasonable answer
   *
   * MD - May 4 2005 - This is still a problem. Here is a failure case:
   *
   * LINESTRING (2089426.5233462777 1180182.3877339689, 2085646.6891757075
   * 1195618.7333999649) LINESTRING (1889281.8148903656 1997547.0560044837,
   * 2259977.3672235999 483675.17050843034) int point =
   * (2097408.2633752143,1144595.8008114607)
   *
   * MD - Dec 14 2006 - This does not seem to be a failure case any longer
   */
  if (!this.isInSegmentEnvelopes(intPt)) {
    // System.out.println("Intersection outside segment envelopes: " + intPt);
    // System.out.println("Segments: " + this);
    // compute a safer result
    intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2, q1, q2);
    // System.out.println("Snapped to " + intPt);
  }

  if (this.precisionModel !== null) {
    this.precisionModel.makePrecise(intPt);
  }

  return intPt;
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
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersectionWithNormalization = function(
    p1, p2, q1, q2) {
  var n1 = new jsts.geom.Coordinate(p1);
  var n2 = new jsts.geom.Coordinate(p2);
  var n3 = new jsts.geom.Coordinate(q1);
  var n4 = new jsts.geom.Coordinate(q2);
  var normPt = new jsts.geom.Coordinate();
  this.normalizeToEnvCentre(n1, n2, n3, n4, normPt);

  var intPt = this.safeHCoordinateIntersection(n1, n2, n3, n4);

  intPt.x += normPt.x;
  intPt.y += normPt.y;

  return intPt;
};


/**
 * Computes a segment intersection using homogeneous coordinates. Round-off
 * error can cause the raw computation to fail, (usually due to the segments
 * being approximately parallel). If this happens, a reasonable approximation is
 * computed instead.
 *
 * @param {Coordinate}
 *          p1 a segment endpoint.
 * @param {Coordinate}
 *          p2 a segment endpoint.
 * @param {Coordinate}
 *          q1 a segment endpoint.
 * @param {Coordinate}
 *          q2 a segment endpoint.
 * @return {Coordinate} the computed intersection point.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.safeHCoordinateIntersection = function(
    p1, p2, q1, q2) {
  var intPt = null;
  try {
    intPt = jsts.algorithm.HCoordinate.intersection(p1, p2, q1, q2);
  } catch (e) {
    if (e instanceof jsts.error.NotRepresentableError) {
      // System.out.println("Not calculable: " + this);
      // compute an approximate result
      intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2,
          q1, q2);
      // System.out.println("Snapped to " + intPt);
    } else {
      throw e;
    }
  }

  return intPt;
};


/**
 * Normalize the supplied coordinates so that their minimum ordinate values lie
 * at the origin. NOTE: this normalization technique appears to cause large
 * errors in the position of the intersection point for some cases.
 *
 * @param {Coordinate}
 *          n1
 * @param {Coordinate}
 *          n2
 * @param {Coordinate}
 *          n3
 * @param {Coordinate}
 *          n4
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToMinimum = function(
    n1, n2, n3, n4, normPt) {
  normPt.x = this.smallestInAbsValue(n1.x, n2.x, n3.x, n4.x);
  normPt.y = this.smallestInAbsValue(n1.y, n2.y, n3.y, n4.y);
  n1.x -= normPt.x;
  n1.y -= normPt.y;
  n2.x -= normPt.x;
  n2.y -= normPt.y;
  n3.x -= normPt.x;
  n3.y -= normPt.y;
  n4.x -= normPt.x;
  n4.y -= normPt.y;
};


/**
 * Normalize the supplied coordinates to so that the midpoint of their
 * intersection envelope lies at the origin.
 *
 * @param {Coordinate}
 *          n00
 * @param {Coordinate}
 *          n01
 * @param {Coordinate}
 *          n10
 * @param {Coordinate}
 *          n11
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToEnvCentre = function(
    n00, n01, n10, n11, normPt) {
  var minX0 = n00.x < n01.x ? n00.x : n01.x;
  var minY0 = n00.y < n01.y ? n00.y : n01.y;
  var maxX0 = n00.x > n01.x ? n00.x : n01.x;
  var maxY0 = n00.y > n01.y ? n00.y : n01.y;

  var minX1 = n10.x < n11.x ? n10.x : n11.x;
  var minY1 = n10.y < n11.y ? n10.y : n11.y;
  var maxX1 = n10.x > n11.x ? n10.x : n11.x;
  var maxY1 = n10.y > n11.y ? n10.y : n11.y;

  var intMinX = minX0 > minX1 ? minX0 : minX1;
  var intMaxX = maxX0 < maxX1 ? maxX0 : maxX1;
  var intMinY = minY0 > minY1 ? minY0 : minY1;
  var intMaxY = maxY0 < maxY1 ? maxY0 : maxY1;

  var intMidX = (intMinX + intMaxX) / 2.0;
  var intMidY = (intMinY + intMaxY) / 2.0;
  normPt.x = intMidX;
  normPt.y = intMidY;

  /*
  // equilavalent code using more modular but slower method
  Envelope env0 = new Envelope(n00, n01);
  Envelope env1 = new Envelope(n10, n11);
  Envelope intEnv = env0.intersection(env1);
  Coordinate intMidPt = intEnv.centre();

  normPt.x = intMidPt.x;
  normPt.y = intMidPt.y;
  */

  n00.x -= normPt.x;
  n00.y -= normPt.y;
  n01.x -= normPt.x;
  n01.y -= normPt.y;
  n10.x -= normPt.x;
  n10.y -= normPt.y;
  n11.x -= normPt.x;
  n11.y -= normPt.y;
};


/**
 * @param {double}
 *          x1
 * @param {double}
 *          x2
 * @param {double}
 *          x3
 * @param {double}
 *          x4
 * @return {double}
 */
jsts.algorithm.RobustLineIntersector.prototype.smallestInAbsValue = function(
    x1, x2, x3, x4) {
  var x = x1;
  var xabs = Math.abs(x);
  if (Math.abs(x2) < xabs) {
    x = x2;
    xabs = Math.abs(x2);
  }
  if (Math.abs(x3) < xabs) {
    x = x3;
    xabs = Math.abs(x3);
  }
  if (Math.abs(x4) < xabs) {
    x = x4;
  }
  return x;
};


/**
 * Test whether a point lies in the envelopes of both input segments. A
 * correctly computed intersection point should return <code>true</code> for
 * this test. Since this test is for debugging purposes only, no attempt is made
 * to optimize the envelope test.
 *
 * @param {Coordinate}
 *          intPt
 * @return {boolean} <code>true</code> if the input point lies within both
 *         input segment envelopes.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.isInSegmentEnvelopes = function(
    intPt) {
  var env0 = new jsts.geom.Envelope(this.inputLines[0][0],
      this.inputLines[0][1]);
  var env1 = new jsts.geom.Envelope(this.inputLines[1][0],
      this.inputLines[1][1]);
  return env0.contains(intPt) && env1.contains(intPt);
};
