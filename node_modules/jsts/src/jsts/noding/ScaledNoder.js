/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/noding/ScaledNoder.java
 * Revision: 478
 */

jsts.noding.ScaledNoder = function(noder, scaleFactor, offsetX, offsetY) {
  this.offsetX = offsetX ? offsetX : 0;
  this.offsetY = offsetY ? offsetY : 0;

  this.noder = noder;
  this.scaleFactor = scaleFactor;

  // no need to scale if input precision is already integral
  this.isScaled = !this.isIntegerPrecision();
};

jsts.noding.ScaledNoder.prototype = new jsts.noding.Noder();
jsts.noding.ScaledNoder.constructor = jsts.noding.ScaledNoder;

jsts.noding.ScaledNoder.prototype.noder = null;
jsts.noding.ScaledNoder.prototype.scaleFactor = undefined;
jsts.noding.ScaledNoder.prototype.offsetX = undefined;
jsts.noding.ScaledNoder.prototype.offsetY = undefined;
jsts.noding.ScaledNoder.prototype.isScaled = false;

jsts.noding.ScaledNoder.prototype.isIntegerPrecision = function() {
  return this.scaleFactor === 1.0;
};

jsts.noding.ScaledNoder.prototype.getNodedSubstrings = function() {
  var splitSS = this.noder.getNodedSubstrings();
  if (this.isScaled)
    this.rescale(splitSS);
  return splitSS;
};

jsts.noding.ScaledNoder.prototype.computeNodes = function(inputSegStrings) {
  var intSegStrings = inputSegStrings;
  if (this.isScaled)
    intSegStrings = this.scale(inputSegStrings);
  this.noder.computeNodes(intSegStrings);
};

/**
 * @private
 */
jsts.noding.ScaledNoder.prototype.scale = function(segStrings) {
  if (segStrings instanceof Array) {
    return this.scale2(segStrings);
  }

  var transformed = new javascript.util.ArrayList();
  for (var i = segStrings.iterator(); i.hasNext();) {
    var ss = i.next();
    transformed.add(new jsts.noding.NodedSegmentString(this.scale(ss
        .getCoordinates()), ss.getData()));
  }

  return transformed;
};

/**
 * @private
 */
jsts.noding.ScaledNoder.prototype.scale2 = function(pts) {
  var roundPts = [];
  for (var i = 0; i < pts.length; i++) {
    roundPts[i] = new jsts.geom.Coordinate(Math
        .round((pts[i].x - this.offsetX) * this.scaleFactor), Math
        .round((pts[i].y - this.offsetY) * this.scaleFactor));
  }
  var roundPtsNoDup = jsts.geom.CoordinateArrays.removeRepeatedPoints(roundPts);
  return roundPtsNoDup;
};

/**
 * @private
 */
jsts.noding.ScaledNoder.prototype.rescale = function(segStrings) {
  if (segStrings instanceof Array) {
    this.rescale2(segStrings);
    return;
  }

  for (var i = segStrings.iterator(); i.hasNext();) {
    var ss = i.next();
    this.rescale(ss.getCoordinates());
  }
};

/**
 * @private
 */
jsts.noding.ScaledNoder.prototype.rescale2 = function(pts) {
  for (var i = 0; i < pts.length; i++) {
    pts[i].x = pts[i].x / this.scaleFactor + this.offsetX;
    pts[i].y = pts[i].y / this.scaleFactor + this.offsetY;
  }
};
