/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Contains information about the nature and location of a {@link Geometry}
 * validation error
 *
 * @version 1.7
 */

/**
 *
 * Creates a validation error with the given type and location
 *
 * @param errorType
 *          the type of the error.
 *
 * @param pt
 *          the location of the error.
 *
 */
jsts.operation.valid.TopologyValidationError = function(errorType, pt) {
  this.errorType = errorType;
  this.pt = null;

  if (pt != null) {
    this.pt = pt.clone();
  }
};

/**
 *
 * Indicates that a hole of a polygon lies partially or completely in the
 * exterior of the shell
 *
 */
jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL = 2;

/**
 *
 * Indicates that a hole lies in the interior of another hole in the same
 * polygon
 *
 */
jsts.operation.valid.TopologyValidationError.NESTED_HOLES = 3;

/**
 *
 * Indicates that the interior of a polygon is disjoint
 *
 * (often caused by set of contiguous holes splitting the polygon into two
 * parts)
 *
 */
jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR = 4;

/**
 *
 * Indicates that two rings of a polygonal geometry intersect
 *
 */
jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION = 5;

/**
 *
 * Indicates that a ring self-intersects
 *
 */
jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION = 6;

/**
 *
 * Indicates that a polygon component of a MultiPolygon lies inside another
 * polygonal component
 *
 */
jsts.operation.valid.TopologyValidationError.NESTED_SHELLS = 7;

/**
 *
 * Indicates that a polygonal geometry contains two rings which are identical
 *
 */
jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS = 8;

/**
 *
 * Indicates that either
 * <ul>
 * <li>a LineString contains a single point
 * <li>a LinearRing contains 2 or 3 points
 * </ul>
 *
 */
jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS = 9;

/**
 *
 * Indicates that the <code>X</code> or <code>Y</code> ordinate of
 * a Coordinate is not a valid numeric value (e.g. {@link Double#NaN} )
 *
 */
jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE = 10;

/**
 *
 * Indicates that a ring is not correctly closed
 * (the first and the last coordinate are different)
 *
 */
jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED = 11;

/**
 *
 * Messages corresponding to error codes
 *
 */
jsts.operation.valid.TopologyValidationError.prototype.errMsg = [
'Topology Validation Error',
'Repeated Point',
'Hole lies outside shell',
'Holes are nested',
'Interior is disconnected',
'Self-intersection',
'Ring Self-intersection',
'Nested shells',
'Duplicate Rings',
'Too few distinct points in geometry component',
'Invalid Coordinate',
'Ring is not closed'
];

/**
 * Creates a validation error of the given type with a null location
 *
 * @param errorType
 *          the type of the error
 *
 * jsts.operation.valid.TopologyValidationError(int errorType) // cannot
 * overload constructors, use above with null as arg 2
 *  {
 * this(errorType, null);
 *  }
 */

/**
 *
 * Returns the location of this error (on the {@link Geometry} containing the
 * error).
 *
 *
 *
 * @return a {@link Coordinate} on the input geometry.
 *
 */
jsts.operation.valid.TopologyValidationError.prototype.getCoordinate = function() {
  return this.pt;
};

/**
 *
 * Gets the type of this error.
 * @return the error type.
 *
 */
jsts.operation.valid.TopologyValidationError.prototype.getErrorType = function() {
  return this.errorType;
};

/**
 *
 * Gets an error message describing this error.
 * The error message does not describe the location of the error.
 * @return the error message.
 *
 */
jsts.operation.valid.TopologyValidationError.prototype.getMessage = function() {
  return this.errMsg[this.errorType];
};

/**
 *
 * Gets a message describing the type and location of this error.
 * @return the error message.
 *
 */
jsts.operation.valid.TopologyValidationError.prototype.toString = function() {
  var locStr = '';
  if (this.pt != null) {
    locStr = ' at or near point ' + this.pt;
    return this.getMessage() + locStr;
  }
  return locStr;
};
