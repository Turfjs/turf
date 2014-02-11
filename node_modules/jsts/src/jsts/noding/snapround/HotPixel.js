/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/noding/snapround/HotPixel.java
 * Revision: 143
 */

/**
 * Implements a "hot pixel" as used in the Snap Rounding algorithm.
 * A hot pixel contains the interior of the tolerance square and
 * the boundary
 * <b>minus</b> the top and right segments.
 * <p>
 * The hot pixel operations are all computed in the integer domain
 * to avoid rounding problems.
 */

/**
 * Creates a new hot pixel.
 *
 * @param pt
 *          the coordinate at the centre of the pixel.
 * @param scaleFactor
 *          the scaleFactor determining the pixel size.
 * @param li
 *          the intersector to use for testing intersection with line segments.
 */
jsts.noding.snapround.HotPixel = function(pt, scaleFactor, li) {
  this.corner = [];

  this.originalPt = pt;
  this.pt = pt;
  this.scaleFactor = scaleFactor;
  this.li = li;
  if (this.scaleFactor !== 1.0) {
    this.pt = new jsts.geom.Coordinate(this.scale(pt.x), this.scale(pt.y));
    this.p0Scaled = new jsts.geom.Coordinate();
    this.p1Scaled = new jsts.geom.Coordinate();
  }
  this.initCorners(this.pt);
};

jsts.noding.snapround.HotPixel.prototype.li = null;

jsts.noding.snapround.HotPixel.prototype.pt = null;
jsts.noding.snapround.HotPixel.prototype.originalPt = null;
jsts.noding.snapround.HotPixel.prototype.ptScaled = null;

jsts.noding.snapround.HotPixel.prototype.p0Scaled = null;
jsts.noding.snapround.HotPixel.prototype.p1Scaled = null;

jsts.noding.snapround.HotPixel.prototype.scaleFactor = undefined;

jsts.noding.snapround.HotPixel.prototype.minx = undefined;
jsts.noding.snapround.HotPixel.prototype.maxx = undefined;
jsts.noding.snapround.HotPixel.prototype.miny = undefined;
jsts.noding.snapround.HotPixel.prototype.maxy = undefined;

/**
 * The corners of the hot pixel, in the order: 10 23
 */
jsts.noding.snapround.HotPixel.prototype.corner = null;

jsts.noding.snapround.HotPixel.prototype.safeEnv = null;


/**
 * Gets the coordinate this hot pixel is based at.
 *
 * @return the coordinate of the pixel.
 */
jsts.noding.snapround.HotPixel.prototype.getCoordinate = function() {
  return this.originalPt;
};

jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR = 0.75;

/**
 * Returns a "safe" envelope that is guaranteed to contain the hot pixel. The
 * envelope returned will be larger than the exact envelope of the pixel.
 *
 * @return an envelope which contains the hot pixel.
 */
jsts.noding.snapround.HotPixel.prototype.getSafeEnvelope = function() {
  if (this.safeEnv === null) {
    var safeTolerance = jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR /
        this.scaleFactor;
    this.safeEnv = new jsts.geom.Envelope(this.originalPt.x - safeTolerance,
        this.originalPt.x + safeTolerance, this.originalPt.y - safeTolerance,
        this.originalPt.y + safeTolerance);
  }
  return this.safeEnv;
};

jsts.noding.snapround.HotPixel.prototype.initCorners = function(pt) {
  var tolerance = 0.5;
  this.minx = pt.x - tolerance;
  this.maxx = pt.x + tolerance;
  this.miny = pt.y - tolerance;
  this.maxy = pt.y + tolerance;

  this.corner[0] = new jsts.geom.Coordinate(this.maxx, this.maxy);
  this.corner[1] = new jsts.geom.Coordinate(this.minx, this.maxy);
  this.corner[2] = new jsts.geom.Coordinate(this.minx, this.miny);
  this.corner[3] = new jsts.geom.Coordinate(this.maxx, this.miny);
};

/**
 * @private
 */
jsts.noding.snapround.HotPixel.prototype.scale = function(val) {
  return Math.round(val * this.scaleFactor);
};

/**
 * Tests whether the line segment (p0-p1) intersects this hot pixel.
 *
 * @param p0
 *          the first coordinate of the line segment to test.
 * @param p1
 *          the second coordinate of the line segment to test.
 * @return true if the line segment intersects this hot pixel.
 */
jsts.noding.snapround.HotPixel.prototype.intersects = function(p0, p1) {
  if (this.scaleFactor === 1.0)
    return this.intersectsScaled(p0, p1);

  this.copyScaled(p0, this.p0Scaled);
  this.copyScaled(p1, this.p1Scaled);
  return this.intersectsScaled(this.p0Scaled, this.p1Scaled);
};

