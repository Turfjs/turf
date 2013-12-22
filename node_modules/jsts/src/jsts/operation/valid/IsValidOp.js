/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Implements the algorithms required to compute the <code>isValid()</code>
 * method for {@link Geometry}s. See the documentation for the various geometry
 * types for a specification of validity.
 *
 * @version 1.7
 * @constructor
 */

jsts.operation.valid.IsValidOp = function(parentGeometry) {
  this.parentGeometry = parentGeometry;
  this.isSelfTouchingRingFormingHoleValid = false;
  this.validErr = null;
};

/**
 * Tests whether a {@link Geometry} is valid.
 *
 * @param geom
 *          the Geometry to test.
 * @return true if the geometry is valid.
 */
jsts.operation.valid.IsValidOp.isValid = function(arg) {
  if (arguments[0] instanceof jsts.geom.Coordinate) {
    if (isNaN(arg.x)) {
      return false;
    }
    if (!isFinite(arg.x) && !isNaN(arg.x)) {
      return false;
    }
    if (isNaN(arg.y)) {
      return false;
    }
    if (!isFinite(arg.y) && !isNaN(arg.y)) {
      return false;
    }
    return true;
  } else {
    var isValidOp = new jsts.operation.valid.IsValidOp(arg);
    return isValidOp.isValid();
  }
};

/**
 * Find a point from the list of testCoords that is NOT a node in the edge for
 * the list of searchCoords
 *
 * @return the point found, or <code>null</code> if none found.
 */
jsts.operation.valid.IsValidOp.findPtNotNode = function(testCoords, searchRing,
    graph) {
  // find edge corresponding to searchRing.
  var searchEdge = graph.findEdge(searchRing);
  // find a point in the testCoords which is not a node of the searchRing
  var eiList = searchEdge.getEdgeIntersectionList();
  // somewhat inefficient - is there a better way? (Use a node map, for
  // instance?)
  for (var i = 0; i < testCoords.length; i++) {
    var pt = testCoords[i];
    if (!eiList.isIntersection(pt)) {
      return pt;
    }
  }
  return null;
};

/**
 * Sets whether polygons using <b>Self-Touching Rings</b> to form holes are
 * reported as valid. If this flag is set, the following Self-Touching
 * conditions are treated as being valid:
 * <ul>
 * <li>the shell ring self-touches to create a hole touching the shell
 * <li>a hole ring self-touches to create two holes touching at a point
 * </ul>
 * <p>
 * The default (following the OGC SFS standard) is that this condition is <b>not</b>
 * valid (<code>false</code>).
 * <p>
 * This does not affect whether Self-Touching Rings disconnecting the polygon
 * interior are considered valid (these are considered to be <b>invalid</b>
 * under the SFS, and many other spatial models as well). This includes
 * "bow-tie" shells, which self-touch at a single point causing the interior to
 * be disconnected, and "C-shaped" holes which self-touch at a single point
 * causing an island to be formed.
 *
 * @param isValid
 *          states whether geometry with this condition is valid.
 */
jsts.operation.valid.IsValidOp.prototype.setSelfTouchingRingFormingHoleValid = function(
    isValid) {
  this.isSelfTouchingRingFormingHoleValid = isValid;
};

jsts.operation.valid.IsValidOp.prototype.isValid = function() {
  this.checkValid(this.parentGeometry);
  return this.validErr == null;
};

jsts.operation.valid.IsValidOp.prototype.getValidationError = function() {
  this.checkValid(this.parentGeometry);
  return this.validErr;
};

jsts.operation.valid.IsValidOp.prototype.checkValid = function(g) {
  this.validErr = null;

  // empty geometries are always valid!
  if (g.isEmpty()) {
    return;
  }

  if (g instanceof jsts.geom.Point) {
    this.checkValidPoint(g);
  } else if (g instanceof jsts.geom.MultiPoint) {
    this.checkValidMultiPoint(g);
    // LineString also handles LinearRings
  } else if (g instanceof jsts.geom.LinearRing) {
    this.checkValidLinearRing(g);
  } else if (g instanceof jsts.geom.LineString) {
    this.checkValidLineString(g);
  } else if (g instanceof jsts.geom.Polygon) {
    this.checkValidPolygon(g);
  } else if (g instanceof jsts.geom.MultiPolygon) {
    this.checkValidMultiPolygon(g);
  } else if (g instanceof jsts.geom.GeometryCollection) {
    this.checkValidGeometryCollection(g);
  } else {
    throw g.constructor;
  }
};

