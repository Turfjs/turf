/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Algorithms for computing values and predicates associated with triangles.
 *
 * For some algorithms extended-precision implementations are provided, which
 * are more robust (i.e. they produce correct answers in more cases). Also, some
 * more robust formulations of some algorithms are provided, which utilize
 * normalization to the origin.
 *
 * @constructor
 */
jsts.triangulate.quadedge.TrianglePredicate = function() {

};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. This
 * test uses simple double-precision arithmetic, and thus may not be robust.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleNonRobust = function(a,
    b, c, p) {
  var isInCircle = (a.x * a.x + a.y * a.y) *
      jsts.triangulate.quadedge.TrianglePredicate.triArea(b, c, p) -
      (b.x * b.x + b.y * b.y) *
      jsts.triangulate.quadedge.TrianglePredicate.triArea(a, c, p) +
      (c.x * c.x + c.y * c.y) *
      jsts.triangulate.quadedge.TrianglePredicate.triArea(a, b, p) -
      (p.x * p.x + p.y * p.y) *
      jsts.triangulate.quadedge.TrianglePredicate.triArea(a, b, c) > 0;

  return isInCircle;
};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. This
 * test uses simple double-precision arithmetic, and thus is not 10% robust.
 * However, by using normalization to the origin it provides improved robustness
 * and increased performance.
 * <p>
 * Based on code by J.R.Shewchuk.
 *
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized = function(a,
    b, c, p) {
  var adx, ady, bdx, bdy, cdx, cdy, abdet, bcdet, cadet, alift, blift, clift, disc;

  adx = a.x - p.x;
  ady = a.y - p.y;
  bdx = b.x - p.x;
  bdy = b.y - p.y;
  cdx = c.x - p.x;
  cdy = c.y - p.y;

  abdet = adx * bdy - bdx * ady;
  bcdet = bdx * cdy - cdx * bdy;
  cadet = cdx * ady - adx * cdy;
  alift = adx * adx + ady * ady;
  blift = bdx * bdx + bdy * bdy;
  clift = cdx * cdx + cdy * cdy;

  disc = alift * bcdet + blift * cadet + clift * abdet;
  return disc > 0;
};


/**
 * Computes twice the area of the oriented triangle (a, b, c), i.e. the area is
 * positive if the triangle is oriented counterclockwise.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @return {Number} The calculated area.
 */
jsts.triangulate.quadedge.TrianglePredicate.triArea = function(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. This
 * method uses more robust computation.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust = function(a, b,
    c, p) {
  return jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized(a, b,
      c, p);
};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. The
 * computation uses {@link DD} arithmetic for robustness.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDSlow = function(a, b,
    c, p) {
  var px, py, ax, ay, bx, by, cx, cy, aTerm, bTerm, cTerm, pTerm, sum, isInCircle;

  px = jsts.math.DD.valueOf(p.x);
  py = jsts.math.DD.valueOf(p.y);
  ax = jsts.math.DD.valueOf(a.x);
  ay = jsts.math.DD.valueOf(a.y);
  bx = jsts.math.DD.valueOf(b.x);
  by = jsts.math.DD.valueOf(b.y);
  cx = jsts.math.DD.valueOf(c.x);
  cy = jsts.math.DD.valueOf(c.y);

  aTerm = (ax.multiply(ax).add(ay.multiply(ay)))
      .multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(bx,
          by, cx, cy, px, py));
  bTerm = (bx.multiply(bx).add(by.multiply(by)))
      .multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,
          ay, cx, cy, px, py));
  cTerm = (cx.multiply(cx).add(cy.multiply(cy)))
      .multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,
          ay, bx, by, px, py));
  pTerm = (px.multiply(px).add(py.multiply(py)))
      .multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,
          ay, bx, by, cx, cy));

  sum = aTerm.subtract(bTerm).add(cTerm).subtract(pTerm);
  isInCircle = sum.doubleValue() > 0;

  return isInCircle;
};


/**
 * Computes twice the area of the oriented triangle (a, b, c), i.e., the area is
 * positive if the triangle is oriented counterclockwise. The computation uses
 * {@link DD} arithmetic for robustness.
 *
 * @param {jsts.math.DD}
 *          ax the x ordinate of a vertex of the triangle.
 * @param {jsts.math.DD}
 *          ay the y ordinate of a vertex of the triangle.
 * @param {jsts.math.DD}
 *          bx the x ordinate of a vertex of the triangle.
 * @param {jsts.math.DD}
 *          by the y ordinate of a vertex of the triangle.
 * @param {jsts.math.DD}
 *          cx the x ordinate of a vertex of the triangle.
 * @param {jsts.math.DD}
 *          cy the y ordinate of a vertex of the triangle.
 * @return {jsts.math.DD} The calculated area.
 */
jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow = function(ax, ay,
    bx, by, cx, cy) {
  return (bx.subtract(ax).multiply(cy.subtract(ay)).subtract(by.subtract(ay)
      .multiply(cx.subtract(ax))));
};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. The
 * computation uses {@link DD} arithmetic for robustness.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDFast = function(a, b,
    c, p) {
  var aTerm, bTerm, cTerm, pTerm, sum, isInCircle;

  aTerm = (jsts.math.DD.sqr(a.x).selfAdd(jsts.math.DD.sqr(a.y)))
      .selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(
          b, c, p));
  bTerm = (jsts.math.DD.sqr(b.x).selfAdd(jsts.math.DD.sqr(b.y)))
      .selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(
          a, c, p));
  cTerm = (jsts.math.DD.sqr(c.x).selfAdd(jsts.math.DD.sqr(c.y)))
      .selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(
          a, b, p));
  pTerm = (jsts.math.DD.sqr(p.x).selfAdd(jsts.math.DD.sqr(p.y)))
      .selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(
          a, b, c));

  sum = aTerm.selfSubtract(bTerm).selfAdd(cTerm).selfSubtract(pTerm);
  isInCircle = sum.doubleValue() > 0;

  return isInCircle;
};


/**
 * Computes twice the area of the oriented triangle (a, b, c), i.e., the area is
 * positive if the triangle is oriented counterclockwise. The computation uses
 * {@link DD} arithmetic for robustness.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex in the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex in the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex in the triangle.
 * @return {jsts.math.DD} The calculated area.
 */
jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast = function(a, b, c) {
  var t1, t2;

  t1 = jsts.math.DD.valueOf(b.x).selfSubtract(a.x).selfMultiply(
      jsts.math.DD.valueOf(c.y).selfSubtract(a.y));

  t2 = jsts.math.DD.valueOf(b.y).selSubtract(a.y).selfMultiply(
      jsts.math.DD.valueOf(c.x).selfSubtract(a.x));

  return t1.selfSubtract(t2);
};


/**
 * Tests if a point is inside the circle defined by the points a, b, c. This
 * test uses double-double precision arithmetic.
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDNormalized = function(
    a, b, c, p) {
  var adx, ady, bdx, bdy, cdx, cdy, abdet, bcdet, cadet, alift, blift, clift, sum, isInCircle;

  adx = jsts.math.DD.valueOf(a.x).selfSubtract(p.x);
  ady = jsts.math.DD.valueOf(a.y).selfSubtract(p.y);
  bdx = jsts.math.DD.valueOf(b.x).selfSubtract(p.x);
  bdx = jsts.math.DD.valueOf(b.y).selfSubtract(p.y);
  cdx = jsts.math.DD.valueOf(c.x).selfSubtract(p.x);
  cdx = jsts.math.DD.valueOf(c.y).selfSubtract(p.y);

  abdet = adx.multiply(bdy).selfSubtract(bdx.multiply(ady));
  bcdet = bdx.multiply(cdy).selfSubtract(cdx.multiply(bdy));
  cadet = cdx.multiply(ady).selfSubtract(adx.multiply(cdy));
  alift = adx.multiply(adx).selfAdd(ady.multiply(ady));
  blift = bdx.multiply(bdx).selfAdd(bdy.multiply(bdy));
  clift = cdx.multiply(cdx).selfAdd(cdy.multiply(cdy));

  sum = alift.selfMultiply(bcdet).selfAdd(blift.selfMultiply(cadet)).selfAdd(
      clift.selfMultiply(abdet));

  isInCircle = sum.doubleValue() > 0;

  return isInCircle;
};


/**
 * Computes the inCircle test using distance from the circumcentre. Uses
 * standard double-precision arithmetic.
 * <p>
 * In general this doesn't appear to be any more robust than the standard
 * calculation. However, there is at least one case where the test point is far
 * enough from the circumcircle that this test gives the correct answer.
 *
 * <pre>
 * LINESTRING
 * (1507029.9878 518325.7547, 1507022.1120341457 518332.8225183258,
 * 1507029.9833 518325.7458, 1507029.9896965567 518325.744909031)
 * </pre>
 *
 * @param {jsts.geom.Coordinate}
 *          a a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          b a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          c a vertex of the triangle.
 * @param {jsts.geom.Coordinate}
 *          p the point to test.
 * @return {Boolean} true if this point is inside the circle defined by the
 *         points a, b, c.
 */
jsts.triangulate.quadedge.TrianglePredicate.isInCircleCC = function(a, b, c, p) {
  var cc, ccRadius, pRadiusDiff;

  cc = jsts.geom.Triangle.circumcentre(a, b, c);
  ccRadius = a.distance(cc);
  pRadiusDiff = p.distance(cc) - ccRadius;

  return pRadiusDiff <= 0;
};
