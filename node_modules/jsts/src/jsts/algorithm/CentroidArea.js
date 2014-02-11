/**
 * Computes the centroid of an area geometry.
 * <h2>Algorithm</h2>
 * Based on the usual algorithm for calculating the centroid as a weighted sum
 * of the centroids of a decomposition of the area into (possibly overlapping)
 * triangles. The algorithm has been extended to handle holes and
 * multi-polygons. See
 * <code>http://www.faqs.org/faqs/graphics/algorithms-faq/</code> for further
 * details of the basic approach. The code has also be extended to handle
 * degenerate (zero-area) polygons. In this case, the centroid of the line
 * segments in the polygon will be returned.
 *
 * @version 1.7
 */
jsts.algorithm.CentroidArea = function() {
  this.basePt = null;
  this.triangleCent3 = new jsts.geom.Coordinate();
  this.centSum = new jsts.geom.Coordinate();
  this.cg3 = new jsts.geom.Coordinate();
};


/**
 * the point all triangles are based at
 *
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.basePt = null;


/**
 * temporary variable to hold centroid of triangle
 *
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.triangleCent3 = null;


/**
 * Partial area sum
 *
 * @type {double}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.areasum2 = 0;


/**
 * partial centroid sum
 *
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.cg3 = null;


/**
 * // data for linear centroid computation, if needed
 *
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.centSum = null;


/**
 * @type {double}
 * @private
 */
jsts.algorithm.CentroidArea.prototype.totalLength = 0.0;


/**
 * Adds the area defined by a Geometry to the centroid total. If the geometry
 * has no area it does not contribute to the centroid.
 *
 * @param geom
 *          the geometry to add.
 */
jsts.algorithm.CentroidArea.prototype.add = function(geom) {
  if (geom instanceof jsts.geom.Polygon) {
    var poly = geom;
    this.setBasePoint(poly.getExteriorRing().getCoordinateN(0));
    this.add3(poly);
  } else if (geom instanceof jsts.geom.GeometryCollection || geom instanceof jsts.geom.MultiPolygon) {
    var gc = geom;
    for (var i = 0; i < gc.getNumGeometries(); i++) {
      this.add(gc.getGeometryN(i));
    }
  } else if (geom instanceof Array) {
    this.add2(geom);
  }
};


/**
 * Adds the area defined by an array of coordinates. The array must be a ring;
 * i.e. end with the same coordinate as it starts with.
 *
 * @param ring
 *          an array of {@link Coordinate} s.
 */
jsts.algorithm.CentroidArea.prototype.add2 = function(ring) {
  this.setBasePoint(ring[0]);
  this.addShell(ring);
};

jsts.algorithm.CentroidArea.prototype.getCentroid = function() {
  var cent = new jsts.geom.Coordinate();
  if (Math.abs(this.areasum2) > 0.0) {
    cent.x = this.cg3.x / 3 / this.areasum2;
    cent.y = this.cg3.y / 3 / this.areasum2;
  } else {
    // if polygon was degenerate, compute linear centroid instead
    cent.x = this.centSum.x / this.totalLength;
    cent.y = this.centSum.y / this.totalLength;
  }
  return cent;
};


/**
 * @private
 */
jsts.algorithm.CentroidArea.prototype.setBasePoint = function(basePt) {
  if (this.basePt == null)
    this.basePt = basePt;
};


/**
 * @private
 */
jsts.algorithm.CentroidArea.prototype.add3 = function(poly) {
  this.addShell(poly.getExteriorRing().getCoordinates());
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    this.addHole(poly.getInteriorRingN(i).getCoordinates());
  }
};


/**
 * @private
 */
jsts.algorithm.CentroidArea.prototype.addShell = function(pts) {
  var isPositiveArea = !jsts.algorithm.CGAlgorithms.isCCW(pts);
  for (var i = 0; i < pts.length - 1; i++) {
    this.addTriangle(this.basePt, pts[i], pts[i + 1], isPositiveArea);
  }
  this.addLinearSegments(pts);
};


/**
 * @private
 */
jsts.algorithm.CentroidArea.prototype.addHole = function(pts) {
  var isPositiveArea = jsts.algorithm.CGAlgorithms.isCCW(pts);
  for (var i = 0; i < pts.length - 1; i++) {
    this.addTriangle(this.basePt, pts[i], pts[i + 1], isPositiveArea);
  }
  this.addLinearSegments(pts);
};


/**
 * @private
 */
jsts.algorithm.CentroidArea.prototype.addTriangle = function(p0, p1, p2,
    isPositiveArea) {
  var sign = (isPositiveArea) ? 1.0 : -1.0;
  jsts.algorithm.CentroidArea.centroid3(p0, p1, p2, this.triangleCent3);
  var area2 = jsts.algorithm.CentroidArea.area2(p0, p1, p2);
  this.cg3.x += sign * area2 * this.triangleCent3.x;
  this.cg3.y += sign * area2 * this.triangleCent3.y;
  this.areasum2 += sign * area2;
};


/**
 * Returns three times the centroid of the triangle p1-p2-p3. The factor of 3 is
 * left in to permit division to be avoided until later.
 *
 * @private
 */
jsts.algorithm.CentroidArea.centroid3 = function(p1, p2, p3, c) {
  c.x = p1.x + p2.x + p3.x;
  c.y = p1.y + p2.y + p3.y;
  return;
};


/**
 * Returns twice the signed area of the triangle p1-p2-p3, positive if a,b,c are
 * oriented ccw, and negative if cw.
 *
 * @private
 */
jsts.algorithm.CentroidArea.area2 = function(p1, p2, p3) {
  return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);
};


/**
 * Adds the linear segments defined by an array of coordinates to the linear
 * centroid accumulators. This is done in case the polygon(s) have zero-area, in
 * which case the linear centroid is computed instead.
 *
 * @param pts
 *          an array of {@link Coordinate} s.
 * @private
 */
jsts.algorithm.CentroidArea.prototype.addLinearSegments = function(pts) {
  for (var i = 0; i < pts.length - 1; i++) {
    var segmentLen = pts[i].distance(pts[i + 1]);
    this.totalLength += segmentLen;

    var midx = (pts[i].x + pts[i + 1].x) / 2;
    this.centSum.x += segmentLen * midx;
    var midy = (pts[i].y + pts[i + 1].y) / 2;
    this.centSum.y += segmentLen * midy;
  }
};
