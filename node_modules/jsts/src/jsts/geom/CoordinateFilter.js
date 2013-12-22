/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>Geometry</code> classes support the concept of applying a coordinate
 * filter to every coordinate in the <code>Geometry</code>. A coordinate
 * filter can either record information about each coordinate or change the
 * coordinate in some way. Coordinate filters implement the interface
 * <code>CoordinateFilter</code>. (<code>CoordinateFilter</code> is an
 * example of the Gang-of-Four Visitor pattern). Coordinate filters can be used
 * to implement such things as coordinate transformations, centroid and envelope
 * computation, and many other functions.
 *
 * @interface
 */
jsts.geom.CoordinateFilter = function() {};
/**
 * Performs an operation with or on <code>coord</code>.
 *
 * @param coord
 *          a <code>Coordinate</code> to which the filter is applied.
 */
jsts.geom.CoordinateFilter.prototype.filter = function(coord) {
  throw new jsts.error.AbstractMethodInvocationError();
};
