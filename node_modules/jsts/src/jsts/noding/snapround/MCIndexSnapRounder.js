/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source: /jts/jts/java/src/com/vividsolutions/jts/noding/snapround/MCIndexSnapRounder.java
 * Revision: 486
 */

/**
 * @requires jsts/algorithm/RobustLineIntersector.js
 * @requires jsts/noding/Noder.js
 */

/**
 * Uses Snap Rounding to compute a rounded, fully noded arrangement from a set
 * of {@link SegmentString}s. Implements the Snap Rounding technique described
 * in papers by Hobby, Guibas & Marimont, and Goodrich et al. Snap Rounding
 * assumes that all vertices lie on a uniform grid; hence the precision model of
 * the input must be fixed precision, and all the input vertices must be rounded
 * to that precision.
 * <p>
 * This implementation uses a monotone chains and a spatial index to speed up
 * the intersection tests.
 * <p>
 * This implementation appears to be fully robust using an integer precision
 * model. It will function with non-integer precision models, but the results
 * are not 100% guaranteed to be correctly noded.
 */
jsts.noding.snapround.MCIndexSnapRounder = function(pm) {
  this.pm = pm;
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.li.setPrecisionModel(pm);
  this.scaleFactor = pm.getScale();
};

jsts.noding.snapround.MCIndexSnapRounder.prototype = new jsts.noding.Noder();
jsts.noding.snapround.MCIndexSnapRounder.constructor = jsts.noding.snapround.MCIndexSnapRounder;


jsts.noding.snapround.MCIndexSnapRounder.prototype.pm = null;
jsts.noding.snapround.MCIndexSnapRounder.prototype.li = null;
jsts.noding.snapround.MCIndexSnapRounder.prototype.scaleFactor = null;
jsts.noding.snapround.MCIndexSnapRounder.prototype.noder = null;
jsts.noding.snapround.MCIndexSnapRounder.prototype.pointSnapper = null;
jsts.noding.snapround.MCIndexSnapRounder.prototype.nodedSegStrings = null;

jsts.noding.snapround.MCIndexSnapRounder.prototype.getNodedSubstrings = function() {
  return jsts.noding.NodedSegmentString
      .getNodedSubstrings(this.nodedSegStrings);
};

jsts.noding.snapround.MCIndexSnapRounder.prototype.computeNodes = function(
    inputSegmentStrings) {
  this.nodedSegStrings = inputSegmentStrings;
  this.noder = new jsts.noding.MCIndexNoder();
  this.pointSnapper = new jsts.noding.snapround.MCIndexPointSnapper(this.noder
      .getIndex());
  this.snapRound(inputSegmentStrings, this.li);
};

/**
 * @private
 */
jsts.noding.snapround.MCIndexSnapRounder.prototype.snapRound = function(
    segStrings, li) {
  var intersections = this.findInteriorIntersections(segStrings, li);
  this.computeIntersectionSnaps(intersections);
  this.computeVertexSnaps(segStrings);
};

/**
 * Computes all interior intersections in the collection of
 * {@link SegmentString}s, and returns their
 *
 * @link Coordinate}s.
 *
 * Does NOT node the segStrings.
 *
 * @return a list of Coordinates for the intersections.
 * @private
 */
jsts.noding.snapround.MCIndexSnapRounder.prototype.findInteriorIntersections = function(
    segStrings, li) {
  var intFinderAdder = new jsts.noding.IntersectionFinderAdder(li);
  this.noder.setSegmentIntersector(intFinderAdder);
  this.noder.computeNodes(segStrings);
  return intFinderAdder.getInteriorIntersections();
};

/**
 * Computes nodes introduced as a result of snapping segments to snap points
 * (hot pixels)
 *
 * @private
 */
jsts.noding.snapround.MCIndexSnapRounder.prototype.computeIntersectionSnaps = function(
    snapPts) {
  for (var it = snapPts.iterator(); it.hasNext();) {
    var snapPt = it.next();
    var hotPixel = new jsts.noding.snapround.HotPixel(snapPt, this.scaleFactor,
        this.li);
    this.pointSnapper.snap(hotPixel);
  }
};

/**
 * Computes nodes introduced as a result of snapping segments to vertices of
 * other segments
 *
 * @param edges
 *          the list of segment strings to snap together.
 */
jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps = function(
    edges) {
  if (edges instanceof jsts.noding.NodedSegmentString) {
    this.computeVertexSnaps2.apply(this, arguments);
    return;
  }

  for (var i0 = edges.iterator(); i0.hasNext();) {
    var edge0 = i0.next();
    this.computeVertexSnaps(edge0);
  }
};

/**
 * Performs a brute-force comparison of every segment in each
 * {@link SegmentString}. This has n^2 performance.
 *
 * @private
 */
jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps2 = function(
    e) {
  var pts0 = e.getCoordinates();
  for (var i = 0; i < pts0.length - 1; i++) {
    var hotPixel = new jsts.noding.snapround.HotPixel(pts0[i],
        this.scaleFactor, this.li);
    var isNodeAdded = this.pointSnapper.snap(hotPixel, e, i);
    // if a node is created for a vertex, that vertex must be noded too
    if (isNodeAdded) {
      e.addIntersection(pts0[i], i);
    }
  }
};
