/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/Noder.js
   */

  var Noder = jsts.noding.Noder;


  /**
   * Base class for {@link Noder}s which make a single pass to find
   * intersections. This allows using a custom {@link SegmentIntersector} (which
   * for instance may simply identify intersections, rather than insert them).
   *
   * @interface
   */
  jsts.noding.SinglePassNoder = function() {

  };


  jsts.noding.SinglePassNoder.prototype = new Noder();
  jsts.noding.SinglePassNoder.constructor = jsts.noding.SinglePassNoder;


  /**
   * @type {SegmentIntersector}
   * @protected
   */
  jsts.noding.SinglePassNoder.prototype.segInt = null;

  /**
   * Sets the SegmentIntersector to use with this noder. A SegmentIntersector
   * will normally add intersection nodes to the input segment strings, but it
   * may not - it may simply record the presence of intersections. However, some
   * Noders may require that intersections be added.
   *
   * @param {SegmentIntersector}
   *          segInt
   */
  jsts.noding.SinglePassNoder.prototype.setSegmentIntersector = function(segInt) {
    this.segInt = segInt;
  };

})();
