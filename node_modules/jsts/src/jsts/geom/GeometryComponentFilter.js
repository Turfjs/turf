/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>Geometry</code> classes support the concept of applying a
 * <code>GeometryComponentFilter</code> filter to the <code>Geometry</code>.
 * The filter is applied to every component of the <code>Geometry</code> which
 * is itself a <code>Geometry</code> and which does not itself contain any
 * components. (For instance, all the {@link LinearRing}s in {@link Polygon}s
 * are visited, but in a {@link MultiPolygon} the {@link Polygon}s themselves
 * are not visited.) Thus the only classes of Geometry which must be handled as
 * arguments to {@link #filter} are {@link LineString}s, {@link LinearRing}s
 * and {@link Point}s.
 * <p>
 * A <code>GeometryComponentFilter</code> filter can either record information
 * about the <code>Geometry</code> or change the <code>Geometry</code> in
 * some way. <code>GeometryComponentFilter</code> is an example of the
 * Gang-of-Four Visitor pattern.
 */
jsts.geom.GeometryComponentFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryComponentFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};
