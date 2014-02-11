/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Base class for STRtree and SIRtree. STR-packed R-trees are described in:
 * P. Rigaux, Michel Scholl and Agnes Voisard. Spatial Databases With
 * Application To GIS. Morgan Kaufmann, San Francisco, 2002.
 * <p>
 * This implementation is based on Boundables rather than just AbstractNodes,
 * because the STR algorithm operates on both nodes and
 * data, both of which are treated here as Boundables.
 *
 * @see STRtree
 * @see SIRtree
 */



/**
 * Constructs an AbstractSTRtree with the specified maximum number of child
 * nodes that a node may have
 *
 * @param {Integer}
 *          nodeCapacity
 *
 * @constuctor
 */
jsts.index.strtree.AbstractSTRtree = function(nodeCapacity) {
  if (nodeCapacity === undefined)
    return;

  this.itemBoundables = [];

  jsts.util.Assert.isTrue(nodeCapacity > 1, 'Node capacity must be greater than 1');
  this.nodeCapacity = nodeCapacity;
};



/**
 * A test for intersection between two bounds, necessary because subclasses of
 * AbstractSTRtree have different implementations of bounds.
 *
 * @interface
 * @constructor
 * @public
 */
jsts.index.strtree.AbstractSTRtree.IntersectsOp = function() {

};


/**
 * For STRtrees, the bounds will be Envelopes; for SIRtrees, Intervals; for
 * other subclasses of AbstractSTRtree, some other class.
 *
 * @param {Object}
 *          aBounds the bounds of one spatial object.
 * @param {Object}
 *          bBounds the bounds of another spatial object.
 * @return {boolean} whether the two bounds intersect.
 */
jsts.index.strtree.AbstractSTRtree.IntersectsOp.prototype.intersects = function(
    aBounds, bBounds) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @type {jsts.index.strtree.AbstractNode}
 * @protected
 */
jsts.index.strtree.AbstractSTRtree.prototype.root = null;


/**
 * @type {boolean}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.built = false;


/**
 * @type {Array}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.itemBoundables = null;


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.nodeCapacity = null;


/**
 * Creates parent nodes, grandparent nodes, and so forth up to the root node,
 * for the data that has been inserted into the tree. Can only be called once,
 * and thus can be called only after all of the data has been inserted into the
 * tree.
 */
jsts.index.strtree.AbstractSTRtree.prototype.build = function() {
  jsts.util.Assert.isTrue(!this.built);
  this.root = this.itemBoundables.length === 0 ? this.createNode(0) : this
      .createHigherLevels(this.itemBoundables, -1);
  this.built = true;
};


/**
 * @param {number}
 *          level
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.createNode = function(level) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Sorts the childBoundables then divides them into groups of size M, where M is
 * the node capacity.
 */
jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables = function(
    childBoundables, newLevel) {
  jsts.util.Assert.isTrue(!(childBoundables.length === 0));
  var parentBoundables = [];
  parentBoundables.push(this.createNode(newLevel));
  var sortedChildBoundables = [];
  for (var i = 0; i < childBoundables.length; i++) {
    sortedChildBoundables.push(childBoundables[i]);
  }
  sortedChildBoundables.sort(this.getComparator());
  for (var i = 0; i < sortedChildBoundables.length; i++) {
    var childBoundable = sortedChildBoundables[i];
    if (this.lastNode(parentBoundables).getChildBoundables().length === this
        .getNodeCapacity()) {
      parentBoundables.push(this.createNode(newLevel));
    }
    this.lastNode(parentBoundables).addChildBoundable(childBoundable);
  }
  return parentBoundables;
};


/**
 * @param {Array}
 *          nodes
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.lastNode = function(nodes) {
  return nodes[nodes.length - 1];
};


/**
 * @param {number}
 *          a
 * @param {number}
 *          b
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};


/**
 * Creates the levels higher than the given level
 *
 * @param {Array}
 *          boundablesOfALevel the level to build on.
 * @param {number}
 *          level the level of the Boundables, or -1 if the boundables are item
 *          boundables (that is, below level 0).
 * @return {jsts.index.strtree.AbstractNode} the root, which may be a ParentNode
 *         or a LeafNode.
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.createHigherLevels = function(
    boundablesOfALevel, level) {
  jsts.util.Assert.isTrue(!(boundablesOfALevel.length === 0));
  var parentBoundables = this.createParentBoundables(boundablesOfALevel,
      level + 1);
  if (parentBoundables.length === 1) {
    return parentBoundables[0];
  }
  return this.createHigherLevels(parentBoundables, level + 1);
};


/**
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getRoot = function() {
  if (!this.built)
    this.build();
  return this.root;
};


/**
 * Returns the maximum number of child nodes that a node may have
 *
 * return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getNodeCapacity = function() {
  return this.nodeCapacity;
};


/**
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.size = function() {
  if (arguments.length === 1) {
    return this.size2(arguments[0]);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    return 0;
  }
  return this.size2(root);
};

/**
 * @param {jsts.index.strtree.AbstractNode=}
 *          [node].
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.size2 = function(node) {
  var size = 0;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      size += this.size(childBoundable);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      size += 1;
    }
  }
  return size;
};


/**
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.depth = function() {
  if (arguments.length === 1) {
    return this.depth2(arguments[0]);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    return 0;
  }
  return this.depth2(root);
};

/**
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.depth2 = function() {
  var maxChildDepth = 0;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      var childDepth = this.depth(childBoundable);
      if (childDepth > maxChildDepth)
        maxChildDepth = childDepth;
    }
  }
  return maxChildDepth + 1;
};


/**
 *
 * @param {Object}
 *          bounds
 * @param {Object}
 *          item
 */
