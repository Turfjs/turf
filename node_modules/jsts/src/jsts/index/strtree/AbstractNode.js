/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A node of the STR tree. The children of this node are either more nodes
 * (AbstractNodes) or real data (ItemBoundables). If this node contains real data
 * (rather than nodes), then we say that this node is a "leaf node".
 *
 * @requires jsts/index/strtree/Boundable.js
 */



/**
 * Constructs an AbstractNode at the given level in the tree
 * @param {Integer} level 0 if this node is a leaf, 1 if a parent of a leaf, and so on; the
 * root node will have the highest level.
 *
 * @extends {Boundable}
 * @constructor
 * @interface
 */
jsts.index.strtree.AbstractNode = function(level) {
  this.level = level;
  this.childBoundables = [];
};

jsts.index.strtree.AbstractNode.prototype = new jsts.index.strtree.Boundable();
jsts.index.strtree.AbstractNode.constructor = jsts.index.strtree.AbstractNode;

/**
 * @type {Array}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.childBoundables = null;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.bounds = null;


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.level = null;


/**
 * Returns either child {@link AbstractNodes}, or if this is a leaf node, real data (wrapped
 * in {@link ItemBoundables}).
 *
 * @return {Array}
 */
jsts.index.strtree.AbstractNode.prototype.getChildBoundables = function() {
  return this.childBoundables;
};


/**
 * Returns a representation of space that encloses this Boundable,
 * preferably not much bigger than this Boundable's boundary yet fast to
 * test for intersection with the bounds of other Boundables. The class of
 * object returned depends on the subclass of AbstractSTRtree.
 *
 * @return an Envelope (for STRtrees), an Interval (for SIRtrees), or other
 *         object (for other subclasses of AbstractSTRtree).
 * @see AbstractSTRtree.IntersectsOp
 */
jsts.index.strtree.AbstractNode.prototype.computeBounds = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

jsts.index.strtree.AbstractNode.prototype.getBounds = function() {
  if (this.bounds === null) {
    this.bounds = this.computeBounds();
  }
  return this.bounds;
};


/**
 * Returns 0 if this node is a leaf, 1 if a parent of a leaf, and so on; the
 * root node will have the highest level
 *
 * @return {number}
 */
jsts.index.strtree.AbstractNode.prototype.getLevel = function() {
  return this.level;
};


/**
 * Adds either an AbstractNode, or if this is a leaf node, a data object
 * (wrapped in an ItemBoundable)
 *
 * @param {jsts.index.strtree.Boundable} childBoundable
 */
jsts.index.strtree.AbstractNode.prototype.addChildBoundable = function(childBoundable) {
  this.childBoundables.push(childBoundable);
};
