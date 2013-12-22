/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Envelope.js
 * @requires jsts/geom/LineSegment.js
 */

/**
 * The action for the internal iterator for performing overlap queries on a
 * MonotoneChain
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainOverlapAction = function() {
  this.tempEnv1 = new jsts.geom.Envelope();
  this.tempEnv2 = new jsts.geom.Envelope();
  this.overlapSeg1 = new jsts.geom.LineSegment();
  this.overlapSeg2 = new jsts.geom.LineSegment();
};

// these envelopes are used during the MonotoneChain search process
jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv1 = null;
jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv2 = null;

jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg1 = null;
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg2 = null;

/**
 * This function can be overridden if the original chains are needed
 *
 * @param start1
 *          the index of the start of the overlapping segment from mc1.
 * @param start2
 *          the index of the start of the overlapping segment from mc2.
 */
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap = function(mc1,
    start1, mc2, start2) {
  this.mc1.getLineSegment(start1, this.overlapSeg1);
  this.mc2.getLineSegment(start2, this.overlapSeg2);
  this.overlap2(this.overlapSeg1, this.overlapSeg2);
};

/**
 * This is a convenience function which can be overridden to obtain the actual
 * line segments which overlap
 *
 * @param seg1
 * @param seg2
 */
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap2 = function(seg1,
    seg2) {
};
