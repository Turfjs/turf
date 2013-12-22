/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>GeometryCollection</code> classes support the concept of applying a
 * <code>GeometryFilter</code> to the <code>Geometry</code>. The filter is
 * applied to every element <code>Geometry</code>. A
 * <code>GeometryFilter</code> can either record information about the
 * <code>Geometry</code> or change the <code>Geometry</code> in some way.
 * <code>GeometryFilter</code> is an example of the Gang-of-Four Visitor
 * pattern.
 */
jsts.geom.GeometryFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};
