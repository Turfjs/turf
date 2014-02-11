/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/overlay/snap/GeometrySnapper.java
 * Revision: 167
 */

/**
 * @requires jsts/operation/overlay/snap/LineStringSnapper.js
 * @requires jsts/geom/PrecisionModel.js
 * @requires jsts/geom/util/GeometryTransformer.js
 */

/**
 * Snaps the vertices and segments of a {@link Geometry} to another Geometry's
 * vertices. A snap distance tolerance is used to control where snapping is
 * performed. Snapping one geometry to another can improve robustness for
 * overlay operations by eliminating nearly-coincident edges (which cause
 * problems during noding and intersection calculation). Too much snapping can
 * result in invalid topology beging created, so the number and location of
 * snapped vertices is decided using heuristics to determine when it is safe to
 * snap. This can result in some potential snaps being omitted, however.
 */

(function() {

  var LineStringSnapper = jsts.operation.overlay.snap.LineStringSnapper;
  var PrecisionModel = jsts.geom.PrecisionModel;
  var TreeSet = javascript.util.TreeSet;

  /**
   * @constructor
   */
  var SnapTransformer = function(snapTolerance, snapPts, isSelfSnap) {
    this.snapTolerance = snapTolerance;
    this.snapPts = snapPts;
    this.isSelfSnap = isSelfSnap || false;
  };

  SnapTransformer.prototype = new jsts.geom.util.GeometryTransformer();

  SnapTransformer.prototype.snapTolerance = null;
  SnapTransformer.prototype.snapPts = null;
  SnapTransformer.prototype.isSelfSnap = false;


  SnapTransformer.prototype.transformCoordinates = function(coords, parent) {
    var srcPts = coords;
    var newPts = this.snapLine(srcPts, this.snapPts);
    return newPts;
  };

  SnapTransformer.prototype.snapLine = function(srcPts, snapPts) {
    var snapper = new LineStringSnapper(srcPts, this.snapTolerance);
    snapper.setAllowSnappingToSourceVertices(this.isSelfSnap);
    return snapper.snapTo(snapPts);
  };

  /**
   * Creates a new snapper acting on the given geometry
   *
   * @param srcGeom
   *          the geometry to snap.
   * @constructor
   */
  var GeometrySnapper = function(srcGeom) {
    this.srcGeom = srcGeom;
  };

  GeometrySnapper.SNAP_PRECISION_FACTOR = 1e-9;

  /**
   * Estimates the snap tolerance for a Geometry, taking into account its
   * precision model.
   *
   * @param g
   *          a Geometry.
   * @return the estimated snap tolerance.
   */
  GeometrySnapper.computeOverlaySnapTolerance = function(g) {
    if (arguments.length === 2) {
      return GeometrySnapper.computeOverlaySnapTolerance2.apply(this, arguments);
    }

    var snapTolerance = this.computeSizeBasedSnapTolerance(g);

    /**
     * Overlay is carried out in the precision model of the two inputs. If this
     * precision model is of type FIXED, then the snap tolerance must reflect
     * the precision grid size. Specifically, the snap tolerance should be at
     * least the distance from a corner of a precision grid cell to the centre
     * point of the cell.
     */
    var pm = g.getPrecisionModel();
    if (pm.getType() == PrecisionModel.FIXED) {
      var fixedSnapTol = (1 / pm.getScale()) * 2 / 1.415;
      if (fixedSnapTol > snapTolerance)
        snapTolerance = fixedSnapTol;
    }
    return snapTolerance;
  };

  GeometrySnapper.computeSizeBasedSnapTolerance = function(g) {
    var env = g.getEnvelopeInternal();
    var minDimension = Math.min(env.getHeight(), env.getWidth());
    var snapTol = minDimension * GeometrySnapper.SNAP_PRECISION_FACTOR;
    return snapTol;
  };

  GeometrySnapper.computeOverlaySnapTolerance2 = function(g0, g1) {
    return Math.min(this.computeOverlaySnapTolerance(g0), this
        .computeOverlaySnapTolerance(g1));
  };

  /**
   * Snaps two geometries together with a given tolerance.
   *
   * @param g0
   *          a geometry to snap.
   * @param g1
   *          a geometry to snap.
   * @param snapTolerance
   *          the tolerance to use.
   * @return the snapped geometries.
   */
  GeometrySnapper.snap = function(g0, g1, snapTolerance) {
    var snapGeom = [];
    var snapper0 = new GeometrySnapper(g0);
    snapGeom[0] = snapper0.snapTo(g1, snapTolerance);

    /**
     * Snap the second geometry to the snapped first geometry (this strategy
     * minimizes the number of possible different points in the result)
     */
    var snapper1 = new GeometrySnapper(g1);
    snapGeom[1] = snapper1.snapTo(snapGeom[0], snapTolerance);

    return snapGeom;
  };

  GeometrySnapper.snapToSelf = function(g0, snapTolerance, cleanResult) {
    var snapper0 = new GeometrySnapper(g0);
    return snapper0.snapToSelf(snapTolerance, cleanResult);
  };

  /**
   * @private
   */
  GeometrySnapper.prototype.srcGeom = null;

  /**
   * Snaps the vertices in the component {@link LineString}s of the source
   * geometry to the vertices of the given snap geometry.
   *
   * @param snapGeom
   *          a geometry to snap the source to.
   * @return a new snapped Geometry.
   */
  GeometrySnapper.prototype.snapTo = function(snapGeom, snapTolerance) {
    var snapPts = this.extractTargetCoordinates(snapGeom);

    var snapTrans = new SnapTransformer(snapTolerance, snapPts);
    return snapTrans.transform(this.srcGeom);
  };

  /**
   * Snaps the vertices in the component {@link LineString}s of the source
   * geometry to the vertices of the given snap geometry.
   *
   * @param snapGeom
   *          a geometry to snap the source to.
   * @return a new snapped Geometry.
   */
  GeometrySnapper.prototype.snapToSelf = function(snapTolerance, cleanResult) {
    var snapPts = this.extractTargetCoordinates(srcGeom);

    var snapTrans = new SnapTransformer(snapTolerance, snapPts, true);
    var snappedGeom = snapTrans.transform(srcGeom);
    var result = snappedGeom;
    if (cleanResult && result instanceof Polygonal) {
      // TODO: use better cleaning approach
      result = snappedGeom.buffer(0);
    }
    return result;
  };

  GeometrySnapper.prototype.extractTargetCoordinates = function(g) {
    // TODO: should do this more efficiently. Use CoordSeq filter to get points,
    // KDTree for uniqueness & queries
    var ptSet = new TreeSet();
    var pts = g.getCoordinates();
    for (var i = 0; i < pts.length; i++) {
      ptSet.add(pts[i]);
    }
    return ptSet.toArray();
  };

  /**
   * Computes the snap tolerance based on the input geometries.
   *
   * @param ringPts
   * @return
   */
  GeometrySnapper.prototype.computeSnapTolerance = function(ringPts) {
    var minSegLen = this.computeMinimumSegmentLength(ringPts);
    // use a small percentage of this to be safe
    var snapTol = minSegLen / 10;
    return snapTol;
  };

  GeometrySnapper.prototype.computeMinimumSegmentLength = function(pts) {
    var minSegLen = Number.MAX_VALUE;
    for (var i = 0; i < pts.length - 1; i++) {
      var segLen = pts[i].distance(pts[i + 1]);
      if (segLen < minSegLen)
        minSegLen = segLen;
    }
    return minSegLen;
  };

  jsts.operation.overlay.snap.GeometrySnapper = GeometrySnapper;

})();
