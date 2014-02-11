/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/PlanarGraph.java
 * Revision: 107
 */

/**
 * @requires jsts/planargraph/NodeMap.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;


  /**
   * Represents a directed graph which is embeddable in a planar surface.
   * <p>
   * This class and the other classes in this package serve as a framework for
   * building planar graphs for specific algorithms. This class must be
   * subclassed to expose appropriate methods to construct the graph. This
   * allows controlling the types of graph components ({@link DirectedEdge}s,
   * {@link Edge}s and {@link Node}s) which can be added to the graph. An
   * application which uses the graph framework will almost always provide
   * subclasses for one or more graph components, which hold
   * application-specific data and graph algorithms.
   *
   * Constructs a empty graph.
   */
  var PlanarGraph = function() {
    this.edges = new javascript.util.HashSet();
    this.dirEdges = new javascript.util.HashSet();
    this.nodeMap = new jsts.planargraph.NodeMap();
  };


  PlanarGraph.prototype.edges = null;
  PlanarGraph.prototype.dirEdges = null;
  PlanarGraph.prototype.nodeMap = null;


  /**
   * Returns the {@link Node} at the given location, or null if no {@link Node}
   * was there.
   *
   * @param pt
   *          the location to query.
   * @return the node found.
   * @return <code>null</code> if this graph contains no node at the location.
   */
  PlanarGraph.prototype.findNode = function(pt) {
    return this.nodeMap.find(pt);
  };

  /**
   * Adds a node to the map, replacing any that is already at that location.
   * Only subclasses can add Nodes, to ensure Nodes are of the right type.
   *
   * @param node
   *          the node to add.
   */
  PlanarGraph.prototype.add = function(node) {
    if (node instanceof jsts.planargraph.Edge) {
      return this.add2(node);
    } else if (node instanceof jsts.planargraph.DirectedEdge) {
      return this.add3(node);
    }

    this.nodeMap.add(node);
  };

  /**
   * Adds the Edge and its DirectedEdges with this PlanarGraph. Assumes that the
   * Edge has already been created with its associated DirectEdges. Only
   * subclasses can add Edges, to ensure the edges added are of the right class.
   */
  PlanarGraph.prototype.add2 = function(edge) {
    this.edges.add(edge);
    this.add(edge.getDirEdge(0));
    this.add(edge.getDirEdge(1));
  };

  /**
   * Adds the Edge to this PlanarGraph; only subclasses can add DirectedEdges,
   * to ensure the edges added are of the right class.
   */
  PlanarGraph.prototype.add3 = function(dirEdge) {
    this.dirEdges.add(dirEdge);
  };

  /**
   * Returns an Iterator over the Nodes in this PlanarGraph.
   */
  PlanarGraph.prototype.nodeIterator = function() {
    return this.nodeMap.iterator();
  };

  /**
   * Returns the Nodes in this PlanarGraph.
   */

  /**
   * Tests whether this graph contains the given {@link Edge}
   *
   * @param e
   *          the edge to query.
   * @return <code>true</code> if the graph contains the edge.
   */
  PlanarGraph.prototype.contains = function(e) {
    if (e instanceof jsts.planargraph.DirectedEdge) {
      return this.contains2(e);
    }

    return this.edges.contains(e);
  };

  /**
   * Tests whether this graph contains the given {@link DirectedEdge}
   *
   * @param de
   *          the directed edge to query.
   * @return <code>true</code> if the graph contains the directed edge.
   */
  PlanarGraph.prototype.contains2 = function(de) {
    return this.dirEdges.contains(de);
  };

  PlanarGraph.prototype.getNodes = function() {
    return this.nodeMap.values();
  };

  /**
   * Returns an Iterator over the DirectedEdges in this PlanarGraph, in the
   * order in which they were added.
   *
   * @see #add(Edge)
   * @see #add(DirectedEdge)
   */
  PlanarGraph.prototype.dirEdgeIterator = function() {
    return this.dirEdges.iterator();
  };
  /**
   * Returns an Iterator over the Edges in this PlanarGraph, in the order in
   * which they were added.
   *
   * @see #add(Edge)
   */
  PlanarGraph.prototype.edgeIterator = function() {
    return this.edges.iterator();
  };

  /**
   * Returns the Edges that have been added to this PlanarGraph
   *
   * @see #add(Edge)
   */
  PlanarGraph.prototype.getEdges = function() {
    return this.edges;
  };

  /**
   * Removes an {@link Edge} and its associated {@link DirectedEdge}s from
   * their from-Nodes and from the graph. Note: This method does not remove the
   * {@link Node}s associated with the {@link Edge}, even if the removal of
   * the {@link Edge} reduces the degree of a {@link Node} to zero.
   */
  PlanarGraph.prototype.remove = function(edge) {
    if (edge instanceof jsts.planargraph.DirectedEdge) {
      return this.remove2(edge);
    }

    this.remove(edge.getDirEdge(0));
    this.remove(edge.getDirEdge(1));
    this.edges.remove(edge);
    this.edge.remove();
  };

  /**
   * Removes a {@link DirectedEdge} from its from-{@link Node} and from this
   * graph. This method does not remove the {@link Node}s associated with the
   * DirectedEdge, even if the removal of the DirectedEdge reduces the degree of
   * a Node to zero.
   */
  PlanarGraph.prototype.remove2 = function(de) {
    if (de instanceof jsts.planargraph.Node) {
      return this.remove3(de);
    }

    var sym = de.getSym();
    if (sym != null)
      sym.setSym(null);

    de.getFromNode().remove(de);
    de.remove();
    this.dirEdges.remove(de);
  };

  /**
   * Removes a node from the graph, along with any associated DirectedEdges and
   * Edges.
   */
  PlanarGraph.prototype.remove3 = function(node) {
    // unhook all directed edges
    var outEdges = node.getOutEdges().getEdges();
    for (var i = outEdges.iterator(); i.hasNext();) {
      var de = i.next();
      var sym = de.getSym();
      // remove the diredge that points to this node
      if (sym != null)
        this.remove(sym);
      // remove this diredge from the graph collection
      this.dirEdges.remove(de);

      var edge = de.getEdge();
      if (edge != null) {
        this.edges.remove(edge);
      }

    }
    // remove the node from the graph
    this.nodeMap.remove(node.getCoordinate());
    node.remove();
  };

  /**
   * Returns all Nodes with the given number of Edges around it.
   */
  PlanarGraph.prototype.findNodesOfDegree = function(degree) {
    var nodesFound = new ArrayList();
    for (var i = this.nodeIterator(); i.hasNext();) {
      var node = i.next();
      if (node.getDegree() == degree)
        nodesFound.add(node);
    }
    return nodesFound;
  };

  jsts.planargraph.PlanarGraph = PlanarGraph;

})();
