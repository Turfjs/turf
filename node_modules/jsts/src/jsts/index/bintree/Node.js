/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A node of a {@link Bintree}.
 */
(function() {

  /**
   * @requires jsts/index/bintree/NodeBase.js
   * @requires jsts/index/bintree/Interval.js
   * @requires jsts/index/bintree/Key.js
   */

  var NodeBase = jsts.index.bintree.NodeBase;
  var Key = jsts.index.bintree.Key;
  var Interval = jsts.index.bintree.Interval;

  /**
   * Constructs a new Node
   *
   * @constructor
   */
  var Node = function(interval, level) {
    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.items = new javascript.util.ArrayList();
    this.subnode = [null, null];
    this.interval = interval;
    this.level = level;
    this.centre = (interval.getMin() + interval.getMax()) / 2;
  };
  Node.prototype = new NodeBase();
  Node.constructor = Node;

  /**
   * Creates a node from a specified interval
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @return {jsts.index.bintree.Node} the created node.
   */
  Node.createNode = function(itemInterval) {
    var key, node;

    key = new Key(itemInterval);
    node = new Node(key.getInterval(), key.getLevel());
    return node;
  };

  /**
   * Creates an expanded node
   *
   * @param {jsts.index.bintree.Node}
   *          node the node.
   * @param {jsts.index.bintree.Interval}
   *          addInterval the interval to add.
   * @return {jsts.index.bintree.Node} the expanded node.
   */
  Node.createExpanded = function(node, addInterval) {
    var expandInt, largerNode;
    expandInt = new Interval(addInterval);
    if (node !== null) {
      expandInt.expandToInclude(node.interval);
    }

    largerNode = Node.createNode(expandInt);

    if (node !== null) {
      largerNode.insert(node);
    }

    return largerNode;
  };

  Node.prototype.getInterval = function() {
    return this.interval;
  };

  /**
   * Checks if the input interval matches any items in this node
   *
   * @return {Boolean} true if there is a search match.
   */
  Node.prototype.isSearchMatch = function(itemInterval) {
    return itemInterval.overlaps(this.interval);
  };

  /**
   * Returns the subnode containing the envelope. Creates the node if it does
   * not already exist.
   *
   * @param {jsts.index.bintree.Interval}
   *          serachInterval the interval.
   * @return {jsts.index.bintree.Node} the node.
   */
  Node.prototype.getNode = function(searchInterval) {
    var subnodeIndex = NodeBase.getSubnodeIndex(searchInterval, this.centre), node;
    // if index is -1 searchEnv is not contained in a subnode
    if (subnodeIndex != -1) {
      // create the node if it does not exist
      node = this.getSubnode(subnodeIndex);
      // recursively search the found/created node
      return node.getNode(searchInterval);
    } else {
      return this;
    }
  };

  /**
   * Returns the smallest <i>existing</i> node containing the envelope.
   *
   * @param {jsts.index.bintree.Interval}
   *          searchInterval the interval.
   * @return {jsts.index.bintree.Node} the smallest node contained.
   */
  Node.prototype.find = function(searchInterval) {
    var subnodeIndex = NodeBase.getSubnodeIndex(searchInterval, this.centre), node;
    if (subnodeIndex === -1) {
      return this;
    }

    if (this.subnode[subnodeIndex] !== null) {
      // query lies in subnode, so search it
      node = this.subnode[subnodeIndex];
      return node.find(searchInterval);
    }
    // no existing subnode, so return this one anyway
    return this;
  };

  /**
   * Inserts a node as a child node (at some level) in this node
   *
   * @param {jsts.index.bintree.Node}
   *          node the node to insert.
   */
  Node.prototype.insert = function(node) {
    //Assert.isTrue(interval == null || interval.contains(node.interval));

    var index = NodeBase.getSubnodeIndex(node.interval, this.centre), childNode;
    if (node.level === this.level - 1) {
      this.subnode[index] = node;
    } else {
      // the node is not a direct child, so make a new child node to contain it
      // and recursively insert the node
      childNode = this.createSubnode(index);
      childNode.insert(node);
      this.subnode[index] = childNode;
    }
  };

  /**
   * get the subnode for the index. If it doesn't exist, create it
   *
   * @param {Number}
   *          index
   * @return {jsts.index.bintree.Node} the found or created node.
   */
  Node.prototype.getSubnode = function(index) {
    if (this.subnode[index] === null) {
      this.subnode[index] = this.createSubnode(index);
    }
    return this.subnode[index];
  };

  /**
   * Creates a subnode
   *
   * @param {Number}
   *          index the index to create the subnode at.
   * @return {jsts.index.bintree.Node} the created node.
   */
  Node.prototype.createSubnode = function(index) {
    // create a new subnode in the appropriate interval

    var min, max, subInt, node;

    min = 0.0;
    max = 0.0;

    switch (index) {
    case 0:
      min = this.interval.getMin();
      max = this.centre;
      break;
    case 1:
      min = this.centre;
      max = this.interval.getMax();
      break;
    }
    subInt = new Interval(min, max);
    node = new Node(subInt, this.level - 1);
    return node;
  };

  jsts.index.bintree.Node = Node;
})();
