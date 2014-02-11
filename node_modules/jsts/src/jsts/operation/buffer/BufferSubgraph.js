/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A connected subset of the graph of {@link DirectedEdge}s and {@link Node}s.
 * Its edges will generate either
 * <ul>
 * <li> a single polygon in the complete buffer, with zero or more holes, or
 * <li> one or more connected holes
 * </ul>
 *
 *
 * @constructor
 */
jsts.operation.buffer.BufferSubgraph = function() {
  this.dirEdgeList = new javascript.util.ArrayList();
  this.nodes = new javascript.util.ArrayList();

  this.finder = new jsts.operation.buffer.RightmostEdgeFinder();
};

/**
 * @type {RightmostEdgeFinder}
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.finder = null;
/**
 * @type {Array}
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.dirEdgeList = null;
/**
 * @type {Array}
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.nodes = null;
/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.rightMostCoord = null;
/**
 * @type {Envelope}
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.env = null;


jsts.operation.buffer.BufferSubgraph.prototype.getDirectedEdges = function() {
  return this.dirEdgeList;
};
jsts.operation.buffer.BufferSubgraph.prototype.getNodes = function() {
  return this.nodes;
};

/**
 * Computes the envelope of the edges in the subgraph. The envelope is cached
 * after being computed.
 *
 * @return the envelope of the graph.
 */
jsts.operation.buffer.BufferSubgraph.prototype.getEnvelope = function() {
  if (this.env === null) {
    var edgeEnv = new jsts.geom.Envelope();
    for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
      var dirEdge = it.next();
      var pts = dirEdge.getEdge().getCoordinates();
      for (var j = 0; j < pts.length - 1; j++) {
        edgeEnv.expandToInclude(pts[j]);
      }
    }
    this.env = edgeEnv;
  }
  return this.env;
};

/**
 * Gets the rightmost coordinate in the edges of the subgraph
 */
jsts.operation.buffer.BufferSubgraph.prototype.getRightmostCoordinate = function() {
  return this.rightMostCoord;
};

/**
 * Creates the subgraph consisting of all edges reachable from this node. Finds
 * the edges in the graph and the rightmost coordinate.
 *
 * @param node
 *          a node to start the graph traversal from.
 */
jsts.operation.buffer.BufferSubgraph.prototype.create = function(node) {
  this.addReachable(node);
  this.finder.findEdge(this.dirEdgeList);
  this.rightMostCoord = this.finder.getCoordinate();
};

/**
 * Adds all nodes and edges reachable from this node to the subgraph. Uses an
 * explicit stack to avoid a large depth of recursion.
 *
 * @param node
 *          a node known to be in the subgraph.
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.addReachable = function(
    startNode) {
  var nodeStack = [];
  nodeStack.push(startNode);
  while (nodeStack.length !== 0) {
    var node = nodeStack.pop();
    this.add(node, nodeStack);
  }
};

/**
 * Adds the argument node and all its out edges to the subgraph
 *
 * @param node
 *          the node to add.
 * @param nodeStack
 *          the current set of nodes being traversed.
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.add = function(node, nodeStack) {
  node.setVisited(true);
  this.nodes.add(node);
  for (var i = node.getEdges().iterator(); i.hasNext(); ) {
    var de = i.next();
    this.dirEdgeList.add(de);
    var sym = de.getSym();
    var symNode = sym.getNode();
    /**
     * NOTE: this is a depth-first traversal of the graph. This will cause a
     * large depth of recursion. It might be better to do a breadth-first
     * traversal.
     */
    if (!symNode.isVisited())
      nodeStack.push(symNode);
  }
};

jsts.operation.buffer.BufferSubgraph.prototype.clearVisitedEdges = function() {
  for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
    var de = it.next();
    de.setVisited(false);
  }
};

jsts.operation.buffer.BufferSubgraph.prototype.computeDepth = function(
    outsideDepth) {
  this.clearVisitedEdges();
  // find an outside edge to assign depth to
  var de = this.finder.getEdge();
  var n = de.getNode();
  var label = de.getLabel();
  // right side of line returned by finder is on the outside
  de.setEdgeDepths(jsts.geomgraph.Position.RIGHT, outsideDepth);
  this.copySymDepths(de);

  this.computeDepths(de);
};

