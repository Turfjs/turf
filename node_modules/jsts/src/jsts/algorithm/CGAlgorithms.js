/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies and implements various fundamental Computational Geometric
 * algorithms. The algorithms supplied in this class are robust for
 * double-precision floating point.
 *
 * @constructor
 */
jsts.algorithm.CGAlgorithms = function() {

};


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.CLOCKWISE = -1;


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.RIGHT = jsts.algorithm.CGAlgorithms.CLOCKWISE;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE = 1;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.LEFT = jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.COLLINEAR = 0;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.STRAIGHT = jsts.algorithm.CGAlgorithms.COLLINEAR;


/**
 * Returns the index of the direction of the point <code>q</code> relative to
 * a vector specified by <code>p1-p2</code>.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the origin point of the vector.
 * @param {jsts.geom.Coordinate}
 *          p2 the final point of the vector.
 * @param {jsts.geom.Coordinate}
 *          q the point to compute the direction to.
 *
 * @return {Number} 1 if q is counter-clockwise (left) from p1-p2.
 * @return {Number} -1 if q is clockwise (right) from p1-p2.
 * @return {Number} 0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.orientationIndex = function(p1, p2, q) {
  /**
   * MD - 9 Aug 2010 It seems that the basic algorithm is slightly orientation
   * dependent, when computing the orientation of a point very close to a line.
   * This is possibly due to the arithmetic in the translation to the origin.
   *
   * For instance, the following situation produces identical results in spite
   * of the inverse orientation of the line segment:
   *
   * Coordinate p0 = new Coordinate(219.3649559090992, 140.84159161824724);
   * Coordinate p1 = new Coordinate(168.9018919682399, -5.713787599646864);
   *
   * Coordinate p = new Coordinate(186.80814046338352, 46.28973405831556); int
   * orient = orientationIndex(p0, p1, p); int orientInv = orientationIndex(p1,
   * p0, p);
   *
   * A way to force consistent results is to normalize the orientation of the
   * vector using the following code. However, this may make the results of
   * orientationIndex inconsistent through the triangle of points, so it's not
   * clear this is an appropriate patch.
   *
   */

  var dx1, dy1, dx2, dy2;
  dx1 = p2.x - p1.x;
  dy1 = p2.y - p1.y;
  dx2 = q.x - p2.x;
  dy2 = q.y - p2.y;

  return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1, dy1, dx2, dy2);
};


/**
 * Tests whether a point lies inside or on a ring. The ring may be oriented in
 * either direction. A point lying exactly on the ring boundary is considered to
 * be inside the ring.
 * <p>
 * This method does <i>not</i> first check the point against the envelope of
 * the ring.
 *
 * @param {jsts.geom.Coordinate}
 *          p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of coordinates representing the ring (which must have
 *          first point identical to last point)
 * @return {Boolean} true if p is inside ring.
 *
 * @see locatePointInRing
 */
jsts.algorithm.CGAlgorithms.isPointInRing = function(p, ring) {
  return jsts.algorithm.CGAlgorithms.locatePointInRing(p, ring) !== jsts.geom.Location.EXTERIOR;
};


/**
 * Determines whether a point lies in the interior, on the boundary, or in the
 * exterior of a ring. The ring may be oriented in either direction.
 * <p>
 * This method does <i>not</i> first check the point against the envelope of
 * the ring.
 *
 * @param {jsts.geom.Coordinate}
 *          p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of coordinates representing the ring (which must have
 *          first point identical to last point)
 * @return {jsts.geom.Location} the {@link Location} of p relative to the ring.
 */
jsts.algorithm.CGAlgorithms.locatePointInRing = function(p, ring) {
  return jsts.algorithm.RayCrossingCounter.locatePointInRing(p, ring);
};


/**
 * Tests whether a point lies on the line segments defined by a list of
 * coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate to test.
 * @param {Array{jsts.geom.Coordinate}}
 *          pt An array of coordinates defining line segments
 * @return {Boolean} true if the point is a vertex of the line or lies in the
 *         interior of a line segment in the linestring.
 */
jsts.algorithm.CGAlgorithms.isOnLine = function(p, pt) {
  var lineIntersector, i, il, p0, p1;
  lineIntersector = new jsts.algorithm.RobustLineIntersector();

  for (i = 1, il = pt.length; i < il; i++) {
    p0 = pt[i - 1];
    p1 = pt[i];
    lineIntersector.computeIntersection(p, p0, p1);

    if (lineIntersector.hasIntersection()) {
      return true;
    }
  }
  return false;
};


/**
 * Computes whether a ring defined by an array of {@link Coordinate}s is
 * oriented counter-clockwise.
 * <ul>
 * <li>The list of points is assumed to have the first and last points equal.
 * <li>This will handle coordinate lists which contain repeated points.
 * </ul>
 * This algorithm is <b>only</b> guaranteed to work with valid rings. If the
 * ring is invalid (e.g. self-crosses or touches), the computed result may not
 * be correct.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of Coordinates forming a ring
 * @return {Boolean} true if the ring is oriented counter-clockwise.
 * @throws IllegalArgumentException
 *           if there are too few points to determine orientation (< 3)
 */
