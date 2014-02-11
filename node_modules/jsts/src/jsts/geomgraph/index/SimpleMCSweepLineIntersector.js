/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/index/EdgeSetIntersector.js
 */



/**
 * Finds all intersections in one or two sets of edges,
 * using an x-axis sweepline algorithm in conjunction with Monotone Chains.
 * While still O(n^2) in the worst case, this algorithm
 * drastically improves the average-case time.
 * The use of MonotoneChains as the items in the index
 * seems to offer an improvement in performance over a sweep-line alone.
 * @constructor
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector = function() {
  throw new jsts.error.NotImplementedError();
};


jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype = new jsts.geomgraph.index.EdgeSetIntersector();

// TODO: port