/**
 * @private
 */
jsts.noding.snapround.HotPixel.prototype.copyScaled = function(p, pScaled) {
  pScaled.x = this.scale(p.x);
  pScaled.y = this.scale(p.y);
};

/**
 * @private
 */
jsts.noding.snapround.HotPixel.prototype.intersectsScaled = function(p0, p1) {
  var segMinx = Math.min(p0.x, p1.x);
  var segMaxx = Math.max(p0.x, p1.x);
  var segMiny = Math.min(p0.y, p1.y);
  var segMaxy = Math.max(p0.y, p1.y);

  var isOutsidePixelEnv = this.maxx < segMinx || this.minx > segMaxx ||
      this.maxy < segMiny || this.miny > segMaxy;
  if (isOutsidePixelEnv)
    return false;
  var intersects = this.intersectsToleranceSquare(p0, p1);

  jsts.util.Assert.isTrue(!(isOutsidePixelEnv && intersects),
      'Found bad envelope test');

  return intersects;
};

/**
 * Tests whether the segment p0-p1 intersects the hot pixel tolerance square.
 * Because the tolerance square point set is partially open (along the top and
 * right) the test needs to be more sophisticated than simply checking for any
 * intersection. However, it can take advantage of the fact that because the hot
 * pixel edges do not lie on the coordinate grid. It is sufficient to check if
 * there is at least one of:
 * <ul>
 * <li>a proper intersection with the segment and any hot pixel edge
 * <li>an intersection between the segment and both the left and bottom edges
 * <li>an intersection between a segment endpoint and the hot pixel coordinate
 * </ul>
 *
 * @param p0
 * @param p1
 * @return
 * @private
 */
jsts.noding.snapround.HotPixel.prototype.intersectsToleranceSquare = function(
    p0, p1) {
  var intersectsLeft = false;
  var intersectsBottom = false;

  this.li.computeIntersection(p0, p1, this.corner[0], this.corner[1]);
  if (this.li.isProper())
    return true;

  this.li.computeIntersection(p0, p1, this.corner[1], this.corner[2]);
  if (this.li.isProper())
    return true;
  if (this.li.hasIntersection())
    intersectsLeft = true;

  this.li.computeIntersection(p0, p1, this.corner[2], this.corner[3]);
  if (this.li.isProper())
    return true;
  if (this.li.hasIntersection())
    intersectsBottom = true;

  this.li.computeIntersection(p0, p1, this.corner[3], this.corner[0]);
  if (this.li.isProper())
    return true;

  if (intersectsLeft && intersectsBottom)
    return true;

  if (p0.equals(this.pt))
    return true;
  if (p1.equals(this.pt))
    return true;

  return false;
};
/**
 * Test whether the given segment intersects the closure of this hot pixel. This
 * is NOT the test used in the standard snap-rounding algorithm, which uses the
 * partially closed tolerance square instead. This routine is provided for
 * testing purposes only.
 *
 * @param p0
 *          the start point of a line segment.
 * @param p1
 *          the end point of a line segment.
 * @return <code>true</code> if the segment intersects the closure of the
 *         pixel's tolerance square.
 * @private
 */
jsts.noding.snapround.HotPixel.prototype.intersectsPixelClosure = function(p0,
    p1) {
  this.li.computeIntersection(p0, p1, this.corner[0], this.corner[1]);
  if (this.li.hasIntersection())
    return true;
  this.li.computeIntersection(p0, p1, this.corner[1], this.corner[2]);
  if (this.li.hasIntersection())
    return true;
  this.li.computeIntersection(p0, p1, this.corner[2], this.corner[3]);
  if (this.li.hasIntersection())
    return true;
  this.li.computeIntersection(p0, p1, this.corner[3], this.corner[0]);
  if (this.li.hasIntersection())
    return true;

  return false;
};

/**
 * Adds a new node (equal to the snap pt) to the specified segment if the
 * segment passes through the hot pixel
 *
 * @param segStr
 * @param segIndex
 * @return true if a node was added to the segment.
 */
jsts.noding.snapround.HotPixel.prototype.addSnappedNode = function(segStr,
    segIndex) {
  var p0 = segStr.getCoordinate(segIndex);
  var p1 = segStr.getCoordinate(segIndex + 1);

  if (this.intersects(p0, p1)) {
    segStr.addIntersection(this.getCoordinate(), segIndex);

    return true;
  }
  return false;
};