jsts.algorithm.CGAlgorithms.isCCW = function(ring) {
  var nPts, hiPt, hiIndex, p, iPrev, iNext, prev, next, i, disc, isCCW;

  // # of points without closing endpoint
  nPts = ring.length - 1;

  // sanity check
  if (nPts < 3) {
    throw new jsts.IllegalArgumentError(
        'Ring has fewer than 3 points, so orientation cannot be determined');
  }

  // find highets point
  hiPt = ring[0];
  hiIndex = 0;

  i = 1;
  for (i; i <= nPts; i++) {
    p = ring[i];
    if (p.y > hiPt.y) {
      hiPt = p;
      hiIndex = i;
    }
  }

  // find distinct point before highest point
  iPrev = hiIndex;
  do {
    iPrev = iPrev - 1;
    if (iPrev < 0) {
      iPrev = nPts;
    }
  } while (ring[iPrev].equals2D(hiPt) && iPrev !== hiIndex);

  // find distinct point after highest point
  iNext = hiIndex;
  do {
    iNext = (iNext + 1) % nPts;
  } while (ring[iNext].equals2D(hiPt) && iNext !== hiIndex);

  prev = ring[iPrev];
  next = ring[iNext];

  /**
   * This check catches cases where the ring contains an A-B-A configuration of
   * points. This can happen if the ring does not contain 3 distinct points
   * (including the case where the input array has fewer than 4 elements), or it
   * contains coincident line segments.
   */
  if (prev.equals2D(hiPt) || next.equals2D(hiPt) || prev.equals2D(next)) {
    return false;
  }

  disc = jsts.algorithm.CGAlgorithms.computeOrientation(prev, hiPt, next);

  /**
   * If disc is exactly 0, lines are collinear. There are two possible cases:
   * (1) the lines lie along the x axis in opposite directions (2) the lines lie
   * on top of one another
   *
   * (1) is handled by checking if next is left of prev ==> CCW (2) will never
   * happen if the ring is valid, so don't check for it (Might want to assert
   * this)
   */
  isCCW = false;
  if (disc === 0) {
    // poly is CCW if prev x is right of next x
    isCCW = (prev.x > next.x);
  } else {
    // if area is positive, points are ordered CCW
    isCCW = (disc > 0);
  }

  return isCCW;
};


/**
 * Computes the orientation of a point q to the directed line segment p1-p2. The
 * orientation of a point relative to a directed line segment indicates which
 * way you turn to get to q after travelling from p1 to p2.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 First coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *          p2 Second coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *          q The point to calculate orientation of.
 *
 * @return {Number} 1 if q is counter-clockwise from p1-p2.
 * @return {Number} -1 if q is clockwise from p1-p2.
 * @return {Number} 0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.computeOrientation = function(p1, p2, q) {
  return jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q);
};


/**
 * Computes the distance from a point p to a line segment AB
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *          A one point of the line.
 * @param {jsts.geom.Coordinate}
 *          B another point of the line (must be different to A).
 * @return {Number} the distance from p to line segment AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLine = function(p, A, B) {
  if (!(A instanceof jsts.geom.Coordinate)) {
    jsts.algorithm.CGAlgorithms.distancePointLine2.apply(this, arguments);
  }

  // if start = end, then just compute distance to one of the endpoints
  if (A.x === B.x && A.y === B.y) {
    return p.distance(A);
  }
  // otherwise use comp.graphics.algorithms Frequently Asked Questions method
  /*(1)             AC dot AB
                   r = ---------
                         ||AB||^2
    r has the following meaning:
    r=0 P = A
    r=1 P = B
    r<0 P is on the backward extension of AB
    r>1 P is on the forward extension of AB
    0<r<1 P is interior to AB
  */
  var r, s;
  r = ((p.x - A.x) * (B.x - A.x) + (p.y - A.y) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  if (r <= 0.0) {
    return p.distance(A);
  }
  if (r >= 1.0) {
    return p.distance(B);
  }

  /*(2)
    (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
  s = -----------------------------
             L^2

  Then the distance from C to P = |s|*L.
  */

  s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the perpendicular distance from a point p to the (infinite) line
 * containing the points AB
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *          A one point of the line.
 * @param {jsts.geom.Coordinate}
 *          B another point of the line (must be different to A).
 * @return {Number} the distance from p to line AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular = function(p, A, B) {
  // use comp.graphics.algorithms Frequently Asked Questions method
  /*(2)
                   (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
              s = -----------------------------
                                   L^2

              Then the distance from C to P = |s|*L.
  */
  var s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the distance from a point to a sequence of line segments.
 *
 * @param {jsts.geom.Coordinate}
 *          p a point.
 * @param {Array{jsts.geom.Coordinate}}
 *          line a sequence of contiguous line segments defined by their
 *          vertices
 * @return {Number} the minimum distance between the point and the line
 *         segments.
 */
jsts.algorithm.CGAlgorithms.distancePointLine2 = function(p, line) {
  var minDistance, i, il, dist;
  if (line.length === 0) {
    throw new jsts.error.IllegalArgumentError(
        'Line array must contain at least one vertex');
  }
  minDistance = p.distance(line[0]);
  for (i = 0, il = line.length - 1; i < il; i++) {
    dist = jsts.algorithm.CGAlgorithms.distancePointLine(p, line[i],
        line[i + 1]);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
};

/**
 * Computes the distance from a line segment AB to a line segment CD
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *          A a point of one line.
 * @param {jsts.geom.Coordinate}
 *          B the second point of (must be different to A).
 * @param {jsts.geom.Coordinate}
 *          C one point of the line.
 * @param {jsts.geom.Coordinate}
 *          D another point of the line (must be different to A).
 * @return {Number} the distance.
 */

jsts.algorithm.CGAlgorithms.distanceLineLine = function(A, B, C, D) {
  // check for zero-length segments
  if (A.equals(B)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D);
  }
  if (C.equals(D)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B);
  }

  // AB and CD are line segments
  /* from comp.graphics.algo

  Solving the above for r and s yields
        (Ay-Cy)(Dx-Cx)-(Ax-Cx)(Dy-Cy)
             r = ----------------------------- (eqn 1)
        (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)

      (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
    s = ----------------------------- (eqn 2)
      (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
  Let P be the position vector of the intersection point, then
    P=A+r(B-A) or
    Px=Ax+r(Bx-Ax)
    Py=Ay+r(By-Ay)
  By examining the values of r & s, you can also determine some other
  limiting conditions:
    If 0<=r<=1 & 0<=s<=1, intersection exists
    r<0 or r>1 or s<0 or s>1 line segments do not intersect
    If the denominator in eqn 1 is zero, AB & CD are parallel
    If the numerator in eqn 1 is also zero, AB & CD are collinear.

  */
  var r_top, r_bot, s_top, s_bot, s, r;
  r_top = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y);
  r_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

  s_top = (A.y - C.y) * (B.x - A.x) - (A.x - C.x) * (B.y - A.y);
  s_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);


  if ((r_bot === 0) || (s_bot === 0)) {
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D), Math
            .min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
                jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  s = s_top / s_bot;
  r = r_top / r_bot;
  if ((r < 0) || (r > 1) || (s < 0) || (s > 1)) {
    // no intersection
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D), Math
            .min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
                jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  return 0.0; // intersection exists
};


