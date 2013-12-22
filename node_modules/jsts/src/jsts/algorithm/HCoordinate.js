/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a homogeneous coordinate in a 2-D coordinate space. In JTS
 * {@link HCoordinate}s are used as a clean way of computing intersections
 * between line segments.
 *
 * Will call correct init* function depending on argument.
 *
 * @constructor
 */
jsts.algorithm.HCoordinate = function() {
  this.x = 0.0;
  this.y = 0.0;
  this.w = 1.0;

  if (arguments.length === 1) {
    this.initFrom1Coordinate(arguments[0]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.geom.Coordinate) {
    this.initFrom2Coordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.algorithm.HCoordinate) {
    this.initFrom2HCoordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2) {
    this.initFromXY(arguments[0], arguments[1]);
  } else if (arguments.length === 3) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2]);
  } else if (arguments.length === 4) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2], arguments[3]);
  }
};


/**
 * Computes the (approximate) intersection point between two line segments using
 * homogeneous coordinates.
 * <p>
 * Note that this algorithm is not numerically stable; i.e. it can produce
 * intersection points which lie outside the envelope of the line segments
 * themselves. In order to increase the precision of the calculation input
 * points should be normalized before passing them to this routine.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 first coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          p2 second coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          q1 first coordinate for the second line.
 * @param {jsts.geom.Coordinate}
 *          q2 second coordinate for the second line.
 * @return {jsts.geom.Coordinate} The coordinate of the intersection.
 */
jsts.algorithm.HCoordinate.intersection = function(p1, p2, q1, q2) {
  var px, py, pw, qx, qy, qw, x, y, w, xInt, yInt;

  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  x = py * qw - qy * pw;
  y = qx * pw - px * qw;
  w = px * qy - qx * py;

  xInt = x / w;
  yInt = y / w;

  if (!isFinite(xInt) || !isFinite(yInt)) {
    throw new jsts.error.NotRepresentableError();
  }

  return new jsts.geom.Coordinate(xInt, yInt);
};


/**
 * Initializes a new HCoordinate from 1 Coordinate
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom1Coordinate = function(p) {
  this.x = p.x;
  this.y = p.y;
  this.w = 1.0;
};


/**
 * Constructs a homogeneous coordinate which is the intersection of the lines
 * define by the homogenous coordinates represented by two {@link Coordinate}s.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2Coordinates = function(p1, p2) {
  // optimization when it is known that w = 1
  this.x = p1.y - p2.y;
  this.y = p2.x - p1.x;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from 2 HCoordinates
 *
 * @param {jsts.algorithm.HCoordinate}
 *          p1 the first HCoordinate.
 * @param {jsts.algorithm.HCoordinate}
 *          p2 the second HCoordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2HCoordinates = function(p1, p2) {
  this.x = p1.y * p2.w - p2.y * p1.w;
  this.y = p2.x * p1.w - p1.x * p2.w;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from x,y,w
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 * @param {Number}
 *          w the w-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXYW = function(x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
};


/**
 * Initializes from x,y
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXY = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 1.0;
};


/**
 * Initializes from 4 Coordinates
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 * @param {jsts.geom.Coordinate}
 *          q1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          q2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom4Coordinates = function(p1, p2,
    q1, q2) {
  var px, py, pw, qx, qy, qw;
  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  this.x = py * qw - qy * pw;
  this.y = qx * pw - px * qw;
  this.w = px * qy - qx * py;
};


/**
 * Gets x/w
 *
 * @return {Number} x/w.
 */
jsts.algorithm.HCoordinate.prototype.getX = function() {
  var a = this.x / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets y/w
 *
 * @return {Number} y/w.
 */
jsts.algorithm.HCoordinate.prototype.getY = function() {
  var a = this.y / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets a coordinate represented by this HCoordinate
 *
 * @return {jst.geom.Coordinate} The coordinate.
 */
jsts.algorithm.HCoordinate.prototype.getCoordinate = function() {
  var p = new jsts.geom.Coordinate();
  p.x = this.getX();
  p.y = this.getY();
  return p;
};
