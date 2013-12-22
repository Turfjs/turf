/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Utility functions for working with angles.
 * Unless otherwise noted, methods in this class express angles in radians.
 *
 * @requires jsts/algorithm/CGAlgorithms.js
 *
 * @constructor
 */
jsts.algorithm.Angle = function() {

};


/**
 * Pi*2
 */
jsts.algorithm.Angle.PI_TIMES_2 = 2.0 * Math.PI;


/**
 * Pi/2
 */
jsts.algorithm.Angle.PI_OVER_2 = Math.PI / 2.0;


/**
 * Pi/4
 */
jsts.algorithm.Angle.PI_OVER_4 = Math.PI / 4.0;


/**
 * Constant representing counterclockwise orientation
 */
jsts.algorithm.Angle.COUNTERCLOCKWISE = jsts.algorithm.CGAlgorithms.prototype.COUNTERCLOCKWISE;


/**
 * Constant representing clockwise orientation
 */
jsts.algorithm.Angle.CLOCKWISE = jsts.algorithm.CGAlgorithms.prototype.CLOCKWISE;


/**
 * Constant representing no orientation
 */
jsts.algorithm.Angle.NONE = jsts.algorithm.CGAlgorithms.prototype.COLLINEAR;


/**
 * Converts from radians to degrees.
 *
 * @param {Number}
 *        radians an angle in radians.
 * @return {Number}
 *         the angle in degrees.
 */
jsts.algorithm.Angle.toDegrees = function(radians) {
  return (radians * 180) / Math.PI;
};


/**
 * Converts from degrees to radians.
 *
 * @param {Number}
 *        angleDegrees an angle in degrees.
 * @return {Number}
 *         the angle in radians.
 */
jsts.algorithm.Angle.toRadians = function(angleDegrees) {
  return (angleDegrees * Math.PI) / 180.0;
};


/**
 * Returns the angle
 * Calls correct angle* depending on argument
 *
 * @return {Number}
 *          The angle in radians.
 */
jsts.algorithm.Angle.angle = function() {
  if (arguments.length === 1) {
    return jsts.algorithm.Angle.angleFromOrigo(arguments[0]);
  }else {
    return jsts.algorithm.Angle.angleBetweenCoords(arguments[0], arguments[1]);
  }
};


/**
 * Returns the angle of the vector from p0 to p1,
 * relative to the positive X-axis.
 * The angle is normalized to be in the range [ -Pi, Pi ].
 *
 * @param {jsts.geom.Coordinate}
 *        p0 a coordinate.
 * @param {jsts.geom.Coordinate}
 *        p1 a coordinate.
 * @return {Number}
 *         the normalized angle (in radians) that p0-p1 makes with the positive
 *         x-axis.
 */
jsts.algorithm.Angle.angleBetweenCoords = function(p0, p1) {
  var dx, dy;
  dx = p1.x - p0.x;
  dy = p1.y - p0.y;
  return Math.atan2(dy, dx);
};


/**
 * Returns the angle that the vector from (0,0) to p,
 * relative to the positive X-axis.
 * The angle is normalized to be in the range ( -Pi, Pi ].
 *
 * @param {jsts.geom.Coordinate}
 *        p a coordinate.
 * @return {Number}
 *         the normalized angle (in radians) that p makes with the positive
 *         x-axis.
 */
jsts.algorithm.Angle.angleFromOrigo = function(p) {
  return Math.atan2(p.y, p.x);
};


/**
 * Tests whether the angle between p0-p1-p2 is acute.
 * An angle is acute if it is less than 90 degrees.
 * <p>
 * Note: this implementation is not precise (determistic) for angles very close to 90 degrees.
 *
 * @param {jsts.geom.Coordinate}
 *        p0 an endpoint of the angle.
 * @param {jsts.geom.Coordinate}
 *        p1 the base of the angle.
 * @param {jsts.geom.Coordinate}
 *        p2 the other endpoint of the angle.
 * @return {Boolean}
 *         true if the angle is acute.
 */
