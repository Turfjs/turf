/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * One-dimensional version of an STR-packed R-tree. SIR stands for
 * "Sort-Interval-Recursive". STR-packed R-trees are described in:
 * P. Rigaux, Michel Scholl and Agnes Voisard. Spatial Databases With
 * Application To GIS. Morgan Kaufmann, San Francisco, 2002.
 * @see STRtree
 *
 * @requires jsts/index/strtree/AbstractNode.js
 * @requires jsts/index/strtree/AbstractSTRtree.js
 */



/**
 * @param {number} [nodeCapacity].
 * @augments jsts.index.strtree.AbstractSTRtree
 * @constructor
 */
jsts.index.strtree.SIRtree = function(nodeCapacity) {
  nodeCapacity = nodeCapacity || 10;
  jsts.index.strtree.AbstractSTRtree.call(this, nodeCapacity);
};

jsts.index.strtree.SIRtree.prototype = new jsts.index.strtree.AbstractSTRtree();
jsts.index.strtree.SIRtree.constructor = jsts.index.strtree.SIRtree;

//TODO: Verify that this comparison really works
jsts.index.strtree.SIRtree.prototype.comperator = {
  compare: function(o1, o2) {
    return o1.getBounds().getCentre() - o2.getBounds().getCentre();
  }
};


/**
 * @type {Object}
 * @extends {jsts.index.strtree.AbstractSTRtree.IntersectsOp}
 * @private
 */
jsts.index.strtree.SIRtree.prototype.intersectionOp = {
  intersects: function(aBounds, bBounds) {
    return aBounds.intersects(bBounds);
  }
};


/**
 *
 * @param {number} level
 * @return {AbstractNode}
 * @protected
 */
jsts.index.strtree.SIRtree.prototype.createNode = function(level) {

  //TODO: Does it really have to be so complex?
  var AbstractNode = function(level) {
    jsts.index.strtree.AbstractNode.apply(this, arguments);
  };

  AbstractNode.prototype = new jsts.index.strtree.AbstractNode();
  AbstractNode.constructor = AbstractNode;

  AbstractNode.prototype.computeBounds = function() {
    var bounds = null,
        childBoundables = this.getChildBoundables(),
        childBoundable;

    for (var i = 0, l = childBoundables.length; i < l; i++) {
      childBoundable = childBoundables[i];
      if (bounds === null) {
        bounds = new jsts.index.strtree.Interval(childBoundable.getBounds());
      }
      else {
        bounds.expandToInclude(childBoundable.getBounds());
      }
    }
    return bounds;
  };

  return AbstractNode;
};


/**
 * Inserts an item having the given bounds into the tree.
 *
 * @param {number} x1
 * @param {number} x2
 * @param {Object} item
 */
jsts.index.strtree.SIRtree.prototype.insert = function(x1, x2, item) {
  jsts.index.strtree.AbstractSTRtree.prototype.insert(
      new jsts.index.strtree.Interval(Math.min(x1, x2), Math.max(x1, x2)),
      item);
};


/**
 * Returns items whose bounds intersect the given bounds.
 *
 * @param {number} x1 possibly equal to x2.
 * @param {number} [x2].
 * @return {Array}
 */
jsts.index.strtree.SIRtree.prototype.query = function(x1, x2) {
  x2 = x2 || x1;
  jsts.index.strtree.AbstractSTRtree.prototype.query(new jsts.index.strtree.Interval(Math.min(x1, x2), Math.max(x1, x2)));
};

jsts.index.strtree.SIRtree.prototype.getIntersectsOp = function() {
  return this.intersectionOp;
};

jsts.index.strtree.SIRtree.prototype.getComparator = function() {
  return this.comperator;
};
