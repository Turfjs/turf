/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * Computes the intersection of line segments, and adds the intersection to
   * the edges containing the segments.
   *
   * @param {LineIntersector}
   *          li
   * @param {boolean}
   *          includeProper
   * @param {boolean}
   *          recordIsolated
   * @constructor
   */
  jsts.geomgraph.index.SegmentIntersector = function(li, includeProper, recordIsolated) {
    this.li = li;
    this.includeProper = includeProper;
    this.recordIsolated = recordIsolated;
  };


  /**
   * @param {number}
   *          i1
   * @param {number}
   *          i2
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments = function(i1, i2) {
    return Math.abs(i1 - i2) === 1;
  };


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype._hasIntersection = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProper = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInterior = false;


  /**
   * the proper intersection point found
   *
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.properIntersectionPoint = null;


  /**
   * @type {LineIntersector}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.li = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.includeProper = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.recordIsolated = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isSelfIntersection = null;


  /**
   * @type {number}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.numIntersections = 0;


  /**
   * testing only
   *
   * @type {number}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.numTests = 0;


  /**
   * @type {Array.<javascript.util.Collection>}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.bdyNodes = null;


  /**
   * @param {javascript.util.Collection}
   *          bdyNodes0
   * @param {javascript.util.Collection}
   *          bdyNodes1
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.setBoundaryNodes = function(bdyNodes0, bdyNodes1) {
    this.bdyNodes = [];
    this.bdyNodes[0] = bdyNodes0;
    this.bdyNodes[1] = bdyNodes1;
  };


  /**
   * @return {Coordinate} the proper intersection point, or <code>null</code>
   *         if none was found.
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.getProperIntersectionPoint = function() {
    return this.properIntersectionPoint;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasIntersection = function() {
    return this._hasIntersection;
  };


  /**
   * A proper intersection is an intersection which is interior to at least two
   * line segments. Note that a proper intersection is not necessarily in the
   * interior of the entire Geometry, since another edge may have an endpoint
   * equal to the intersection, which according to SFS semantics can result in
   * the point being on the Boundary of the Geometry.
   *
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperIntersection = function() {
    return this.hasProper;
  };


  /**
   * A proper interior intersection is a proper intersection which is <b>not</b>
   * contained in the set of boundary nodes set for this jsts.geomgraph.index.SegmentIntersector.
   *
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInteriorIntersection = function() {
    return this.hasProperInterior;
  };


  /**
   * A trivial intersection is an apparent self-intersection which in fact is
   * simply the point shared by adjacent line segments. Note that closed edges
   * require a special check for the point shared by the beginning and end
   * segments.
   *
   * @param {Edge}
   *          e0
   * @param {int}
   *          segIndex0
   * @param {Edge}
   *          e1
   * @param {int}
   *          segIndex1
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isTrivialIntersection = function(e0, segIndex0,
      e1, segIndex1) {
    if (e0 === e1) {
      if (this.li.getIntersectionNum() === 1) {
        if (jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments(segIndex0, segIndex1))
          return true;
        if (e0.isClosed()) {
          var maxSegIndex = e0.getNumPoints() - 1;
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
   * This method is called by clients of the EdgeIntersector class to test for
   * and add intersections for two segments of the edges being intersected. Note
   * that clients (such as MonotoneChainEdges) may choose not to intersect
   * certain pairs of segments for efficiency reasons.
   *
   * @param {Edge}
   *          e0
   * @param {int}
   *          segIndex0
   * @param {Edge}
   *          e1
   * @param {int}
   *          segIndex1
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.addIntersections = function(e0, segIndex0, e1,
      segIndex1) {
    if (e0 === e1 && segIndex0 === segIndex1)
      return;
    this.numTests++;
    var p00 = e0.getCoordinates()[segIndex0];
    var p01 = e0.getCoordinates()[segIndex0 + 1];
    var p10 = e1.getCoordinates()[segIndex1];
    var p11 = e1.getCoordinates()[segIndex1 + 1];

    this.li.computeIntersection(p00, p01, p10, p11);
    /**
     * Always record any non-proper intersections. If includeProper is true,
     * record any proper intersections as well.
     */
    if (this.li.hasIntersection()) {
      if (this.recordIsolated) {
        e0.setIsolated(false);
        e1.setIsolated(false);
      }
      this.numIntersections++;
      // if the segments are adjacent they have at least one trivial
      // intersection,
      // the shared endpoint. Don't bother adding it if it is the
      // only intersection.
      if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
        this._hasIntersection = true;
        if (this.includeProper || !this.li.isProper()) {
          e0.addIntersections(this.li, segIndex0, 0);
          e1.addIntersections(this.li, segIndex1, 1);
        }
        if (this.li.isProper()) {
          this.properIntersectionPoint = this.li.getIntersection(0).clone();
          this.hasProper = true;
          if (!this.isBoundaryPoint(this.li, this.bdyNodes))
            this.hasProperInterior = true;
        }
      }
    }
  };


  /**
   * @param {LineIntersector}
   *          li
   * @param {Array.<javascript.util.Collection>|javascript.util.Collection}
   *          bdyNodes
   * @return {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isBoundaryPoint = function(li, bdyNodes) {
    if (bdyNodes === null)
      return false;

    if (bdyNodes instanceof Array) {
      if (this.isBoundaryPoint(li, bdyNodes[0]))
        return true;
      if (this.isBoundaryPoint(li, bdyNodes[1]))
        return true;
      return false;
    } else {
      for (var i = bdyNodes.iterator(); i.hasNext();) {
        var node = i.next();
        var pt = node.getCoordinate();
        if (li.isIntersection(pt))
          return true;
      }
      return false;
    }
  };

})();
