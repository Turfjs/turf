/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Constructs {@link MonotoneChain}s for sequences of {@link Coordinate}s.
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainBuilder = function() {

};

jsts.index.chain.MonotoneChainBuilder.toIntArray = function(list) {
  var array = [];
  for (var i = 0; i < list.length; i++) {
    array[i] = list[i];
  }
  return array;
};

jsts.index.chain.MonotoneChainBuilder.getChains = function(pts) {
  if (arguments.length === 2) {
    return jsts.index.chain.MonotoneChainBuilder.getChains2.apply(this, arguments);
  }

  return jsts.index.chain.MonotoneChainBuilder.getChains2(pts, null);
};

/**
 * Return a list of the {@link MonotoneChain}s for the given list of
 * coordinates.
 */
jsts.index.chain.MonotoneChainBuilder.getChains2 = function(pts, context) {
  var mcList = [];
  var startIndex = jsts.index.chain.MonotoneChainBuilder
      .getChainStartIndices(pts);
  for (var i = 0; i < startIndex.length - 1; i++) {
    var mc = new jsts.index.chain.MonotoneChain(pts, startIndex[i],
        startIndex[i + 1], context);
    mcList.push(mc);
  }
  return mcList;
};

/**
 * Return an array containing lists of start/end indexes of the monotone chains
 * for the given list of coordinates. The last entry in the array points to the
 * end point of the point array, for use as a sentinel.
 */
jsts.index.chain.MonotoneChainBuilder.getChainStartIndices = function(pts) {
  // find the startpoint (and endpoints) of all monotone chains in this edge
  var start = 0;
  var startIndexList = [];
  startIndexList.push(start);
  do {
    var last = jsts.index.chain.MonotoneChainBuilder.findChainEnd(pts, start);
    startIndexList.push(last);
    start = last;
  } while (start < pts.length - 1);
  // copy list to an array of ints, for efficiency
  var startIndex = jsts.index.chain.MonotoneChainBuilder
      .toIntArray(startIndexList);
  return startIndex;
};

/**
 * Finds the index of the last point in a monotone chain starting at a given
 * point. Any repeated points (0-length segments) will be included in the
 * monotone chain returned.
 *
 * @return the index of the last point in the monotone chain starting at
 *         <code>start</code>.
 * @private
 */
jsts.index.chain.MonotoneChainBuilder.findChainEnd = function(pts, start) {
  var safeStart = start;
  // skip any zero-length segments at the start of the sequence
  // (since they cannot be used to establish a quadrant)
  while (safeStart < pts.length - 1 &&
      pts[safeStart].equals2D(pts[safeStart + 1])) {
    safeStart++;
  }
  // check if there are NO non-zero-length segments
  if (safeStart >= pts.length - 1) {
    return pts.length - 1;
  }
  // determine overall quadrant for chain (which is the starting quadrant)
  var chainQuad = jsts.geomgraph.Quadrant.quadrant(pts[safeStart],
      pts[safeStart + 1]);
  var last = start + 1;
  while (last < pts.length) {
    // skip zero-length segments, but include them in the chain
    if (!pts[last - 1].equals2D(pts[last])) {
      // compute quadrant for next possible segment in chain
      var quad = jsts.geomgraph.Quadrant.quadrant(pts[last - 1],
          pts[last]);
      if (quad !== chainQuad)
        break;
    }
    last++;
  }
  return last - 1;
};
