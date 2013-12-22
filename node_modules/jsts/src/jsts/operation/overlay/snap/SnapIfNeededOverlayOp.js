/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/operation/overlay/OverlayOp.js
   * @requires jsts/operation/overlay/snap/SnapOverlayOp.js
   */

  var OverlayOp = jsts.operation.overlay.OverlayOp;
  var SnapOverlayOp = jsts.operation.overlay.snap.SnapOverlayOp;

  /**
   * Performs an overlay operation using snapping and enhanced precision to
   * improve the robustness of the result. This class only uses snapping if an
   * error is detected when running the standard JTS overlay code. Errors
   * detected include thrown exceptions (in particular,
   * {@link TopologyException}) and invalid overlay computations.
   */
  var SnapIfNeededOverlayOp = function(g1, g2) {
    this.geom = [];
    this.geom[0] = g1;
    this.geom[1] = g2;
  };

  SnapIfNeededOverlayOp.overlayOp = function(g0, g1, opCode) {
    var op = new SnapIfNeededOverlayOp(g0, g1);
    return op.getResultGeometry(opCode);
  };

  SnapIfNeededOverlayOp.intersection = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.INTERSECTION);
  };

  SnapIfNeededOverlayOp.union = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.UNION);
  };

  SnapIfNeededOverlayOp.difference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.DIFFERENCE);
  };

  SnapIfNeededOverlayOp.symDifference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.SYMDIFFERENCE);
  };

  /**
   * @private
   * @type {Array.<jsts.geom.Geometry}
   */
  SnapIfNeededOverlayOp.prototype.geom = null;


  SnapIfNeededOverlayOp.prototype.getResultGeometry = function(opCode) {
    var result = null;
    var isSuccess = false;
    var savedException = null;
    try {
      result = OverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
      var isValid = true;
      if (isValid)
        isSuccess = true;

    } catch (ex) {
      savedException = ex;
    }
    if (!isSuccess) {
      // this may still throw an exception
      // if so, throw the original exception since it has the input coordinates
      try {
        result = SnapOverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
      } catch (ex) {
        throw savedException;
      }
    }
    return result;
  };

  jsts.operation.overlay.snap.SnapIfNeededOverlayOp = SnapIfNeededOverlayOp;

})();