jsts.algorithm.Angle.isAcute = function(p0, p1, p2) {
  var dx0, dy0, dx1, dy1, dotprod;

  //relies on fact that A dot B is positive if A ang B is acute
  dx0 = p0.x - p1.x;
  dy0 = p0.y - p1.y;
  dx1 = p2.x - p1.x;
  dy1 = p2.y - p1.y;
  dotprod = dx0 * dx1 + dy0 * dy1;
  return dotprod > 0;
};


/**
 * Tests whether the angle between p0-p1-p2 is obtuse.
 * An angle is obtuse if it is greater than 90 degrees.
 * <p>
 * Note: this implementation is not precise (determistic) for angles very close to 90 degrees.
 *
 * @param {jsts.geom.Coordinate}
 *        p0 an endpoint of the angle.
 * @param {jsts.geom.Coordinate}
 *        p1 the base of the angle.
 * @param {jsts.geom.Coordinate}
 *        p2 the other endpoint of the angle.
 * @return {Boolean}
 *         true if the angle is obtuse.
 */
jsts.algorithm.Angle.isObtuse = function(p0, p1, p2) {
  var dx0, dy0, dx1, dy1, dotprod;

  //relies on fact that A dot B is negative iff A ang B is obtuse
  dx0 = p0.x - p1.x;
  dy0 = p0.y - p1.y;
  dx1 = p2.x - p1.x;
  dy1 = p2.y - p1.y;
  dotprod = dx0 * dx1 + dy0 * dy1;
  return dotprod < 0;
};


/**
 * Returns the unoriented smallest angle between two vectors.
 * The computed angle will be in the range [0, Pi).
 *
 * @param {jsts.geom.Coordinate}
 *        tip1 the tip of one vector.
 * @param {jsts.geom.Coordinate}
 *        tail the tail of each vector.
 * @param {jsts.geom.Coordinate}
 *        tip2 the tip of the other vector.
 * @return {Number}
 *         the angle between tail-tip1 and tail-tip2.
 */
jsts.algorithm.Angle.angleBetween = function(tip1, tail, tip2) {
  var a1, a2;
  a1 = jsts.algorithm.Angle.angle(tail, tip1);
  a2 = jsts.algorithm.Angle.angle(tail, tip2);

  return jsts.algorithm.Angle.diff(a1, a2);
};


/**
 * Returns the oriented smallest angle between two vectors.
 * The computed angle will be in the range (-Pi, Pi].
 * A positive result corresponds to a counterclockwise rotation
 * from v1 to v2;
 * a negative result corresponds to a clockwise rotation.
 *
 * @param {jsts.geom.Coordinate}
 *        tip1 the tip of v1.
 * @param {jsts.geom.Coordinate}
 *        tail the tail of each vector.
 * @param {jsts.geom.Coordinate}
 *        tip2 the tip of v2.
 * @return {Number}
 *         the angle between v1 and v2, relative to v1.
 */
jsts.algorithm.Angle.angleBetweenOriented = function(tip1, tail, tip2) {
  var a1, a2, angDel;

  a1 = jsts.algorithm.Angle.angle(tail, tip1);
  a2 = jsts.algorithm.Angle.angle(tail, tip2);
  angDel = a2 - a1;

  // normalize, maintaining orientation
  if (angDel <= -Math.PI) {
    return angDel + jsts.algorithm.Angle.PI_TIMES_2;
  }
  if (angDel > Math.PI) {
    return angDel - jsts.algorithm.Angle.PI_TIMES_2;
  }
  return angDel;
};


/**
 * Computes the interior angle between two segments of a ring. The ring is
 * assumed to be oriented in a clockwise direction. The computed angle will be
 * in the range [0, 2Pi]
 *
 * @param {jsts.geom.Coordinate}
 *        p0 a point of the ring.
 * @param {jsts.geom.Coordinate}
 *        p1 the next point of the ring.
 * @param {jsts.geom.Coordinate}
 *        p2 the next point of the ring.
 * @return {Number}
 *         the interior angle based at <code>p1.</code>
 */
