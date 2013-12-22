/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Monotone Chains are a way of partitioning the segments of a linestring to
 * allow for fast searching of intersections. They have the following
 * properties:
 * <ol>
 * <li>the segments within a monotone chain never intersect each other
 * <li>the envelope of any contiguous subset of the segments in a monotone
 * chain is equal to the envelope of the endpoints of the subset.
 * </ol>
 * Property 1 means that there is no need to test pairs of segments from within
 * the same monotone chain for intersection.
 * <p>
 * Property 2 allows an efficient binary search to be used to find the
 * intersection points of two monotone chains. For many types of real-world
 * data, these properties eliminate a large number of segment comparisons,
 * producing substantial speed gains.
 * <p>
 * One of the goals of this implementation of MonotoneChains is to be as space
 * and time efficient as possible. One design choice that aids this is that a
 * MonotoneChain is based on a subarray of a list of points. This means that new
 * arrays of points (potentially very large) do not have to be allocated.
 * <p>
 *
 * MonotoneChains support the following kinds of queries:
 * <ul>
 * <li>Envelope select: determine all the segments in the chain which intersect
 * a given envelope
 * <li>Overlap: determine all the pairs of segments in two chains whose
 * envelopes overlap
 * </ul>
 *
 * This implementation of MonotoneChains uses the concept of internal iterators
 * to return the resultsets for the above queries. This has time and space
 * advantages, since it is not necessary to build lists of instantiated objects
 * to represent the segments returned by the query. However, it does mean that
 * the queries are not thread-safe.
 *
 * @constructor
 */
jsts.index.chain.MonotoneChain = function(pts, start, end, context) {
  this.pts = pts;
  this.start = start;
  this.end = end;
  this.context = context;
};

/**
 * @type {Array.<jsts.geom.Coordinate>}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.pts = null;
/**
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.start = null;
/**
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.end = null;
/**
 * @type {Envelope}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.env = null;
/**
 * user-defined information
 *
 * @type {Object}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.context = null;
/**
 * useful for optimizing chain comparisons
 *
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.id = null;

jsts.index.chain.MonotoneChain.prototype.setId = function(id) {
  this.id = id;
};
jsts.index.chain.MonotoneChain.prototype.getId = function() {
  return this.id;
};

jsts.index.chain.MonotoneChain.prototype.getContext = function() {
  return this.context;
};

jsts.index.chain.MonotoneChain.prototype.getEnvelope = function() {
  if (this.env == null) {
    var p0 = this.pts[this.start];
    var p1 = this.pts[this.end];
    this.env = new jsts.geom.Envelope(p0, p1);
  }
  return this.env;
};

jsts.index.chain.MonotoneChain.prototype.getStartIndex = function() {
  return this.start;
};
jsts.index.chain.MonotoneChain.prototype.getEndIndex = function() {
  return this.end;
};

jsts.index.chain.MonotoneChain.prototype.getLineSegment = function(index, ls) {
  ls.p0 = this.pts[index];
  ls.p1 = this.pts[index + 1];
};
/**
 * Return the subsequence of coordinates forming this chain. Allocates a new
 * array to hold the Coordinates
 */
jsts.index.chain.MonotoneChain.prototype.getCoordinates = function() {
  var coord = [];
  var index = 0;
  for (var i = this.start; i <= this.end; i++) {
    coord[index++] = this.pts[i];
  }
  return coord;
};

/**
 * Determine all the line segments in the chain whose envelopes overlap the
 * searchEnvelope, and process them.
 * <p>
 * The monotone chain search algorithm attempts to optimize performance by not
 * calling the select action on chain segments which it can determine are not in
 * the search envelope. However, it *may* call the select action on segments
 * which do not intersect the search envelope. This saves on the overhead of
 * checking envelope intersection each time, since clients may be able to do
 * this more efficiently.
 *
 * @param {Envelope}
 *          searchEnv the search envelope.
 * @param {MonotoneChainSelectAction}
 *          mcs the select action to execute on selected segments.
 */
jsts.index.chain.MonotoneChain.prototype.select = function(searchEnv, mcs) {
  this.computeSelect2(searchEnv, this.start, this.end, mcs);
};

/**
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.computeSelect2 = function(searchEnv,
    start0, end0, mcs) {
  var p0 = this.pts[start0];
  var p1 = this.pts[end0];
  mcs.tempEnv1.init(p0, p1);

  // terminating condition for the recursion
  if (end0 - start0 === 1) {
    mcs.select(this, start0);
    return;
  }
  // nothing to do if the envelopes don't overlap
  if (!searchEnv.intersects(mcs.tempEnv1))
    return;

  // the chains overlap, so split each in half and iterate (binary search)
  var mid = parseInt((start0 + end0) / 2);

  // Assert: mid != start or end (since we checked above for end - start <= 1)
  // check terminating conditions before recursing
  if (start0 < mid) {
    this.computeSelect2(searchEnv, start0, mid, mcs);
  }
  if (mid < end0) {
    this.computeSelect2(searchEnv, mid, end0, mcs);
  }
};

/**
 * Determine all the line segments in two chains which may overlap, and process
 * them.
 * <p>
 * The monotone chain search algorithm attempts to optimize performance by not
 * calling the overlap action on chain segments which it can determine do not
 * overlap. However, it *may* call the overlap action on segments which do not
 * actually interact. This saves on the overhead of checking intersection each
 * time, since clients may be able to do this more efficiently.
 *
 * @param {MonotoneChain}
 *          searchEnv the search envelope.
 * @param {MonotoneChainOverlapAction}
 *          mco the overlap action to execute on selected segments.
 */
jsts.index.chain.MonotoneChain.prototype.computeOverlaps = function(mc, mco) {
  if (arguments.length === 6) {
    return this.computeOverlaps2.apply(this, arguments);
  }
  this.computeOverlaps2(this.start, this.end, mc, mc.start, mc.end, mco);
};

/**
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.computeOverlaps2 = function(start0,
    end0, mc, start1, end1, mco) {
  var p00 = this.pts[start0];
  var p01 = this.pts[end0];
  var p10 = mc.pts[start1];
  var p11 = mc.pts[end1];
  // Debug.println("computeIntersectsForChain:" + p00 + p01 + p10 + p11);
  // terminating condition for the recursion
  if (end0 - start0 === 1 && end1 - start1 === 1) {
    mco.overlap(this, start0, mc, start1);
    return;
  }
  // nothing to do if the envelopes of these chains don't overlap
  mco.tempEnv1.init(p00, p01);
  mco.tempEnv2.init(p10, p11);
  if (!mco.tempEnv1.intersects(mco.tempEnv2))
    return;

  // the chains overlap, so split each in half and iterate (binary search)
  var mid0 = parseInt((start0 + end0) / 2);
  var mid1 = parseInt((start1 + end1) / 2);

  // Assert: mid != start or end (since we checked above for end - start <= 1)
  // check terminating conditions before recursing
  if (start0 < mid0) {
    if (start1 < mid1)
      this.computeOverlaps2(start0, mid0, mc, start1, mid1, mco);
    if (mid1 < end1)
      this.computeOverlaps2(start0, mid0, mc, mid1, end1, mco);
  }
  if (mid0 < end0) {
    if (start1 < mid1)
      this.computeOverlaps2(mid0, end0, mc, start1, mid1, mco);
    if (mid1 < end1)
      this.computeOverlaps2(mid0, end0, mc, mid1, end1, mco);
  }
};
