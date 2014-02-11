/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/noding/SegmentNodeList.java
 * Revision: 478
 */


/**
 * A list of the {@link SegmentNode}s present along a noded
 * {@link SegmentString}.
 *
 * @constructor
 */
jsts.noding.SegmentNodeList = function(edge) {
  this.nodeMap = new javascript.util.TreeMap();

  this.edge = edge;
};


/**
 * @type {javascript.util.TreeMap}
 * @private
 */
jsts.noding.SegmentNodeList.prototype.nodeMap = null;

/**
 * returns an iterator of SegmentNodes
 */
jsts.noding.SegmentNodeList.prototype.iterator = function() {
  return this.nodeMap.values().iterator();
};


/**
 * the parent edge
 *
 * @type {NodedSegmentString}
 * @private
 */
jsts.noding.SegmentNodeList.prototype.edge = null;


jsts.noding.SegmentNodeList.prototype.getEdge = function() {
  return this.edge;
};


/**
 * Adds an intersection into the list, if it isn't already there. The input
 * segmentIndex and dist are expected to be normalized.
 *
 * @return the SegmentIntersection found or added.
 */
jsts.noding.SegmentNodeList.prototype.add = function(intPt, segmentIndex) {
  var eiNew = new jsts.noding.SegmentNode(this.edge, intPt, segmentIndex,
      this.edge.getSegmentOctant(segmentIndex));
  var ei = this.nodeMap.get(eiNew);
  if (ei !== null) {
    jsts.util.Assert.isTrue(ei.coord.equals2D(intPt),
        'Found equal nodes with different coordinates');
    return ei;
  }
  // node does not exist, so create it
  this.nodeMap.put(eiNew, eiNew);
  return eiNew;
};


/**
 * Adds nodes for the first and last points of the edge
 *
 * @private
 */
jsts.noding.SegmentNodeList.prototype.addEndpoints = function() {
  var maxSegIndex = this.edge.size() - 1;
  this.add(this.edge.getCoordinate(0), 0);
  this.add(this.edge.getCoordinate(maxSegIndex), maxSegIndex);
};


/**
 * Adds nodes for any collapsed edge pairs. Collapsed edge pairs can be caused
 * by inserted nodes, or they can be pre-existing in the edge vertex list. In
 * order to provide the correct fully noded semantics, the vertex at the base of
 * a collapsed pair must also be added as a node.
 *
 * @private
 */
jsts.noding.SegmentNodeList.prototype.addCollapsedNodes = function() {
  var collapsedVertexIndexes = [];

  this.findCollapsesFromInsertedNodes(collapsedVertexIndexes);
  this.findCollapsesFromExistingVertices(collapsedVertexIndexes);

  // node the collapses
  for (var i = 0; i < collapsedVertexIndexes.length; i++) {
    var vertexIndex = collapsedVertexIndexes[i];
    this.add(this.edge.getCoordinate(vertexIndex), vertexIndex);
  }
};


/**
 * Adds nodes for any collapsed edge pairs which are pre-existing in the vertex
 * list.
 *
 * @private
 */
jsts.noding.SegmentNodeList.prototype.findCollapsesFromExistingVertices = function(
    collapsedVertexIndexes) {
  for (var i = 0; i < this.edge.size() - 2; i++) {
    var p0 = this.edge.getCoordinate(i);
    var p1 = this.edge.getCoordinate(i + 1);
    var p2 = this.edge.getCoordinate(i + 2);
    if (p0.equals2D(p2)) {
      // add base of collapse as node
      collapsedVertexIndexes.push(i + 1);
    }
  }
};


/**
 * Adds nodes for any collapsed edge pairs caused by inserted nodes Collapsed
 * edge pairs occur when the same coordinate is inserted as a node both before
 * and after an existing edge vertex. To provide the correct fully noded
 * semantics, the vertex must be added as a node as well.
 *
 * @private
 */
