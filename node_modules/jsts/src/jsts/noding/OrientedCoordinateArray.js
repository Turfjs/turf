/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Allows comparing {@link Coordinate} arrays in an orientation-independent way.
 *
 * Creates a new {@link OrientedCoordinateArray} for the given
 * {@link Coordinate} array.
 *
 * @param pts
 *          the coordinates to orient.
 */
jsts.noding.OrientedCoordinateArray = function(pts) {
  this.pts = pts;
  this._orientation = jsts.noding.OrientedCoordinateArray.orientation(pts);
};


/**
 * @type {Array.<Coordinate>}
 * @private
 */
jsts.noding.OrientedCoordinateArray.prototype.pts = null;


/**
 * @type {boolean}
 * @private
 */
jsts.noding.OrientedCoordinateArray.prototype._orientation = undefined;


/**
 * Computes the canonical orientation for a coordinate array.
 *
 * @param {Array.
 *          <Coordinate>} pts the array to test.
 * @return <code>true</code> if the points are oriented forwards.
 * @return <code>false</code if the points are oriented in reverse.
 * @private
 */
jsts.noding.OrientedCoordinateArray.orientation = function(pts) {
  return jsts.geom.CoordinateArrays.increasingDirection(pts) === 1;
};

/**
 * Compares two {@link OrientedCoordinateArray}s for their relative order
 *
 * @return -1 this one is smaller.
 * @return 0 the two objects are equal.
 * @return 1 this one is greater.
 */

jsts.noding.OrientedCoordinateArray.prototype.compareTo = function(o1) {
  var oca = o1;
  var comp = jsts.noding.OrientedCoordinateArray.compareOriented(this.pts,
      this._orientation, oca.pts, oca._orientation);
  return comp;
};


/**
 * @private
 */
jsts.noding.OrientedCoordinateArray.compareOriented = function(pts1,
    orientation1, pts2, orientation2) {
  var dir1 = orientation1 ? 1 : -1;
  var dir2 = orientation2 ? 1 : -1;
  var limit1 = orientation1 ? pts1.length : -1;
  var limit2 = orientation2 ? pts2.length : -1;

  var i1 = orientation1 ? 0 : pts1.length - 1;
  var i2 = orientation2 ? 0 : pts2.length - 1;
  var comp = 0;
  while (true) {
    var compPt = pts1[i1].compareTo(pts2[i2]);
    if (compPt !== 0)
      return compPt;
    i1 += dir1;
    i2 += dir2;
    var done1 = i1 === limit1;
    var done2 = i2 === limit2;
    if (done1 && !done2)
      return -1;
    if (!done1 && done2)
      return 1;
    if (done1 && done2)
      return 0;
  }
};