/**
 * Computes the signed area for a ring. The signed area is positive if the ring
 * is oriented CW, negative if the ring is oriented CCW, and zero if the ring is
 * degenerate or flat.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring the coordinates forming the ring
 * @return {Number} the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  if (ring.length < 3) {
    return 0.0;
  }
  var sum, i, il, bx, by, cx, cy;

  sum = 0.0;

  for (i = 0, il = ring.length - 1; i < il; i++) {
    bx = ring[i].x;
    by = ring[i].y;
    cx = ring[i + 1].x;
    cy = ring[i + 1].y;
    sum += (bx + cx) * (cy - by);
  }

  return -sum / 2.0;
};


/**
 * Computes the signed area for a ring. The signed area is:
 * <ul>
 * <li>positive if the ring is oriented CW
 * <li>negative if the ring is oriented CCW
 * <li>zero if the ring is degenerate or flat
 * </ul>
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring the coordinates forming the ring
 * @return {Number} the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  var n, sum, p, bx, by, i, cx, cy;

  n = ring.length;
  if (n < 3) {
    return 0.0;
  }

  sum = 0.0;
  p = ring[0];

  bx = p.x;
  by = p.y;

  for (i = 1; i < n; i++) {
    p = ring[i];
    cx = p.x;
    cy = p.y;
    sum += (bx + cx) * (cy - by);
    bx = cx;
    by = cy;
  }

  return -sum / 2.0;
};

/**
 * Computes the length of a linestring specified by a sequence of points.
 *
 * NOTE: This is renamed from length() to computeLength() because 'length' is a
 * reserved keyword in javascript.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          pts the points specifying the linestring
 * @return {Number} the length of the linestring.
 */
jsts.algorithm.CGAlgorithms.computeLength = function(pts) {
  // optimized for processing CoordinateSequences
  var n = pts.length, len, x0, y0, x1, y1, dx, dy, p, i, il;
  if (n <= 1) {
    return 0.0;
  }

  len = 0.0;

  p = pts[0];

  x0 = p.x;
  y0 = p.y;

  i = 1, il = n;
  for (i; i < n; i++) {
    p = pts[i];

    x1 = p.x;
    y1 = p.y;
    dx = x1 - x0;
    dy = y1 - y0;

    len += Math.sqrt(dx * dx + dy * dy);

    x0 = x1;
    y0 = y1;
  }
  return len;
};

/**
 * @see {jsts.algorithm.CGAlgorithms.computeLength} Since 'length' is a reserved
 *      keyword in javascript this function does not act as a function. Please
 *      use 'computeLength' instead.
 */
jsts.algorithm.CGAlgorithms.length = function() {};
