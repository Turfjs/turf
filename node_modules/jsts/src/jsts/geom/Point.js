/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/geom/Geometry.js
 */



/**
 * @constructor
 * @extends jsts.geom.Geometry
 */
jsts.geom.Point = function(coordinate, factory) {
  this.factory = factory;

  if (coordinate === undefined)
    return;

  this.coordinate = coordinate;
};

jsts.geom.Point.prototype = new jsts.geom.Geometry();
jsts.geom.Point.constructor = jsts.geom.Point;


jsts.geom.Point.CLASS_NAME = 'jsts.geom.Point';


jsts.geom.Point.prototype.coordinate = null;


/**
 * @return {number} x-axis value of this Point.
 */
jsts.geom.Point.prototype.getX = function() {
  return this.coordinate.x;
};


/**
 * @return {number} y-axis value of this Point.
 */
jsts.geom.Point.prototype.getY = function() {
  return this.coordinate.y;
};

jsts.geom.Point.prototype.getCoordinate = function() {
  return this.coordinate;
};


/**
 * @return {Coordinate[]} this Point as coordinate array.
 */
jsts.geom.Point.prototype.getCoordinates = function() {
  return this.isEmpty() ? [] : [this.coordinate];
};

jsts.geom.Point.prototype.isEmpty = function() {
  return this.coordinate === null;
};

jsts.geom.Point.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.isEmpty() && other.isEmpty()) {
    return true;
  }
  return this.equal(other.getCoordinate(), this.getCoordinate(), tolerance);
};


/**
 * @return {number} number of coordinates (0 or 1).
 */
jsts.geom.Point.prototype.getNumPoints = function() {
  return this.isEmpty() ? 0 : 1;
};


/**
 * @return {boolean} Point is always simple.
 */
jsts.geom.Point.prototype.isSimple = function() {
  return true;
};


/**
 * Gets the boundary of this geometry. Zero-dimensional geometries have no
 * boundary by definition, so an empty GeometryCollection is returned.
 *
 * @return {GeometryCollection} an empty GeometryCollection.
 * @see Geometry#getBoundary
 */
jsts.geom.Point.prototype.getBoundary = function() {
  return new jsts.geom.GeometryCollection(null);
};


/**
 * @return {Envelope} Envelope of this point.
 */
jsts.geom.Point.prototype.computeEnvelopeInternal = function() {
  if (this.isEmpty()) {
    return new jsts.geom.Envelope();
  }
  return new jsts.geom.Envelope(this.coordinate);
};

jsts.geom.Point.prototype.apply = function(filter) {
  if (filter instanceof jsts.geom.GeometryFilter || filter instanceof jsts.geom.GeometryComponentFilter) {
    filter.filter(this);
  } else if (filter instanceof jsts.geom.CoordinateFilter) {
    if (this.isEmpty()) { return; }
    filter.filter(this.getCoordinate());
  }

};

jsts.geom.Point.prototype.clone = function() {
  return new jsts.geom.Point(this.coordinate.clone(), this.factory);
};


/**
 * @return {number} Always 0.
 */
jsts.geom.Point.prototype.getDimension = function() {
  return 0;
};


/**
 * @return {number} Always Dimension.FALSE.
 */
jsts.geom.Point.prototype.getBoundaryDimension = function() {
  return jsts.geom.Dimension.FALSE;
};


/**
 * @return {Point} Reversed point is a cloned point.
 */
jsts.geom.Point.prototype.reverse = function() {
  return this.clone();
};


/**
 * A Point is valid iff:
 * <ul>
 * <li>the coordinate which defines it is a valid coordinate (i.e does not have
 * an NaN X or Y ordinate)
 * </ul>
 *
 * @return {boolean} true iff the Point is valid.
 */
jsts.geom.Point.prototype.isValid = function() {
  if (!jsts.operation.valid.IsValidOp.isValid(this.getCoordinate())) {
    return false;
  }
  return true;
};


/**
 *
 */
jsts.geom.Point.prototype.normalize = function() {
  // a Point is always in normalized form
};

jsts.geom.Point.prototype.compareToSameClass = function(other) {
  var point = other;
  return this.getCoordinate().compareTo(point.getCoordinate());
};

/**
 * @return {string} String representation of Point type.
 */
jsts.geom.Point.prototype.getGeometryType = function() {
  return 'Point';
};

jsts.geom.Point.prototype.hashCode = function() {
  return 'Point_' + this.coordinate.hashCode();
};

jsts.geom.Point.prototype.CLASS_NAME = 'jsts.geom.Point';
