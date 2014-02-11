/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/SinglePassNoder.js
   * @requires jsts/index/strtree/STRtree.js
   * @requires jsts/noding/NodedSegmentString.js
   * @requires jsts/index/chain/MonotoneChainBuilder.js
   * @requires jsts/index/chain/MonotoneChainOverlapAction.js
   */

  var MonotoneChainOverlapAction = jsts.index.chain.MonotoneChainOverlapAction;
  var SinglePassNoder = jsts.noding.SinglePassNoder;
  var STRtree = jsts.index.strtree.STRtree;
  var NodedSegmentString = jsts.noding.NodedSegmentString;
  var MonotoneChainBuilder = jsts.index.chain.MonotoneChainBuilder;

  /**
   * @constructor
   * @private
   */
  var SegmentOverlapAction = function(si) {
    this.si = si;

  };
  SegmentOverlapAction.prototype = new MonotoneChainOverlapAction();
  SegmentOverlapAction.constructor = SegmentOverlapAction;

  /**
   * @type {SegmentIntersector}
   * @private
   */
  SegmentOverlapAction.prototype.si = null;

  SegmentOverlapAction.prototype.overlap = function(mc1, start1, mc2, start2) {
    var ss1 = mc1.getContext();
    var ss2 = mc2.getContext();
    this.si.processIntersections(ss1, start1, ss2, start2);
  };

  /**
   * @constructor
   */
  jsts.noding.MCIndexNoder = function() {
    this.monoChains = [];
    this.index = new STRtree();
  };

  jsts.noding.MCIndexNoder.prototype = new SinglePassNoder();
  jsts.noding.MCIndexNoder.constructor = jsts.noding.MCIndexNoder;

  /**
   * @type {Array}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.monoChains = null;
  /**
   * @type {SpatialIndex}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.index = null;
  /**
   * @type {number}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.idCounter = 0;

  /**
   * @type {Array}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.nodedSegStrings = null;
  /**
   * statistics
   *
   * @type {number}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.nOverlaps = 0;


  jsts.noding.MCIndexNoder.prototype.getMonotoneChains = function() {
    return this.monoChains;
  };

  jsts.noding.MCIndexNoder.prototype.getIndex = function() {
    return this.index;
  };

  jsts.noding.MCIndexNoder.prototype.getNodedSubstrings = function() {
    return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
  };

  jsts.noding.MCIndexNoder.prototype.computeNodes = function(inputSegStrings) {
    this.nodedSegStrings = inputSegStrings;
    for (var i = inputSegStrings.iterator(); i.hasNext(); ) {
      this.add(i.next());
    }
    this.intersectChains();
  };

  /**
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.intersectChains = function() {
    var overlapAction = new SegmentOverlapAction(this.segInt);

    for (var i = 0; i < this.monoChains.length; i++) {
      var queryChain = this.monoChains[i];
      var overlapChains = this.index.query(queryChain.getEnvelope());
      for (var j = 0; j < overlapChains.length; j++) {
        var testChain = overlapChains[j];
        /**
         * following test makes sure we only compare each pair of chains once
         * and that we don't compare a chain to itself
         */
        if (testChain.getId() > queryChain.getId()) {
          queryChain.computeOverlaps(testChain, overlapAction);
          this.nOverlaps++;
        }
        // short-circuit if possible
        if (this.segInt.isDone())
          return;
      }
    }
  };

  /**
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.add = function(segStr) {
    var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(),
        segStr);
    for (var i = 0; i < segChains.length; i++) {
      var mc = segChains[i];
      mc.setId(this.idCounter++);
      this.index.insert(mc.getEnvelope(), mc);
      this.monoChains.push(mc);
    }
  };

})();
