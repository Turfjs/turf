/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a node of a {@link Quadtree}. Nodes contain items which have a
 * spatial extent corresponding to the node's position in the quadtree.
 *
 * @param {jsts.geom.Envelope}
 *          env Envelope to initialize from.
 * @param {Number}
 *          level The level.
 *
 * @constructor
 * @requires jsts/index/quadtree/NodeBase.js
 */
jsts.index.quadtree.Node = function(env, level) {
  jsts.index.quadtree.NodeBase.prototype.constructor.apply(this, arguments);

  this.env = env;
  this.level = level;
  this.centre = new jsts.geom.Coordinate();
  this.centre.x = (env.getMinX() + env.getMaxX()) / 2;
  this.centre.y = (env.getMinY() + env.getMaxY()) / 2;
};

jsts.index.quadtree.Node.prototype = new jsts.index.quadtree.NodeBase();


/**
 * Creates a node from specified envelope
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.createNode = function(env) {
  var key, node;
  key = new jsts.index.quadtree.Key(env);
  node = new jsts.index.quadtree.Node(key.getEnvelope(), key.getLevel());

  return node;
};


/**
 * Creates an expanded node.
 *
 * @param {jsts.index.quadtree.Node}
 *          node the node to create a new node from.
 * @param {jsts.geom.Envelope}
 *          addEnv the envelope.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.createExpanded = function(node, addEnv) {
  var expandEnv = new jsts.geom.Envelope(addEnv), largerNode;

  if (node !== null) {
    expandEnv.expandToInclude(node.env);
  }

  largerNode = jsts.index.quadtree.Node.createNode(expandEnv);
  if (node !== null) {
    largerNode.insertNode(node);
  }

  return largerNode;
};


/**
 * Gets the envelope for this node
 *
 * @return {jsts.geom.Envelope} the envelope.
 */
jsts.index.quadtree.Node.prototype.getEnvelope = function() {
  return this.env;
};


/**
 * Checks wheter the provided envelope intersects this nodes envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope to search.
 * @return {Boolean} True if searchEnv intersects this nodes envelope.
 */
jsts.index.quadtree.Node.prototype.isSearchMatch = function(searchEnv) {
  return this.env.intersects(searchEnv);
};


/**
 * Returns the subquad containing the envelope. Creates the subquad if it does
 * not already exist.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the input envelope.
 * @return {jsts.index.quadtree.Node} the node containing the searchEnv.
 */
jsts.index.quadtree.Node.prototype.getNode = function(searchEnv) {
  var subnodeIndex = this.getSubnodeIndex(searchEnv, this.centre), node;

  // if subquadIndex is -1 searchEnv is not contained in a subquad
  if (subnodeIndex !== -1) {
    // create the quad if it does not exist
    node = this.getSubnode(subnodeIndex);
    // recursively search the found/created quad
    return node.getNode(searchEnv);
  } else {
    return this;
  }
};


/**
 * Returns the smallest <i>existing</i> node containing the envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv input Envelope.
 * @return {jsts.index.quadtree.Node} the smallest node containing searchEnv.
 */
jsts.index.quadtree.Node.prototype.find = function(searchEnv) {
  var subnodeIndex = this.getSubnodeIndex(searchEnv, this.centre), node;
  if (subnodeIndex === -1) {
    return this;
  }

  if (this.subnode[subnodeIndex] !== null) {
    // query lies in subquad, so search it
    node = this.subnode[subnodeIndex];
    return node.find(searchEnv);
  }

  // no existing subquad, so return this one anyway
  return this;
};


/**
 * Inserts a child-node
 *
 * @param {jsts.index.quadtree.Node}
 *          node to insert.
 */
jsts.index.quadtree.Node.prototype.insertNode = function(node) {
  var index = this.getSubnodeIndex(node.env, this.centre), childNode;
  if (node.level === this.level - 1) {
    this.subnode[index] = node;
  } else {
    // the quad is not a direct child, so make a new child quad to contain it
    // and recursively insert the quad
    childNode = this.createSubnode(index);
    childNode.insertNode(node);
    this.subnode[index] = childNode;
  }
};


/**
 * get the subquad for the index. If it doesn't exist, create it
 *
 * @param {Number}
 *          index the index of the subnode to get.
 * @return {jsts.index.quadtree.Node} the specified subnode.
 */
jsts.index.quadtree.Node.prototype.getSubnode = function(index) {
  if (this.subnode[index] === null) {
    this.subnode[index] = this.createSubnode(index);
  }
  return this.subnode[index];
};


/**
 * Creates a subnode
 *
 * @param {Number}
 *          index The index (0-4) on where to create a subnode.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.prototype.createSubnode = function(index) {
  var minx = 0.0, maxx = 0.0, miny = 0.0, maxy = 0.0, sqEnv, node;
  // create a new subquad in the appropriate quadrant
  switch (index) {
    case 0:
      minx = this.env.getMinX();
      maxx = this.centre.x;
      miny = this.env.getMinY();
      maxy = this.centre.y;
      break;
    case 1:
      minx = this.centre.x;
      maxx = this.env.getMaxX();
      miny = this.env.getMinY();
      maxy = this.centre.y;
      break;
    case 2:
      minx = this.env.getMinX();
      maxx = this.centre.x;
      miny = this.centre.y;
      maxy = this.env.getMaxY();
      break;
    case 3:
      minx = this.centre.x;
      maxx = this.env.getMaxX();
      miny = this.centre.y;
      maxy = this.env.getMaxY();
      break;
  }

  sqEnv = new jsts.geom.Envelope(minx, maxx, miny, maxy);
  node = new jsts.index.quadtree.Node(sqEnv, this.level - 1);

  return node;
};
