/**
 * Computes the centroid of a linear geometry.
 * <h2>Algorithm</h2>
 * Compute the average of the midpoints of all line segments weighted by the
 * segment length.
 *
 * @version 1.7
 */
jsts.algorithm.CentroidLine = function() {
  this.centSum = new jsts.geom.Coordinate();
};


/**
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidLine.prototype.centSum = null;


/**
 * @type {double}
 * @private
 */
jsts.algorithm.CentroidLine.prototype.totalLength = 0.0;


/**
 * Adds the linear components of by a Geometry to the centroid total. If the
 * geometry has no linear components it does not contribute to the centroid,
 *
 * @param geom
 *          the geometry to add.
 */
jsts.algorithm.CentroidLine.prototype.add = function(geom) {
  if (geom instanceof Array) {
    this.add2.apply(this, arguments);
    return;
  }

  if (geom instanceof jsts.geom.LineString) {
    this.add(geom.getCoordinates());
  } else if (geom instanceof jsts.geom.Polygon) {
    var poly = geom;
    // add linear components of a polygon
    this.add(poly.getExteriorRing().getCoordinates());
    for (var i = 0; i < poly.getNumInteriorRing(); i++) {
      this.add(poly.getInteriorRingN(i).getCoordinates());
    }
  } else if (geom instanceof jsts.geom.GeometryCollection ||
      geom instanceof jsts.geom.MultiPoint ||
      geom instanceof jsts.geom.MultiLineString ||
      geom instanceof jsts.geom.MultiPolygon) {
    var gc = geom;
    for (var i = 0; i < gc.getNumGeometries(); i++) {
      this.add(gc.getGeometryN(i));
    }
  }
};

jsts.algorithm.CentroidLine.prototype.getCentroid = function() {
  var cent = new jsts.geom.Coordinate();
  cent.x = this.centSum.x / this.totalLength;
  cent.y = this.centSum.y / this.totalLength;
  return cent;
};


/**
 * Adds the length defined by an array of coordinates.
 *
 * @param pts
 *          an array of {@link Coordinate} s.
 */
jsts.algorithm.CentroidLine.prototype.add2 = function(pts) {
  for (var i = 0; i < pts.length - 1; i++) {
    var segmentLen = pts[i].distance(pts[i + 1]);
    this.totalLength += segmentLen;

    var midx = (pts[i].x + pts[i + 1].x) / 2;
    this.centSum.x += segmentLen * midx;
    var midy = (pts[i].y + pts[i + 1].y) / 2;
    this.centSum.y += segmentLen * midy;
  }
};
