/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The base class for nodes in a {@link Bintree}.
 */
(function() {

  /**
   * Constructs a new NodeBase
   *
   * @constructor
   */
  var NodeBase = function() {
    this.items = new javascript.util.ArrayList();

    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.subnode = [null, null];
  };

  /**
   * Returns the index of the subnode that wholely contains the given interval.
   * If none does, returns -1.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval.
   * @param {Number}
   *          centre
   */
  NodeBase.getSubnodeIndex = function(interval, centre) {
    var subnodeIndex = -1;
    if (interval.min >= centre) {
      subnodeIndex = 1;
    }
    if (interval.max <= centre) {
      subnodeIndex = 0;
    }
    return subnodeIndex;
  };

  /**
   * Gets the items
   *
   * @return {javascript.util.ArrayList}
   */
  NodeBase.prototype.getItems = function() {
    return this.items;
  };

  /**
   * Adds an item
   *
   * @param {Object}
   *          item the item to add.
   */
  NodeBase.prototype.add = function(item) {
    this.items.add(item);
  };

  /**
   * Adds all items from this tree to the provided items
   *
   * @param {javascript.util.ArrayList}
   *          items the list to add to.
   * @return {javscript.util.ArrayList} the input list filled with items.
   */
  NodeBase.prototype.addAllItems = function(items) {
    // TODO: Check if addAll really takes an ordinary javascript array
    items.addAll(this.items);
    var i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        this.subnode[i].addAllItems(items);
      }
    }
    return items;
  };

  /**
   * Adds items in the tree which potentially overlap the query interval to the
   * given collection. If the query interval is <tt>null</tt>, add all items
   * in the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval a query nterval, or null.
   * @param {javascript.util.Collection}
   *          resultItems the candidate items found.
   */
  NodeBase.prototype.addAllItemsFromOverlapping = function(interval,
      resultItems) {
    if (interval !== null && !this.isSearchMatch(interval)) {
      return;
    }

    // some of these may not actually overlap - this is allowed by the bintree
    // contract
    resultItems.addAll(this.items);

    if (this.subnode[0] !== null) {
      this.subnode[0].addAllItemsFromOverlapping(interval, resultItems);
    }

    if (this.subnode[1] !== null) {
      this.subnode[1].addAllItemsFromOverlapping(interval, resultItems);
    }
  };

  /**
   * Removes a single item from this subtree.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the envelope containing the item.
   * @param {Object}
   *          item the item to remove.
   * @return <code>true</code> if the item was found and removed.
   */
  NodeBase.prototype.remove = function(itemInterval, item) {
    if (!this.isSearchMatch(itemInterval)) {
      return false;
    }

    var found = false, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        found = this.subnode[i].remove(itemInterval, item);
        if (found) {
          // trim subtree if empty
          if (this.subnode[i].isPrunable()) {
            this.subnode[i] = null;
          }
          break;
        }
      }
    }

    // if item was found lower down, don't need to search for it here
    if (found) {
      return found;
    }

    // otherwise, try and remove the item from the list of items in this node
    found = this.items.remove(item);
    return found;
  };

  /**
   * Checks if this tree has any children or items
   *
   * @return {Boolean} true if it has children or items (or both).
   */
  NodeBase.prototype.isPrunable = function() {
    return !(this.hasChildren() || this.hasItems());
  };

  /**
   * Checks if this tree has any children
   *
   * @return {Boolean} true if it has children.
   */
  NodeBase.prototype.hasChildren = function() {
    var i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks i this node has any items
   *
   * @return {Boolean} true if it has items.
   */
  NodeBase.prototype.hasItems = function() {
    return !this.items.isEmpty();
  };

  NodeBase.prototype.depth = function() {
    var maxSubDepth = 0, i = 0, il = 2, sqd;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        sqd = this.subnode[i].depth();
        if (sqd > maxSubDepth) {
          maxSubDepth = sqd;
        }
      }
    }
    return maxSubDepth + 1;
  };

  NodeBase.prototype.size = function() {
    var subSize = 0, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        subSize += this.subnode[i].size();
      }
    }
    return subSize + this.items.size();
  };

  NodeBase.prototype.nodeSize = function() {
    var subSize = 0, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        subSize += this.subnode[i].nodeSize();
      }
    }
    return subSize + 1;
  };

  jsts.index.bintree.NodeBase = NodeBase;
})();