/**
 * Checks validity of a Point.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidPoint = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
};
/**
 * Checks validity of a MultiPoint.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidMultiPoint = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
};

/**
 * Checks validity of a LineString. Almost anything goes for linestrings!
 */
jsts.operation.valid.IsValidOp.prototype.checkValidLineString = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
  if (this.validErr != null) {
    return;
  }
  var graph = new jsts.geomgraph.GeometryGraph(0, g);
  this.checkTooFewPoints(graph);
};
/**
 * Checks validity of a LinearRing.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidLinearRing = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
  if (this.validErr != null) {
    return;
  }
  this.checkClosedRing(g);
  if (this.validErr != null) {
    return;
  }
  var graph = new jsts.geomgraph.GeometryGraph(0, g);
  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  var li = new jsts.algorithm.RobustLineIntersector();
  graph.computeSelfNodes(li, true);
  this.checkNoSelfIntersectingRings(graph);
};

/**
 * Checks the validity of a polygon. Sets the validErr flag.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidPolygon = function(g) {
  this.checkInvalidCoordinates(g);
  if (this.validErr != null) {
    return;
  }
  this.checkClosedRings(g);
  if (this.validErr != null) {
    return;
  }

  var graph = new jsts.geomgraph.GeometryGraph(0, g);

  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConsistentArea(graph);
  if (this.validErr != null) {
    return;
  }

  if (!this.isSelfTouchingRingFormingHoleValid) {
    this.checkNoSelfIntersectingRings(graph);
    if (this.validErr != null) {
      return;
    }
  }
  this.checkHolesInShell(g, graph);
  if (this.validErr != null) {
    return;
  }
  // SLOWcheckHolesNotNested(g);
  this.checkHolesNotNested(g, graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConnectedInteriors(graph);
};

jsts.operation.valid.IsValidOp.prototype.checkValidMultiPolygon = function(g) {
  var il = g.getNumGeometries();
  for (var i = 0; i < il; i++) {
    var p = g.getGeometryN(i);
    this.checkInvalidCoordinates(p);
    if (this.validErr != null) {
      return;
    }
    this.checkClosedRings(p);
    if (this.validErr != null) {
      return;
    }
  }
  // Add this
  var graph = new jsts.geomgraph.GeometryGraph(0, g);

  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConsistentArea(graph);
  if (this.validErr != null) {
    return;
  }
  if (!this.isSelfTouchingRingFormingHoleValid) {
    this.checkNoSelfIntersectingRings(graph);
    if (this.validErr != null) {
      return;
    }
  }
  for (var i = 0; i < g.getNumGeometries(); i++) {
    var p = g.getGeometryN(i);
    this.checkHolesInShell(p, graph);
    if (this.validErr != null) {
      return;
    }
  }
  for (var i = 0; i < g.getNumGeometries(); i++) {
    var p = g.getGeometryN(i);
    this.checkHolesNotNested(p, graph);
    if (this.validErr != null) {
      return;
    }
  }
  this.checkShellsNotNested(g, graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConnectedInteriors(graph);
};

jsts.operation.valid.IsValidOp.prototype.checkValidGeometryCollection = function(
    gc) {
  for (var i = 0; i < gc.getNumGeometries(); i++) {
    var g = gc.getGeometryN(i);
    this.checkValid(g);
    if (this.validErr != null) {
      return;
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkInvalidCoordinates = function(
    arg) {
  if (arg instanceof jsts.geom.Polygon) {
    var poly = arg;
    this.checkInvalidCoordinates(poly.getExteriorRing().getCoordinates());
    if (this.validErr != null) {
      return;
    }
    for (var i = 0; i < poly.getNumInteriorRing(); i++) {
      this.checkInvalidCoordinates(poly.getInteriorRingN(i).getCoordinates());
      if (this.validErr != null) {
        return;
      }
    }
  } else {
    var coords = arg;
    for (var i = 0; i < coords.length; i++) {
      if (!jsts.operation.valid.IsValidOp.isValid(coords[i])) {
        this.validErr = new jsts.operation.valid.TopologyValidationError(
            jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE,
            coords[i]);
        return;
      }
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkClosedRings = function(poly) {
  // checkClosedRing((LinearRing) poly.getExteriorRing());
  this.checkClosedRing(poly.getExteriorRing());
  if (this.validErr != null) {
    return;
  }
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    // checkClosedRing((LinearRing) poly.getInteriorRingN(i));
    this.checkClosedRing(poly.getInteriorRingN(i));
    if (this.validErr != null) {
      return;
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkClosedRing = function(ring) {
  if (!ring.isClosed()) {
    var pt = null;
    if (ring.getNumPoints() >= 1) {
      pt = ring.getCoordinateN(0);
    }
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED, pt);
  }
};

jsts.operation.valid.IsValidOp.prototype.checkTooFewPoints = function(graph) {
  if (graph.hasTooFewPoints) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS, graph
            .getInvalidPoint());
    return;
  }
};

/**
 * Checks that the arrangement of edges in a polygonal geometry graph forms a
 * consistent area.
 *
 * @param graph
 *
 * @see ConsistentAreaTester
 */
