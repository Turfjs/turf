/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/PlanarGraph.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var Assert = jsts.util.Assert;



  /**
   * A GeometryGraph is a graph that models a given Geometry
   *
   * @param {int}
   *          argIndex
   * @param {Geometry}
   *          parentGeom
   * @param {BoundaryNodeRule}
   *          boundaryNodeRule
   * @augments jsts.planargraph.PlanarGraph
   */
  jsts.geomgraph.GeometryGraph = function(argIndex, parentGeom,
      boundaryNodeRule) {
    jsts.geomgraph.PlanarGraph.call(this);

    this.lineEdgeMap = new javascript.util.HashMap();

    this.ptLocator = new jsts.algorithm.PointLocator();

    this.argIndex = argIndex;
    this.parentGeom = parentGeom;
    this.boundaryNodeRule = boundaryNodeRule ||
        jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
    if (parentGeom !== null) {
      this.add(parentGeom);
    }
  };

  jsts.geomgraph.GeometryGraph.prototype = new jsts.geomgraph.PlanarGraph();
  jsts.geomgraph.GeometryGraph.constructor = jsts.geomgraph.GeometryGraph;

  /**
   * @return {EdgeSetIntersector}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.createEdgeSetIntersector = function() {
    return new jsts.geomgraph.index.SimpleEdgeSetIntersector();
    // TODO: use optimized version when ported
    // return new jsts.geomgraph.index.SimpleMCSweepLineIntersector();
  };

  /**
   * @param {BoundaryNodeRule}
   *          boundaryNodeRule
   * @param {int}
   *          boundaryCount
   * @return {int}
   */
  jsts.geomgraph.GeometryGraph.determineBoundary = function(boundaryNodeRule,
      boundaryCount) {
    return boundaryNodeRule.isInBoundary(boundaryCount) ? Location.BOUNDARY
        : Location.INTERIOR;
  };


  /**
   * @type {Geometry}
   */
  jsts.geomgraph.GeometryGraph.prototype.parentGeom = null;


  /**
   * The lineEdgeMap is a map of the linestring components of the parentGeometry
   * to the edges which are derived from them. This is used to efficiently
   * perform findEdge queries
   *
   * @type {Object}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.lineEdgeMap = null;


  /**
   * @type {BoundaryNodeRule}
   */
  jsts.geomgraph.GeometryGraph.prototype.boundaryNodeRule = null;


  /**
   * If this flag is true, the Boundary Determination Rule will used when
   * deciding whether nodes are in the boundary or not
   */
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.useBoundaryDeterminationRule = true;


  /**
   * the index of this geometry as an argument to a spatial function (used for
   * labelling)
   *
   * @type {number}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.argIndex = null;


  /**
   * @type {javascript.util.Collection}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.boundaryNodes = null;


  /**
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.hasTooFewPoints = false;


  /**
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.invalidPoint = null;


  /**
   * @type {PointOnGeometryLocator}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.areaPtLocator = null;


  /**
   * for use if geometry is not Polygonal
   *
   * @type {PointLocator}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.ptLocator = null;


  jsts.geomgraph.GeometryGraph.prototype.getGeometry = function() {
    return this.parentGeom;
  };

  jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodes = function() {
    if (this.boundaryNodes === null)
      this.boundaryNodes = this.nodes.getBoundaryNodes(this.argIndex);
    return this.boundaryNodes;
  };

  jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodeRule = function() {
    return this.boundaryNodeRule;
  };



  jsts.geomgraph.GeometryGraph.prototype.findEdge = function(line) {
    return this.lineEdgeMap.get(line);
  };

  jsts.geomgraph.GeometryGraph.prototype.computeSplitEdges = function(edgelist) {
    for (var i = this.edges.iterator(); i.hasNext();) {
      var e = i.next();
      e.eiList.addSplitEdges(edgelist);
    }
  }

  /**
   * @param {Geometry}
   *          g
   */
  jsts.geomgraph.GeometryGraph.prototype.add = function(g) {
    if (g.isEmpty()) {
      return;
    }

    // check if this Geometry should obey the Boundary Determination Rule
    // all collections except MultiPolygons obey the rule
    if (g instanceof jsts.geom.MultiPolygon)
      this.useBoundaryDeterminationRule = false;

    if (g instanceof jsts.geom.Polygon)
      this.addPolygon(g);
    // LineString also handles LinearRings
    else if (g instanceof jsts.geom.LineString)
      this.addLineString(g);
    else if (g instanceof jsts.geom.Point)
      this.addPoint(g);
    else if (g instanceof jsts.geom.MultiPoint)
      this.addCollection(g);
    else if (g instanceof jsts.geom.MultiLineString)
      this.addCollection(g);
    else if (g instanceof jsts.geom.MultiPolygon)
      this.addCollection(g);
    else if (g instanceof jsts.geom.GeometryCollection)
      this.addCollection(g);
    else
      throw new jsts.error.IllegalArgumentError('Geometry type not supported.');
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addCollection = function(gc) {
    for (var i = 0; i < gc.getNumGeometries(); i++) {
      var g = gc.getGeometryN(i);
      this.add(g);
    }
  };


  /**
   * Add an Edge computed externally. The label on the Edge is assumed to be
   * correct.
   */
  jsts.geomgraph.GeometryGraph.prototype.addEdge = function(e) {
    this.insertEdge(e);
    var coord = e.getCoordinates();
    // insert the endpoint as a node, to mark that it is on the boundary
    this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
    this.insertPoint(this.argIndex, coord[coord.length - 1], Location.BOUNDARY);
  };


  /**
   * Add a Point to the graph.
   */
  jsts.geomgraph.GeometryGraph.prototype.addPoint = function(p) {
    var coord = p.getCoordinate();
    this.insertPoint(this.argIndex, coord, Location.INTERIOR);
  };


  /**
   * @param {LineString}
   *          line
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addLineString = function(line) {
    var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(line
        .getCoordinates());

    if (coord.length < 2) {
      this.hasTooFewPoints = true;
      this.invalidPoint = coords[0];
      return;
    }

    // add the edge for the LineString
    // line edges do not have locations for their left and right sides
    var e = new jsts.geomgraph.Edge(coord, new jsts.geomgraph.Label(
        this.argIndex, Location.INTERIOR));
    this.lineEdgeMap.put(line, e);
    this.insertEdge(e);
    /**
     * Add the boundary points of the LineString, if any. Even if the LineString
     * is closed, add both points as if they were endpoints. This allows for the
     * case that the node already exists and is a boundary point.
     */
    Assert.isTrue(coord.length >= 2, 'found LineString with single point');
    this.insertBoundaryPoint(this.argIndex, coord[0]);
    this.insertBoundaryPoint(this.argIndex, coord[coord.length - 1]);
  };


  /**
   * Adds a polygon ring to the graph. Empty rings are ignored.
   *
   * The left and right topological location arguments assume that the ring is
   * oriented CW. If the ring is in the opposite orientation, the left and right
   * locations must be interchanged.
   *
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addPolygonRing = function(lr, cwLeft,
      cwRight) {
    // don't bother adding empty holes
    if (lr.isEmpty())
      return;

    var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(lr
        .getCoordinates());

    if (coord.length < 4) {
      this.hasTooFewPoints = true;
      this.invalidPoint = coord[0];
      return;
    }

    var left = cwLeft;
    var right = cwRight;
    if (jsts.algorithm.CGAlgorithms.isCCW(coord)) {
      left = cwRight;
      right = cwLeft;
    }
    var e = new jsts.geomgraph.Edge(coord, new jsts.geomgraph.Label(
        this.argIndex, Location.BOUNDARY, left, right));
    this.lineEdgeMap.put(lr, e);

    this.insertEdge(e);
    // insert the endpoint as a node, to mark that it is on the boundary
    this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addPolygon = function(p) {
    this.addPolygonRing(p.getExteriorRing(), Location.EXTERIOR,
        Location.INTERIOR);

    for (var i = 0; i < p.getNumInteriorRing(); i++) {
      var hole = p.getInteriorRingN(i);

      // Holes are topologically labelled opposite to the shell, since
      // the interior of the polygon lies on their opposite side
      // (on the left, if the hole is oriented CW)
      this.addPolygonRing(hole, Location.INTERIOR, Location.EXTERIOR);
    }
  };


  jsts.geomgraph.GeometryGraph.prototype.computeEdgeIntersections = function(g,
      li, includeProper) {
    var si = new jsts.geomgraph.index.SegmentIntersector(li, includeProper,
        true);
    si.setBoundaryNodes(this.getBoundaryNodes(), g.getBoundaryNodes());

    var esi = this.createEdgeSetIntersector();
    esi.computeIntersections(this.edges, g.edges, si);

    return si;
  };


  /**
   * Compute self-nodes, taking advantage of the Geometry type to minimize the
   * number of intersection tests. (E.g. rings are not tested for
   * self-intersection, since they are assumed to be valid).
   *
   * @param {LineIntersector}
   *          li the LineIntersector to use.
   * @param {boolean}
   *          computeRingSelfNodes if <false>, intersection checks are optimized
   *          to not test rings for self-intersection.
   * @return {SegmentIntersector} the SegmentIntersector used, containing
   *         information about the intersections found.
   */
  jsts.geomgraph.GeometryGraph.prototype.computeSelfNodes = function(li,
      computeRingSelfNodes) {
    var si = new jsts.geomgraph.index.SegmentIntersector(li, true, false);
    var esi = this.createEdgeSetIntersector();
    // optimized test for Polygons and Rings
    if (!computeRingSelfNodes &&
        (this.parentGeom instanceof jsts.geom.LinearRing ||
            this.parentGeom instanceof jsts.geom.Polygon || this.parentGeom instanceof jsts.geom.MultiPolygon)) {
      esi.computeIntersections(this.edges, si, false);
    } else {
      esi.computeIntersections(this.edges, si, true);
    }
    this.addSelfIntersectionNodes(this.argIndex);
    return si;
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.insertPoint = function(argIndex,
      coord, onLocation) {
    var n = this.nodes.addNode(coord);
    var lbl = n.getLabel();
    if (lbl == null) {
      n.label = new jsts.geomgraph.Label(argIndex, onLocation);
    } else
      lbl.setLocation(argIndex, onLocation);
  };


  /**
   * Adds candidate boundary points using the current {@link BoundaryNodeRule}.
   * This is used to add the boundary points of dim-1 geometries
   * (Curves/MultiCurves).
   */
  jsts.geomgraph.GeometryGraph.prototype.insertBoundaryPoint = function(
      argIndex, coord) {
    var n = this.nodes.addNode(coord);
    var lbl = n.getLabel();
    // the new point to insert is on a boundary
    var boundaryCount = 1;
    // determine the current location for the point (if any)
    var loc = Location.NONE;
    if (lbl !== null)
      loc = lbl.getLocation(argIndex, Position.ON);
    if (loc === Location.BOUNDARY)
      boundaryCount++;

    // determine the boundary status of the point according to the Boundary
    // Determination Rule
    var newLoc = jsts.geomgraph.GeometryGraph.determineBoundary(
        this.boundaryNodeRule, boundaryCount);
    lbl.setLocation(argIndex, newLoc);
  };


  /**
   * add edge intersections as self intersections from each edge intersection
   * list
   *
   * @param argIndex
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNodes = function(
      argIndex) {
    for (var i = this.edges.iterator(); i.hasNext();) {
      var e = i.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.eiList.iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        this.addSelfIntersectionNode(argIndex, ei.coord, eLoc);
      }
    }
  };


  /**
   * Add a node for a self-intersection. If the node is a potential boundary
   * node (e.g. came from an edge which is a boundary) then insert it as a
   * potential boundary node. Otherwise, just add it as a regular node.
   *
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNode = function(
      argIndex, coord, loc) {
    // if this node is already a boundary node, don't change it
    if (this.isBoundaryNode(argIndex, coord))
      return;
    if (loc === Location.BOUNDARY && this.useBoundaryDeterminationRule)
      this.insertBoundaryPoint(argIndex, coord);
    else
      this.insertPoint(argIndex, coord, loc);
  };

  jsts.geomgraph.GeometryGraph.prototype.getInvalidPoint = function() {
    return this.invalidPoint;
  };

})();

// TODO: port rest of class
