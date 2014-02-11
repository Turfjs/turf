/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Snaps the vertices and segments of a {@link LineString} to a set of target
 * snap vertices. A snap distance tolerance is used to control where snapping is
 * performed.
 * <p>
 * The implementation handles empty geometry and empty snap vertex sets.
 *
 */

(function() {
  /**
   * Constructs a new LineStringSnapper based on provided arguments
   *
   * @constructor
   */
  var LineStringSnapper = function() {
    this.snapTolerance = 0.0;
    this.seg = new jsts.geom.LineSegment();
    this.allowSnappingToSourceVertices = false;
    this.isClosed = false;
    this.srcPts = [];

    if (arguments[0] instanceof jsts.geom.LineString) {
      this.initFromLine.apply(this, arguments);
    } else {
      this.initFromPoints.apply(this, arguments);
    }
  };

  /**
   * Creates a new snapper using the points in the given {@link LineString} as
   * source snap points.
   *
   * @param {jsts.geom.LineString}
   *          srcLine a LineString to snap (may be empty).
   * @param {Number}
   *          snapTolerance the snap tolerance to use.
   */
  LineStringSnapper.prototype.initFromLine = function(srcLine, snapTolerance) {
    this.initFromPoints(srcLine.getCoordinates(), snapTolerance);
  };

  /**
   * Creates a new snapper using the given points as source points to be
   * snapped.
   *
   * @param {Array{jsts.geom.Coordinate}}
   *          srcPts the points to snap
   * @param {Number}
   *          snapTolerance the snap tolerance to use.
   */
  LineStringSnapper.prototype.initFromPoints = function(srcPts, snapTolerance) {
    this.srcPts = srcPts;
    this.isClosed = this.calcIsClosed(srcPts);
    this.snapTolerance = snapTolerance;
  };

  LineStringSnapper.prototype.setAllowSnappingToSourceVertices = function(
      allowSnappingToSourceVertices) {
    this.allowSnappingToSourceVertices = allowSnappingToSourceVertices;
  };

  LineStringSnapper.prototype.calcIsClosed = function(pts) {
    if (pts.length <= 1) {
      return false;
    }

    return pts[0].equals(pts[pts.length - 1]);
  };

  /**
   * Snaps the vertices and segments of the source LineString to the given set
   * of snap vertices.
   *
   * @param {Array{Coordinate}}
   *          snapPts the vertices to snap to
   * @return {Array{Coordinate}} a list of the snapped points
   */
  LineStringSnapper.prototype.snapTo = function(snapPts) {
    var coordList = new jsts.geom.CoordinateList(this.srcPts);
    this.snapVertices(coordList, snapPts);
    this.snapSegments(coordList, snapPts);

    return coordList.toCoordinateArray();
  };

  /**
   * Snap source vertices to vertices in the target.
   *
   * @param {jsts.geom.CoordinateList}
   *          srcCoords the points to snap.
   * @param {Array{Coordinate}}
   *          snapPts the points to snap to
   */
  LineStringSnapper.prototype.snapVertices = function(srcCoords, snapPts) {
    // try snapping vertices
    // if src is a ring then don't snap final vertex
    var end = this.isClosed ? srcCoords.size() - 1 : srcCoords.size(), i = 0, srcPt, snapVert;
    for (i; i < end; i++) {
      srcPt = srcCoords.get(i);
      snapVert = this.findSnapForVertex(srcPt, snapPts);
      if (snapVert !== null) {
        // update src with snap pt
        srcCoords.set(i, new jsts.geom.Coordinate(snapVert));
        // keep final closing point in synch (rings only)
        if (i === 0 && this.isClosed)
          srcCoords.set(srcCoords.size() - 1, new jsts.geom.Coordinate(snapVert));
      }
    }
  };

  LineStringSnapper.prototype.findSnapForVertex = function(pt, snapPts) {
    var i = 0, il = snapPts.length;
    for (i = 0; i < il; i++) {
      // if point is already equal to a src pt, don't snap
      if (pt.equals(snapPts[i])) {
        return null;
      }

      if (pt.distance(snapPts[i]) < this.snapTolerance) {
        return snapPts[i];
      }
    }
    return null;
  };

  /**
   * Snap segments of the source to nearby snap vertices. Source segments are
   * "cracked" at a snap vertex. A single input segment may be snapped several
   * times to different snap vertices.
   * <p>
   * For each distinct snap vertex, at most one source segment is snapped to.
   * This prevents "cracking" multiple segments at the same point, which would
   * likely cause topology collapse when being used on polygonal linework.
   *
   * @param {jsts.geom.CoordinateList}
   *          srcCoords the coordinates of the source linestring to be snapped.
   * @param {Array{jsts.geom.Coordinate}}
   *          snapPts the target snap vertices
   */
  LineStringSnapper.prototype.snapSegments = function(srcCoords, snapPts) {
    // guard against empty input
    if (snapPts.length === 0) {
      return;
    }

    var distinctPtCount = snapPts.length, i, snapPt, index;

    // check for duplicate snap pts when they are sourced from a linear ring.
    // TODO: Need to do this better - need to check *all* snap points for dups
    // (using a Set?)
    if (snapPts.length>1 && snapPts[0].equals2D(snapPts[snapPts.length - 1])) {
      distinctPtCount = snapPts.length - 1;
    }

    i = 0;
    for (i; i < distinctPtCount; i++) {
      snapPt = snapPts[i];
      index = this.findSegmentIndexToSnap(snapPt, srcCoords);
      /**
       * If a segment to snap to was found, "crack" it at the snap pt. The new
       * pt is inserted immediately into the src segment list, so that
       * subsequent snapping will take place on the modified segments. Duplicate
       * points are not added.
       */
      if (index >= 0) {
        srcCoords.add(index + 1, new jsts.geom.Coordinate(snapPt), false);
      }
    }
  };

  /**
   * Finds a src segment which snaps to (is close to) the given snap point.
   * <p>
   * Only a single segment is selected for snapping. This prevents multiple
   * segments snapping to the same snap vertex, which would almost certainly
   * cause invalid geometry to be created. (The heuristic approach to snapping
   * used here is really only appropriate when snap pts snap to a unique spot on
   * the src geometry.)
   * <p>
   * Also, if the snap vertex occurs as a vertex in the src coordinate list, no
   * snapping is performed.
   *
   * @param {jsts.geom.Coordinate}
   *          snapPt the point to snap to.
   * @param {jsts.geom.CoordinateList}
   *          srcCoords the source segment coordinates.
   * @return {Number} the index of the snapped segment.
   * @return {Number} -1 if no segment snaps to the snap point.
   */
  LineStringSnapper.prototype.findSegmentIndexToSnap = function(snapPt,
      srcCoords) {
    var minDist = Number.MAX_VALUE, snapIndex = -1, i = 0, dist;
    for (i; i < srcCoords.size() - 1; i++) {
      this.seg.p0 = srcCoords.get(i);
      this.seg.p1 = srcCoords.get(i + 1);

      /**
       * Check if the snap pt is equal to one of the segment endpoints.
       *
       * If the snap pt is already in the src list, don't snap at all.
       */
      if (this.seg.p0.equals(snapPt) || this.seg.p1.equals(snapPt)) {
        if (this.allowSnappingToSourceVertices) {
          continue;
        } else {
          return -1;
        }
      }

      dist = this.seg.distance(snapPt);
      if (dist < this.snapTolerance && dist < minDist) {
        minDist = dist;
        snapIndex = i;
      }
    }
    return snapIndex;
  };

  jsts.operation.overlay.snap.LineStringSnapper = LineStringSnapper;
})();
