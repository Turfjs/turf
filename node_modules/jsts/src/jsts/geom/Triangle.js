/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * Represents a planar triangle, and provides methods for calculating various
 * properties of triangles.
 *
 * @constructor
 * @param {jsts.geom.Coordinate}
 *          p0 a coordinate.
 * @param {jsts.geom.Coordinate}
 *          p1 a coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 a coordinate.
 */
jsts.geom.Triangle = function(p0, p1, p2) {
  this.p0 = p0;
  this.p1 = p1;
  this.p2 = p2;
};

/**
 * Tests whether a triangle is acute. A triangle is acute iff all interior
 * angles are acute. This is a strict test - right triangles will return
 * <tt>false</tt> A triangle which is not acute is either right or obtuse.
 * <p>
 * Note: this implementation is not robust for angles very close to 90 degrees.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {Boolean} true if the triangle is acute.
 */
jsts.geom.Triangle.isAcute = function(a, b, c) {
  if (!jsts.algorithm.Angle.isAcute(a, b, c)) {
    return false;
  }
  if (!jsts.algorithm.Angle.isAcute(b, c, a)) {
    return false;
  }
  if (!jsts.algorithm.Angle.isAcute(c, a, b)) {
    return false;
  }
  return true;
};


/**
 * Computes the line which is the perpendicular bisector of the line segment
 * a-b.
 *
 * @param {jsts.geom.Coordinate}
 *          a a point.
 * @param {jsts.geom.Coordinate}
 *          b another point.
 * @return {jsts.algorithm.HCoordinate} the perpendicular bisector, as an
 *         HCoordinate.
 */
jsts.geom.Triangle.perpendicularBisector = function(a, b) {
  // returns the perpendicular bisector of the line segment ab
  var dx, dy, l1, l2;

  dx = b.x - a.x;
  dy = b.y - a.y;

  l1 = new jsts.algorithm.HCoordinate(a.x + dx / 2.0, a.y + dy / 2.0, 1.0);
  l2 = new jsts.algorithm.HCoordinate(a.x - dy + dx / 2.0, a.y + dx + dy / 2.0,
      1.0);
  return new jsts.algorithm.HCoordinate(l1, l2);
};


/**
 * Computes the circumcentre of a triangle. The circumcentre is the centre of
 * the circumcircle, the smallest circle which encloses the triangle. It is also
 * the common intersection point of the perpendicular bisectors of the sides of
 * the triangle, and is the only point which has equal distance to all three
 * vertices of the triangle.
 * <p>
 * This method uses an algorithm due to J.R.Shewchuk which uses normalization to
 * the origin to improve the accuracy of computation. (See <i>Lecture Notes on
 * Geometric Robustness</i>, Jonathan Richard Shewchuk, 1999).
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertx of the triangle.
 * @return {jsts.geom.Coordinate} the circumcentre of the triangle.
 */
jsts.geom.Triangle.circumcentre = function(a, b, c) {
  var cx, cy, ax, ay, bx, by, denom, numx, numy, ccx, ccy;

  cx = c.x;
  cy = c.y;
  ax = a.x - cx;
  ay = a.y - cy;
  bx = b.x - cx;
  by = b.y - cy;

  denom = 2 * jsts.geom.Triangle.det(ax, ay, bx, by);
  numx = jsts.geom.Triangle.det(ay, ax * ax + ay * ay, by, bx * bx + by * by);
  numy = jsts.geom.Triangle.det(ax, ax * ax + ay * ay, bx, bx * bx + by * by);

  ccx = cx - numx / denom;
  ccy = cy + numy / denom;

  return new jsts.geom.Coordinate(ccx, ccy);
};


/**
 * Computes the determinant of a 2x2 matrix. Uses standard double-precision
 * arithmetic, so is susceptible to round-off error.
 *
 * @param {Number}
 *          m00 the [0,0] entry of the matrix.
 * @param {Number}
 *          m01 the [0,1] entry of the matrix.
 * @param {Number}
 *          m10 the [1,0] entry of the matrix.
 * @param {Number}
 *          m11 the [1,1] entry of the matrix.
 * @return {Number} the determinant.
 */
jsts.geom.Triangle.det = function(m00, m01, m10, m11) {
  return m00 * m11 - m01 * m10;
};


