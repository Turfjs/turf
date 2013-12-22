/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Computes the centroid of a point geometry.
 * <h2>Algorithm</h2>
 * Compute the average of all points.
 *
 * @version 1.7
 */
jsts.algorithm.CentroidPoint = function() {
  this.centSum = new jsts.geom.Coordinate();
};


/**
 * @type {int}
 * @private
 */
jsts.algorithm.CentroidPoint.prototype.ptCount = 0;


/**
 * @type {jsts.geom.Coordinate}
 * @private
 */
jsts.algorithm.CentroidPoint.prototype.centSum = null;


/**
 * Adds the point(s) defined by a Geometry to the centroid total. If the
 * geometry is not of dimension 0 it does not contribute to the centroid.
 *
 * @param {Geometry}
 *          geom the geometry to add.
 */
jsts.algorithm.CentroidPoint.prototype.add = function(geom) {
  if (geom instanceof jsts.geom.Point) {
    this.add2(geom.getCoordinate());
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


/**
 * Adds the length defined by an array of coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          pts an array of {@link Coordinate}s.
 */
jsts.algorithm.CentroidPoint.prototype.add2 = function(pt) {
  this.ptCount += 1;
  this.centSum.x += pt.x;
  this.centSum.y += pt.y;
};


/**
 * @return {jsts.geom.Coordinate}
 */
jsts.algorithm.CentroidPoint.prototype.getCentroid = function() {
  var cent = new jsts.geom.Coordinate();
  cent.x = this.centSum.x / this.ptCount;
  cent.y = this.centSum.y / this.ptCount;
  return cent;
};
