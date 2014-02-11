/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Utility functions for working with quadrants, which are numbered as follows:
 *
 * <pre>
 * 1 | 0
 * --+--
 * 2 | 3
 * &lt;pre&gt;
 * @constructor
 *
 */
jsts.geomgraph.Quadrant = function() {

};

jsts.geomgraph.Quadrant.NE = 0;
jsts.geomgraph.Quadrant.NW = 1;
jsts.geomgraph.Quadrant.SW = 2;
jsts.geomgraph.Quadrant.SE = 3;


/**
 * Returns the quadrant of a directed line segment (specified as x and y
 * displacements, which cannot both be 0).
 *
 * @throws IllegalArgumentException
 *           if the displacements are both 0
 */
jsts.geomgraph.Quadrant.quadrant = function(dx, dy) {
  if (dx instanceof jsts.geom.Coordinate) {
    return jsts.geomgraph.Quadrant.quadrant2.apply(this, arguments);
  }

  if (dx === 0.0 && dy === 0.0)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for point ( ' + dx + ', ' + dy + ' )');
  if (dx >= 0.0) {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns the quadrant of a directed line segment from p0 to p1.
 *
 * @throws IllegalArgumentException
 *           if the points are equal
 */
jsts.geomgraph.Quadrant.quadrant2 = function(p0, p1) {
  if (p1.x === p0.x && p1.y === p0.y)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for two identical points ' + p0);

  if (p1.x >= p0.x) {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns true if the quadrants are 1 and 3, or 2 and 4
 */
jsts.geomgraph.Quadrant.isOpposite = function(quad1, quad2) {
  if (quad1 === quad2)
    return false;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they are opposite
  if (diff === 2)
    return true;
  return false;
};


/**
 * Returns the right-hand quadrant of the halfplane defined by the two
 * quadrants, or -1 if the quadrants are opposite, or the quadrant if they are
 * identical.
 */
jsts.geomgraph.Quadrant.commonHalfPlane = function(quad1, quad2) {
  // if quadrants are the same they do not determine a unique common halfplane.
  // Simply return one of the two possibilities
  if (quad1 === quad2)
    return quad1;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they do not share a common halfplane
  if (diff === 2)
    return -1;
  //
  var min = (quad1 < quad2) ? quad1 : quad2;
  var max = (quad1 > quad2) ? quad1 : quad2;
  // for this one case, the righthand plane is NOT the minimum index;
  if (min === 0 && max === 3)
    return 3;
  // in general, the halfplane index is the minimum of the two adjacent
  // quadrants
  return min;
};


/**
 * Returns whether the given quadrant lies within the given halfplane (specified
 * by its right-hand quadrant).
 */
jsts.geomgraph.Quadrant.isInHalfPlane = function(quad, halfPlane) {
  if (halfPlane === jsts.geomgraph.Quadrant.SE) {
    return quad === jsts.geomgraph.Quadrant.SE ||
        quad === jsts.geomgraph.Quadrant.SW;
  }
  return quad === halfPlane || quad === halfPlane + 1;
};


/**
 * Returns true if the given quadrant is 0 or 1.
 */
jsts.geomgraph.Quadrant.isNorthern = function(quad) {
  return quad === jsts.geomgraph.Quadrant.NE ||
      quad === jsts.geomgraph.Quadrant.NW;
};
