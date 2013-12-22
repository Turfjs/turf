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
 * The action for the internal iterator for performing envelope select queries
 * on a MonotoneChain
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainSelectAction = function() {
  this.tempEnv1 = new jsts.geom.Envelope();
  this.selectedSegment = new jsts.geom.LineSegment();
};



jsts.index.chain.MonotoneChainSelectAction.prototype.tempEnv1 = null;

jsts.index.chain.MonotoneChainSelectAction.prototype.selectedSegment = null;

/**
 * This function can be overridden if the original chain is needed.
 */
jsts.index.chain.MonotoneChainSelectAction.prototype.select = function(mc,
    start) {
  mc.getLineSegment(start, this.selectedSegment);
  this.select2(this.selectedSegment);
};

/**
 * This is a convenience function which can be overridden to obtain the actual
 * line segment which is selected.
 *
 * @param seg
 */
jsts.index.chain.MonotoneChainSelectAction.prototype.select2 = function(seg) {};
