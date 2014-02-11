/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A spatial object in an AbstractSTRtree.
 *
 * @version 1.7
 */



/**
 * @constructor
 * @interface
 */
jsts.index.strtree.Boundable = function() {

};


/**
 * Returns a representation of space that encloses this Boundable, preferably
 * not much bigger than this Boundable's boundary yet fast to test for intersection
 * with the bounds of other Boundables. The class of object returned depends
 * on the subclass of AbstractSTRtree.
 *
 * @return {Object} an Envelope (for STRtrees), an Interval (for SIRtrees), or other object
 * (for other subclasses of AbstractSTRtree).
 * @see jsts.index.strtree.AbstractSTRtree.IntersectsOp
 * @public
 */
jsts.index.strtree.Boundable.prototype.getBounds = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};
