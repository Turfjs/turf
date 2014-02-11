/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * QuadRoot is the root of a single Quadtree. It is centred at the origin, and
 * does not have a defined extent.
 *
 * @constructor
 */
jsts.index.quadtree.Root = function() {
  jsts.index.quadtree.NodeBase.prototype.constructor.apply(this, arguments);

  // the root quad is centred at the origin.
  this.origin = new jsts.geom.Coordinate(0.0, 0.0);
};

jsts.index.quadtree.Root.prototype = new jsts.index.quadtree.NodeBase();


/**
 * Insert an item into the quadtree this is the root of.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the item envelope.
 * @param {Object}
 *          item the item to insert.
 */
jsts.index.quadtree.Root.prototype.insert = function(itemEnv, item) {
  var index = this.getSubnodeIndex(itemEnv, this.origin);

  // if index is -1, itemEnv must cross the X or Y axis.
  if (index === -1) {
    this.add(item);
    return;
  }
  /**
   * the item must be contained in one quadrant, so insert it into the tree for
   * that quadrant (which may not yet exist)
   */
  var node = this.subnode[index];
  /**
   * If the subquad doesn't exist or this item is not contained in it, have to
   * expand the tree upward to contain the item.
   */

  if (node === null || !node.getEnvelope().contains(itemEnv)) {
    var largerNode = jsts.index.quadtree.Node.createExpanded(node, itemEnv);
    this.subnode[index] = largerNode;
  }
  /**
   * At this point we have a subquad which exists and must contain contains the
   * env for the item. Insert the item into the tree.
   */
  this.insertContained(this.subnode[index], itemEnv, item);
};


/**
 * insert an item which is known to be contained in the tree rooted at the given
 * QuadNode root. Lower levels of the tree will be created if necessary to hold
 * the item.
 *
 * @param {jsts.index.quadtree.Node}
 *          tree the root-node of the tree.
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope.
 * @param {Object}
 *          item the item to insert.
 */
jsts.index.quadtree.Root.prototype.insertContained = function(tree, itemEnv,
    item) {
  /**
   * Do NOT create a new quad for zero-area envelopes - this would lead to
   * infinite recursion. Instead, use a heuristic of simply returning the
   * smallest existing quad containing the query
   */
  var isZeroX, isZeroY, node;
  isZeroX = jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinX(),
      itemEnv.getMaxX());
  isZeroY = jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinY(),
      itemEnv.getMaxY());

  if (isZeroX || isZeroY) {
    node = tree.find(itemEnv);
  } else {
    node = tree.getNode(itemEnv);
  }
  node.add(item);
};


/**
 * Checks if the root is a search match.
 *
 * @param {jsts.geom.Envelope} searchEnv the envelope.
 * @return {Boolean} Always returns true for a root node.
 */
jsts.index.quadtree.Root.prototype.isSearchMatch = function(searchEnv) {
  return true;
};
