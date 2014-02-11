/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/noding/IntersectionFinderAdder.java
 * Revision: 108
 */

/**
 * Finds proper and interior intersections in a set of SegmentStrings,
 * and adds them as nodes.
 */

/**
 * Creates an intersection finder which finds all proper intersections
 *
 * @param li
 *          the LineIntersector to use.
 */
jsts.noding.IntersectionFinderAdder = function(li) {
  this.li = li;
  this.interiorIntersections = new javascript.util.ArrayList();
};

jsts.noding.IntersectionFinderAdder.prototype = new jsts.noding.SegmentIntersector();
jsts.noding.IntersectionFinderAdder.constructor = jsts.noding.IntersectionFinderAdder;


jsts.noding.IntersectionFinderAdder.prototype.li = null;
jsts.noding.IntersectionFinderAdder.prototype.interiorIntersections = null;


jsts.noding.IntersectionFinderAdder.prototype.getInteriorIntersections = function() {
  return this.interiorIntersections;
};

/**
 * This method is called by clients of the {@link SegmentIntersector} class to
 * process intersections for two segments of the {@link SegmentString}s being
 * intersected. Note that some clients (such as {@link MonotoneChain}s) may
 * optimize away this call for segment pairs which they have determined do not
 * intersect (e.g. by an disjoint envelope test).
 */
jsts.noding.IntersectionFinderAdder.prototype.processIntersections = function(
    e0, segIndex0, e1, segIndex1) {
  // don't bother intersecting a segment with itself
  if (e0 === e1 && segIndex0 === segIndex1)
    return;

  var p00 = e0.getCoordinates()[segIndex0];
  var p01 = e0.getCoordinates()[segIndex0 + 1];
  var p10 = e1.getCoordinates()[segIndex1];
  var p11 = e1.getCoordinates()[segIndex1 + 1];

  this.li.computeIntersection(p00, p01, p10, p11);

  if (this.li.hasIntersection()) {
    if (this.li.isInteriorIntersection()) {
      for (var intIndex = 0; intIndex < this.li.getIntersectionNum(); intIndex++) {
        this.interiorIntersections.add(this.li.getIntersection(intIndex));
      }
      e0.addIntersections(this.li, segIndex0, 0);
      e1.addIntersections(this.li, segIndex1, 1);
    }
  }
};

/**
 * Always process all intersections
 *
 * @return false always.
 */
jsts.noding.IntersectionFinderAdder.prototype.isDone = function() {
  return false;
};
