/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/index/chain/MonotoneChainSelectAction.js
 */

/**
 * Implements {@link PointInRing} using {@link MonotoneChain}s and a
 * {@link Bintree} index to increase performance.
 *
 * @see IndexedPointInAreaLocator for more general functionality
 */
jsts.algorithm.MCPointInRing = function(ring) {
  this.ring = ring;
  this.tree = null;
  this.crossings = 0;
  this.interval = new jsts.index.bintree.Interval();
  this.buildIndex();
};

/**
 *
 * @param {jsts.geom.Coordinate}
 *          p the input coordinate.
 * @return {jsts.algorithm.MCPointInRing.MCSelecter}
 * @constructor
 */
jsts.algorithm.MCPointInRing.MCSelecter = function(p,parent) {
  this.parent = parent; //To be used instead of inner-class function calls
  this.p = p;
};

jsts.algorithm.MCPointInRing.MCSelecter.prototype = new jsts.index.chain.MonotoneChainSelectAction;
jsts.algorithm.MCPointInRing.MCSelecter.prototype.constructor = jsts.algorithm.MCPointInRing.MCSelecter;

jsts.algorithm.MCPointInRing.MCSelecter.prototype.select2 = function(ls) {
  this.parent.testLineSegment.apply(this.parent, [this.p, ls]);
  //this.testLineSegment(this.p, ls);
};

jsts.algorithm.MCPointInRing.prototype.buildIndex = function() {
  this.tree = new jsts.index.bintree.Bintree();

  var pts = jsts.geom.CoordinateArrays.removeRepeatedPoints(this.ring
      .getCoordinates());

  var mcList = jsts.index.chain.MonotoneChainBuilder.getChains(pts);

  for (var i = 0; i < mcList.length; i++) {
    var mc = mcList[i];
    var mcEnv = mc.getEnvelope();
    this.interval.min = mcEnv.getMinY();
    this.interval.max = mcEnv.getMaxY();
    this.tree.insert(this.interval, mc);
  }
};

jsts.algorithm.MCPointInRing.prototype.isInside = function(pt) {
  this.crossings = 0;

  // test all segments intersected by ray from pt in positive x direction
  var rayEnv = new jsts.geom.Envelope(-Number.MAX_VALUE, Number.MAX_VALUE, pt.y,
      pt.y);

  this.interval.min = pt.y;
  this.interval.max = pt.y;

  var segs = this.tree.query(this.interval);

  var mcSelecter = new jsts.algorithm.MCPointInRing.MCSelecter(pt, this);

  for (var i = segs.iterator(); i.hasNext();) {
    var mc = i.next();
    this.testMonotoneChain(rayEnv, mcSelecter, mc);
  }

  /*
   *  p is inside if number of crossings is odd.
   */
  if ((this.crossings % 2) == 1) {
    return true;
  }
  return false;

};

jsts.algorithm.MCPointInRing.prototype.testMonotoneChain = function(rayEnv,
    mcSelecter, mc) {
  mc.select(rayEnv, mcSelecter);
};

jsts.algorithm.MCPointInRing.prototype.testLineSegment = function(p, seg) {
  var xInt, x1, y1, x2, y2, p1, p2;

  /*
   *  Test if segment crosses ray from test point in positive x direction.
   */
  p1 = seg.p0;
  p2 = seg.p1;

  x1 = p1.x - p.x;
  y1 = p1.y - p.y;
  x2 = p2.x - p.x;
  y2 = p2.y - p.y;

  if (((y1 > 0) && (y2 <= 0)) || ((y2 > 0) && (y1 <= 0))) {
    /*
     *  segment straddles x axis, so compute intersection.
     */
    xInt = jsts.algorithm.RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) /
        (y2 - y1);
    // xsave = xInt;
    /*
     *  crosses ray if strictly positive intersection.
     */
    if (0.0 < xInt) {
      this.crossings++;
    }
  }
};
