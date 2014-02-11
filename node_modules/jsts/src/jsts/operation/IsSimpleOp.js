/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Tests whether a <code>Geometry</code> is simple.
 * In general, the SFS specification of simplicity
 * follows the rule:
 * <ul>
 *  <li>A Geometry is simple if and only if the only self-intersections are at
 *  boundary points.</li>
 * </ul>
 * This definition relies on the definition of boundary points.
 * The SFS uses the Mod-2 rule to determine which points are on the boundary of
 * lineal geometries, but this class supports
 * using other {@link BoundaryNodeRule}s as well.
 * <p>
 * Simplicity is defined for each {@link Geometry} subclass as follows:
 * <ul>
 * <li>Valid polygonal geometries are simple by definition, so
 * <code>isSimple</code> trivially returns true.
 * (Hint: in order to check if a polygonal geometry has self-intersections,
 * use {@link Geometry#isValid}).
 * <li>Linear geometries are simple iff they do not self-intersect at points
 * other than boundary points.
 * (Using the Mod-2 rule, this means that closed linestrings
 * cannot be touched at their endpoints, since these are
 * interior points, not boundary points).
 * <li>Zero-dimensional geometries (points) are simple iff they have no
 * repeated points.
 * <li>Empty <code>Geometry</code>s are always simple
 * </ul>
 *
 * @see BoundaryNodeRule
 */



/**
 * Creates a simplicity checker using the default SFS Mod-2 Boundary Node Rule
 *
 * @param {Geometry}
 *          geom the geometry to test.
 * @constructor
 */
jsts.operation.IsSimpleOp = function(geom) {
  this.geom = geom;
};


/**
 * @type {jsts.geom.Geometry}
 */
jsts.operation.IsSimpleOp.prototype.geom = null;


/**
 * @type {boolean}
 */
jsts.operation.IsSimpleOp.prototype.isClosedEndpointsInInterior = true;


/**
 * @type {jsts.geom.Coordinate}
 */
jsts.operation.IsSimpleOp.prototype.nonSimpleLocation = null;


/**
 * Creates a simplicity checker using the default SFS Mod-2 Boundary Node Rule
 *
 * @param {Geometry}
 *          geom the geometry to test.
 */
jsts.operation.IsSimpleOp.prototype.IsSimpleOp = function(geom) {
  this.geom = geom;
};


/**
 * Tests whether the geometry is simple.
 *
 * @return {boolean} true if the geometry is simple.
 */
jsts.operation.IsSimpleOp.prototype.isSimple = function() {
  this.nonSimpleLocation = null;
  if (this.geom instanceof jsts.geom.LineString) {
    return this.isSimpleLinearGeometry(this.geom);
  }
  if (this.geom instanceof jsts.geom.MultiLineString) {
    return this.isSimpleLinearGeometry(this.geom);
  }
  if (this.geom instanceof jsts.geom.MultiPoint) {
    return this.isSimpleMultiPoint(this.geom);
  }
  // all other geometry types are simple by definition
  return true;
};


/**
 * @param {MultiPoint}
 *          mp
 * @return {boolean} true if the geometry is simple.
 * @private
 */
jsts.operation.IsSimpleOp.prototype.isSimpleMultiPoint = function(mp) {
  if (mp.isEmpty())
    return true;
  var points = [];
  for (var i = 0; i < mp.getNumGeometries(); i++) {
    var pt = mp.getGeometryN(i);
    var p = pt.getCoordinate();
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      if (p.equals2D(point)) {
        this.nonSimpleLocation = p;
        return false;
      }
    }
    points.push(p);
  }
  return true;
};


/**
 * @param {Geometry}
 *          geom input geometry.
 * @return {boolean} true if the geometry is simple.
 * @private
 */
jsts.operation.IsSimpleOp.prototype.isSimpleLinearGeometry = function(geom) {
  if (geom.isEmpty())
    return true;
  var graph = new jsts.geomgraph.GeometryGraph(0, geom);
  var li = new jsts.algorithm.RobustLineIntersector();
  var si = graph.computeSelfNodes(li, true);
  // if no self-intersection, must be simple
  if (!si.hasIntersection())
    return true;
  if (si.hasProperIntersection()) {
    this.nonSimpleLocation = si.getProperIntersectionPoint();
    return false;
  }
  if (this.hasNonEndpointIntersection(graph))
    return false;
  if (this.isClosedEndpointsInInterior) {
    if (this.hasClosedEndpointIntersection(graph))
      return false;
  }
  return true;
};


/**
 * For all edges, check if there are any intersections which are NOT at an
 * endpoint. The Geometry is not simple if there are intersections not at
 * endpoints.
 *
 * @param {GeometryGraph}
 *          graph
 * @return {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.prototype.hasNonEndpointIntersection = function(graph) {
  for (var i = graph.getEdgeIterator(); i.hasNext(); ) {
    var e = i.next();
    var maxSegmentIndex = e.getMaximumSegmentIndex();
    for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext(); ) {
      var ei = eiIt.next();
      if (! ei.isEndPoint(maxSegmentIndex)) {
        this.nonSimpleLocation = ei.getCoordinate();
        return true;
      }
    }
  }
  return false;
};


/**
 * Tests that no edge intersection is the endpoint of a closed line. This
 * ensures that closed lines are not touched at their endpoint, which is an
 * interior point according to the Mod-2 rule To check this we compute the
 * degree of each endpoint. The degree of endpoints of closed lines must be
 * exactly 2.
 *
 * @param {GeometryGraph}
 *          graph
 * @return {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.prototype.hasClosedEndpointIntersection = function(
    graph) {
  var endPoints = new javascript.util.TreeMap();
  for (var i = graph.getEdgeIterator(); i.hasNext(); ) {
    var e = i.next();
    var maxSegmentIndex = e.getMaximumSegmentIndex();
    var isClosed = e.isClosed();
    var p0 = e.getCoordinate(0);
    this.addEndpoint(endPoints, p0, isClosed);
    var p1 = e.getCoordinate(e.getNumPoints() - 1);
    this.addEndpoint(endPoints, p1, isClosed);
  }

  for (var i = endPoints.values().iterator(); i.hasNext(); ) {
    var eiInfo = i.next();
    if (eiInfo.isClosed && eiInfo.degree != 2) {
      this.nonSimpleLocation = eiInfo.getCoordinate();
      return true;
    }
  }
  return false;
};



/**
 * private
 *
 * @constructor
 */
jsts.operation.IsSimpleOp.EndpointInfo = function(pt) {

  this.pt = pt;
  this.isClosed = false;
  this.degree = 0;
};


/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.pt = null;


/**
 * @type {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.isClosed = null;


/**
 * @type {int}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.degree = null;


/**
 * @return {Coordinate}
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.getCoordinate = function() {
  return this.pt;
};


/**
 * @param {boolean}
 *          isClosed
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.addEndpoint = function(
    isClosed) {
  this.degree++;
  this.isClosed = this.isClosed || isClosed;
};


/**
 * Add an endpoint to the map, creating an entry for it if none exists
 *
 * @param {javascript.util.Map}
 *          endPoints
 * @param {jsts.geom.Coordinate}
 *          p
 * @param {boolean}
 *          isClosed
 * @private
 */
jsts.operation.IsSimpleOp.prototype.addEndpoint = function(endPoints, p,
    isClosed) {
  var eiInfo = endPoints.get(p);
  if (eiInfo === null) {
    eiInfo = new jsts.operation.IsSimpleOp.EndpointInfo(p);
    endPoints.put(p, eiInfo);
  }
  eiInfo.addEndpoint(isClosed);
};