jsts.operation.valid.IsValidOp.prototype.checkConsistentArea = function(graph) {
  var cat = new jsts.operation.valid.ConsistentAreaTester(graph);
  var isValidArea = cat.isNodeConsistentArea();
  if (!isValidArea) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION, cat
            .getInvalidPoint());
    return;
  }
  if (cat.hasDuplicateRings()) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS, cat
            .getInvalidPoint());
  }
};

/**
 * Check that there is no ring which self-intersects (except of course at its
 * endpoints). This is required by OGC topology rules (but not by other models
 * such as ESRI SDE, which allow inverted shells and exverted holes).
 *
 * @param graph
 *          the topology graph of the geometry.
 */
jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRings = function(
    graph) {
  for (var i = graph.getEdgeIterator(); i.hasNext();) {
    var e = i.next();
    this.checkNoSelfIntersectingRing(e.getEdgeIntersectionList());
    if (this.validErr != null) {
      return;
    }
  }
};

/**
 * Check that a ring does not self-intersect, except at its endpoints. Algorithm
 * is to count the number of times each node along edge occurs. If any occur
 * more than once, that must be a self-intersection.
 */
jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRing = function(
    eiList) {
  var nodeSet = [];
  var isFirst = true;
  for (var i = eiList.iterator(); i.hasNext();) {
    var ei = i.next();
    if (isFirst) {
      isFirst = false;
      continue;
    }
    if (nodeSet.indexOf(ei.coord) >= 0) {
      this.validErr = new jsts.operation.valid.TopologyValidationError(
          jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION,
          ei.coord);
      return;
    } else {
      nodeSet.push(ei.coord);
    }
  }
};

/**
 * Tests that each hole is inside the polygon shell. This routine assumes that
 * the holes have previously been tested to ensure that all vertices lie on the
 * shell oon the same side of it (i.e that the hole rings do not cross the shell
 * ring). In other words, this test is only correct if the ConsistentArea test
 * is passed first. Given this, a simple point-in-polygon test of a single point
 * in the hole can be used, provided the point is chosen such that it does not
 * lie on the shell.
 *
 * @param p
 *          the polygon to be tested for hole inclusion.
 * @param graph
 *          a GeometryGraph incorporating the polygon.
 */
jsts.operation.valid.IsValidOp.prototype.checkHolesInShell = function(p, graph) {
  var shell = p.getExteriorRing();

  // PointInRing pir = new SimplePointInRing(shell);
  // PointInRing pir = new SIRtreePointInRing(shell);

  var pir = new jsts.algorithm.MCPointInRing(shell);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {

    var hole = p.getInteriorRingN(i); // Cast?
    var holePt = jsts.operation.valid.IsValidOp.findPtNotNode(hole.getCoordinates(), shell, graph);
    /**
     * If no non-node hole vertex can be found, the hole must split the polygon
     * into disconnected interiors. This will be caught by a subsequent check.
     */
    if (holePt == null) {
      return;
    }

    var outside = !pir.isInside(holePt);
    if (outside) {
      this.validErr = new jsts.operation.valid.TopologyValidationError(
          jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL,
          holePt);
      return;
    }
  }
};

/**
 * Tests that no hole is nested inside another hole. This routine assumes that
 * the holes are disjoint. To ensure this, holes have previously been tested to
 * ensure that:
 * <ul>
 * <li>they do not partially overlap (checked by
 * <code>checkRelateConsistency</code>)
 * <li>they are not identical (checked by <code>checkRelateConsistency</code>)
 * </ul>
 */
jsts.operation.valid.IsValidOp.prototype.checkHolesNotNested = function(p,
    graph) {
  var nestedTester = new jsts.operation.valid.IndexedNestedRingTester(graph);
  // SimpleNestedRingTester nestedTester = new SimpleNestedRingTester(arg[0]);
  // SweeplineNestedRingTester nestedTester = new
  // SweeplineNestedRingTester(arg[0]);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {
    var innerHole = p.getInteriorRingN(i);
    nestedTester.add(innerHole);
  }
  var isNonNested = nestedTester.isNonNested();
  if (!isNonNested) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.NESTED_HOLES, nestedTester
            .getNestedPoint());
  }
};

