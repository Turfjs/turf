/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The root node of a single {@link Bintree}. It is centred at the origin, and
 * does not have a defined extent.
 */
(function() {

  /**
   * @requires jsts/index/bintree/NodeBase.js
   * @requires jsts/index/bintree/Node.js
   */

  var Node = jsts.index.bintree.Node;
  var NodeBase = jsts.index.bintree.NodeBase;

  /**
   * Constructs a new Root
   *
   * @constructor
   */
  var Root = function() {
    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.subnode = [null, null];
    this.items = new javascript.util.ArrayList();
  };
  Root.prototype = new jsts.index.bintree.NodeBase();
  Root.constructor = Root;

  // the singleton root node is centred at the origin.
  Root.origin = 0.0;

  /**
   * Insert an item into the tree this is the root of.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval of the item.
   * @param {Object}
   *          item the item to insert.
   */
  Root.prototype.insert = function(itemInterval, item) {
    var index = NodeBase.getSubnodeIndex(itemInterval, Root.origin), node, largerNode;
    // if index is -1, itemEnv must contain the origin.
    if (index === -1) {
      this.add(item);
      return;
    }

    /**
     * the item must be contained in one interval, so insert it into the tree
     * for that interval (which may not yet exist)
     */
    node = this.subnode[index];

    /**
     * If the subnode doesn't exist or this item is not contained in it, have to
     * expand the tree upward to contain the item.
     */

    if (node === null || !node.getInterval().contains(itemInterval)) {
      largerNode = Node.createExpanded(node, itemInterval);
      this.subnode[index] = largerNode;
    }

    /**
     * At this point we have a subnode which exists and must contain contains
     * the env for the item. Insert the item into the tree.
     */
    this.insertContained(this.subnode[index], itemInterval, item);
  };

  /**
   * insert an item which is known to be contained in the tree rooted at the
   * given Node. Lower levels of the tree will be created if necessary to hold
   * the item.
   *
   * @param {jsts.index.bintree.Node}
   *          tree the subtree.
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @param {Object}
   *          item the item to insert.
   */
  Root.prototype.insertContained = function(tree, itemInterval, item) {
    var isZeroArea, node;
    /**
     * Do NOT create a new node for zero-area intervals - this would lead to
     * infinite recursion. Instead, use a heuristic of simply returning the
     * smallest existing node containing the query
     */
    isZeroArea = jsts.index.IntervalSize.isZeroWidth(itemInterval
        .getMin(), itemInterval.getMax());
    node = isZeroArea ? tree.find(itemInterval) : tree.getNode(itemInterval);
    node.add(item);
  };

  /**
   * The root node matches all searches
   */
  Root.prototype.isSearchMatch = function(interval) {
    return true;
  };

  jsts.index.bintree.Root = Root;
})();
