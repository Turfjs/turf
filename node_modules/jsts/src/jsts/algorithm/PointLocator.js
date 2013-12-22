/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the topological ({@link Location}) of a single point to a
 * {@link Geometry}. A {@link BoundaryNodeRule} may be specified to control the
 * evaluation of whether the point lies on the boundary or not The default rule
 * is to use the the <i>SFS Boundary Determination Rule</i>
 * <p>
 * Notes:
 * <ul>
 * <li>{@link LinearRing}s do not enclose any area - points inside the ring
 * are still in the EXTERIOR of the ring.
 * </ul>
 * Instances of this class are not reentrant.
 *
 * @constructor
 */
jsts.algorithm.PointLocator = function(boundaryRule) {
  this.boundaryRule = boundaryRule ? boundaryRule
      : jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
};


/**
 * default is to use OGC SFS rule
 *
 * @type {BoundaryNodeRule}
 * @private
 */
jsts.algorithm.PointLocator.prototype.boundaryRule = null;


/**
 * true if the point lies in or on any Geometry element
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.PointLocator.prototype.isIn = null;


/**
 * the number of sub-elements whose boundaries the point lies in
 *
 * @type {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.numBoundaries = null;


/**
 * Convenience method to test a point for intersection with a Geometry
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {boolean} <code>true</code> if the point is in the interior or
 *         boundary of the Geometry.
 */
jsts.algorithm.PointLocator.prototype.intersects = function(p, geom) {
  return this.locate(p, geom) !== jsts.geom.Location.EXTERIOR;
};


/**
 * Computes the topological relationship ({@link Location}) of a single point
 * to a Geometry. It handles both single-element and multi-element Geometries.
 * The algorithm for multi-part Geometries takes into account the SFS Boundary
 * Determination Rule.
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {int} the {@link Location} of the point relative to the input
 *         Geometry.
 */
jsts.algorithm.PointLocator.prototype.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (geom instanceof jsts.geom.Point) {
    return this.locate2(p, geom);
  } else if (geom instanceof jsts.geom.LineString) {
    return this.locate3(p, geom);
  } else if (geom instanceof jsts.geom.Polygon) {
    return this.locate4(p, geom);
  }

  this.isIn = false;
  this.numBoundaries = 0;
  this.computeLocation(p, geom);
  if (this.boundaryRule.isInBoundary(this.numBoundaries))
    return jsts.geom.Location.BOUNDARY;
  if (this.numBoundaries > 0 || this.isIn)
    return jsts.geom.Location.INTERIOR;

  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @private
 */
jsts.algorithm.PointLocator.prototype.computeLocation = function(p, geom) {
  if (geom instanceof jsts.geom.Point || geom instanceof jsts.geom.LineString ||
      geom instanceof jsts.geom.Polygon) {
    this.updateLocationInfo(this.locate(p, geom));
  } else if (geom instanceof jsts.geom.MultiLineString) {
    var ml = geom;
    for (var i = 0; i < ml.getNumGeometries(); i++) {
      var l = ml.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, l));
    }
  } else if (geom instanceof jsts.geom.MultiPolygon) {
    var mpoly = geom;
    for (var i = 0; i < mpoly.getNumGeometries(); i++) {
      var poly = mpoly.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, poly));
    }
  } else if (geom instanceof jsts.geom.MultiPoint || geom instanceof jsts.geom.GeometryCollection) {
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var part = geom.getGeometryN(i);
      if (part !== geom) {
        this.computeLocation(p, part);
      }
    }
  }
};


/**
 * @param {int}
 *          loc
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.updateLocationInfo = function(loc) {
  if (loc === jsts.geom.Location.INTERIOR)
    this.isIn = true;
  if (loc === jsts.geom.Location.BOUNDARY)
    this.numBoundaries++;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Point}
 *          pt the Point to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate2 = function(p, pt) {
  // no point in doing envelope test, since equality test is just as fast

  var ptCoord = pt.getCoordinate();
  if (ptCoord.equals2D(p))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LineString}
 *          l the LineString to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate3 = function(p, l) {
  // bounding-box check
  if (!l.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  var pt = l.getCoordinates();
  if (!l.isClosed()) {
    if (p.equals(pt[0]) || p.equals(pt[pt.length - 1])) {
      return jsts.geom.Location.BOUNDARY;
    }
  }
  if (jsts.algorithm.CGAlgorithms.isOnLine(p, pt))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LinearRing}
 *          ring the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locateInPolygonRing = function(p, ring) {
  // bounding-box check
  if (!ring.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  return jsts.algorithm.CGAlgorithms
      .locatePointInRing(p, ring.getCoordinates());
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Polygon}
 *          poly the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate4 = function(p, poly) {
  if (poly.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  var shell = poly.getExteriorRing();

  var shellLoc = this.locateInPolygonRing(p, shell);
  if (shellLoc === jsts.geom.Location.EXTERIOR)
    return jsts.geom.Location.EXTERIOR;
  if (shellLoc === jsts.geom.Location.BOUNDARY)
    return jsts.geom.Location.BOUNDARY;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    var holeLoc = this.locateInPolygonRing(p, hole);
    if (holeLoc === jsts.geom.Location.INTERIOR)
      return jsts.geom.Location.EXTERIOR;
    if (holeLoc === jsts.geom.Location.BOUNDARY)
      return jsts.geom.Location.BOUNDARY;
  }
  return jsts.geom.Location.INTERIOR;
};
