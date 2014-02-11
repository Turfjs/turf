/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A RightmostEdgeFinder find the DirectedEdge in a list which has the highest
 * coordinate, and which is oriented L to R at that point. (I.e. the right side
 * is on the RHS of the edge.)
 *
 * @constructor
 */
jsts.operation.buffer.RightmostEdgeFinder = function() {};
// private Coordinate extremeCoord;
jsts.operation.buffer.RightmostEdgeFinder.prototype.minIndex = -1;
jsts.operation.buffer.RightmostEdgeFinder.prototype.minCoord = null;
jsts.operation.buffer.RightmostEdgeFinder.prototype.minDe = null;
jsts.operation.buffer.RightmostEdgeFinder.prototype.orientedDe = null;


jsts.operation.buffer.RightmostEdgeFinder.prototype.getEdge = function() {
  return this.orientedDe;
};
jsts.operation.buffer.RightmostEdgeFinder.prototype.getCoordinate = function() {
  return this.minCoord;
};

jsts.operation.buffer.RightmostEdgeFinder.prototype.findEdge = function(
    dirEdgeList) {
  /**
   * Check all forward DirectedEdges only. This is still general, because each
   * edge has a forward DirectedEdge.
   */
  for (var i = dirEdgeList.iterator(); i.hasNext();) {
    var de = i.next();
    if (!de.isForward())
      continue;
    this.checkForRightmostCoordinate(de);
  }

  /**
   * If the rightmost point is a node, we need to identify which of the incident
   * edges is rightmost.
   */
  jsts.util.Assert.isTrue(this.minIndex !== 0 ||
      this.minCoord.equals(this.minDe.getCoordinate()),
      'inconsistency in rightmost processing');
  if (this.minIndex === 0) {
    this.findRightmostEdgeAtNode();
  } else {
    this.findRightmostEdgeAtVertex();
  }
  /**
   * now check that the extreme side is the R side. If not, use the sym instead.
   */
  this.orientedDe = this.minDe;
  var rightmostSide = this.getRightmostSide(this.minDe, this.minIndex);
  if (rightmostSide == jsts.geomgraph.Position.LEFT) {
    this.orientedDe = this.minDe.getSym();
  }
};
/**
 * @private
 */
jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtNode = function() {
  var node = this.minDe.getNode();
  var star = node.getEdges();
  this.minDe = star.getRightmostEdge();
  // the DirectedEdge returned by the previous call is not
  // necessarily in the forward direction. Use the sym edge if it isn't.
  if (!this.minDe.isForward()) {
    this.minDe = this.minDe.getSym();
    this.minIndex = this.minDe.getEdge().getCoordinates().length - 1;
  }
};
/**
 * @private
 */
jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtVertex = function() {
  /**
   * The rightmost point is an interior vertex, so it has a segment on either
   * side of it. If these segments are both above or below the rightmost point,
   * we need to determine their relative orientation to decide which is
   * rightmost.
   */
  var pts = this.minDe.getEdge().getCoordinates();
  jsts.util.Assert.isTrue(this.minIndex > 0 && this.minIndex < pts.length,
      'rightmost point expected to be interior vertex of edge');
  var pPrev = pts[this.minIndex - 1];
  var pNext = pts[this.minIndex + 1];
  var orientation = jsts.algorithm.CGAlgorithms.computeOrientation(
      this.minCoord, pNext, pPrev);
  var usePrev = false;
  // both segments are below min point
  if (pPrev.y < this.minCoord.y && pNext.y < this.minCoord.y &&
      orientation === jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE) {
    usePrev = true;
  } else if (pPrev.y > this.minCoord.y && pNext.y > this.minCoord.y &&
      orientation === jsts.algorithm.CGAlgorithms.CLOCKWISE) {
    usePrev = true;
  }
  // if both segments are on the same side, do nothing - either is safe
  // to select as a rightmost segment
  if (usePrev) {
    this.minIndex = this.minIndex - 1;
  }
};
/**
 * @private
 */
jsts.operation.buffer.RightmostEdgeFinder.prototype.checkForRightmostCoordinate = function(
    de) {
  var coord = de.getEdge().getCoordinates();
  for (var i = 0; i < coord.length - 1; i++) {
    // only check vertices which are the start or end point of a non-horizontal
    // segment
    // <FIX> MD 19 Sep 03 - NO! we can test all vertices, since the rightmost
    // must have a non-horiz segment adjacent to it
    if (this.minCoord === null || coord[i].x > this.minCoord.x) {
      this.minDe = de;
      this.minIndex = i;
      this.minCoord = coord[i];
    }
    // }
  }
};
/**
 * @private
 */
jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSide = function(
    de, index) {
  var side = this.getRightmostSideOfSegment(de, index);
  if (side < 0)
    side = this.getRightmostSideOfSegment(de, index - 1);
  if (side < 0) {
    // reaching here can indicate that segment is horizontal
    // Assert.shouldNeverReachHere("problem with finding rightmost side of
    // segment at " + de.getCoordinate());
    // testing only
    this.minCoord = null;
    this.checkForRightmostCoordinate(de);
  }
  return side;
};

/**
 * @private
 */
jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSideOfSegment = function(
    de, i) {
  var e = de.getEdge();
  var coord = e.getCoordinates();

  if (i < 0 || i + 1 >= coord.length)
    return -1;
  if (coord[i].y == coord[i + 1].y)
    return -1; // indicates edge is parallel to x-axis

  var pos = jsts.geomgraph.Position.LEFT;
  if (coord[i].y < coord[i + 1].y)
    pos = jsts.geomgraph.Position.RIGHT;
  return pos;
};
