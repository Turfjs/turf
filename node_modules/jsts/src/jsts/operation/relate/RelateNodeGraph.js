/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;

  /**
   * Implements the simple graph of Nodes and EdgeEnd which is all that is
   * required to determine topological relationships between Geometries. Also
   * supports building a topological graph of a single Geometry, to allow
   * verification of valid topology.
   * <p>
   * It is <b>not</b> necessary to create a fully linked PlanarGraph to
   * determine relationships, since it is sufficient to know how the Geometries
   * interact locally around the nodes. In fact, this is not even feasible,
   * since it is not possible to compute exact intersection points, and hence
   * the topology around those nodes cannot be computed robustly. The only Nodes
   * that are created are for improper intersections; that is, nodes which occur
   * at existing vertices of the Geometries. Proper intersections (e.g. ones
   * which occur between the interior of line segments) have their topology
   * determined implicitly, without creating a Node object to represent them.
   *
   * @constructor
   */
  jsts.operation.relate.RelateNodeGraph = function() {
    this.nodes = new jsts.geomgraph.NodeMap(
        new jsts.operation.relate.RelateNodeFactory());
  };


  /**
   * @private
   */
  jsts.operation.relate.RelateNodeGraph.prototype.nodes = null;


  jsts.operation.relate.RelateNodeGraph.prototype.build = function(geomGraph) {
    // compute nodes for intersections between previously noded edges
    this.computeIntersectionNodes(geomGraph, 0);
    /**
     * Copy the labelling for the nodes in the parent Geometry. These override
     * any labels determined by intersections.
     */
    this.copyNodesAndLabels(geomGraph, 0);

    /**
     * Build EdgeEnds for all intersections.
     */
    var eeBuilder = new jsts.operation.relate.EdgeEndBuilder();
    var eeList = eeBuilder.computeEdgeEnds(geomGraph.getEdgeIterator());
    this.insertEdgeEnds(eeList);
  };


  /**
   * Insert nodes for all intersections on the edges of a Geometry. Label the
   * created nodes the same as the edge label if they do not already have a
   * label. This allows nodes created by either self-intersections or mutual
   * intersections to be labelled. Endpoint nodes will already be labelled from
   * when they were inserted.
   * <p>
   * Precondition: edge intersections have been computed.
   */
  jsts.operation.relate.RelateNodeGraph.prototype.computeIntersectionNodes = function(geomGraph,
      argIndex) {
    for (var edgeIt = geomGraph.getEdgeIterator(); edgeIt.hasNext();) {
      var e = edgeIt.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        var n = this.nodes.addNode(ei.coord);
        if (eLoc === Location.BOUNDARY)
          n.setLabelBoundary(argIndex);
        else {
          if (n.getLabel().isNull(argIndex))
            n.setLabel(argIndex, Location.INTERIOR);
        }
      }
    }
  };


  /**
   * Copy all nodes from an arg geometry into this graph. The node label in the
   * arg geometry overrides any previously computed label for that argIndex.
   * (E.g. a node may be an intersection node with a computed label of BOUNDARY,
   * but in the original arg Geometry it is actually in the interior due to the
   * Boundary Determination Rule)
   */
  jsts.operation.relate.RelateNodeGraph.prototype.copyNodesAndLabels = function(geomGraph, argIndex) {
    for (var nodeIt = geomGraph.getNodeIterator(); nodeIt.hasNext();) {
      var graphNode = nodeIt.next();
      var newNode = this.nodes.addNode(graphNode.getCoordinate());
      newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    }
  };

  jsts.operation.relate.RelateNodeGraph.prototype.insertEdgeEnds = function(ee) {
    for (var i = ee.iterator(); i.hasNext();) {
      var e = i.next();
      this.nodes.add(e);
    }
  };

  jsts.operation.relate.RelateNodeGraph.prototype.getNodeIterator = function() {
    return this.nodes.iterator();
  };

})();
