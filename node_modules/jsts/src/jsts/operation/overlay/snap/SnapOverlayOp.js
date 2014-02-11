/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/overlay/snap/SnapOverlayOp.java
 * Revision: 150
 */

/**
 * @requires jsts/operation/overlay/snap/GeometrySnapper.js
 * @requires jsts/operation/overlay/OverlayOp.js
 * TODO: reenable when ported: requires jsts/precision/CommonBitsRemover.js
 */

/**
 * Performs an overlay operation using snapping and enhanced precision to
 * improve the robustness of the result. This class <i>always</i> uses
 * snapping. This is less performant than the standard JTS overlay code, and may
 * even introduce errors which were not present in the original data. For this
 * reason, this class should only be used if the standard overlay code fails to
 * produce a correct result.
 */

(function() {

  var OverlayOp = jsts.operation.overlay.OverlayOp;
  var GeometrySnapper = jsts.operation.overlay.snap.GeometrySnapper;

  /**
   * @constructor
   */
  var SnapOverlayOp = function(g1, g2) {
    this.geom = [];
    this.geom[0] = g1;
    this.geom[1] = g2;
    this.computeSnapTolerance();
  };

  SnapOverlayOp.overlayOp = function(g0, g1, opCode) {
    var op = new SnapOverlayOp(g0, g1);
    return op.getResultGeometry(opCode);
  };

  SnapOverlayOp.intersection = function(g0, g1) {
    return this.overlayOp(g0, g1, OverlayOp.INTERSECTION);
  };

  SnapOverlayOp.union = function(g0, g1) {
    return this.overlayOp(g0, g1, OverlayOp.UNION);
  };

  SnapOverlayOp.difference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.DIFFERENCE);
  };

  SnapOverlayOp.symDifference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.SYMDIFFERENCE);
  };


  SnapOverlayOp.prototype.geom = null;
  SnapOverlayOp.prototype.snapTolerance = null;

  /**
   * @private
   */
  SnapOverlayOp.prototype.computeSnapTolerance = function() {
    this.snapTolerance = GeometrySnapper.computeOverlaySnapTolerance(
        this.geom[0], this.geom[1]);
  };

  SnapOverlayOp.prototype.getResultGeometry = function(opCode) {
    var prepGeom = this.snap(this.geom);
    var result = OverlayOp.overlayOp(prepGeom[0], prepGeom[1], opCode);
    return this.prepareResult(result);
  };

  /**
   * @private
   */
  SnapOverlayOp.prototype.selfSnap = function(geom) {
    var snapper0 = new GeometrySnapper(geom);
    var snapGeom = snapper0.snapTo(geom, this.snapTolerance);
    return snapGeom;
  };

  /**
   * @private
   */
  SnapOverlayOp.prototype.snap = function(geom) {
    // TODO: CommonBitsRemover isn't ported yet...
    var remGeom = geom;//this.removeCommonBits(geom);

    var snapGeom = GeometrySnapper.snap(remGeom[0], remGeom[1],
        this.snapTolerance);

    return snapGeom;
  };

  /**
   * @private
   */
  SnapOverlayOp.prototype.prepareResult = function(geom) {
 // TODO: CommonBitsRemover isn't ported yet...
    //this.cbr.addCommonBits(geom);
    return geom;
  };

  /**
   * @private
   * @type {CommonBitsRemover}
   */
  SnapOverlayOp.prototype.cbr = null;

  /**
   * @private
   */
  SnapOverlayOp.prototype.removeCommonBits = function(geom) {
    this.cbr = new jsts.precision.CommonBitsRemover();
    this.cbr.add(this.geom[0]);
    this.cbr.add(this.geom[1]);
    var remGeom = [];
    remGeom[0] = cbr.removeCommonBits(this.geom[0].clone());
    remGeom[1] = cbr.removeCommonBits(this.geom[1].clone());
    return remGeom;
  };

  jsts.operation.overlay.snap.SnapOverlayOp = SnapOverlayOp;

})();
