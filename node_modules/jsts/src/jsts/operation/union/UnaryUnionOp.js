/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

/**
 * @requires jsts/geom/util/GeometryExtracter.js
 * @requires jsts/operation/union/CascadedPolygonUnion.js
 * @requires jsts/operation/union/PointGeometryUnion.js
 * @requires jsts/operation/overlay/OverlayOp.js
 * @requires jsts/operation/overlay/snap/SnapIfNeededOverlayOp.js
 */

  var GeometryExtracter = jsts.geom.util.GeometryExtracter;
  var CascadedPolygonUnion = jsts.operation.union.CascadedPolygonUnion;
  var PointGeometryUnion = jsts.operation.union.PointGeometryUnion;
  var OverlayOp = jsts.operation.overlay.OverlayOp;
  var SnapIfNeededOverlayOp = jsts.operation.overlay.snap.SnapIfNeededOverlayOp;
  var ArrayList = javascript.util.ArrayList;

/**
 * Unions a collection of Geometry or a single Geometry (which may be a
 * collection) together. By using this special-purpose operation over a
 * collection of geometries it is possible to take advantage of various
 * optimizations to improve performance. Heterogeneous
 * {@link GeometryCollection}s are fully supported.
 * <p>
 * The result obeys the following contract:
 * <ul>
 * <li>Unioning a set of overlapping {@link Polygons}s has the effect of
 * merging the areas (i.e. the same effect as iteratively unioning all
 * individual polygons together).
 *
 * <li>Unioning a set of {@link LineString}s has the effect of <b>fully noding</b>
 * and <b>dissolving</b> the input linework. In this context "fully noded"
 * means that there will be a node or endpoint in the output for every endpoint
 * or line segment crossing in the input. "Dissolved" means that any duplicate
 * (e.g. coincident) line segments or portions of line segments will be reduced
 * to a single line segment in the output. This is consistent with the semantics
 * of the {@link Geometry#union(Geometry)} operation. If <b>merged</b> linework
 * is required, the {@link LineMerger} class can be used.
 *
 * <li>Unioning a set of {@link Points}s has the effect of merging al
 * identical points (producing a set with no duplicates).
 * </ul>
 *
 * <tt>UnaryUnion</tt> always operates on the individual components of
 * MultiGeometries. So it is possible to use it to "clean" invalid
 * self-intersecting MultiPolygons (although the polygon components must all
 * still be individually valid.)
 *
 */

  /**
   *
   * @param {jsts.geom.Geometry|Array.
   *          <jsts.geom.Geometry>} geoms a Geometry or Geometry collection.
   * @param {jsts.geom.GeometryFactory}
   *          [geomFact] a GeometryFactory.
   * @constructor
   */
  jsts.operation.union.UnaryUnionOp = function(geoms, geomFact) {
    this.polygons = new ArrayList();
    this.lines = new ArrayList();
    this.points = new ArrayList();

    if (geomFact) {
      this.geomFact = geomFact;
    }

    this.extract(geoms);
  };


  /**
   *
   * @param {jsts.geom.Geometry|Array.
   *          <jsts.geom.Geometry>} geoms a Geometry or Geometry collection.
   * @param {jsts.geom.GeometryFactory}
   *          [gemFact] a GeometryFactory.
   * @return {jsts.geom.Geometry}
   */
  jsts.operation.union.UnaryUnionOp.union = function(geoms, geomFact) {
    var op = new jsts.operation.union.UnaryUnionOp(geoms, geomFact);
    return op.union();
  };


  /**
   * @type {Array.<jsts.geom.Polygon>}
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.polygons = null;


  /**
   * @type {Array.<jsts.geom.Line>}
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.lines = null;


  /**
   * @type {Array.<jsts.geom.Point>}
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.points = null;


  /**
   * @type {jsts.geom.GeometryFactory}
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.geomFact = null;


  /**
   * @param {jsts.geom.Geometry|Array.
   *          <jsts.geom.Geometry>} geoms a Geometry or Geometry collection.
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.extract = function(geoms) {
    if (geoms instanceof ArrayList) {
      for (var i = geoms.iterator(); i.hasNext();) {
        var geom = i.next();
        this.extract(geom);
      }
    } else {
      if (this.geomFact === null) {
        this.geomFact = geoms.getFactory();
      }
      GeometryExtracter.extract(geoms, jsts.geom.Polygon,
          this.polygons);
      GeometryExtracter.extract(geoms, jsts.geom.LineString,
          this.lines);
      GeometryExtracter.extract(geoms, jsts.geom.Point,
          this.points);
    }
  };


  /**
   * Gets the union of the input geometries. If no input geometries were
   * provided, a POINT EMPTY is returned.
   *
   * @return {jsts.geom.Geometry|jsts.geom.GeometryCollection} a Geometry containing the union or an empty GEOMETRYCOLLECTION if no
   *         geometries were provided in the input.
   */
  jsts.operation.union.UnaryUnionOp.prototype.union = function() {
    if (this.geomFact === null) {
      return null;
    }

    /**
     * For points and lines, only a single union operation is required, since
     * the OGC model allowings self-intersecting MultiPoint and
     * MultiLineStrings. This is not the case for polygons, so Cascaded Union is
     * required.
     */

    var unionPoints = null;
    if (this.points.size() > 0) {
      var ptGeom = this.geomFact.buildGeometry(this.points);
      unionPoints = this.unionNoOpt(ptGeom);
    }

    var unionLines = null;
    if (this.lines.size() > 0) {
      var lineGeom = this.geomFact.buildGeometry(this.lines);
      unionLines = this.unionNoOpt(lineGeom);
    }

    var unionPolygons = null;
    if (this.polygons.size() > 0) {
      unionPolygons = CascadedPolygonUnion.union(this.polygons);
    }

    /**
     * Performing two unions is somewhat inefficient, but is mitigated by
     * unioning lines and points first
     */

    var unionLA = this.unionWithNull(unionLines, unionPolygons);
    var union = null;
    if (unionPoints === null) {
      union = unionLA;
    } else if (unionLA === null) {
      union = unionPoints;
    } else {
      union = PointGeometryUnion(unionPoints, unionLA);
    }

    if (union === null) {
      return this.geomFact.createGeometryCollection(null);
    }

    return union;
  };


  /**
   * Computes the union of two geometries, either of both of which may be null.
   *
   * @param {jsts.geom.Geometry}
   *          g0 a Geometry.
   * @param {jsts.geom.Geometry}
   *          g1 a Geometry.
   * @return {?jsts.geom.Geometry} the union of the input(s), returns null if
   *         both inputs are null.
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.unionWithNull = function(g0, g1) {
    if (g0 === null && g1 === null) {
      return null;
    }
    if (g1 === null) {
      return g0;
    }
    if (g0 === null) {
      return g1;
    }
    return g0.union(g1);
  };


  /**
   * Computes a unary union with no extra optimization, and no short-circuiting.
   * Due to the way the overlay operations are implemented, this is still
   * efficient in the case of linear and puntal geometries.
   *
   * @param {Geometry}
   *          g0
   * @return the union of the input geometry.
   * @private
   */
  jsts.operation.union.UnaryUnionOp.prototype.unionNoOpt = function(g0) {
    var empty = this.geomFact.createPoint(null);
    return SnapIfNeededOverlayOp.overlayOp(g0, empty, OverlayOp.UNION);
  };

}());
