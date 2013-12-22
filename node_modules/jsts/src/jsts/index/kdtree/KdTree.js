/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of
 * the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An implementation of a 2-D KD-Tree. KD-trees provide fast range searching on
 * point data.
 * <p>
 * This implementation supports detecting and snapping points which are closer
 * than a given tolerance value. If the same point (up to tolerance) is inserted
 * more than once a new node is not created but the count of the existing node
 * is incremented.
 *
 * Creates a new instance of a KdTree, specifying a snapping distance tolerance.
 * Points which lie closer than the tolerance to a point already in the tree
 * will be treated as identical to the existing point.
 *
 * @param {Number}
 *          tolerance (optional) the tolerance distance for considering two
 *          points equal.
 *
 * @constructor
 */
jsts.index.kdtree.KdTree = function(tolerance) {
  var tol = 0.0;
  if (tolerance !== undefined) {
    tol = tolerance;
  }

  this.root = null;
  this.last = null;
  this.numberOfNodes = 0;
  this.tolerance = tol;
};


/**
 * Inserts a new point in the kd-tree.
 *
 * Will call correct *insert function depending on arguments
 *
 * @return {jsts.index.kdtree.KdNode} The kd-node containing the point.
 */
jsts.index.kdtree.KdTree.prototype.insert = function() {
  if (arguments.length === 1) {
    return this.insertCoordinate.apply(this, arguments[0]);
  } else {
    return this.insertWithData.apply(this, arguments[0], arguments[1]);
  }
};


/**
 * Inserts a new point in the kd-tree, with no data.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to insert.
 * @return {jsts.index.kdtree.KdNode} the kdnode containing the point.
 */
jsts.index.kdtree.KdTree.prototype.insertCoordinate = function(p) {
  return this.insertWithData(p, null);
};


/**
 * Inserts a new point into the kd-tree.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to insert.
 * @param {Object}
 *          data a data item for the point.
 * @return {jsts.index.kdtree.KdNode} returns a new KdNode if a new point is
 *         inserted, else an existing node is returned with its counter
 *         incremented. This can be checked by testing returnedNode.getCount() >
 *         1.
 */
jsts.index.kdtree.KdTree.prototype.insertWithData = function(p, data) {
  if (this.root === null) {
    this.root = new jsts.index.kdtree.KdNode(p, data);
    return this.root;
  }

  var currentNode = this.root, leafNode = this.root, isOddLevel = true, isLessThan = true;

  // traverse the tree first cutting the plane left-right the top-bottom
  while (currentNode !== last) {
    if (isOddLevel) {
      isLessThan = p.x < currentNode.getX();
    } else {
      isLessThan = p.y < currentNode.getY();
    }
    leafNode = currentNode;
    if (isLessThan) {
      currentNode = currentNode.getLeft();
    } else {
      currentNode = currentNode.getRight();
    }

    // test if point is already a node
    if (currentNode !== null) {
      var isInTolerance = p.distance(currentNode.getCoordinate()) <= this.tolerance;

      // check if point is already in tree (up to tolerance) and if so simply
      // return existing node
      if (isInTolerance) {
        currentNode.increment();
        return currentNode;
      }
    }
    isOddLevel = !isOddLevel;
  }

  // no node found, add new leaf node to tree
  this.numberOfNodes = numberOfNodes + 1;
  var node = new jsts.index.kdtree.KdNode(p, data);
  node.setLeft(this.last);
  node.setRight(this.last);
  if (isLessThan) {
    leafNode.setLeft(node);
  } else {
    leafNode.setRight(node);
  }
  return node;
};


/**
 * Query's the tree
 *
 * @param {jsts.index.kdtree.KdNode}
 *          currentNode the current node.
 * @param {jsts.index.kdtree.KdNode}
 *          bottomNode the bottom node.
 * @param {jsts.geom.Envelope}
 *          queryEnv the query-envelope.
 * @param {Boolean}
 *          odd true if the level is odd.
 * @param {Array}
 *          result the array to fill the result with.
 */
jsts.index.kdtree.KdTree.prototype.queryNode = function(currentNode,
    bottomNode, queryEnv, odd, result) {
  if (currentNode === bottomNode) {
    return;
  }

  var min, max, discriminant;
  if (odd) {
    min = queryEnv.getMinX();
    max = queryEnv.getMaxX();
    discriminant = currentNode.getX();
  } else {
    min = queryEnv.getMinY();
    max = queryEnv.getMaxY();
    discriminant = currentNode.getY();
  }

  var searchLeft = min < discriminant;
  var searchRight = discriminant <= max;

  if (searchLeft) {
    this.queryNode(currentNode.getLeft(), bottomNode, queryEnv, !odd, result);
  }

  if (queryEnv.contains(currentNode.getCoordinate())) {
    result.add(currentNode);
  }

  if (searchRight) {
    this.queryNode(currentNode.getRight(), bottomNode, queryEnv, !odd, result);
  }
};


/**
 * Will call the correct *query-function depending on arguments
 *
 * @return {Array{jsts.index.KdNode}} The found nodes.
 */
jsts.index.kdtree.KdTree.prototype.query = function() {
  if (arguments.length === 1) {
    return this.queryByEnvelope.apply(this, arguments[0]);
  } else {
    return this.queryWithArray.apply(this, arguments[0], arguments[1]);
  }
};


/**
 * Performs a range search of the points in the index.
 *
 * @param {jsts.geom.Envelope}
 *          queryEnv the range rectangle to query.
 * @return {Array} a list of the KdNodes found.
 */
jsts.index.kdtree.KdTree.prototype.queryByEnvelope = function(queryEnv) {
  var result = [];
  this.queryNode(this.root, this.last, queryEnv, true, result);
  return result;
};


/**
 * Performs a range search of the points in the index.
 *
 * @param {jsts.geom.Envelope}
 *          queryEnv the range rectangle to query.
 * @param {Array}
 *          result a list to accumulate the result nodes into.
 */
jsts.index.kdtree.KdTree.prototype.queryWithArray = function(queryEnv, result) {
  this.queryNode(this.root, this.last, queryEnv, true, result);
};
