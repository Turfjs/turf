/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/NodeMap.js
 * @requires jsts/geomgraph/NodeFactory.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * The computation of the <code>IntersectionMatrix</code> relies on the use
   * of a structure called a "topology graph". The topology graph contains nodes
   * and edges corresponding to the nodes and line segments of a
   * <code>Geometry</code>. Each node and edge in the graph is labeled with
   * its topological location relative to the source geometry.
   * <P>
   * Note that there is no requirement that points of self-intersection be a
   * vertex. Thus to obtain a correct topology graph, <code>Geometry</code>s
   * must be self-noded before constructing their graphs.
   * <P>
   * Two fundamental operations are supported by topology graphs:
   * <UL>
   * <LI>Computing the intersections between all the edges and nodes of a
   * single graph
   * <LI>Computing the intersections between the edges and nodes of two
   * different graphs
   * </UL>
   *
   * @constructor
   */
  jsts.geomgraph.PlanarGraph = function(nodeFactory) {
    this.edges = new ArrayList();
    this.edgeEndList = new ArrayList();
    this.nodes = new jsts.geomgraph.NodeMap(nodeFactory ||
        new jsts.geomgraph.NodeFactory());
  };


  /**
   * @type {javascript.util.ArrayList}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.edges = null;


  /**
   * @type {jsts.geomgraph.NodeMap}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.nodes = null;
  /**
   * @type {javascript.util.ArrayList}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.edgeEndList = null;

  /**
   * For nodes in the Collection, link the DirectedEdges at the node that are in
   * the result. This allows clients to link only a subset of nodes in the
   * graph, for efficiency (because they know that only a subset is of
   * interest).
   */
  jsts.geomgraph.PlanarGraph.linkResultDirectedEdges = function(nodes) {
    for (var nodeit = nodes.iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().linkResultDirectedEdges();
    }
  };


  jsts.geomgraph.PlanarGraph.prototype.getEdgeIterator = function() {
    return this.edges.iterator();
  };
  jsts.geomgraph.PlanarGraph.prototype.getEdgeEnds = function() {
    return this.edgeEndList;
  };

  jsts.geomgraph.PlanarGraph.prototype.isBoundaryNode = function(geomIndex,
      coord) {
    var node = this.nodes.find(coord);
    if (node === null)
      return false;
    var label = node.getLabel();
    if (label !== null &&
        label.getLocation(geomIndex) === jsts.geom.Location.BOUNDARY)
      return true;
    return false;
  };

  jsts.geomgraph.PlanarGraph.prototype.insertEdge = function(e) {
    this.edges.add(e);
  };

  jsts.geomgraph.PlanarGraph.prototype.add = function(e) {
    this.nodes.add(e);
    this.edgeEndList.add(e);
  };

  /**
   * @return {javascript.util.Iterator}
   */
  jsts.geomgraph.PlanarGraph.prototype.getNodeIterator = function() {
    return this.nodes.iterator();
  };

  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.PlanarGraph.prototype.getNodes = function() {
    return this.nodes.values();
  };

  jsts.geomgraph.PlanarGraph.prototype.addNode = function(node) {
    return this.nodes.addNode(node);
  };

  /**
   * Add a set of edges to the graph. For each edge two DirectedEdges will be
   * created. DirectedEdges are NOT linked by this method.
   *
   * @param {javascript.util.List}
   *          edgedToAdd
   */
  jsts.geomgraph.PlanarGraph.prototype.addEdges = function(edgesToAdd) {
    // create all the nodes for the edges
    for (var it = edgesToAdd.iterator(); it.hasNext();) {
      var e = it.next();
      this.edges.add(e);

      var de1 = new jsts.geomgraph.DirectedEdge(e, true);
      var de2 = new jsts.geomgraph.DirectedEdge(e, false);
      de1.setSym(de2);
      de2.setSym(de1);

      this.add(de1);
      this.add(de2);
    }
  };

  jsts.geomgraph.PlanarGraph.prototype.linkResultDirectedEdges = function() {
    for (var nodeit = this.nodes.iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().linkResultDirectedEdges();
    }
  };

  /**
   * Returns the edge which starts at p0 and whose first segment is parallel to
   * p1
   *
   * @return the edge, if found <code>null</code> if the edge was not found.
   */
  jsts.geomgraph.PlanarGraph.prototype.findEdgeInSameDirection = function(p0,
      p1) {
    var i = 0, il = this.edges.size(), e, eCoord;
    for (i; i < il; i++) {
      e = this.edges.get(i);
      eCoord = e.getCoordinates();

      if (this.matchInSameDirection(p0, p1, eCoord[0], eCoord[1])) {
        return e;
      }

      if (this.matchInSameDirection(p0, p1, eCoord[eCoord.length - 1],
          eCoord[eCoord.length - 2])) {
        return e;
      }
    }
    return null;
  };

  /**
   * The coordinate pairs match if they define line segments lying in the same
   * direction. E.g. the segments are parallel and in the same quadrant (as
   * opposed to parallel and opposite!).
   */
  jsts.geomgraph.PlanarGraph.prototype.matchInSameDirection = function(p0, p1,
      ep0, ep1) {
    if (!p0.equals(ep0)) {
      return false;
    }

    if (jsts.algorithm.CGAlgorithms.computeOrientation(p0, p1, ep1) === jsts.algorithm.CGAlgorithms.COLLINEAR &&
        jsts.geomgraph.Quadrant.quadrant(p0, p1) === jsts.geomgraph.Quadrant
            .quadrant(ep0, ep1)) {
      return true;
    }
    return false;
  };

  /**
   * Returns the EdgeEnd which has edge e as its base edge (MD 18 Feb 2002 -
   * this should return a pair of edges)
   *
   * @return the edge, if found <code>null</code> if the edge was not found.
   */
  jsts.geomgraph.PlanarGraph.prototype.findEdgeEnd = function(e) {
    for (var i = this.getEdgeEnds().iterator(); i.hasNext();) {
      var ee = i.next();
      if (ee.getEdge() === e) {
        return ee;
      }
    }
    return null;
  };
})();

// TODO: port rest of class
