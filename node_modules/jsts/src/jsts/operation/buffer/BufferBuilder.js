/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Builds the buffer geometry for a given input geometry and precision model.
 * Allows setting the level of approximation for circular arcs, and the
 * precision model in which to carry out the computation.
 * <p>
 * When computing buffers in floating point double-precision it can happen that
 * the process of iterated noding can fail to converge (terminate). In this case
 * a TopologyException will be thrown. Retrying the computation in a fixed
 * precision can produce more robust results.
 *
 * @param {jsts.operation.buffer.BufferBuilder.BufferParameters}
 *          bufParams
 * @constructor
 */
jsts.operation.buffer.BufferBuilder = function(bufParams) {
  this.bufParams = bufParams;

  this.edgeList = new jsts.geomgraph.EdgeList();
};


/**
 * Compute the change in depth as an edge is crossed from R to L
 *
 * @param {Label}
 *          label
 * @return {Number}
 */
jsts.operation.buffer.BufferBuilder.depthDelta = function(label) {
  var lLoc = label.getLocation(0, jsts.geomgraph.Position.LEFT);
  var rLoc = label.getLocation(0, jsts.geomgraph.Position.RIGHT);
  if (lLoc === jsts.geom.Location.INTERIOR &&
      rLoc === jsts.geom.Location.EXTERIOR)
    return 1;
  else if (lLoc === jsts.geom.Location.EXTERIOR &&
      rLoc === jsts.geom.Location.INTERIOR)
    return -1;
  return 0;
};


/**
 * @type {BufferParameters}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.bufParams = null;


/**
 * @type {PrecisionModel}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.workingPrecisionModel = null;


/**
 * @type {Noder}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.workingNoder = null;


/**
 * @type {GeometryFactory}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.geomFact = null;


/**
 * @type {PlanarGraph}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.graph = null;


/**
 * @type {EdgeList}
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.edgeList = null;


/**
 * Sets the precision model to use during the curve computation and noding, if
 * it is different to the precision model of the Geometry. If the precision
 * model is less than the precision of the Geometry precision model, the
 * Geometry must have previously been rounded to that precision.
 *
 * @param pm
 *          the precision model to use.
 */
jsts.operation.buffer.BufferBuilder.prototype.setWorkingPrecisionModel = function(
    pm) {
  this.workingPrecisionModel = pm;
};


/**
 * Sets the {@link Noder} to use during noding. This allows choosing fast but
 * non-robust noding, or slower but robust noding.
 *
 * @param noder
 *          the noder to use.
 */
jsts.operation.buffer.BufferBuilder.prototype.setNoder = function(noder) {
  this.workingNoder = noder;
};

jsts.operation.buffer.BufferBuilder.prototype.buffer = function(g, distance) {
  var precisionModel = this.workingPrecisionModel;
  if (precisionModel === null)
    precisionModel = g.getPrecisionModel();

  // factory must be the same as the one used by the input
  this.geomFact = g.getFactory();

  var curveBuilder = new jsts.operation.buffer.OffsetCurveBuilder(
      precisionModel, this.bufParams);

  var curveSetBuilder = new jsts.operation.buffer.OffsetCurveSetBuilder(g,
      distance, curveBuilder);

  var bufferSegStrList = curveSetBuilder.getCurves();

  // short-circuit test
  if (bufferSegStrList.size() <= 0) {
    return this.createEmptyResultGeometry();
  }

  this.computeNodedEdges(bufferSegStrList, precisionModel);
  this.graph = new jsts.geomgraph.PlanarGraph(
      new jsts.operation.overlay.OverlayNodeFactory());
  this.graph.addEdges(this.edgeList.getEdges());

  var subgraphList = this.createSubgraphs(this.graph);
  var polyBuilder = new jsts.operation.overlay.PolygonBuilder(this.geomFact);
  this.buildSubgraphs(subgraphList, polyBuilder);
  var resultPolyList = polyBuilder.getPolygons();

  // just in case...
  if (resultPolyList.size() <= 0) {
    return this.createEmptyResultGeometry();
  }

  var resultGeom = this.geomFact.buildGeometry(resultPolyList);
  return resultGeom;
};


