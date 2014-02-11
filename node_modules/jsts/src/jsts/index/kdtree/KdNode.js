/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license
 * notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A node of a {@link KdTree}, which represents one or more points in the same
 * location.
 *
 * Creates a new KdNode. Will call appropriate *initialize-function depending on
 * arguments.
 *
 * @constructor
 */
jsts.index.kdtree.KdNode = function() {
  this.left = null;
  this.right = null;
  this.count = 1;

  if (arguments.length === 2) {
    this.initializeFromCoordinate.apply(this, arguments[0], arguments[1]);
  } else if (arguments.length === 3) {
    this.initializeFromXY.apply(this, arguments[0], arguments[1], arguments[2]);
  }
};


/**
 * Creates a new KdNode.
 *
 * @param {Number}
 *          x coordinate of point.
 * @param {Number}
 *          y coordinate of point.
 * @param {Object}
 *          data a data objects to associate with this node.
 */
jsts.index.kdtree.KdNode.prototype.initializeFromXY = function(x, y, data) {
  this.p = new jsts.geom.Coordinate(x, y);
  this.data = data;
};


/**
 * Creates a new KdNode.
 *
 * @param {jsts.geom.Coordinate}
 *          p point location of new node.
 * @param {Object}
 *          data a data objects to associate with this node.
 */
jsts.index.kdtree.KdNode.prototype.initializeFromCoordinate = function(p, data) {
  this.p = p;
  this.data = data;
};


/**
 * Returns the X coordinate of the node
 *
 * @return {Number} X coordinate of the node.
 */
jsts.index.kdtree.KdNode.prototype.getX = function() {
  return this.p.x;
};


/**
 * Returns the Y coordinate of the node
 *
 * @return {Number} Y coordinate of the node.
 */
jsts.index.kdtree.KdNode.prototype.getY = function() {
  return this.p.y;
};


/**
 * Returns the location of this node
 *
 * @return {jsts.geom.Coordinate} location of this node.
 */
jsts.index.kdtree.KdNode.prototype.getCoordinate = function() {
  return this.p;
};


/**
 * Gets the user data object associated with this node.
 *
 * @return {Object} The data of this node.
 */
jsts.index.kdtree.KdNode.prototype.getData = function() {
  return this.data;
};


/**
 * Returns the left node of the tree
 *
 * @return {jsts.index.kdtree.KdNode} The left node of the tree.
 */
jsts.index.kdtree.KdNode.prototype.getLeft = function() {
  return this.left;
};


/**
 * Returns the right node of the tree
 *
 * @return {jsts.index.kdtree.KdNode} The right node of the tree.
 */
jsts.index.kdtree.KdNode.prototype.getRight = function() {
  return this.right;
};


/**
 * Increments the count by 1
 */
jsts.index.kdtree.KdNode.prototype.increment = function() {
  this.count += 1;
};


/**
 * Returns the number of inserted points that are coincident at this location.
 *
 * @return {Number} Number of inserted points that this node represents.
 */
jsts.index.kdtree.KdNode.prototype.getCount = function() {
  return this.count;
};


/**
 * Tests whether more than one point with this value have been inserted (up to
 * the tolerance)
 *
 * @return {Boolean} true if more than one point have been inserted with this
 *         value.
 */
jsts.index.kdtree.KdNode.prototype.isRepeated = function() {
  return count > 1;
};


/**
 * Sets the left node value
 *
 * @param {jsts.index.kdtree.KdNode}
 *          left The node to be inserted as left.
 */
jsts.index.kdtree.KdNode.prototype.setLeft = function(left) {
  this.left = left;
};


/**
 * Sets the right node value
 *
 * @param {jsts.index.kdtree.KdNode}
 *          right The node to be inserted as right.
 */
jsts.index.kdtree.KdNode.prototype.setRight = function(right) {
  this.right = right;
};
