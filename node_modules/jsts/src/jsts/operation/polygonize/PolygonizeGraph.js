/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeDirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/operation/polygonize/EdgeRing.js
 * @requires jsts/operation/polygonize/PolygonizeEdge.js
 * @requires jsts/operation/polygonize/PolygonizeDirectedEdge.js
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/planargraph/PlanarGraph.js
 * @requires jsts/planargraph/Node.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var Stack = javascript.util.Stack;
  var HashSet = javascript.util.HashSet;
  var Assert = jsts.util.Assert;
  var EdgeRing = jsts.operation.polygonize.EdgeRing;
  var PolygonizeEdge = jsts.operation.polygonize.PolygonizeEdge;
  var PolygonizeDirectedEdge = jsts.operation.polygonize.PolygonizeDirectedEdge;
  var PlanarGraph = jsts.planargraph.PlanarGraph;
  var Node = jsts.planargraph.Node;

  /**
   * Represents a planar graph of edges that can be used to compute a
   * polygonization, and implements the algorithms to compute the
   * {@link EdgeRings} formed by the graph.
   * <p>
   * The marked flag on {@link DirectedEdge}s is used to indicate that a
   * directed edge has be logically deleted from the graph.
   *
   * Create a new polygonization graph.
   */
  var PolygonizeGraph = function(factory) {
    PlanarGraph.apply(this);

    this.factory = factory;
  };

  PolygonizeGraph.prototype = new PlanarGraph();

  /**
   * @private
   */
  PolygonizeGraph.getDegreeNonDeleted = function(node) {
    var edges = node.getOutEdges().getEdges();
    var degree = 0;
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      if (!de.isMarked())
        degree++;
    }
    return degree;
  };

  /**
   * @private
   */
  PolygonizeGraph.getDegree = function(node, label) {
    var edges = node.getOutEdges().getEdges();
    var degree = 0;
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.getLabel() == label)
        degree++;
    }
    return degree;
  };

  /**
   * Deletes all edges at a node
   *
   * @private
   */
  PolygonizeGraph.deleteAllEdges = function(node) {
    var edges = node.getOutEdges().getEdges();
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      de.setMarked(true);
      var sym = de.getSym();
      if (sym != null)
        sym.setMarked(true);
    }
  };


  PolygonizeGraph.prototype.factory = null;


  /**
   * Add a {@link LineString} forming an edge of the polygon graph.
   *
   * @param line
   *          the line to add.
   */
  PolygonizeGraph.prototype.addEdge = function(line) {
    if (line.isEmpty()) {
      return;
    }
    var linePts = jsts.geom.CoordinateArrays.removeRepeatedPoints(line.getCoordinates());

    if (linePts.length < 2) {
      return;
    }

    var startPt = linePts[0];
    var endPt = linePts[linePts.length - 1];

    var nStart = this.getNode(startPt);
    var nEnd = this.getNode(endPt);

    var de0 = new PolygonizeDirectedEdge(nStart, nEnd, linePts[1], true);
    var de1 = new PolygonizeDirectedEdge(nEnd, nStart,
        linePts[linePts.length - 2], false);
    var edge = new PolygonizeEdge(line);
    edge.setDirectedEdges(de0, de1);
    this.add(edge);
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.getNode = function(pt) {
    var node = this.findNode(pt);
    if (node == null) {
      node = new Node(pt);
      // ensure node is only added once to graph
      this.add(node);
    }
    return node;
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.computeNextCWEdges = function() {
    // set the next pointers for the edges around each node
    for (var iNode = this.nodeIterator(); iNode.hasNext();) {
      var node = iNode.next();
      PolygonizeGraph.computeNextCWEdges(node);
    }
  };

  /**
   * Convert the maximal edge rings found by the initial graph traversal into
   * the minimal edge rings required by JTS polygon topology rules.
   *
   * @param ringEdges
   *          the list of start edges for the edgeRings to convert.
   * @private
   */
  PolygonizeGraph.prototype.convertMaximalToMinimalEdgeRings = function(
      ringEdges) {
    for (var i = ringEdges.iterator(); i.hasNext();) {
      var de = i.next();
      var label = de.getLabel();
      var intNodes = PolygonizeGraph.findIntersectionNodes(de, label);

      if (intNodes == null)
        continue;
      // flip the next pointers on the intersection nodes to create minimal edge
      // rings
      for (var iNode = intNodes.iterator(); iNode.hasNext();) {
        var node = iNode.next();
        PolygonizeGraph.computeNextCCWEdges(node, label);
      }
    }
  };

  /**
   * Finds all nodes in a maximal edgering which are self-intersection nodes
   *
   * @param startDE
   * @param label
   * @return the list of intersection nodes found, or <code>null</code> if no
   *         intersection nodes were found.
   * @private
   */
  PolygonizeGraph.findIntersectionNodes = function(startDE, label) {
    var de = startDE;
    var intNodes = null;
    do {
      var node = de.getFromNode();
      if (PolygonizeGraph.getDegree(node, label) > 1) {
        if (intNodes == null)
          intNodes = new ArrayList();
        intNodes.add(node);
      }

      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return intNodes;
  };

  /**
   * Computes the minimal EdgeRings formed by the edges in this graph.
   *
   * @return a list of the {@link EdgeRing} s found by the polygonization
   *         process.
   *
   */
  PolygonizeGraph.prototype.getEdgeRings = function() {
    // maybe could optimize this, since most of these pointers should be set
    // correctly already
    // by deleteCutEdges()
    this.computeNextCWEdges();
    // clear labels of all edges in graph
    PolygonizeGraph.label(this.dirEdges, -1);
    var maximalRings = PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);
    this.convertMaximalToMinimalEdgeRings(maximalRings);

    // find all edgerings (which will now be minimal ones, as required)
    var edgeRingList = new ArrayList();
    for (var i = this.dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;
      if (de.isInRing())
        continue;

      var er = this.findEdgeRing(de);
      edgeRingList.add(er);
    }
    return edgeRingList;
  };

  /**
   * Finds and labels all edgerings in the graph. The edge rings are labelling
   * with unique integers. The labelling allows detecting cut edges.
   *
   * @param dirEdges
   *          a List of the DirectedEdges in the graph.
   * @return a List of DirectedEdges, one for each edge ring found.
   * @private
   */
  PolygonizeGraph.findLabeledEdgeRings = function(dirEdges) {
    var edgeRingStarts = new ArrayList();
    // label the edge rings formed
    var currLabel = 1;
    for (var i = dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;
      if (de.getLabel() >= 0)
        continue;

      edgeRingStarts.add(de);
      var edges = PolygonizeGraph.findDirEdgesInRing(de);

      PolygonizeGraph.label(edges, currLabel);
      currLabel++;
    }
    return edgeRingStarts;
  };

  /**
   * Finds and removes all cut edges from the graph.
   *
   * @return a list of the {@link LineString} s forming the removed cut edges.
   */
  PolygonizeGraph.prototype.deleteCutEdges = function() {
    this.computeNextCWEdges();
    // label the current set of edgerings
    PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);

    /**
     * Cut Edges are edges where both dirEdges have the same label. Delete them,
     * and record them
     */
    var cutLines = new ArrayList();
    for (var i = this.dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;

      var sym = de.getSym();

      if (de.getLabel() == sym.getLabel()) {
        de.setMarked(true);
        sym.setMarked(true);

        // save the line as a cut edge
        var e = de.getEdge();
        cutLines.add(e.getLine());
      }
    }
    return cutLines;
  };

  /**
   * @private
   */
  PolygonizeGraph.label = function(dirEdges, label) {
    for (var i = dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      de.setLabel(label);
    }
  };

  /**
   * @private
   */
  PolygonizeGraph.computeNextCWEdges = function(node) {
    var deStar = node.getOutEdges();
    var startDE = null;
    var prevDE = null;

    // the edges are stored in CCW order around the star
    for (var i = deStar.getEdges().iterator(); i.hasNext();) {
      var outDE = i.next();
      if (outDE.isMarked())
        continue;

      if (startDE == null)
        startDE = outDE;
      if (prevDE != null) {
        var sym = prevDE.getSym();
        sym.setNext(outDE);
      }
      prevDE = outDE;
    }
    if (prevDE != null) {
      var sym = prevDE.getSym();
      sym.setNext(startDE);
    }
  };

  /**
   * Computes the next edge pointers going CCW around the given node, for the
   * given edgering label. This algorithm has the effect of converting maximal
   * edgerings into minimal edgerings
   *
   * @private
   *
   */
  PolygonizeGraph.computeNextCCWEdges = function(node, label) {
    var deStar = node.getOutEdges();
    // PolyDirectedEdge lastInDE = null;
    var firstOutDE = null;
    var prevInDE = null;

    // the edges are stored in CCW order around the star
    var edges = deStar.getEdges();
    // for (Iterator i = deStar.getEdges().iterator(); i.hasNext(); ) {
    for (var i = edges.size() - 1; i >= 0; i--) {
      var de = edges.get(i);
      var sym = de.getSym();

      var outDE = null;
      if (de.getLabel() == label)
        outDE = de;
      var inDE = null;
      if (sym.getLabel() == label)
        inDE = sym;

      if (outDE == null && inDE == null)
        continue; // this edge is not in edgering

      if (inDE != null) {
        prevInDE = inDE;
      }

      if (outDE != null) {
        if (prevInDE != null) {
          prevInDE.setNext(outDE);
          prevInDE = null;
        }
        if (firstOutDE == null)
          firstOutDE = outDE;
      }
    }
    if (prevInDE != null) {
      Assert.isTrue(firstOutDE != null);
      prevInDE.setNext(firstOutDE);
    }
  };

  /**
   * Traverses a ring of DirectedEdges, accumulating them into a list. This
   * assumes that all dangling directed edges have been removed from the graph,
   * so that there is always a next dirEdge.
   *
   * @param startDE
   *          the DirectedEdge to start traversing at.
   * @return a List of DirectedEdges that form a ring.
   * @private
   */
  PolygonizeGraph.findDirEdgesInRing = function(startDE) {
    var de = startDE;
    var edges = new ArrayList();
    do {
      edges.add(de);
      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return edges;
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.findEdgeRing = function(startDE) {
    var de = startDE;
    var er = new EdgeRing(this.factory);
    do {
      er.add(de);
      de.setRing(er);
      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return er;
  };

  /**
   * Marks all edges from the graph which are "dangles". Dangles are which are
   * incident on a node with degree 1. This process is recursive, since removing
   * a dangling edge may result in another edge becoming a dangle. In order to
   * handle large recursion depths efficiently, an explicit recursion stack is
   * used
   *
   * @return a List containing the {@link LineStrings} that formed dangles.
   */
  PolygonizeGraph.prototype.deleteDangles = function() {
    var nodesToRemove = this.findNodesOfDegree(1);
    var dangleLines = new HashSet();

    var nodeStack = new Stack();
    for (var i = nodesToRemove.iterator(); i.hasNext();) {
      nodeStack.push(i.next());
    }

    while (!nodeStack.isEmpty()) {
      var node = nodeStack.pop();

      PolygonizeGraph.deleteAllEdges(node);
      var nodeOutEdges = node.getOutEdges().getEdges();
      for (var i = nodeOutEdges.iterator(); i.hasNext();) {
        var de = i.next();
        // delete this edge and its sym
        de.setMarked(true);
        var sym = de.getSym();
        if (sym != null)
          sym.setMarked(true);

        // save the line as a dangle
        var e = de.getEdge();
        dangleLines.add(e.getLine());

        var toNode = de.getToNode();
        // add the toNode to the list to be processed, if it is now a dangle
        if (PolygonizeGraph.getDegreeNonDeleted(toNode) == 1)
          nodeStack.push(toNode);
      }
    }
    return dangleLines;
  };

  /**
   * Traverses the polygonized edge rings in the graph and computes the depth
   * parity (odd or even) relative to the exterior of the graph. If the client
   * has requested that the output be polygonally valid, only odd polygons will
   * be constructed.
   *
   */
  PolygonizeGraph.prototype.computeDepthParity = function() {
    while (true) {
      var de = null;
      if (de == null)
        return;
      this.computeDepthParity(de);
    }
  };

  /**
   * Traverses all connected edges, computing the depth parity of the associated
   * polygons.
   *
   * @param de
   * @private
   */
  PolygonizeGraph.prototype.computeDepthParity = function(de) {

  };

  jsts.operation.polygonize.PolygonizeGraph = PolygonizeGraph;

})();