/**
 * Tests that no element polygon is wholly in the interior of another element
 * polygon.
 * <p>
 * Preconditions:
 * <ul>
 * <li>shells do not partially overlap
 * <li>shells do not touch along an edge
 * <li>no duplicate rings exist
 * </ul>
 * This routine relies on the fact that while polygon shells may touch at one or
 * more vertices, they cannot touch at ALL vertices.
 */
jsts.operation.valid.IsValidOp.prototype.checkShellsNotNested = function(mp,
    graph) {
  for (var i = 0; i < mp.getNumGeometries(); i++) {
    var p = mp.getGeometryN(i);
    var shell = p.getExteriorRing();
    for (var j = 0; j < mp.getNumGeometries(); j++) {
      if (i == j) {
        continue;
      }
      var p2 = mp.getGeometryN(j);
      this.checkShellNotNested(shell, p2, graph);
      if (this.validErr != null) {
        return;
      }
    }
  }
};

/**
 * Check if a shell is incorrectly nested within a polygon. This is the case if
 * the shell is inside the polygon shell, but not inside a polygon hole. (If the
 * shell is inside a polygon hole, the nesting is valid.)
 * <p>
 * The algorithm used relies on the fact that the rings must be properly
 * contained. E.g. they cannot partially overlap (this has been previously
 * checked by <code>checkRelateConsistency</code> )
 */
jsts.operation.valid.IsValidOp.prototype.checkShellNotNested = function(shell,
    p, graph) {
  var shellPts = shell.getCoordinates();
  // test if shell is inside polygon shell
  var polyShell = p.getExteriorRing();
  var polyPts = polyShell.getCoordinates();
  var shellPt = jsts.operation.valid.IsValidOp.findPtNotNode(shellPts, polyShell, graph);
  // if no point could be found, we can assume that the shell is outside the
  // polygon
  if (shellPt == null) {
    return;
  }
  var insidePolyShell = jsts.algorithm.CGAlgorithms.isPointInRing(shellPt, polyPts);
  if (!insidePolyShell) {
    return;
  }

  // if no holes, this is an error!
  if (p.getNumInteriorRing() <= 0) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.NESTED_SHELLS, shellPt);
    return;
  }

  /**
   * Check if the shell is inside one of the holes. This is the case if one of
   * the calls to checkShellInsideHole returns a null coordinate. Otherwise, the
   * shell is not properly contained in a hole, which is an error.
   */
  var badNestedPt = null;
  for (var i = 0; i < p.getNumInteriorRing(); i++) {
    var hole = p.getInteriorRingN(i);
    badNestedPt = this.checkShellInsideHole(shell, hole, graph);
    if (badNestedPt == null) {
      return;
    }
  }
  this.validErr = new jsts.operation.valid.TopologyValidationError(
      jsts.operation.valid.TopologyValidationError.NESTED_SHELLS, badNestedPt);
};

/**
 * This routine checks to see if a shell is properly contained in a hole. It
 * assumes that the edges of the shell and hole do not properly intersect.
 *
 * @return <code>null</code> if the shell is properly contained, or a
 *         Coordinate which is not inside the hole if it is not.
 *
 */
jsts.operation.valid.IsValidOp.prototype.checkShellInsideHole = function(shell,
    hole, graph) {
  var shellPts = shell.getCoordinates();
  var holePts = hole.getCoordinates();
  // TODO: improve performance of this - by sorting pointlists for instance?
  var shellPt = jsts.operation.valid.IsValidOp.findPtNotNode(shellPts, hole, graph);
  // if point is on shell but not hole, check that the shell is inside the
  // hole
  if (shellPt != null) {
    var insideHole = jsts.algorithm.CGAlgorithms.isPointInRing(shellPt, holePts);
    if (!insideHole) {
      return shellPt;
    }
  }
  var holePt = jsts.operation.valid.IsValidOp.findPtNotNode(holePts, shell, graph);
  // if point is on hole but not shell, check that the hole is outside the
  // shell
  if (holePt != null) {
    var insideShell = jsts.algorithm.CGAlgorithms.isPointInRing(holePt, shellPts);
    if (insideShell) {
      return holePt;
    }
    return null;
  }
  jsts.util.Assert
      .shouldNeverReachHere('points in shell and hole appear to be equal');
  return null;
};

jsts.operation.valid.IsValidOp.prototype.checkConnectedInteriors = function(
    graph) {
  var cit = new jsts.operation.valid.ConnectedInteriorTester(graph);
  if (!cit.isInteriorsConnected()) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR, cit
            .getCoordinate());
  }

};
