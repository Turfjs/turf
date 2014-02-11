/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geom.CoordinateArrays = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * If the coordinate array argument has repeated points, constructs a new array
 * containing no repeated points. Otherwise, returns the argument.
 *
 * @return {Coordinate[]}
 * @see #hasRepeatedPoints(Coordinate[])
 */
jsts.geom.CoordinateArrays.removeRepeatedPoints = function(coord) {
  var coordList;
  if (!this.hasRepeatedPoints(coord)) {
    return coord;
  }
  coordList = new jsts.geom.CoordinateList(coord, false);
  return coordList.toCoordinateArray();
};


/**
 * Returns whether #equals returns true for any two consecutive Coordinates in
 * the given array.
 *
 * @param {Coordinate[]}
 *          coord
 * @return {boolean}
 */
jsts.geom.CoordinateArrays.hasRepeatedPoints = function(coord) {
  var i;
  for (i = 1; i < coord.length; i++) {
    if (coord[i - 1].equals(coord[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Finds a point in a list of points which is not contained in another list of points
 * @param testPts the {@link Coordinate} s to test.
 * @param pts an array of {@link Coordinate} s to test the input points against.
 * @return a {@link Coordinate} from <code>testPts</code> which is not in <code>pts</code>, '
 * or <code>null.</code>
 */
jsts.geom.CoordinateArrays.ptNotInList = function(testPts, pts) {
  for (var i = 0; i < testPts.length; i++) {
    var testPt = testPts[i];
    if (jsts.geom.CoordinateArrays.indexOf(testPt, pts) < 0)
        return testPt;
  }
  return null;
};

/**
 * Determines which orientation of the {@link Coordinate} array is (overall)
 * increasing. In other words, determines which end of the array is "smaller"
 * (using the standard ordering on {@link Coordinate}). Returns an integer
 * indicating the increasing direction. If the sequence is a palindrome, it is
 * defined to be oriented in a positive direction.
 *
 * @param pts
 *          the array of Coordinates to test.
 * @return <code>1</code> if the array is smaller at the start or is a
 *         palindrome, <code>-1</code> if smaller at the end.
 */
jsts.geom.CoordinateArrays.increasingDirection = function(pts) {
  for (var i = 0; i < parseInt(pts.length / 2); i++) {
    var j = pts.length - 1 - i;
    // skip equal points on both ends
    var comp = pts[i].compareTo(pts[j]);
    if (comp != 0)
      return comp;
  }
  // array must be a palindrome - defined to be in positive direction
  return 1;
};

/**
 * Returns the minimum coordinate, using the usual lexicographic comparison.
 *
 * @param coordinates
 *          the array to search.
 * @return the minimum coordinate in the array, found using
 *         <code>compareTo.</code>
 * @see Coordinate#compareTo(Object)
 */
jsts.geom.CoordinateArrays.minCoordinate = function(coordinates) {
  var minCoord = null;
  for (var i = 0; i < coordinates.length; i++) {
    if (minCoord === null || minCoord.compareTo(coordinates[i]) > 0) {
      minCoord = coordinates[i];
    }
  }
  return minCoord;
};

/**
 * Shifts the positions of the coordinates until <code>firstCoordinate</code>
 * is first.
 *
 * @param coordinates
 *          the array to rearrange.
 * @param firstCoordinate
 *          the coordinate to make first.
 */
jsts.geom.CoordinateArrays.scroll = function(coordinates, firstCoordinate) {
  var i = jsts.geom.CoordinateArrays.indexOf(firstCoordinate, coordinates);
  if (i < 0)
    return;

  var newCoordinates = coordinates.slice(i).concat(coordinates.slice(0, i));
  for (i = 0; i < newCoordinates.length; i++) {
    coordinates[i] = newCoordinates[i];
  }
};

/**
 * Returns the index of <code>coordinate</code> in <code>coordinates</code>.
 * The first position is 0; the second, 1; etc.
 *
 * @param coordinate
 *          the <code>Coordinate</code> to search for.
 * @param coordinates
 *          the array to search.
 * @return the position of <code>coordinate</code>, or -1 if it is not found.
 */
jsts.geom.CoordinateArrays.indexOf = function(coordinate, coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    if (coordinate.equals(coordinates[i])) {
      return i;
    }
  }
  return -1;
};