/**
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.getNoder = function(
    precisionModel) {
  if (this.workingNoder !== null)
    return this.workingNoder;

  // otherwise use a fast (but non-robust) noder
  var noder = new jsts.noding.MCIndexNoder();
  var li = new jsts.algorithm.RobustLineIntersector();
  li.setPrecisionModel(precisionModel);
  noder.setSegmentIntersector(new jsts.noding.IntersectionAdder(li));
  return noder;
};


/**
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.computeNodedEdges = function(
    bufferSegStrList, precisionModel) {
  var noder = this.getNoder(precisionModel);
  noder.computeNodes(bufferSegStrList);
  var nodedSegStrings = noder.getNodedSubstrings();

  for (var i = nodedSegStrings.iterator(); i.hasNext();) {
    var segStr = i.next();
    var oldLabel = segStr.getData();
    var edge = new jsts.geomgraph.Edge(segStr.getCoordinates(),
        new jsts.geomgraph.Label(oldLabel));
    this.insertUniqueEdge(edge);
  }
};


/**
 * Inserted edges are checked to see if an identical edge already exists. If so,
 * the edge is not inserted, but its label is merged with the existing edge.
 *
 * @protected
 */
jsts.operation.buffer.BufferBuilder.prototype.insertUniqueEdge = function(e) {
  var existingEdge = this.edgeList.findEqualEdge(e);

  // If an identical edge already exists, simply update its label
  if (existingEdge != null) {
    var existingLabel = existingEdge.getLabel();

    var labelToMerge = e.getLabel();
    // check if new edge is in reverse direction to existing edge
    // if so, must flip the label before merging it
    if (!existingEdge.isPointwiseEqual(e)) {
      labelToMerge = new jsts.geomgraph.Label(e.getLabel());
      labelToMerge.flip();
    }
    existingLabel.merge(labelToMerge);

    // compute new depth delta of sum of edges
    var mergeDelta = jsts.operation.buffer.BufferBuilder
        .depthDelta(labelToMerge);
    var existingDelta = existingEdge.getDepthDelta();
    var newDelta = existingDelta + mergeDelta;
    existingEdge.setDepthDelta(newDelta);
  } else {
    // no matching existing edge was found
    // add this new edge to the list of edges in this graph
    this.edgeList.add(e);
    e.setDepthDelta(jsts.operation.buffer.BufferBuilder
        .depthDelta(e.getLabel()));
  }
};


/**
 * @param {PlanarGraph}
 *          graph
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.createSubgraphs = function(graph) {
  var subgraphList = [];
  for (var i = graph.getNodes().iterator(); i.hasNext();) {
    var node = i.next();
    if (!node.isVisited()) {
      var subgraph = new jsts.operation.buffer.BufferSubgraph();
      subgraph.create(node);
      subgraphList.push(subgraph);
    }
  }
  /**
   * Sort the subgraphs in descending order of their rightmost coordinate. This
   * ensures that when the Polygons for the subgraphs are built, subgraphs for
   * shells will have been built before the subgraphs for any holes they
   * contain.
   */

  var compare = function(a, b) {
    return a.compareTo(b);
  };
  subgraphList.sort(compare);
  subgraphList.reverse();
  return subgraphList;
};


/**
 * Completes the building of the input subgraphs by depth-labelling them, and
 * adds them to the PolygonBuilder. The subgraph list must be sorted in
 * rightmost-coordinate order.
 *
 * @param {Array}
 *          subgraphList the subgraphs to build.
 * @param {PolygonBuilder}
 *          polyBuilder the PolygonBuilder which will build the final polygons.
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.buildSubgraphs = function(
    subgraphList, polyBuilder) {
  var processedGraphs = [];
  for (var i = 0; i < subgraphList.length; i++) {
    var subgraph = subgraphList[i];
    var p = subgraph.getRightmostCoordinate();
    var locater = new jsts.operation.buffer.SubgraphDepthLocater(
        processedGraphs);
    var outsideDepth = locater.getDepth(p);
    subgraph.computeDepth(outsideDepth);
    subgraph.findResultEdges();
    processedGraphs.push(subgraph);
    polyBuilder.add(subgraph.getDirectedEdges(), subgraph.getNodes());
  }
};


/**
 * @private
 */
jsts.operation.buffer.BufferBuilder.convertSegStrings = function(it) {
  var fact = new jsts.geom.GeometryFactory();
  var lines = new javascript.util.ArrayList();
  while (it.hasNext()) {
    var ss = it.next();
    var line = fact.createLineString(ss.getCoordinates());
    lines.add(line);
  }
  return fact.buildGeometry(lines);
};


/**
 * Gets the standard result for an empty buffer. Since buffer always returns a
 * polygonal result, this is chosen to be an empty polygon.
 *
 * @return the empty result geometry.
 * @private
 */
jsts.operation.buffer.BufferBuilder.prototype.createEmptyResultGeometry = function() {
  var emptyGeom = this.geomFact.createPolygon(null, null);
  return emptyGeom;
};
