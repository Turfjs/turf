/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/algorithm/PointLocator.js
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/EdgeList.js
   * @requires jsts/geomgraph/Label.js
   * @requires jsts/geomgraph/PlanarGraph.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeNodingValidator.js
   * @requires jsts/operation/GeometryGraphOperation.js
   * @requires jsts/operation/overlay/OverlayNodeFactory.js
   * @requires jsts/operation/overlay/PolygonBuilder.js
   * @requires jsts/operation/overlay/LineBuilder.js
   * @requires jsts/operation/overlay/PointBuilder.js
   * @requires jsts/util/Assert.js
   */

  var PointLocator = jsts.algorithm.PointLocator;
  var Location = jsts.geom.Location;
  var EdgeList = jsts.geomgraph.EdgeList;
  var Label = jsts.geomgraph.Label;
  var PlanarGraph = jsts.geomgraph.PlanarGraph;
  var Position = jsts.geomgraph.Position;
  var EdgeNodingValidator = jsts.geomgraph.EdgeNodingValidator;
  var GeometryGraphOperation = jsts.operation.GeometryGraphOperation;
  var OverlayNodeFactory = jsts.operation.overlay.OverlayNodeFactory;
  var PolygonBuilder = jsts.operation.overlay.PolygonBuilder;
  var LineBuilder = jsts.operation.overlay.LineBuilder;
  var PointBuilder = jsts.operation.overlay.PointBuilder;
  var Assert = jsts.util.Assert;
  var ArrayList = javascript.util.ArrayList;

  /**
   * Computes the overlay of two {@link Geometry}s. The overlay can be used to
   * determine any boolean combination of the geometries.
   */
  jsts.operation.overlay.OverlayOp = function(g0, g1) {
    this.ptLocator = new PointLocator();
    this.edgeList = new EdgeList();
    this.resultPolyList = new ArrayList();
    this.resultLineList = new ArrayList();
    this.resultPointList = new ArrayList();

    GeometryGraphOperation.call(this, g0, g1);
    this.graph = new PlanarGraph(new OverlayNodeFactory());
    /**
     * Use factory of primary geometry. Note that this does NOT handle
     * mixed-precision arguments where the second arg has greater precision than
     * the first.
     */
    this.geomFact = g0.getFactory();
  };
  jsts.operation.overlay.OverlayOp.prototype = new GeometryGraphOperation();
  jsts.operation.overlay.OverlayOp.constructor = jsts.operation.overlay.OverlayOp;

  /**
   * The spatial functions supported by this class. These operations implement
   * various boolean combinations of the resultants of the overlay.
   */
  jsts.operation.overlay.OverlayOp.INTERSECTION = 1;
  jsts.operation.overlay.OverlayOp.UNION = 2;
  jsts.operation.overlay.OverlayOp.DIFFERENCE = 3;
  jsts.operation.overlay.OverlayOp.SYMDIFFERENCE = 4;

  jsts.operation.overlay.OverlayOp.overlayOp = function(geom0, geom1, opCode) {
    var gov = new jsts.operation.overlay.OverlayOp(geom0, geom1);
    var geomOv = gov.getResultGeometry(opCode);
    return geomOv;
  }

  jsts.operation.overlay.OverlayOp.isResultOfOp = function(label, opCode) {
    if (arguments.length === 3) {
      return jsts.operation.overlay.OverlayOp.isResultOfOp2.apply(this,
          arguments);
    }
    var loc0 = label.getLocation(0);
    var loc1 = label.getLocation(1);
    return jsts.operation.overlay.OverlayOp.isResultOfOp2(loc0, loc1, opCode);
  }

  /**
   * This method will handle arguments of Location.NONE correctly
   *
   * @return true if the locations correspond to the opCode.
   */
  jsts.operation.overlay.OverlayOp.isResultOfOp2 = function(loc0, loc1, opCode) {
    if (loc0 == Location.BOUNDARY)
      loc0 = Location.INTERIOR;
    if (loc1 == Location.BOUNDARY)
      loc1 = Location.INTERIOR;
    switch (opCode) {
    case jsts.operation.overlay.OverlayOp.INTERSECTION:
      return loc0 == Location.INTERIOR && loc1 == Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.UNION:
      return loc0 == Location.INTERIOR || loc1 == Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.DIFFERENCE:
      return loc0 == Location.INTERIOR && loc1 != Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:
      return (loc0 == Location.INTERIOR && loc1 != Location.INTERIOR) ||
          (loc0 != Location.INTERIOR && loc1 == Location.INTERIOR);
    }
    return false;
  }

  jsts.operation.overlay.OverlayOp.prototype.ptLocator = null;
  jsts.operation.overlay.OverlayOp.prototype.geomFact = null;
  jsts.operation.overlay.OverlayOp.prototype.resultGeom = null;

  jsts.operation.overlay.OverlayOp.prototype.graph = null;
  jsts.operation.overlay.OverlayOp.prototype.edgeList = null;

  jsts.operation.overlay.OverlayOp.prototype.resultPolyList = null;
  jsts.operation.overlay.OverlayOp.prototype.resultLineList = null;
  jsts.operation.overlay.OverlayOp.prototype.resultPointList = null;


  jsts.operation.overlay.OverlayOp.prototype.getResultGeometry = function(
      funcCode) {
    this.computeOverlay(funcCode);
    return this.resultGeom;
  }

  jsts.operation.overlay.OverlayOp.prototype.getGraph = function() {
    return this.graph;
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeOverlay = function(opCode) {
    // copy points from input Geometries.
    // This ensures that any Point geometries
    // in the input are considered for inclusion in the result set
    this.copyPoints(0);
    this.copyPoints(1);

    // node the input Geometries
    this.arg[0].computeSelfNodes(this.li, false);
    this.arg[1].computeSelfNodes(this.li, false);

    // compute intersections between edges of the two input geometries
    this.arg[0].computeEdgeIntersections(this.arg[1], this.li, true);

    var baseSplitEdges = new ArrayList();
    this.arg[0].computeSplitEdges(baseSplitEdges);
    this.arg[1].computeSplitEdges(baseSplitEdges);
    var splitEdges = baseSplitEdges;
    // add the noded edges to this result graph
    this.insertUniqueEdges(baseSplitEdges);

    this.computeLabelsFromDepths();
    this.replaceCollapsedEdges();

    /**
     * Check that the noding completed correctly.
     *
     * This test is slow, but necessary in order to catch robustness failure
     * situations. If an exception is thrown because of a noding failure, then
     * snapping will be performed, which will hopefully avoid the problem. In
     * the future hopefully a faster check can be developed.
     *
     */
    EdgeNodingValidator.checkValid(this.edgeList.getEdges());

    this.graph.addEdges(this.edgeList.getEdges());
    this.computeLabelling();
    this.labelIncompleteNodes();

    /**
     * The ordering of building the result Geometries is important. Areas must
     * be built before lines, which must be built before points. This is so that
     * lines which are covered by areas are not included explicitly, and
     * similarly for points.
     */
    this.findResultAreaEdges(opCode);
    this.cancelDuplicateResultEdges();

    var polyBuilder = new PolygonBuilder(this.geomFact);
    polyBuilder.add(this.graph);
    this.resultPolyList = polyBuilder.getPolygons();

    var lineBuilder = new LineBuilder(this, this.geomFact, this.ptLocator);
    this.resultLineList = lineBuilder.build(opCode);

    var pointBuilder = new PointBuilder(this, this.geomFact, this.ptLocator);
    this.resultPointList = pointBuilder.build(opCode);

    // gather the results from all calculations into a single Geometry for the
    // result set
    this.resultGeom = this.computeGeometry(this.resultPointList,
        this.resultLineList, this.resultPolyList, opCode);
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdges = function(edges) {
    for (var i = edges.iterator(); i.hasNext();) {
      var e = i.next();
      this.insertUniqueEdge(e);
    }
  }
  /**
   * Insert an edge from one of the noded input graphs. Checks edges that are
   * inserted to see if an identical edge already exists. If so, the edge is not
   * inserted, but its label is merged with the existing edge.
   *
   * @protected
   */
  jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdge = function(e) {
    // <FIX> MD 8 Oct 03 speed up identical edge lookup
    // fast lookup
    var existingEdge = this.edgeList.findEqualEdge(e);

    // If an identical edge already exists, simply update its label
    if (existingEdge !== null) {
      var existingLabel = existingEdge.getLabel();

      var labelToMerge = e.getLabel();
      // check if new edge is in reverse direction to existing edge
      // if so, must flip the label before merging it
      if (!existingEdge.isPointwiseEqual(e)) {
        labelToMerge = new Label(e.getLabel());
        labelToMerge.flip();
      }
      var depth = existingEdge.getDepth();
      // if this is the first duplicate found for this edge, initialize the
      // depths
      // /*
      if (depth.isNull()) {
        depth.add(existingLabel);
      }
      // */
      depth.add(labelToMerge);
      existingLabel.merge(labelToMerge);

    } else { // no matching existing edge was found
      // add this new edge to the list of edges in this graph
      // e.setName(name + edges.size());
      // e.getDepth().add(e.getLabel());
      this.edgeList.add(e);
    }
  };


  /**
   * Update the labels for edges according to their depths. For each edge, the
   * depths are first normalized. Then, if the depths for the edge are equal,
   * this edge must have collapsed into a line edge. If the depths are not
   * equal, update the label with the locations corresponding to the depths
   * (i.e. a depth of 0 corresponds to a Location of EXTERIOR, a depth of 1
   * corresponds to INTERIOR)
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeLabelsFromDepths = function() {
    for (var it = this.edgeList.iterator(); it.hasNext();) {
      var e = it.next();
      var lbl = e.getLabel();
      var depth = e.getDepth();
      /**
       * Only check edges for which there were duplicates, since these are the
       * only ones which might be the result of dimensional collapses.
       */
      if (!depth.isNull()) {
        depth.normalize();
        for (var i = 0; i < 2; i++) {
          if (!lbl.isNull(i) && lbl.isArea() && !depth.isNull(i)) {
            /**
             * if the depths are equal, this edge is the result of the
             * dimensional collapse of two or more edges. It has the same
             * location on both sides of the edge, so it has collapsed to a
             * line.
             */
            if (depth.getDelta(i) == 0) {
              lbl.toLine(i);
            } else {
              /**
               * This edge may be the result of a dimensional collapse, but it
               * still has different locations on both sides. The label of the
               * edge must be updated to reflect the resultant side locations
               * indicated by the depth values.
               */
              Assert.isTrue(!depth.isNull(i, Position.LEFT),
                  'depth of LEFT side has not been initialized');
              lbl.setLocation(i, Position.LEFT, depth.getLocation(i,
                  Position.LEFT));
              Assert.isTrue(!depth.isNull(i, Position.RIGHT),
                  'depth of RIGHT side has not been initialized');
              lbl.setLocation(i, Position.RIGHT, depth.getLocation(i,
                  Position.RIGHT));
            }
          }
        }
      }
    }
  }
  /**
   * If edges which have undergone dimensional collapse are found, replace them
   * with a new edge which is a L edge
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.replaceCollapsedEdges = function() {
    var newEdges = new ArrayList();
    for (var it = this.edgeList.iterator(); it.hasNext();) {
      var e = it.next();
      if (e.isCollapsed()) {
        it.remove();
        newEdges.add(e.getCollapsedEdge());
      }
    }
    this.edgeList.addAll(newEdges);
  }
  /**
   * Copy all nodes from an arg geometry into this graph. The node label in the
   * arg geometry overrides any previously computed label for that argIndex.
   * (E.g. a node may be an intersection node with a previously computed label
   * of BOUNDARY, but in the original arg Geometry it is actually in the
   * interior due to the Boundary Determination Rule)
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.copyPoints = function(argIndex) {
    for (var i = this.arg[argIndex].getNodeIterator(); i.hasNext();) {
      var graphNode = i.next();
      var newNode = this.graph.addNode(graphNode.getCoordinate());
      newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    }
  }

  /**
   * Compute initial labelling for all DirectedEdges at each node. In this step,
   * DirectedEdges will acquire a complete labelling (i.e. one with labels for
   * both Geometries) only if they are incident on a node which has edges for
   * both Geometries
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeLabelling = function() {
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().computeLabelling(this.arg);
    }
    this.mergeSymLabels();
    this.updateNodeLabelling();
  }
  /**
   * For nodes which have edges from only one Geometry incident on them, the
   * previous step will have left their dirEdges with no labelling for the other
   * Geometry. However, the sym dirEdge may have a labelling for the other
   * Geometry, so merge the two labels.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.mergeSymLabels = function() {
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().mergeSymLabels();
    }
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.updateNodeLabelling = function() {
    // update the labels for nodes
    // The label for a node is updated from the edges incident on it
    // (Note that a node may have already been labelled
    // because it is a point in one of the input geometries)
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      var lbl = node.getEdges().getLabel();
      node.getLabel().merge(lbl);
    }
  }

  /**
   * Incomplete nodes are nodes whose labels are incomplete. (e.g. the location
   * for one Geometry is null). These are either isolated nodes, or nodes which
   * have edges from only a single Geometry incident on them.
   *
   * Isolated nodes are found because nodes in one graph which don't intersect
   * nodes in the other are not completely labelled by the initial process of
   * adding nodes to the nodeList. To complete the labelling we need to check
   * for nodes that lie in the interior of edges, and in the interior of areas.
   * <p>
   * When each node labelling is completed, the labelling of the incident edges
   * is updated, to complete their labelling as well.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNodes = function() {
    var nodeCount = 0;
    for (var ni = this.graph.getNodes().iterator(); ni.hasNext();) {
      var n = ni.next();
      var label = n.getLabel();
      if (n.isIsolated()) {
        nodeCount++;
        if (label.isNull(0))
          this.labelIncompleteNode(n, 0);
        else
          this.labelIncompleteNode(n, 1);
      }
      // now update the labelling for the DirectedEdges incident on this node
      n.getEdges().updateLabelling(label);
    }
  };

  /**
   * Label an isolated node with its relationship to the target geometry.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNode = function(n,
      targetIndex) {
    var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex]
        .getGeometry());

    // MD - 2008-10-24 - experimental for now
    // int loc = arg[targetIndex].locate(n.getCoordinate());
    n.getLabel().setLocation(targetIndex, loc);
  };

  /**
   * Find all edges whose label indicates that they are in the result area(s),
   * according to the operation being performed. Since we want polygon shells to
   * be oriented CW, choose dirEdges with the interior of the result on the RHS.
   * Mark them as being in the result. Interior Area edges are the result of
   * dimensional collapses. They do not form part of the result area boundary.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.findResultAreaEdges = function(
      opCode) {
    for (var it = this.graph.getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      // mark all dirEdges with the appropriate label
      var label = de.getLabel();
      if (label.isArea() &&
          !de.isInteriorAreaEdge() &&
          jsts.operation.overlay.OverlayOp.isResultOfOp(label.getLocation(0,
              Position.RIGHT), label.getLocation(1, Position.RIGHT), opCode)) {
        de.setInResult(true);
      }
    }
  };
  /**
   * If both a dirEdge and its sym are marked as being in the result, cancel
   * them out.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.cancelDuplicateResultEdges = function() {
    // remove any dirEdges whose sym is also included
    // (they "cancel each other out")
    for (var it = this.graph.getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      var sym = de.getSym();
      if (de.isInResult() && sym.isInResult()) {
        de.setInResult(false);
        sym.setInResult(false);
      }
    }
  };
  /**
   * This method is used to decide if a point node should be included in the
   * result or not.
   *
   * @return {boolean} true if the coord point is covered by a result Line or
   *         Area geometry.
   */
  jsts.operation.overlay.OverlayOp.prototype.isCoveredByLA = function(coord) {
    if (this.isCovered(coord, this.resultLineList))
      return true;
    if (this.isCovered(coord, this.resultPolyList))
      return true;
    return false;
  };
  /**
   * This method is used to decide if an L edge should be included in the result
   * or not.
   *
   * @return true if the coord point is covered by a result Area geometry.
   */
  jsts.operation.overlay.OverlayOp.prototype.isCoveredByA = function(coord) {
    if (this.isCovered(coord, this.resultPolyList))
      return true;
    return false;
  };
  /**
   * @return true if the coord is located in the interior or boundary of a
   *         geometry in the list.
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.isCovered = function(coord,
      geomList) {
    for (var it = geomList.iterator(); it.hasNext();) {
      var geom = it.next();
      var loc = this.ptLocator.locate(coord, geom);
      if (loc != Location.EXTERIOR)
        return true;
    }
    return false;
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeGeometry = function(
      resultPointList, resultLineList, resultPolyList, opcode) {
    var geomList = new ArrayList();
    // element geometries of the result are always in the order P,L,A
    geomList.addAll(resultPointList);
    geomList.addAll(resultLineList);
    geomList.addAll(resultPolyList);

    /*
    if (geomList.isEmpty())
      return createEmptyResult(opcode);
    */

    // build the most specific geometry possible
    return this.geomFact.buildGeometry(geomList);
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.createEmptyResult = function(
      opCode) {
    var result = null;
    switch (resultDimension(opCode, this.arg[0].getGeometry(), this.arg[1]
        .getGeometry())) {
    case -1:
      result = geomFact.createGeometryCollection();
      break;
    case 0:
      result = geomFact.createPoint(null);
      break;
    case 1:
      result = geomFact.createLineString(null);
      break;
    case 2:
      result = geomFact.createPolygon(null, null);
      break;
    }
    return result;
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.resultDimension = function(opCode,
      g0, g1) {
    var dim0 = g0.getDimension();
    var dim1 = g1.getDimension();

    var resultDimension = -1;
    switch (opCode) {
    case jsts.operation.overlay.OverlayOp.INTERSECTION:
      resultDimension = Math.min(dim0, dim1);
      break;
    case jsts.operation.overlay.OverlayOp.UNION:
      resultDimension = Math.max(dim0, dim1);
      break;
    case jsts.operation.overlay.OverlayOp.DIFFERENCE:
      resultDimension = dim0;
      break;
    case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:
      resultDimension = Math.max(dim0, dim1);
      break;
    }
    return resultDimension;
  };

})();
