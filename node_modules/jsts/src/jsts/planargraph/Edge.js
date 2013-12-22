/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/Edge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 */

(function() {

  var GraphComponent = jsts.planargraph.GraphComponent;

  /**
   * Represents an undirected edge of a {@link PlanarGraph}. An undirected edge
   * in fact simply acts as a central point of reference for two opposite
   * {@link DirectedEdge}s.
   * <p>
   * Usually a client using a <code>PlanarGraph</code> will subclass
   * <code>Edge</code> to add its own application-specific data and methods.
   *
   * Constructs an Edge initialized with the given DirectedEdges, and for each
   * DirectedEdge: sets the Edge, sets the symmetric DirectedEdge, and adds this
   * Edge to its from-Node.
   */
  var Edge = function(de0, de1) {
    if (de0 === undefined) {
      return;
    }
    this.setDirectedEdges(de0, de1);
  };

  Edge.prototype = new GraphComponent();


  /**
   * The two DirectedEdges associated with this Edge. Index 0 is forward, 1 is
   * reverse.
   */
  Edge.prototype.dirEdge = null;

  /**
   * Initializes this Edge's two DirectedEdges, and for each DirectedEdge: sets
   * the Edge, sets the symmetric DirectedEdge, and adds this Edge to its
   * from-Node.
   */
  Edge.prototype.setDirectedEdges = function(de0, de1) {
    this.dirEdge = [de0, de1];
    de0.setEdge(this);
    de1.setEdge(this);
    de0.setSym(de1);
    de1.setSym(de0);
    de0.getFromNode().addOutEdge(de0);
    de1.getFromNode().addOutEdge(de1);
  };

  /**
   * Returns one of the DirectedEdges associated with this Edge.
   *
   * @param i
   *          0 or 1. 0 returns the forward directed edge, 1 returns the reverse.
   */
  Edge.prototype.getDirEdge = function(i) {
    if (i instanceof jsts.planargraph.Node) {
      this.getDirEdge2(i);
    }

    return this.dirEdge[i];
  };

  /**
   * Returns the {@link DirectedEdge} that starts from the given node, or null
   * if the node is not one of the two nodes associated with this Edge.
   */
  Edge.prototype.getDirEdge2 = function(fromNode) {
    if (this.dirEdge[0].getFromNode() == fromNode)
      return this.dirEdge[0];
    if (this.dirEdge[1].getFromNode() == fromNode)
      return this.dirEdge[1];
    // node not found
    // possibly should throw an exception here?
    return null;
  };

  /**
   * If <code>node</code> is one of the two nodes associated with this Edge,
   * returns the other node; otherwise returns null.
   */
  Edge.prototype.getOppositeNode = function(node) {
    if (this.dirEdge[0].getFromNode() == node)
      return this.dirEdge[0].getToNode();
    if (this.dirEdge[1].getFromNode() == node)
      return this.dirEdge[1].getToNode();
    // node not found
    // possibly should throw an exception here?
    return null;
  };

  /**
   * Removes this edge from its containing graph.
   */
  Edge.prototype.remove = function() {
    this.dirEdge = null;
  };

  /**
   * Tests whether this edge has been removed from its containing graph
   *
   * @return <code>true</code> if this edge is removed.
   */
  Edge.prototype.isRemoved = function() {
    return dirEdge == null;
  };

  jsts.planargraph.Edge = Edge;

})();
