/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/Node.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 * @requires jsts/planargraph/DirectedEdgeStar.js
 */

(function() {

  var GraphComponent = jsts.planargraph.GraphComponent;
  var DirectedEdgeStar = jsts.planargraph.DirectedEdgeStar;

  /**
   * A node in a {@link PlanarGraph}is a location where 0 or more {@link Edge}s
   * meet. A node is connected to each of its incident Edges via an outgoing
   * DirectedEdge. Some clients using a <code>PlanarGraph</code> may want to
   * subclass <code>Node</code> to add their own application-specific data and
   * methods.
   *
   * Constructs a Node with the given location and collection of outgoing
   * DirectedEdges.
   */
  var Node = function(pt, deStar) {
    this.pt = pt;
    this.deStar = deStar || new DirectedEdgeStar();
  };


  Node.prototype = new GraphComponent();


  /**
   * Returns all Edges that connect the two nodes (which are assumed to be
   * different).
   */
  Node.getEdgesBetween = function(node0, node1) {
    var edges0 = DirectedEdge.toEdges(node0.getOutEdges().getEdges());
    var commonEdges = new javascript.util.HashSet(edges0);
    var edges1 = DirectedEdge.toEdges(node1.getOutEdges().getEdges());
    commonEdges.retainAll(edges1);
    return commonEdges;
  };

  /** The location of this Node */
  Node.prototype.pt = null;

  /** The collection of DirectedEdges that leave this Node */
  Node.prototype.deStar = null;

  /**
   * Returns the location of this Node.
   */
  Node.prototype.getCoordinate = function() {
    return this.pt;
  };

  /**
   * Adds an outgoing DirectedEdge to this Node.
   */
  Node.prototype.addOutEdge = function(de) {
    this.deStar.add(de);
  };

  /**
   * Returns the collection of DirectedEdges that leave this Node.
   */
  Node.prototype.getOutEdges = function() {
    return this.deStar;
  };

  /**
   * Returns the number of edges around this Node.
   */
  Node.prototype.getDegree = function() {
    return this.deStar.getDegree();
  };

  /**
   * Returns the zero-based index of the given Edge, after sorting in ascending
   * order by angle with the positive x-axis.
   */
  Node.prototype.getIndex = function(edge) {
    return this.deStar.getIndex(edge);
  };

  /**
   * Removes a {@link DirectedEdge} incident on this node. Does not change the
   * state of the directed edge.
   */
  Node.prototype.remove = function(de) {
    if (de === undefined) {
      return this.remove2();
    }

    this.deStar.remove(de);
  };

  /**
   * Removes this node from its containing graph.
   */
  Node.prototype.remove2 = function() {
    this.pt = null;
  };


  /**
   * Tests whether this node has been removed from its containing graph
   *
   * @return <code>true</code> if this node is removed.
   */
  Node.prototype.isRemoved = function() {
    return this.pt == null;
  };

  jsts.planargraph.Node = Node;

})();
