/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Methods for computing and working with octants of the Cartesian plane
 * Octants are numbered as follows:
 * <pre>
 *  \2|1/
 * 3 \|/ 0
 * ---+--
 * 4 /|\ 7
 *  /5|6\
 * <pre>
 * If line segments lie along a coordinate axis, the octant is the lower of the two
 * possible values.
 *
 * @constructor
 */
jsts.noding.Octant = function() {
  throw jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the octant of a directed line segment (specified as x and y
 * displacements, which cannot both be 0).
 */
jsts.noding.Octant.octant = function(dx,  dy)  {
  if (dx instanceof jsts.geom.Coordinate) {
    return jsts.noding.Octant.octant2.apply(this, arguments);
  }

  if (dx === 0.0 && dy === 0.0)
    throw new jsts.error.IllegalArgumentError('Cannot compute the octant for point ( ' + dx + ', ' + dy + ' )');

  var adx = Math.abs(dx);
  var ady = Math.abs(dy);

  if (dx >= 0) {
    if (dy >= 0) {
      if (adx >= ady)
        return 0;
      else
        return 1;
    }
    else { // dy < 0
      if (adx >= ady)
        return 7;
      else
        return 6;
    }
  }
  else { // dx < 0
    if (dy >= 0) {
      if (adx >= ady)
        return 3;
      else
        return 2;
    }
    else { // dy < 0
      if (adx >= ady)
        return 4;
      else
        return 5;
    }
  }
};


/**
 * Returns the octant of a directed line segment from p0 to p1.
 */
jsts.noding.Octant.octant2 = function(p0,  p1)  {
  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;
  if (dx === 0.0 && dy === 0.0)
    throw new jsts.error.IllegalArgumentError('Cannot compute the octant for two identical points ' + p0);
  return jsts.noding.Octant.octant(dx, dy);
};
