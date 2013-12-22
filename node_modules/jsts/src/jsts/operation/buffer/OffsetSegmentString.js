/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * A dynamic list of the vertices in a constructed offset curve. Automatically
 * removes adjacent vertices which are closer than a given tolerance.
 * @constructor
 */
jsts.operation.buffer.OffsetSegmentString = function() {
  this.ptList = [];
};


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentString.prototype.ptList = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentString.prototype.precisionModel = null;


/**
 * The distance below which two adjacent points on the curve are considered to
 * be coincident. This is chosen to be a small fraction of the offset distance.
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentString.prototype.minimimVertexDistance = 0.0;


jsts.operation.buffer.OffsetSegmentString.prototype.setPrecisionModel = function(
    precisionModel) {
  this.precisionModel = precisionModel;
};

jsts.operation.buffer.OffsetSegmentString.prototype.setMinimumVertexDistance = function(
    minimimVertexDistance) {
  this.minimimVertexDistance = minimimVertexDistance;
};

jsts.operation.buffer.OffsetSegmentString.prototype.addPt = function(pt) {
  var bufPt = new jsts.geom.Coordinate(pt);
  this.precisionModel.makePrecise(bufPt);
  // don't add duplicate (or near-duplicate) points
  if (this.isRedundant(bufPt))
    return;
  this.ptList.push(bufPt);
};

jsts.operation.buffer.OffsetSegmentString.prototype.addPts = function(pt,
    isForward) {
  if (isForward) {
    for (var i = 0; i < pt.length; i++) {
      this.addPt(pt[i]);
    }
  } else {
    for (var i = pt.length - 1; i >= 0; i--) {
      this.addPt(pt[i]);
    }
  }
};


/**
 * Tests whether the given point is redundant relative to the previous point in
 * the list (up to tolerance).
 *
 * @param pt
 * @return true if the point is redundant.
 * @private
 */
jsts.operation.buffer.OffsetSegmentString.prototype.isRedundant = function(pt) {
  if (this.ptList.length < 1)
    return false;
  var lastPt = this.ptList[this.ptList.length - 1];
  var ptDist = pt.distance(lastPt);
  if (ptDist < this.minimimVertexDistance)
    return true;
  return false;
};

jsts.operation.buffer.OffsetSegmentString.prototype.closeRing = function() {
  if (this.ptList.length < 1)
    return;
  var startPt = new jsts.geom.Coordinate(this.ptList[0]);
  var lastPt = this.ptList[this.ptList.length - 1];
  var last2Pt = null;
  if (this.ptList.length >= 2)
    last2Pt = this.ptList[this.ptList.length - 2];
  if (startPt.equals(lastPt))
    return;
  this.ptList.push(startPt);
};

jsts.operation.buffer.OffsetSegmentString.prototype.reverse = function() {

};

jsts.operation.buffer.OffsetSegmentString.prototype.getCoordinates = function() {
  return this.ptList;
};
