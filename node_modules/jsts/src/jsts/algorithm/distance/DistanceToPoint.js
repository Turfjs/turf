/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/algorithm/distance/DistanceToPoint.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/Polygon.js
 */

/**
 * Computes the Euclidean distance (L2 metric) from a Point to a Geometry. Also
 * computes two points which are separated by the distance.
 */
jsts.algorithm.distance.DistanceToPoint = function() {

};

jsts.algorithm.distance.DistanceToPoint.computeDistance = function(geom, pt,
    ptDist) {
  if (geom instanceof jsts.geom.LineString) {
    jsts.algorithm.distance.DistanceToPoint.computeDistance2(geom, pt, ptDist);
  } else if (geom instanceof jsts.geom.Polygon) {
    jsts.algorithm.distance.DistanceToPoint.computeDistance4(geom, pt, ptDist);
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    var gc = geom;
    for (var i = 0; i < gc.getNumGeometries(); i++) {
      var g = gc.getGeometryN(i);
      jsts.algorithm.distance.DistanceToPoint.computeDistance(g, pt, ptDist);
    }
  } else { // assume geom is Point
    ptDist.setMinimum(geom.getCoordinate(), pt);
  }
};

jsts.algorithm.distance.DistanceToPoint.computeDistance2 = function(line, pt,
    ptDist) {
  var tempSegment = new jsts.geom.LineSegment();

  var coords = line.getCoordinates();
  for (var i = 0; i < coords.length - 1; i++) {
    tempSegment.setCoordinates(coords[i], coords[i + 1]);
    // this is somewhat inefficient - could do better
    var closestPt = tempSegment.closestPoint(pt);
    ptDist.setMinimum(closestPt, pt);
  }
};

jsts.algorithm.distance.DistanceToPoint.computeDistance3 = function(segment,
    pt, ptDist) {
  var closestPt = segment.closestPoint(pt);
  ptDist.setMinimum(closestPt, pt);
};

jsts.algorithm.distance.DistanceToPoint.computeDistance4 = function(poly, pt,
    ptDist) {
  jsts.algorithm.distance.DistanceToPoint.computeDistance2(poly
      .getExteriorRing(), pt, ptDist);
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    jsts.algorithm.distance.DistanceToPoint.computeDistance2(poly
        .getInteriorRingN(i), pt, ptDist);
  }
};
