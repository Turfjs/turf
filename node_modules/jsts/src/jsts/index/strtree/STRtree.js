/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 *  A query-only R-tree created using the Sort-Tile-Recursive (STR) algorithm.
 *  For two-dimensional spatial data.
 * <P>
 *  The STR packed R-tree is simple to implement and maximizes space
 *  utilization; that is, as many leaves as possible are filled to capacity.
 *  Overlap between nodes is far less than in a basic R-tree. However, once the
 *  tree has been built (explicitly or on the first call to #query), items may
 *  not be added or removed.
 * <P>
 * Described in: P. Rigaux, Michel Scholl and Agnes Voisard.
 * <i>Spatial Databases With Application To GIS</i>.
 * Morgan Kaufmann, San Francisco, 2002.
 *
 * @requires jsts/index/SpatialIndex.js
 * @requires jsts/index/strtree/STRtree.js
 * @requires jsts/index/strtree/AbstractSTRtree.js
 */



/**
 * Constructs an STRtree with the default node capacity or with the given
 * maximum number of child nodes that a node may have.
 * <p>
 * The minimum recommended capacity setting is 4.
 *
 *
 * @param {number}
 *          [nodeCapacity].
 * @extends {jsts.index.strtree.AbstractSTRtree}
 * @extends {jsts.index.SpatialIndex}
 * @constructor
 */
jsts.index.strtree.STRtree = function(nodeCapacity) {
  nodeCapacity = nodeCapacity ||
      jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY;
  jsts.index.strtree.AbstractSTRtree.call(this, nodeCapacity);
};

jsts.index.strtree.STRtree.prototype = new jsts.index.strtree.AbstractSTRtree();
jsts.index.strtree.STRtree.constructor = jsts.index.strtree.STRtree;

/**
 * @type {Object} implements function for comparison
 * @private
 */
jsts.index.strtree.STRtree.prototype.xComparator = function(o1, o2) {
  return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(
      jsts.index.strtree.STRtree.prototype.centreX(o1.getBounds()),
      jsts.index.strtree.STRtree.prototype.centreX(o2.getBounds()));
};


/**
 * @type {Object} implements function for comparison
 * @private
 */
jsts.index.strtree.STRtree.prototype.yComparator = function(o1, o2) {
  return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(
      jsts.index.strtree.STRtree.prototype.centreY(o1.getBounds()),
      jsts.index.strtree.STRtree.prototype.centreY(o2.getBounds()));
};


/**
 * @param {jsts.geom.Envelope}
 *          e
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.centreX = function(e) {
  return jsts.index.strtree.STRtree.prototype.avg(e.getMinX(), e.getMaxX());
};


/**
 * @param {jsts.geom.Envelope}
 *          e
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.centreY = function(e) {
  return jsts.index.strtree.STRtree.prototype.avg(e.getMinY(), e.getMaxY());
};


/**
 * @param {number}
 *          a
 * @param {number}
 *          b
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.avg = function(a, b) {
  return (a + b) / 2.0;
};


/**
 * @type {Object}
 * @extends {jsts.index.strtree.AbstractSTRtree.IntersectsOp}
 * @private
 */
jsts.index.strtree.STRtree.prototype.intersectsOp = {
  intersects: function(aBounds, bBounds) {
    return aBounds.intersects(bBounds);
  }
};


/**
 * Creates the parent level for the given child level. First, orders the items
 * by the x-values of the midpoints, and groups them into vertical slices. For
 * each slice, orders the items by the y-values of the midpoints, and group them
 * into runs of size M (the node capacity). For each run, creates a new (parent)
 * node.
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          newLevel
 * @return {Array}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createParentBoundables = function(
    childBoundables, newLevel) {
  jsts.util.Assert.isTrue(!(childBoundables.length === 0));
  var minLeafCount = Math.ceil(childBoundables.length / this.getNodeCapacity());
  var sortedChildBoundables = [];
  for (var i = 0; i < childBoundables.length; i++) {
    sortedChildBoundables.push(childBoundables[i]);
  }
  sortedChildBoundables.sort(this.xComparator);
  var verticalSlices = this.verticalSlices(sortedChildBoundables, Math
      .ceil(Math.sqrt(minLeafCount)));
  return this
      .createParentBoundablesFromVerticalSlices(verticalSlices, newLevel);
};


/**
 *
 * @param {Array.
 *          <Array>} verticalSlices
 * @param {number}
 *          newLevel
 * @return {Array.<Array>}
 * @private
 */
jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlices = function(
    verticalSlices, newLevel) {
  jsts.util.Assert.isTrue(verticalSlices.length > 0);
  var parentBoundables = [];
  for (var i = 0; i < verticalSlices.length; i++) {
    parentBoundables = parentBoundables.concat(this.createParentBoundablesFromVerticalSlice(
        verticalSlices[i], newLevel));
  }
  return parentBoundables;
};


/**
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          newLevel
 * @return {Array}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlice = function(
    childBoundables, newLevel) {
  return jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables
      .call(this, childBoundables, newLevel);
};


/**
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          sliceCount
 * @return {Array.<Array>}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.verticalSlices = function(childBoundables,
    sliceCount) {
  var sliceCapacity = Math.ceil(childBoundables.length / sliceCount);
  var slices = [];

  var i = 0, boundablesAddedToSlice, childBoundable;

  for (var j = 0; j < sliceCount; j++) {
    slices[j] = [];
    boundablesAddedToSlice = 0;
    while (i < childBoundables.length && boundablesAddedToSlice < sliceCapacity) {
      childBoundable = childBoundables[i++];
      slices[j].push(childBoundable);
      boundablesAddedToSlice++;
    }
  }

  return slices;
};


/**
 * @type {number}
 * @const
 * @private
 */
jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY = 10;


/**
 * @param {number}
 *          level
 * @return {jsts.index.strtree.AbstractNode}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createNode = function(level) {
  var abstractNode = new jsts.index.strtree.AbstractNode(level);

  abstractNode.computeBounds = function() {
    var bounds = null;
    var childBoundables = this.getChildBoundables();
    for (var i = 0; i < childBoundables.length; i++) {
      var childBoundable = childBoundables[i];
      if (bounds === null) {
        bounds = new jsts.geom.Envelope(childBoundable.getBounds());
      } else {
        bounds.expandToInclude(childBoundable.getBounds());
      }
    }
    return bounds;
  };

  return abstractNode;
};


/**
 * @return {jsts.index.strtree.AbstractSTRtree.IntersectsOp}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.getIntersectsOp = function() {
  return this.intersectsOp;
};


/**
 * Inserts an item having the given bounds into the tree.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv
 * @param {Object}
 *          item
 * @public
 */
jsts.index.strtree.STRtree.prototype.insert = function(itemEnv, item) {
  if (itemEnv.isNull()) {
    return;
  }
  jsts.index.strtree.AbstractSTRtree.prototype.insert.call(this, itemEnv, item);
};


/**
 * Returns items whose bounds intersect the given envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv
 * @param {jsts.index.ItemVisitor}
 *          visitor
 * @return {?Array}
 * @public
 */
jsts.index.strtree.STRtree.prototype.query = function(searchEnv, visitor) {
  // Yes this method does something. It specifies that the bounds is an
  // Envelope. super.query takes an Object, not an Envelope. [Jon Aquino
  // 10/24/2003]
  return jsts.index.strtree.AbstractSTRtree.prototype.query.apply(this,
      arguments);
};


/**
 * Removes a single item from the tree.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the Envelope of the item to remove.
 * @param {Object}
 *          item the item to remove.
 * @return {boolean} <code>true</code> if the item was found.
 * @public
 */
jsts.index.strtree.STRtree.prototype.remove = function(itemEnv, item) {
  return jsts.index.strtree.AbstractSTRtree.prototype.remove.call(this,
      itemEnv, item);
};


/**
 * Returns the number of items in the tree.
 *
 * @return {number} the number of items in the tree.
 * @public
 */
jsts.index.strtree.STRtree.prototype.size = function() {
  return jsts.index.strtree.AbstractSTRtree.prototype.size.call(this);
};


/**
 * Returns the number of items in the tree.
 *
 * @return {number} the number of items in the tree.
 * @public
 */
jsts.index.strtree.STRtree.prototype.depth = function() {
  return jsts.index.strtree.AbstractSTRtree.prototype.depth.call(this);
};


/**
 * @return {Object}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.getComparator = function() {
  return this.yComparator;
};

/**
 * Finds the two nearest items in the tree, using {@link ItemDistance} as the
 * distance metric. A Branch-and-Bound tree traversal algorithm is used to
 * provide an efficient search.
 *
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in this tree.
 * @return {Array.<Object>} the pair of the nearest items.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour = function(itemDist) {
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), this.getRoot(),
      itemDist);
  return this.nearestNeighbour4(bp);
};

/**
 * Finds the nearest item to the given object in this tree, using
 * {@link ItemDistance} as the distance metric. A Branch-and-Bound tree
 * traversal algorithm is used to provide an efficient search.
 *
 * @param {Envelope}
 *          env the envelope of the query item.
 * @param {Object}
 *          item the item to find the nearest neighbour of.
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in this tree and
 *          the query item.
 * @return {Array.<Object>} the nearest item in this tree.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour2 = function(env, item,
    itemDist) {
  var bnd = new jsts.index.strtree.ItemBoundable(env, item);
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), bnd, itemDist);
  return this.nearestNeighbour4(bp)[0];
};

/**
 * Finds the two nearest items from this tree and another tree, using
 * {@link ItemDistance} as the distance metric. A Branch-and-Bound tree
 * traversal algorithm is used to provide an efficient search. The result value
 * is a pair of items, the first from this tree and the second from the argument
 * tree.
 *
 * @param {STRtree}
 *          tree another tree.
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in the trees.
 * @return {Array.<Object>} the pair of the nearest items, one from each tree.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour3 = function(tree,
    itemDist) {
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), tree.getRoot(),
      itemDist);
  return this.nearestNeighbour4(bp);
};

jsts.index.strtree.STRtree.prototype.nearestNeighbour4 = function(initBndPair) {
  return this.nearestNeighbour5(initBndPair, Double.POSITIVE_INFINITY);
};

/**
 * NOTE: PriorityQueue replaces by js array
 *
 * @param initBndPair
 * @param maxDistance
 * @return {Array}
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour5 = function(initBndPair,
    maxDistance) {
  var distanceLowerBound = maxDistance;
  var minPair = null;

  // initialize internal structures
  var priQ = [];

  // initialize queue
  priQ.push(initBndPair);

  while (!priQ.isEmpty() && distanceLowerBound > 0.0) {
    // pop head of queue and expand one side of pair
    var bndPair = priQ.pop();
    var currentDistance = bndPair.getDistance();

    /**
     * If the distance for the first node in the queue is >= the current minimum
     * distance, all other nodes in the queue must also have a greater distance.
     * So the current minDistance must be the true minimum, and we are done.
     */
    if (currentDistance >= distanceLowerBound)
      break;

    /**
     * If the pair members are leaves then their distance is the exact lower
     * bound. Update the distanceLowerBound to reflect this (which must be
     * smaller, due to the test immediately prior to this).
     */
    if (bndPair.isLeaves()) {
      // assert: currentDistance < minimumDistanceFound
      distanceLowerBound = currentDistance;
      minPair = bndPair;
    } else {
      /**
       * Otherwise, expand one side of the pair, (the choice of which side to
       * expand is heuristically determined) and insert the new expanded pairs
       * into the queue
       */
      bndPair.expandToQueue(priQ, distanceLowerBound);
    }
  }
  // done - return items with min distance
  return [minPair.getBoundable(0).getItem(), minPair.getBoundable(1).getItem()];
};
