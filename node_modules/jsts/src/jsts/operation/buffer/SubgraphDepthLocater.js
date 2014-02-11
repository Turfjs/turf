/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Locates a subgraph inside a set of subgraphs, in order to determine the
 * outside depth of the subgraph. The input subgraphs are assumed to have had
 * depths already calculated for their edges.
 *
 * @constructor
 */
jsts.operation.buffer.SubgraphDepthLocater = function(subgraphs) {
  this.subgraphs = [];
  this.seg = new jsts.geom.LineSegment();

  this.subgraphs = subgraphs;
};

jsts.operation.buffer.SubgraphDepthLocater.prototype.subgraphs = null;
jsts.operation.buffer.SubgraphDepthLocater.prototype.seg = null;


jsts.operation.buffer.SubgraphDepthLocater.prototype.getDepth = function(p) {
  var stabbedSegments = this.findStabbedSegments(p);
  // if no segments on stabbing line subgraph must be outside all others.
  if (stabbedSegments.length === 0)
    return 0;
  stabbedSegments.sort();
  var ds = stabbedSegments[0];
  return ds.leftDepth;
};

/**
 * Finds all non-horizontal segments intersecting the stabbing line. The
 * stabbing line is the ray to the right of stabbingRayLeftPt.
 *
 * @param stabbingRayLeftPt
 *          the left-hand origin of the stabbing line.
 * @return a List of {@link DepthSegments} intersecting the stabbing line.
 * @private
 */
jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments = function(
    stabbingRayLeftPt) {

  if (arguments.length === 3) {
    this.findStabbedSegments2.apply(this, arguments);
    return;
  }

  var stabbedSegments = [];
  for (var i = 0; i < this.subgraphs.length; i++) {
    var bsg = this.subgraphs[i];

    // optimization - don't bother checking subgraphs which the ray does not
    // intersect
    var env = bsg.getEnvelope();
    if (stabbingRayLeftPt.y < env.getMinY() ||
        stabbingRayLeftPt.y > env.getMaxY())
      continue;

    this.findStabbedSegments2(stabbingRayLeftPt, bsg.getDirectedEdges(),
        stabbedSegments);
  }
  return stabbedSegments;
};

/**
 * Finds all non-horizontal segments intersecting the stabbing line in the list
 * of dirEdges. The stabbing line is the ray to the right of stabbingRayLeftPt.
 *
 * @param stabbingRayLeftPt
 *          the left-hand origin of the stabbing line.
 * @param stabbedSegments
 *          the current list of {@link DepthSegments} intersecting the stabbing
 *          line.
 * @private
 */
jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments2 = function(
    stabbingRayLeftPt, dirEdges, stabbedSegments) {

  if (arguments[1] instanceof jsts.geomgraph.DirectedEdge) {
    this.findStabbedSegments3(stabbingRayLeftPt, dirEdges, stabbedSegments);
    return;
  }

  /**
   * Check all forward DirectedEdges only. This is still general, because each
   * Edge has a forward DirectedEdge.
   */
  for (var i = dirEdges.iterator(); i.hasNext();) {
    var de = i.next();
    if (! de.isForward())
      continue;
    this.findStabbedSegments3(stabbingRayLeftPt, de, stabbedSegments);
  }
};

/**
 * Finds all non-horizontal segments intersecting the stabbing line in the input
 * dirEdge. The stabbing line is the ray to the right of stabbingRayLeftPt.
 *
 * @param stabbingRayLeftPt
 *          the left-hand origin of the stabbing line.
 * @param stabbedSegments
 *          the current list of {@link DepthSegments} intersecting the stabbing
 *          line.
 * @private
 */
jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments3 = function(
    stabbingRayLeftPt, dirEdge, stabbedSegments) {
  var pts = dirEdge.getEdge().getCoordinates();
  for (var i = 0; i < pts.length - 1; i++) {
    this.seg.p0 = pts[i];
    this.seg.p1 = pts[i + 1];
    // ensure segment always points upwards
    if (this.seg.p0.y > this.seg.p1.y)
      this.seg.reverse();

    // skip segment if it is left of the stabbing line
    var maxx = Math.max(this.seg.p0.x, this.seg.p1.x);
    if (maxx < stabbingRayLeftPt.x)
      continue;

    // skip horizontal segments (there will be a non-horizontal one carrying the
    // same depth info
    if (this.seg.isHorizontal())
      continue;

    // skip if segment is above or below stabbing line
    if (stabbingRayLeftPt.y < this.seg.p0.y || stabbingRayLeftPt.y > this.seg.p1.y)
      continue;

    // skip if stabbing ray is right of the segment
    if (jsts.algorithm.CGAlgorithms.computeOrientation(this.seg.p0, this.seg.p1,
        stabbingRayLeftPt) === jsts.algorithm.CGAlgorithms.RIGHT)
      continue;

    // stabbing line cuts this segment, so record it
    var depth = dirEdge.getDepth(jsts.geomgraph.Position.LEFT);
    // if segment direction was flipped, use RHS depth instead
    if (!this.seg.p0.equals(pts[i]))
      depth = dirEdge.getDepth(jsts.geomgraph.Position.RIGHT);
    var ds = new jsts.operation.buffer.SubgraphDepthLocater.DepthSegment(this.seg, depth);
    stabbedSegments.push(ds);
  }
};


/**
 * A segment from a directed edge which has been assigned a depth value for its
 * sides.
 */
jsts.operation.buffer.SubgraphDepthLocater.DepthSegment = function(seg, depth) {
  // input seg is assumed to be normalized
  this.upwardSeg = new jsts.geom.LineSegment(seg);
  // upwardSeg.normalize();
  this.leftDepth = depth;
};
jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.upwardSeg = null;
jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.leftDepth = null;

/**
 * Defines a comparision operation on DepthSegments which orders them left to
 * right
 *
 * <pre>
 * DS1 &lt; DS2   if   DS1.seg is left of DS2.seg
 * DS1 &gt; DS2   if   DS1.seg is right of DS2.seg
 * </pre>
 *
 * @param obj
 * @return
 */
jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareTo = function(
    obj) {
  var other = obj;
  /**
   * try and compute a determinate orientation for the segments. Test returns 1
   * if other is left of this (i.e. this > other)
   */
  var orientIndex = this.upwardSeg.orientationIndex(other.upwardSeg);

  /**
   * If comparison between this and other is indeterminate, try the opposite
   * call order. orientationIndex value is 1 if this is left of other, so have
   * to flip sign to get proper comparison value of -1 if this is leftmost
   */
  if (orientIndex === 0)
    orientIndex = -1 * other.upwardSeg.orientationIndex(upwardSeg);

  // if orientation is determinate, return it
  if (orientIndex !== 0)
    return orientIndex;

  // otherwise, segs must be collinear - sort based on minimum X value
  return this.compareX(this.upwardSeg, other.upwardSeg);
};

/**
 * Compare two collinear segments for left-most ordering. If segs are vertical,
 * use vertical ordering for comparison. If segs are equal, return 0. Segments
 * are assumed to be directed so that the second coordinate is >= to the first
 * (e.g. up and to the right).
 *
 * @param seg0
 *          a segment to compare.
 * @param seg1
 *          a segment to compare.
 * @return
 */
jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareX = function(
    seg0, seg1) {
  var compare0 = seg0.p0.compareTo(seg1.p0);
  if (compare0 !== 0)
    return compare0;
  return seg0.p1.compareTo(seg1.p1);

};