jsts.index.strtree.AbstractSTRtree.prototype.insert = function(bounds, item) {
  jsts.util.Assert.isTrue(!this.built, 'Cannot insert items into an STR packed R-tree after it has been built.');
  this.itemBoundables.push(new jsts.index.strtree.ItemBoundable(bounds, item));
};

/**
 * Also builds the tree, if necessary.
 *
 * @param {Object}
 *          searchBounds
 * @param {jsts.index.ItemVisitor}
 *          [visitor].
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @param {Array}
 *          [matches].
 * @return {Array}
 */
jsts.index.strtree.AbstractSTRtree.prototype.query = function(searchBounds) {
  if (arguments.length > 1) {
    this.query2.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }
  var matches = [];
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() === null);
    return matches;
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    this.query3(searchBounds, this.root, matches);
  }
  return matches;
};

jsts.index.strtree.AbstractSTRtree.prototype.query2 = function(searchBounds,
    visitor) {
  if (arguments.length > 2) {
    this.query3.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() === null);
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    this.query4(searchBounds, this.root, visitor);
  }
};

/**
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.query3 = function(searchBounds,
    node, matches) {
  if (!(arguments[2] instanceof Array)) {
    this.query4.apply(this, arguments);
  }

  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      this.query3(searchBounds, childBoundable, matches);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      matches.push(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
};

/**
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.query4 = function(searchBounds,
    node, visitor) {
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      this.query4(searchBounds, childBoundable, visitor);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      visitor.visitItem(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
};

/**
 * @return {jsts.index.strtree.AbstractSTRtree.IntersectOp}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getIntersectsOp = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

// TODO: port rest

/**
 * Gets a tree structure (as a nested list) corresponding to the structure of
 * the items and nodes in this tree.
 * <p>
 * The returned {@link List}s contain either {@link Object} items, or Lists
 * which correspond to subtrees of the tree Subtrees which do not contain any
 * items are not included.
 * <p>
 * Builds the tree if necessary.
 *
 * @return {Array} a List of items and/or Lists.
 */
jsts.index.strtree.AbstractSTRtree.prototype.itemsTree = function() {
  if (arguments.length === 1) {
    return this.itemsTree2.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }

  var valuesTree = this.itemsTree2(this.root);
  if (valuesTree === null)
    return [];
  return valuesTree;
};

jsts.index.strtree.AbstractSTRtree.prototype.itemsTree2 = function(node) {
  var valuesTreeForNode = [];
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      var valuesTreeForChild = this.itemsTree(childBoundable);
      // only add if not null (which indicates an item somewhere in this tree
      if (valuesTreeForChild != null)
        valuesTreeForNode.push(valuesTreeForChild);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      valuesTreeForNode.push(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
  if (valuesTreeForNode.length <= 0)
    return null;
  return valuesTreeForNode;
};

/**
 * Removes an item from the tree. (Builds the tree, if necessary.)
 *
 * @param {Object}
 *          searchBounds
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @param {Object]
 *          item}
 * @return {boolean}
 */
jsts.index.strtree.AbstractSTRtree.prototype.remove = function(searchBounds,
    item) {
  // TODO: argument switch


  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() == null);
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    return this.remove2(searchBounds, this.root, item);
  }
  return false;
};

jsts.index.strtree.AbstractSTRtree.prototype.remove2 = function(searchBounds,
    node, item) {
  // first try removing item from this node
  var found = this.removeItem(node, item);
  if (found)
    return true;

  var childToPrune = null;
  // next try removing item from lower nodes
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      found = this.remove(searchBounds, childBoundable, item);
      // if found, record child for pruning and exit
      if (found) {
        childToPrune = childBoundable;
        break;
      }
    }
  }
  // prune child if possible
  if (childToPrune != null) {
    if (childToPrune.getChildBoundables().length === 0) {
      childBoundables.splice(childBoundables.indexOf(childToPrune), 1);
    }
  }
  return found;
};



/**
 *
 * @param {jsts.index.strtree.AbstractNode}
 *          node
 * @param {Object}
 *          item
 * @return {boolean}
 */
jsts.index.strtree.AbstractSTRtree.prototype.removeItem = function(node, item) {
  var childToRemove = null;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      if (childBoundable.getItem() === item)
        childToRemove = childBoundable;
    }
  }
  if (childToRemove !== null) {
    childBoundables.splice(childBoundables.indexOf(childToRemove), 1);
    return true;
  }
  return false;
};


jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel = function(level) {
  if (arguments.length > 1) {
    this.boundablesAtLevel2.apply(this, arguments);
    return;
  }

  var boundables = [];
  this.boundablesAtLevel2(level, this.root, boundables);
  return boundables;
};

/**
 * @param {number}
 *          level
 * @param {jsts.index.strtree.AbstractNode}
 *          [top].
 * @param {Array}
 *          [boundables].
 * @return {?Array}
 */
jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel2 = function(
    level, top, boundables) {
  jsts.util.Assert.isTrue(level > -2);
  if (top.getLevel() === level) {
    boundables.add(top);
    return;
  }
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var boundable = childBoundables[i];
    if (boundable instanceof jsts.index.strtree.AbstractNode) {
      this.boundablesAtLevel(level, boundable, boundables);
    } else {
      jsts.util.Assert.isTrue(boundable instanceof jsts.index.strtree.ItemBoundable);
      if (level === -1) {
        boundables.add(boundable);
      }
    }
  }
  return;
};


/**
 * @return {Comparator}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getComparator = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};
