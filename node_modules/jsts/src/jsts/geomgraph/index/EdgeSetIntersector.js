/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.index.EdgeSetIntersector = function() {

};


/**
 * Computes all self-intersections between edges in a set of edges, allowing
 * client to choose whether self-intersections are computed.
 *
 * @param {javascript.util.List}
 *          edges a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 * @param {boolean}
 *          testAllSegments true if self-intersections are to be tested as well.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections = function(
    edges, si, testAllSegments) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Computes all mutual intersections between two sets of edges.
 *
 * @param {javascript.util.List}
 *          edges0 a list of edges to test for intersections.
 * @param {javascript.util.List}
 *          edges1 a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections2 = function(
    edges0, edges1, si) {
  throw new jsts.error.AbstractMethodInvocationError();
};