/**
 * Computes the incentre of a triangle. The <i>inCentre</i> of a triangle is
 * the point which is equidistant from the sides of the triangle. It is also the
 * point at which the bisectors of the triangle's angles meet. It is the centre
 * of the triangle's <i>incircle</i>, which is the unique circle that is
 * tangent to each of the triangle's three sides.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertx of the triangle.
 * @return {jsts.geom.Coordinate} the point which is the incentre of the
 *         triangle.
 */
jsts.geom.Triangle.inCentre = function(a, b, c) {
  var len0, len1, len2, circum, inCentreX, inCentreY;

  // the lengths of the sides, labelled by their opposite vertex
  len0 = b.distance(c);
  len1 = a.distance(c);
  len2 = a.distance(b);
  circum = len0 + len1 + len2;

  inCentreX = (len0 * a.x + len1 * b.x + len2 * c.x) / circum;
  inCentreY = (len0 * a.y + len1 * b.y + len2 * c.y) / circum;

  return new jsts.geom.Coordinate(inCentreX, inCentreY);
};


/**
 * Computes the centroid (centre of mass) of a triangle. This is also the point
 * at which the triangle's three medians intersect (a triangle median is the
 * segment from a vertex of the triangle to the midpoint of the opposite side).
 * The centroid divides each median in a ratio of 2:1. The centroid always lies
 * within the triangle.
 *
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertx of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertx of the triangle.
 * @return {jsts.geom.Coordinate} the centroid of the triangle.
 */
jsts.geom.Triangle.centroid = function(a, b, c) {
  var x, y;

  x = (a.x + b.x + c.x) / 3;
  y = (a.y + b.y + c.y) / 3;

  return new jsts.geom.Coordinate(x, y);
};


/**
 * Computes the length of the longest side of a triangle
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {Number} the length of the longest side of the triangle.
 */
jsts.geom.Triangle.longestSideLength = function(a, b, c) {
  var lenAB, lenBC, lenCA, maxLen;

  lenAB = a.distance(b);
  lenBC = b.distance(c);
  lenCA = c.distance(a);
  maxLen = lenAB;

  if (lenBC > maxLen) {
    maxLen = lenBC;
  }
  if (lenCA > maxLen) {
    maxLen = lenCA;
  }
  return maxLen;
};


/**
 * Computes the point at which the bisector of the angle ABC cuts the segment
 * AC.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {jsts.geom.Coordinate} the angle bisector cut point.
 */
jsts.geom.Triangle.angleBisector = function(a, b, c) {
  /**
   * Uses the fact that the lengths of the parts of the split segment are
   * proportional to the lengths of the adjacent triangle sides
   */
  var len0, len2, frac, dx, dy, splitPt;

  len0 = b.distance(a);
  len2 = b.distance(c);
  frac = len0 / (len0 + len2);
  dx = c.x - a.x;
  dy = c.y - a.y;

  splitPt = new jsts.geom.Coordinate(a.x + frac * dx, a.y + frac * dy);
  return splitPt;
};


/**
 * Computes the 2D area of a triangle. The area value is always non-negative.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {Number} the area of the triangle.
 */
jsts.geom.Triangle.area = function(a, b, c) {
  return Math
      .abs(((c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y)) / 2.0);
};


/**
 * Computes the signed 2D area of a triangle. The area value is positive if the
 * triangle is oriented CW, and negative if it is oriented CCW.
 * <p>
 * The signed area value can be used to determine point orientation, but the
 * implementation in this method is susceptible to round-off errors. Use
 * {@link CGAlgorithms#orientationIndex(Coordinate, Coordinate, Coordinate)} for
 * robust orientation calculation.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {Number} the signed 2D area of the triangle.
 *
 */
jsts.geom.Triangle.signedArea = function(a, b, c) {
  /**
   * Uses the formula 1/2 * | u x v | where u,v are the side vectors of the
   * triangle x is the vector cross-product For 2D vectors, this formula
   * simplifies to the expression below
   */
  return ((c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y)) / 2.0;
};

/**
 * Computes the incentre of a triangle. The <i>incentre</i> of a triangle is
 * the point which is equidistant from the sides of the triangle. It is also the
 * point at which the bisectors of the triangle's angles meet. It is the centre
 * of the triangle's <i>incircle</i>, which is the unique circle that is
 * tangent to each of the triangle's three sides.
 *
 * @return {jsts.geom.Coordinate} the point which is the inCentre of the
 *         triangle.
 */
jsts.geom.Triangle.prototype.inCentre = function() {
  return jsts.geom.Triangle.inCentre(this.p0, this.p1, this.p2);
};
