/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/noding/snapround/MCIndexPointSnapper.java
 * Revision: 486
 */

/**
 * @requires jsts/index/chain/MonotoneChainSelectAction.js
 */

(function() {

  var HotPixelSnapAction = function(hotPixel, parentEdge, vertexIndex) {
    this.hotPixel = hotPixel;
    this.parentEdge = parentEdge;
    this.vertexIndex = vertexIndex;
  };

  HotPixelSnapAction.prototype = new jsts.index.chain.MonotoneChainSelectAction();
  HotPixelSnapAction.constructor = HotPixelSnapAction;

  HotPixelSnapAction.prototype.hotPixel = null;
  HotPixelSnapAction.prototype.parentEdge = null;
  HotPixelSnapAction.prototype.vertexIndex = null;
  HotPixelSnapAction.prototype._isNodeAdded = false;

  HotPixelSnapAction.prototype.isNodeAdded = function() {
    return this._isNodeAdded;
  };

  HotPixelSnapAction.prototype.select = function(mc, startIndex) {
    var ss = mc.getContext();
    // don't snap a vertex to itself
    if (this.parentEdge !== null) {
      if (ss === this.parentEdge && startIndex === this.vertexIndex)
        return;
    }
    // isNodeAdded = SimpleSnapRounder.addSnappedNode(hotPixel, ss, startIndex);
    this._isNodeAdded = this.hotPixel.addSnappedNode(ss, startIndex);
  };


  /**
   * "Snaps" all {@link SegmentString}s in a {@link SpatialIndex} containing
   * {@link MonotoneChain}s to a given {@link HotPixel}.
   */
  jsts.noding.snapround.MCIndexPointSnapper = function(index) {
    this.index = index;
  };

  jsts.noding.snapround.MCIndexPointSnapper.prototype.index = null;

  /**
   * Snaps (nodes) all interacting segments to this hot pixel. The hot pixel may
   * represent a vertex of an edge, in which case this routine uses the
   * optimization of not noding the vertex itself
   *
   * @param hotPixel
   *          the hot pixel to snap to.
   * @param parentEdge
   *          the edge containing the vertex, if applicable, or
   *          <code>null.</code>
   * @param vertexIndex
   *          the index of the vertex, if applicable, or -1.
   * @return <code>true</code> if a node was added for this pixel.
   */
  jsts.noding.snapround.MCIndexPointSnapper.prototype.snap = function(hotPixel,
      parentEdge, vertexIndex) {
    if (arguments.length === 1) {
      this.snap2.apply(this, arguments);
      return;
    }

    var pixelEnv = hotPixel.getSafeEnvelope();
    var hotPixelSnapAction = new HotPixelSnapAction(hotPixel, parentEdge,
        vertexIndex);

    this.index.query(pixelEnv, {
      visitItem: function(testChain) {
        testChain.select(pixelEnv, hotPixelSnapAction);
      }
    });
    return hotPixelSnapAction.isNodeAdded();
  };

  jsts.noding.snapround.MCIndexPointSnapper.prototype.snap2 = function(hotPixel) {
    return this.snap(hotPixel, null, -1);
  };

})();
