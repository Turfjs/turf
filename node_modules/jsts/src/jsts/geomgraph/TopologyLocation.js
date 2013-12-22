/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Position.js
 */

/**
 * A TopologyLocation is the labelling of a GraphComponent's topological
 * relationship to a single Geometry.
 * <p>
 * If the parent component is an area edge, each side and the edge itself have a
 * topological location. These locations are named
 * <ul>
 * <li> ON: on the edge
 * <li> LEFT: left-hand side of the edge
 * <li> RIGHT: right-hand side
 * </ul>
 * If the parent component is a line edge or node, there is a single topological
 * relationship attribute, ON.
 * <p>
 * The possible values of a topological location are {Location.NONE,
 * Location.EXTERIOR, Location.BOUNDARY, Location.INTERIOR}
 * <p>
 * The labelling is stored in an array location[j] where where j has the values
 * ON, LEFT, RIGHT
 *
 * @constructor
 */
jsts.geomgraph.TopologyLocation = function() {
  this.location = [];

  if (arguments.length === 3) {
    var on = arguments[0];
    var left = arguments[1];
    var right = arguments[2];
    this.init(3);
    this.location[jsts.geomgraph.Position.ON] = on;
    this.location[jsts.geomgraph.Position.LEFT] = left;
    this.location[jsts.geomgraph.Position.RIGHT] = right;
  } else if (arguments[0] instanceof jsts.geomgraph.TopologyLocation) {
    var gl = arguments[0];
    this.init(gl.location.length);
    if (gl != null) {
      for (var i = 0; i < this.location.length; i++) {
        this.location[i] = gl.location[i];
      }
    }
  } else if (typeof arguments[0] === 'number') {
    var on = arguments[0];
    this.init(1);
    this.location[jsts.geomgraph.Position.ON] = on;
  } else if (arguments[0] instanceof Array) {
    var location = arguments[0];
    this.init(location.length);
  }
};


/**
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.location = null;


/**
 * @param {int}
 *          size
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.init = function(size) {
  this.location[size - 1] = null;
  this.setAllLocations(jsts.geom.Location.NONE);
};


/**
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.TopologyLocation.prototype.get = function(posIndex) {
  if (posIndex < this.location.length)
    return this.location[posIndex];
  return jsts.geom.Location.NONE;
};


/**
 * @return {boolean} true if all locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== jsts.geom.Location.NONE)
      return false;
  }
  return true;
};


/**
 * @return {boolean} true if any locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isAnyNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      return true;
  }
  return false;
};


/**
 * @param {TopologyLocation}
 *          le
 * @param {int}
 *          locIndex
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isEqualOnSide = function(le, locIndex) {
  return this.location[locIndex] == le.location[locIndex];
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isArea = function() {
  return this.location.length > 1;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isLine = function() {
  return this.location.length === 1;
};

jsts.geomgraph.TopologyLocation.prototype.flip = function() {
  if (this.location.length <= 1)
    return;
  var temp = this.location[jsts.geomgraph.Position.LEFT];
  this.location[jsts.geomgraph.Position.LEFT] = this.location[jsts.geomgraph.Position.RIGHT];
  this.location[jsts.geomgraph.Position.RIGHT] = temp;
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocations = function(locValue) {
  for (var i = 0; i < this.location.length; i++) {
    this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocationsIfNull = function(
    locValue) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locIndex
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setLocation = function(locIndex,
    locValue) {
  if (locValue !== undefined) {
    this.location[locIndex] = locValue;
  } else {
    this.setLocation(jsts.geomgraph.Position.ON, locIndex);
  }
};


/**
 * @return {int[]}
 */
jsts.geomgraph.TopologyLocation.prototype.getLocations = function() {
  return location;
};


/**
 * @param {int}
 *          on
 * @param {int}
 *          left
 * @param {int}
 *          right
 */
jsts.geomgraph.TopologyLocation.prototype.setLocations = function(on, left,
    right) {
  this.location[jsts.geomgraph.Position.ON] = on;
  this.location[jsts.geomgraph.Position.LEFT] = left;
  this.location[jsts.geomgraph.Position.RIGHT] = right;
};


/**
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.allPositionsEqual = function(loc) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== loc)
      return false;
  }
  return true;
};


/**
 * merge updates only the NULL attributes of this object with the attributes of
 * another.
 *
 * @param {TopologyLocation}
 *          gl
 */
jsts.geomgraph.TopologyLocation.prototype.merge = function(gl) {
  // if the src is an Area label & and the dest is not, increase the dest to be
  // an Area
  if (gl.location.length > this.location.length) {
    var newLoc = [];
    newLoc[jsts.geomgraph.Position.ON] = this.location[jsts.geomgraph.Position.ON];
    newLoc[jsts.geomgraph.Position.LEFT] = jsts.geom.Location.NONE;
    newLoc[jsts.geomgraph.Position.RIGHT] = jsts.geom.Location.NONE;
    this.location = newLoc;
  }
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE && i < gl.location.length)
      this.location[i] = gl.location[i];
  }
};