jsts.noding.SegmentNodeList.prototype.findCollapsesFromInsertedNodes = function(
    collapsedVertexIndexes) {
  var collapsedVertexIndex = [null];
  var it = this.iterator();
  // there should always be at least two entries in the list, since the
  // endpoints are nodes
  var eiPrev = it.next();
  while (it.hasNext()) {
    var ei = it.next();
    var isCollapsed = this.findCollapseIndex(eiPrev, ei, collapsedVertexIndex);
    if (isCollapsed)
      collapsedVertexIndexes.push(collapsedVertexIndex[0]);

    eiPrev = ei;
  }
};


/**
 * @private
 */
jsts.noding.SegmentNodeList.prototype.findCollapseIndex = function(ei0, ei1,
    collapsedVertexIndex) {
  // only looking for equal nodes
  if (!ei0.coord.equals2D(ei1.coord))
    return false;

  var numVerticesBetween = ei1.segmentIndex - ei0.segmentIndex;
  if (!ei1.isInterior()) {
    numVerticesBetween--;
  }

  // if there is a single vertex between the two equal nodes, this is a collapse
  if (numVerticesBetween === 1) {
    collapsedVertexIndex[0] = ei0.segmentIndex + 1;
    return true;
  }
  return false;
};


/**
 * Creates new edges for all the edges that the intersections in this list split
 * the parent edge into. Adds the edges to the provided argument list (this is
 * so a single list can be used to accumulate all split edges for a set of
 * {@link SegmentString}s).
 *
 * @param {Array}
 *          edgeList
 */
jsts.noding.SegmentNodeList.prototype.addSplitEdges = function(edgeList) {
  // ensure that the list has entries for the first and last point of the edge
  this.addEndpoints();
  this.addCollapsedNodes();

  var it = this.iterator();
  // there should always be at least two entries in the list, since the
  // endpoints are nodes
  var eiPrev = it.next();
  while (it.hasNext()) {
    var ei = it.next();
    var newEdge = this.createSplitEdge(eiPrev, ei);
    edgeList.add(newEdge);
    eiPrev = ei;
  }
};


/**
 * Checks the correctness of the set of split edges corresponding to this edge.
 *
 * @param {Array}
 *          splitEdges the split edges for this edge (in order).
 * @private
 */
jsts.noding.SegmentNodeList.prototype.checkSplitEdgesCorrectness = function(
    splitEdges) {
  var edgePts = edge.getCoordinates();

  // check that first and last points of split edges are same as endpoints of
  // edge
  var split0 = splitEdges[0];
  var pt0 = split0.getCoordinate(0);
  if (!pt0.equals2D(edgePts[0]))
    throw new Error('bad split edge start point at ' + pt0);

  var splitn = splitEdges[splitEdges.length - 1];
  var splitnPts = splitn.getCoordinates();
  var ptn = splitnPts[splitnPts.length - 1];
  if (!ptn.equals2D(edgePts[edgePts.length - 1]))
    throw new Error('bad split edge end point at ' + ptn);
};


/**
 * Create a new "split edge" with the section of points between (and including)
 * the two intersections. The label for the new edge is the same as the label
 * for the parent edge.
 *
 * @private
 */
jsts.noding.SegmentNodeList.prototype.createSplitEdge = function(ei0, ei1) {
  var npts = ei1.segmentIndex - ei0.segmentIndex + 2;

  var lastSegStartPt = this.edge.getCoordinate(ei1.segmentIndex);
  // if the last intersection point is not equal to the its segment start pt,
  // add it to the points list as well.
  // (This check is needed because the distance metric is not totally reliable!)
  // The check for point equality is 2D only - Z values are ignored
  var useIntPt1 = ei1.isInterior() || !ei1.coord.equals2D(lastSegStartPt);
  if (!useIntPt1) {
    npts--;
  }

  var pts = [];
  // pts.length = npts;
  var ipt = 0;
  pts[ipt++] = new jsts.geom.Coordinate(ei0.coord);
  for (var i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
    pts[ipt++] = this.edge.getCoordinate(i);
  }
  if (useIntPt1)
    pts[ipt] = ei1.coord;

  return new jsts.noding.NodedSegmentString(pts, this.edge.getData());
};
