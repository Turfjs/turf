/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Computes all intersections between segments in a set of
   * {@link SegmentString}s. Intersections found are represented as
   * {@link SegmentNode}s and added to the {@link SegmentString}s in which
   * they occur. As a final step in the noding a new set of segment strings
   * split at the nodes may be returned.
   *
   * @interface
   */
  jsts.noding.Noder = function() {

  };


  /**
   * Computes the noding for a collection of {@link SegmentString}s. Some
   * Noders may add all these nodes to the input SegmentStrings; others may only
   * add some or none at all.
   *
   * @param {Array}
   *          segStrings a collection of {@link SegmentString}s to node.
   */
  jsts.noding.Noder.prototype.computeNodes = jsts.abstractFunc;

  /**
   * Returns a {@link Collection} of fully noded {@link SegmentString}s. The
   * SegmentStrings have the same context as their parent.
   *
   * @return {Array} a Collection of SegmentStrings.
   */
  jsts.noding.Noder.prototype.getNodedSubstrings = jsts.abstractFunc;

})();
