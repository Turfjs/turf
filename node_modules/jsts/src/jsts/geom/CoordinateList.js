/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constructs a new list from an array of Coordinates, allowing caller to
 * specify if repeated points are to be removed.
 *
 * @param {Array.<jsts.geom.Coordinate>}
 *          coord the array of coordinates to load into the list.
 * @param {boolean}
 *          allowRepeated if <code>false</code>, repeated points are removed.
 *
 * @constructor
 */
jsts.geom.CoordinateList = function(coord, allowRepeated) {
  javascript.util.ArrayList.apply(this, arguments);
  
  allowRepeated = (allowRepeated === undefined) ? true : allowRepeated;

  if (coord !== undefined) {
    this.add(coord, allowRepeated);
  }
};

jsts.geom.CoordinateList.prototype = new javascript.util.ArrayList();


// simulate overloaded methods...
jsts.geom.CoordinateList.prototype.add = function() {
    if (arguments.length>1) {
        return this.addCoordinates.apply(this, arguments);
    } else {
        return javascript.util.ArrayList.prototype.add.apply(this, arguments);
    }
};

/**
 * Adds an array of coordinates to the list.
 *
 * @param {Array.<jsts.geom.Coordinate>}
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 * @param {boolean}
 *          direction if false, the array is added in reverse order.
 * @return {boolean} true (as by general collection contract).
 */
jsts.geom.CoordinateList.prototype.addCoordinates = function(coord, allowRepeated,
    direction) {
  if (coord instanceof jsts.geom.Coordinate) {
    return this.addCoordinate.apply(this, arguments);
  } else if (typeof coord === 'number') {
    return this.insertCoordinate.apply(this, arguments);
  }

  direction = direction || true;

  if (direction) {
    for (var i = 0; i < coord.length; i++) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  } else {
    for (var i = coord.length - 1; i >= 0; i--) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  }
  return true;
};


/**
 * Adds a coordinate to the end of the list.
 *
 * @param {Coordinate}
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 */
jsts.geom.CoordinateList.prototype.addCoordinate = function(coord,
    allowRepeated) {
  // don't add duplicate coordinates
  if (!allowRepeated) {
    if (this.size() >= 1) {
      var last = this.get(this.size() - 1);
      if (last.equals2D(coord)) return;
    }
  }
  this.add(coord);
};

/**
 * Inserts a coordinate at the specified place in the list
 *
 * @param {Number}
 *          index The index where to insert the coordinate.
 * @param {Coordinate}
 *          coord The coordinate.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 */
jsts.geom.CoordinateList.prototype.insertCoordinate = function(index, coord,
    allowRepeated) {
  // don't add duplicate coordinates
  if (!allowRepeated) {
    var before = index > 0 ? index - 1 : -1;
    if (before !== -1 && this.get(before).equals2D(coord)) {
      return;
    }

    var after = index < this.size() - 1 ? index + 1 : -1;
    if (after !== -1 && this.get(after).equals2D(coord)) {
      return;
    }
  }
  this.array.splice(index, 0, coord);
};

/**
 * Ensure this coordList is a ring, by adding the start point if necessary
 */
jsts.geom.CoordinateList.prototype.closeRing = function() {
  if (this.size() > 0) {
    this.addCoordinate(new jsts.geom.Coordinate(this.get(0)), false);
  }
};

/**
 * Creates a standard javascript-array from the contents of this list
 *
 * @return {Array}
 *            the created array.
 */
jsts.geom.CoordinateList.prototype.toArray = function() {
  var i, il, arr;
  i = 0, il = this.size(), arr = [];

  for (i; i < il; i++) {
    arr[i] = this.get(i);
  }

  return arr;
};

/** Returns the Coordinates in this collection.
*
* @return the coordinates.
*/
jsts.geom.CoordinateList.prototype.toCoordinateArray = function() {
  return this.toArray();
};

// TODO: port rest?