jsts.algorithm.Angle.interiorAngle = function(p0, p1, p2) {
  var anglePrev, angleNext;

  anglePrev = jsts.algorithm.Angle.angle(p1, p0);
  angleNext = jsts.algorithm.Angle.angle(p1, p2);
  return Math.abs(angleNext - anglePrev);
};


/**
 * Returns whether an angle must turn clockwise or counterclockwise
 * to overlap another angle.
 *
 * @param {Number}
 *        ang1 an angle (in radians).
 * @param {Number}
 *        ang2 an angle (in radians).
 * @return {Number}
 *         whether a1 must turn CLOCKWISE, COUNTERCLOCKWISE or NONE to
 *         overlap a2.
 */
jsts.algorithm.Angle.getTurn = function(ang1, ang2) {
  var crossproduct = Math.sin(ang2 - ang1);

  if (crossproduct > 0) {
    return jsts.algorithm.Angle.COUNTERCLOCKWISE;
  }
  if (crossproduct < 0) {
    return jsts.algorithm.Angle.CLOCKWISE;
  }
  return jsts.algorithm.Angle.NONE;
};


/**
 * Computes the normalized value of an angle, which is the
 * equivalent angle in the range ( -Pi, Pi ].
 *
 * @param {Number}
 *        angle the angle to normalize.
 * @return {Number}
 *         an equivalent angle in the range (-Pi, Pi].
 */
jsts.algorithm.Angle.normalize = function(angle) {
  while (angle > Math.PI) {
    angle -= jsts.algorithm.Angle.PI_TIMES_2;
  }
  while (angle <= -Math.PI) {
    angle += jsts.algorithm.Angle.PI_TIMES_2;
  }
  return angle;
};


/**
 * Computes the normalized positive value of an angle, which is the
 * equivalent angle in the range [ 0, 2*Pi ).
 * E.g.:
 * <ul>
 * <li>normalizePositive(0.0) = 0.0
 * <li>normalizePositive(-PI) = PI
 * <li>normalizePositive(-2PI) = 0.0
 * <li>normalizePositive(-3PI) = PI
 * <li>normalizePositive(-4PI) = 0
 * <li>normalizePositive(PI) = PI
 * <li>normalizePositive(2PI) = 0.0
 * <li>normalizePositive(3PI) = PI
 * <li>normalizePositive(4PI) = 0.0
 * </ul>
 *
 * @param {Number}
 *        angle the angle to normalize, in radians.
 * @return {Number}
 *         an equivalent positive angle.
 */
jsts.algorithm.Angle.normalizePositive = function(angle) {
  if (angle < 0.0) {
    while (angle < 0.0) {
      angle += jsts.algorithm.Angle.PI_TIMES_2;
    }
    // in case round-off error bumps the value over
    if (angle >= jsts.algorithm.Angle.PI_TIMES_2) {
      angle = 0.0;
    }
  }
  else {
    while (angle >= jsts.algorithm.Angle.PI_TIMES_2) {
      angle -= jsts.algorithm.Angle.PI_TIMES_2;
    }
    // in case round-off error bumps the value under
    if (angle < 0.0) {
      angle = 0.0;
    }
  }
  return angle;
};


/**
 * Computes the unoriented smallest difference between two angles.
 * The angles are assumed to be normalized to the range [-Pi, Pi].
 * The result will be in the range [0, Pi].
 *
 * @param {Number}
 *        ang1 the angle of one vector (in [-Pi, Pi] ).
 * @param {Number}
 *        ang2 the angle of the other vector (in range [-Pi, Pi] ).
 * @return {Number}
 *         the angle (in radians) between the two vectors (in range [0, Pi] ).
 */
jsts.algorithm.Angle.diff = function(ang1, ang2) {
  var delAngle;

  if (ang1 < ang2) {
    delAngle = ang2 - ang1;
  } else {
    delAngle = ang1 - ang2;
  }

  if (delAngle > Math.PI) {
    delAngle = (2 * Math.PI) - delAngle;
  }

  return delAngle;
};
