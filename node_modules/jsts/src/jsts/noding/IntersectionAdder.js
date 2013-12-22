/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 *@requires jsts/noding/SegmentIntersector.js
 */

/**
 * Computes the intersections between two line segments in {@link SegmentString}s
 * and adds them to each string. The {@link SegmentIntersector} is passed to a
 * {@link Noder}. The {@link addIntersections} method is called whenever the
 * {@link Noder} detects that two SegmentStrings <i>might</i> intersect. This
 * class is an example of the <i>Strategy</i> pattern.
 *
 * @constructor
 */
jsts.noding.IntersectionAdder = function(li) {
  this.li = li;
};

jsts.noding.IntersectionAdder.prototype = new jsts.noding.SegmentIntersector();
jsts.noding.IntersectionAdder.constructor = jsts.noding.IntersectionAdder;


jsts.noding.IntersectionAdder.isAdjacentSegments = function(i1, i2) {
  return Math.abs(i1 - i2) === 1;
};

/**
 * These variables keep track of what types of intersections were found during
 * ALL edges that have been intersected.
 */
/**
 * @type {boolean}
 * @private
 */
jsts.noding.IntersectionAdder.prototype._hasIntersection = false;
/**
 * @type {boolean}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.hasProper = false;
/**
 * @type {boolean}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.hasProperInterior = false;
/**
 * @type {boolean}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.hasInterior = false;

// the proper intersection point found

/**
 * @type {Coordinate}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.properIntersectionPoint = null;

/**
 * @type {LineIntersector}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.li = null;
/**
 * @type {boolean}
 * @private
 */
jsts.noding.IntersectionAdder.prototype.isSelfIntersection = null;

jsts.noding.IntersectionAdder.prototype.numIntersections = 0;
jsts.noding.IntersectionAdder.prototype.numInteriorIntersections = 0;
jsts.noding.IntersectionAdder.prototype.numProperIntersections = 0;

// testing only
jsts.noding.IntersectionAdder.prototype.numTests = 0;


jsts.noding.IntersectionAdder.prototype.getLineIntersector = function() {
  return this.li;
};

/**
 * @return the proper intersection point, or <code>null</code> if none was
 *         found.
 */
jsts.noding.IntersectionAdder.prototype.getProperIntersectionPoint = function() {
  return this.properIntersectionPoint;
};

jsts.noding.IntersectionAdder.prototype.hasIntersection = function() {
  return this._hasIntersection;
};
/**
 * A proper intersection is an intersection which is interior to at least two
 * line segments. Note that a proper intersection is not necessarily in the
 * interior of the entire Geometry, since another edge may have an endpoint
 * equal to the intersection, which according to SFS semantics can result in the
 * point being on the Boundary of the Geometry.
 */
jsts.noding.IntersectionAdder.prototype.hasProperIntersection = function() {
  return this.hasProper;
};
/**
 * A proper interior intersection is a proper intersection which is <b>not</b>
 * contained in the set of boundary nodes set for this SegmentIntersector.
 */
jsts.noding.IntersectionAdder.prototype.hasProperInteriorIntersection = function() {
  return this.hasProperInterior;
};
/**
 * An interior intersection is an intersection which is in the interior of some
 * segment.
 */
jsts.noding.IntersectionAdder.prototype.hasInteriorIntersection = function() {
  return this.hasInterior;
};

/**
 * A trivial intersection is an apparent self-intersection which in fact is
 * simply the point shared by adjacent line segments. Note that closed edges
 * require a special check for the point shared by the beginning and end
 * segments.
 *
 * @private
 */
jsts.noding.IntersectionAdder.prototype.isTrivialIntersection = function(e0,
    segIndex0, e1, segIndex1) {
  if (e0 == e1) {
    if (this.li.getIntersectionNum() == 1) {
      if (jsts.noding.IntersectionAdder
          .isAdjacentSegments(segIndex0, segIndex1))
        return true;
      if (e0.isClosed()) {
        var maxSegIndex = e0.size() - 1;
        if ((segIndex0 === 0 && segIndex1 === maxSegIndex) ||
            (segIndex1 === 0 && segIndex0 === maxSegIndex)) {
          return true;
        }
      }
    }
  }
  return false;
};

/**
 * This method is called by clients of the {@link SegmentIntersector} class to
 * process intersections for two segments of the {@link SegmentString}s being
 * intersected. Note that some clients (such as {@link MonotoneChain}s) may
 * optimize away this call for segment pairs which they have determined do not
 * intersect (e.g. by an disjoint envelope test).
 */
jsts.noding.IntersectionAdder.prototype.processIntersections = function(e0,
    segIndex0, e1, segIndex1) {
  if (e0 === e1 && segIndex0 === segIndex1)
    return;
  this.numTests++;
  var p00 = e0.getCoordinates()[segIndex0];
  var p01 = e0.getCoordinates()[segIndex0 + 1];
  var p10 = e1.getCoordinates()[segIndex1];
  var p11 = e1.getCoordinates()[segIndex1 + 1];

  this.li.computeIntersection(p00, p01, p10, p11);
  if (this.li.hasIntersection()) {
    this.numIntersections++;
    if (this.li.isInteriorIntersection()) {
      this.numInteriorIntersections++;
      this.hasInterior = true;
    }
    // if the segments are adjacent they have at least one trivial intersection,
    // the shared endpoint. Don't bother adding it if it is the
    // only intersection.
    if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
      this._hasIntersection = true;
      e0.addIntersections(this.li, segIndex0, 0);
      e1.addIntersections(this.li, segIndex1, 1);
      if (this.li.isProper()) {
        this.numProperIntersections++;
        this.hasProper = true;
        this.hasProperInterior = true;
      }
    }
  }
};

/**
 * Always process all intersections
 *
 * @return false always.
 */
jsts.noding.IntersectionAdder.prototype.isDone = function() {
  return false;
};