/**
 * Compute depths for all dirEdges via breadth-first traversal of nodes in graph
 *
 * @param startEdge
 *          edge to start processing with.
 * @private
 */
// <FIX> MD - use iteration & queue rather than recursion, for speed and
// robustness
jsts.operation.buffer.BufferSubgraph.prototype.computeDepths = function(
    startEdge) {
  var nodesVisited = [];
  var nodeQueue = [];

  var startNode = startEdge.getNode();
  nodeQueue.push(startNode);
  nodesVisited.push(startNode);
  startEdge.setVisited(true);

  while (nodeQueue.length !== 0) {
    var n = nodeQueue.shift();
    nodesVisited.push(n);
    // compute depths around node, starting at this edge since it has depths
    // assigned
    this.computeNodeDepth(n);

    // add all adjacent nodes to process queue,
    // unless the node has been visited already
    for (var i = n.getEdges().iterator(); i.hasNext(); ) {
      var de = i.next();
      var sym = de.getSym();
      if (sym.isVisited())
        continue;
      var adjNode = sym.getNode();
      if (nodesVisited.indexOf(adjNode) === -1) {
        nodeQueue.push(adjNode);
        nodesVisited.push(adjNode);
      }
    }
  }
};

/**
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.computeNodeDepth = function(n) {
  // find a visited dirEdge to start at
  var startEdge = null;
  for (var i = n.getEdges().iterator(); i.hasNext(); ) {
    var de = i.next();
    if (de.isVisited() || de.getSym().isVisited()) {
      startEdge = de;
      break;
    }
  }
  // MD - testing Result: breaks algorithm
  // if (startEdge == null) return;

  // only compute string append if assertion would fail
  if (startEdge == null)
    throw new jsts.error.TopologyError(
        'unable to find edge to compute depths at ' + n.getCoordinate());

  n.getEdges().computeDepths(startEdge);

  // copy depths to sym edges
  for (var i = n.getEdges().iterator(); i.hasNext(); ) {
    var de = i.next();
    de.setVisited(true);
    this.copySymDepths(de);
  }
};

/**
 * @private
 */
jsts.operation.buffer.BufferSubgraph.prototype.copySymDepths = function(de) {
  var sym = de.getSym();
  sym.setDepth(jsts.geomgraph.Position.LEFT, de
      .getDepth(jsts.geomgraph.Position.RIGHT));
  sym.setDepth(jsts.geomgraph.Position.RIGHT, de
      .getDepth(jsts.geomgraph.Position.LEFT));
};

/**
 * Find all edges whose depths indicates that they are in the result area(s).
 * Since we want polygon shells to be oriented CW, choose dirEdges with the
 * interior of the result on the RHS. Mark them as being in the result. Interior
 * Area edges are the result of dimensional collapses. They do not form part of
 * the result area boundary.
 */
jsts.operation.buffer.BufferSubgraph.prototype.findResultEdges = function() {
  for (var it = this.dirEdgeList.iterator(); it.hasNext(); ) {
    var de = it.next();
    /**
     * Select edges which have an interior depth on the RHS
     * and an exterior depth on the LHS.
     * Note that because of weird rounding effects there may be
     * edges which have negative depths!  Negative depths
     * count as "outside".
     */
    // <FIX> - handle negative depths
    if (de.getDepth(jsts.geomgraph.Position.RIGHT) >= 1 &&
        de.getDepth(jsts.geomgraph.Position.LEFT) <= 0 &&
        !de.isInteriorAreaEdge()) {
      de.setInResult(true);
    }
  }
};

/**
 * BufferSubgraphs are compared on the x-value of their rightmost Coordinate.
 * This defines a partial ordering on the graphs such that:
 * <p>
 * g1 >= g2 <==> Ring(g2) does not contain Ring(g1)
 * <p>
 * where Polygon(g) is the buffer polygon that is built from g.
 * <p>
 * This relationship is used to sort the BufferSubgraphs so that shells are
 * guaranteed to be built before holes.
 */
jsts.operation.buffer.BufferSubgraph.prototype.compareTo = function(o) {
  var graph = o;
  if (this.rightMostCoord.x < graph.rightMostCoord.x) {
    return -1;
  }
  if (this.rightMostCoord.x > graph.rightMostCoord.x) {
    return 1;
  }
  return 0;
};
