/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the location of points relative to a {@link Polygonal}
 * {@link Geometry}, using a simple O(n) algorithm. This algorithm is suitable
 * for use in cases where only one or a few points will be tested against a
 * given area.
 * <p>
 * The algorithm used is only guaranteed to return correct results for points
 * which are <b>not</b> on the boundary of the Geometry.
 *
 * @constructor
 * @augments {PointOnGeometryLocator}
 */
jsts.algorithm.locate.SimplePointInAreaLocator = function(geom) {
  this.geom = geom;
};


/**
 * Determines the {@link Location} of a point in an areal {@link Geometry}.
 * Currently this will never return a value of BOUNDARY.
 *
 * @param p
 *          the point to test.
 * @param geom
 *          the areal geometry to test.
 * @return the Location of the point in the geometry.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, geom))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint = function(p, geom) {
  if (geom instanceof jsts.geom.Polygon) {
    return jsts.algorithm.locate.SimplePointInAreaLocator
        .containsPointInPolygon(p, geom);
  } else if (geom instanceof jsts.geom.GeometryCollection ||
      geom instanceof jsts.geom.MultiPoint ||
      geom instanceof jsts.geom.MultiLineString ||
      geom instanceof jsts.geom.MultiPolygon) {
    for (var i = 0; i < geom.geometries.length; i++) {
      var g2 = geom.geometries[i];
      if (g2 !== geom)
        if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, g2))
          return true;
    }
  }
  return false;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon = function(
    p, poly) {
  if (poly.isEmpty())
    return false;
  var shell = poly.getExteriorRing();
  if (!jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, shell))
    return false;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    if (jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, hole))
      return false;
  }
  return true;
};


/**
 * Determines whether a point lies in a LinearRing, using the ring envelope to
 * short-circuit if possible.
 *
 * @param p
 *          the point to test.
 * @param ring
 *          a linear ring.
 * @return true if the point lies inside the ring.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing = function(p, ring) {
  // short-circuit if point is not in ring envelope
  if (!ring.getEnvelopeInternal().intersects(p))
    return false;
  return jsts.algorithm.CGAlgorithms.isPointInRing(p, ring.getCoordinates());
};

jsts.algorithm.locate.SimplePointInAreaLocator.prototype.geom = null;


jsts.algorithm.locate.SimplePointInAreaLocator.prototype.locate = function(p) {
  return jsts.algorithm.locate.SimplePointInAreaLocator.locate(p, geom);
};
