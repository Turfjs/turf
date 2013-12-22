/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/io/WKTWriter.js
 */

/**
 * A class that contains the {@link QuadEdge}s representing a planar
 * subdivision that models a triangulation.
 * The subdivision is constructed using the
 * quadedge algebra defined in the classs {@link QuadEdge}.
 * All metric calculations
 * are done in the {@link Vertex} class.
 * In addition to a triangulation, subdivisions
 * support extraction of Voronoi diagrams.
 * This is easily accomplished, since the Voronoi diagram is the dual
 * of the Delaunay triangulation.
 * <p>
 * Subdivisions can be provided with a tolerance value. Inserted vertices which
 * are closer than this value to vertices already in the subdivision will be
 * ignored. Using a suitable tolerance value can prevent robustness failures
 * from happening during Delaunay triangulation.
 * <p>
 * Subdivisions maintain a <b>frame</b> triangle around the client-created
 * edges. The frame is used to provide a bounded "container" for all edges
 * within a TIN. Normally the frame edges, frame connecting edges, and frame
 * triangles are not included in client processing.
 *
 * @author David Skea
 * @author Martin Davis
 */

/**
 * Creates a new instance of a quad-edge subdivision based on a frame triangle
 * that encloses a supplied bounding box. A new super-bounding box that contains
 * the triangle is computed and stored.
 *
 * @param env
 *          the bouding box to surround.
 * @param tolerance
 *          the tolerance value for determining if two sites are equal.
 *
 * @constructor
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision = function(env, tolerance) {
  this.tolerance = tolerance;
  this.edgeCoincidenceTolerance = tolerance / jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR;

  //used for edge extraction to ensure edge uniqueness
  this.visitedKey = 0;
  this.quadEdges = [];
  this.startingEdge;
  this.tolerance;
  this.edgeCoincidenceTolerance;
  this.frameEnv;
  this.locator = null;
  this.seg = new jsts.geom.LineSegment();
  this.triEdges = new Array(3);
  this.frameVertex = new Array(3);
  this.createFrame(env);

  this.startingEdge = this.initSubdiv();
  this.locator = new jsts.triangulate.quadedge.LastFoundQuadEdgeLocator(this);
};

jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR = 1000;

/**
 * Gets the edges for the triangle to the left of the given {@link QuadEdge}.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          startQE the starting quad-edge.
 * @param {jsts.triangulate.quadedge.QuadEdge[]}
 *          triEdge array of quadedges.
 *
 * @throws IllegalArgumentException
 *           if the edges do not form a triangle
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.getTriangleEdges = function(startQE, triEdge) {
  triEdge[0] = startQE;
  triEdge[1] = triEdge[0].lNext();
  triEdge[2] = triEdge[1].lNext();
  if (triEdge[2].lNext() != triEdge[0]) {
    throw new jsts.IllegalArgumentError('Edges do not form a triangle');
  }
};

/**
 * Creates the framing envelope
 *
 * @param {jsts.geom.Envelope}
 *          env an envelope.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.createFrame = function(env) {
  var deltaX, deltaY, offset;

  deltaX = env.getWidth();
  deltaY = env.getHeight();
  offset = 0.0;

  if (deltaX > deltaY) {
    offset = deltaX * 10.0;
  }else {
    offset = deltaY * 10.0;
  }

  this.frameVertex[0] = new jsts.triangulate.quadedge.Vertex((env.getMaxX() + env.getMinX()) / 2.0, env
      .getMaxY()
      + offset);
  this.frameVertex[1] = new jsts.triangulate.quadedge.Vertex(env.getMinX() - offset, env.getMinY() - offset);
  this.frameVertex[2] = new jsts.triangulate.quadedge.Vertex(env.getMaxX() + offset, env.getMinY() - offset);

  this.frameEnv = new jsts.geom.Envelope(this.frameVertex[0].getCoordinate(), this.frameVertex[1]
      .getCoordinate());
  this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate());
};

/**
 * @return {jsts.geom.triangulate.quadedge.QuadEdge} The quadedge.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.initSubdiv = function() {
  var ea, eb, ec;

  //build initial subdivision from frame
  ea = this.makeEdge(this.frameVertex[0], this.frameVertex[1]);
  eb = this.makeEdge(this.frameVertex[1], this.frameVertex[2]);
  jsts.triangulate.quadedge.QuadEdge.splice(ea.sym(), eb);
  ec = this.makeEdge(this.frameVertex[2], this.frameVertex[0]);
  jsts.triangulate.quadedge.QuadEdge.splice(eb.sym(), ec);
  jsts.triangulate.quadedge.QuadEdge.splice(ec.sym(), ea);

  return ea;
};

/**
 * Gets the vertex-equality tolerance value used in this subdivision
 *
 * @return {Number}
 *          the tolerance value.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTolerance = function() {
  return this.tolerance;
};



/**
 * Gets the envelope of the Subdivision (including the frame).
 *
 * @return {jsts.geom.Envelope}
 *         the envelope.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEnvelope = function() {
  return new jsts.geom.Envelope(this.frameEnv);
};

/**
 * Gets the collection of base {@link Quadedge}s (one for every pair of
 * vertices which is connected).
 *
 * @return {jsts.triangulate.quadedge.QuadEdge[]}
 *          a collection of QuadEdges.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdges = function() {
    if (arguments.length > 0) {
      return this.getEdgesByFactory(arguments[0]);
    }else {
      return this.quadEdges;
    }
};

/**
 * Sets the {@link QuadEdgeLocator} to use for locating containing triangles
 * in this subdivision.
 *
 * @param {jsts.triangulate.quadedge.QuadEdgeLocator}
 *         locator a QuadEdgeLocator.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.setLocator = function(locator) {
  this.locator = locator;
};

/**
 * Creates a new quadedge, recording it in the edges list.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *         o a Vertex.
 * @param {jsts.triangulate.quadedge.Vertex}
 *         d another Vertex.
 *
 * @return {jsts.triangulate.quadedge.QuadEdge}
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.makeEdge = function(o, d) {
  var q = jsts.triangulate.quadedge.QuadEdge.makeEdge(o, d);
  this.quadEdges.push(q);

  return q;
};

/**
 * Creates a new QuadEdge connecting the destination of a to the origin of b,
 * in such a way that all three have the same left face after the connection
 * is complete. The quadedge is recorded in the edges list.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *         a The first quadedge.
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *         b The second quadedge.
 *
 * @return {jsts.triangulate.quadedge.QuadEdge}
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.connect = function(a, b) {
  var q = jsts.triangulate.quadedge.QuadEdge.connect(a, b);
  this.quadEdges.push(q);
  return q;
};

/**
 * Deletes a quadedge from the subdivision. Linked quadedges are updated to
 * reflect the deletion.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *         e the quadedge to delete.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.delete_jsts = function(e) {
  jsts.triangulate.quadedge.QuadEdge.splice(e, e.oPrev());
  jsts.triangulate.quadedge.QuadEdge.splice(e.sym(), e.sym().oPrev());

  var eSym, eRot, eRotSym;

  e.
  eSym = e.sym();
  eRot = e.rot;
  eRotSym = e.rot.sym();

  var idx = this.quadEdges.indexOf(e);
  if (idx !== -1) {
    this.quadEdges.splice(idx, 1);
  }

  idx = this.quadEdges.indexOf(eSym);
  if (idx !== -1) {
    this.quadEdges.splice(idx, 1);
  }

  idx = this.quadEdges.indexOf(eRot);
  if (idx !== -1) {
    this.quadEdges.splice(idx, 1);
  }

  idx = this.quadEdges.indexOf(eRotSym);
  if (idx !== -1) {
    this.quadEdges.splice(idx, 1);
  }

  e.delete_jsts();
  eSym.delete_jsts();
  eRot.delete_jsts();
  eRotSym.delete_jsts();
};

/**
 * Locates an edge of a triangle which contains a location specified by a
 * Vertex v. The edge returned has the property that either v is on e, or e is
 * an edge of a triangle containing v. The search starts from startEdge amd
 * proceeds on the general direction of v.
 * <p>
 * This locate algorithm relies on the subdivision being Delaunay. For
 * non-Delaunay subdivisions, this may loop for ever.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v the location to search for.
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          startEdge an edge of the subdivision to start searching at.
 * @return {jsts.triangulate.quadedge.QuadEdge}
 *          a QuadEdge which contains v, or is on the edge of a triangle
 *          containing v.
 *
 * @throws jsts.error.LocateFailureError
 *           if the location algorithm fails to converge in a reasonable
 *           number of iterations
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateFromEdge = function(v, startEdge) {
  var iter = 0, maxIter = this.quadEdges.length, e;

  e = startEdge;

  while (true) {
    iter++;
    /**
     * So far it has always been the case that failure to locate indicates an
     * invalid subdivision. So just fail completely. (An alternative would be
     * to perform an exhaustive search for the containing triangle, but this
     * would mask errors in the subdivision topology)
     *
     * This can also happen if two vertices are located very close together,
     * since the orientation predicates may experience precision failures.
     */
    if (iter > maxIter) {
      throw new jsts.error.LocateFailureError(e.toLineSegment());
    }

    if ((v.equals(e.orig())) || (v.equals(e.dest()))) {
      break;
    } else if (v.rightOf(e)) {
      e = e.sym();
    } else if (!v.rightOf(e.oNext())) {
      e = e.oNext();
    } else if (!v.rightOf(e.dPrev())) {
      e = e.dPrev();
    } else {
      // on edge or in triangle containing edge
      break;
    }
  }

  return e;
};

/**
 * Locates a quadedge
 * Will call correct locate* -function based on arguments
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locate = function() {
  if (arguments.length === 1) {
    if (arguments[0] instanceof jsts.triangulate.quadedge.Vertex) {
      return this.locateByVertex(arguments[0]);
    }else {
      return this.locateByCoordinate(arguments[0]);
    }
  }else {
    return this.locateByCoordinates(arguments[0], arguments[1]);
  }
};

/**
 * Finds a quadedge of a triangle containing a location specified by a
 * {@link Vertex}, if one exists.
 *
 * @param  {jsts.triangulate.quadedge.Vertex}
 *          x the vertex to locate.
 * @return {jsts.triangulate.quadedge.QuadEdge}
 *          a quadedge on the edge of a triangle which touches or contains the location, null of no such triangle exists.
 */

jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByVertex = function(v) {
  return this.locator.locate(v);
};

/**
 * Finds a quadedge of a triangle containing a location specified by a
 * {@link Coordinate}, if one exists.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate to locate.
 * @return {jsts.triangulate.quadedge.QuadEdge}
 *          a quadedge on the edge of a triangle which touches or contains the
 *          location or null if no such triangle exists.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinate = function(p) {
  return this.locator.locate(new jsts.triangulate.quadedge.Vertex(p));
};

/**
 * Locates the edge between the given vertices, if it exists in the
 * subdivision.
 *
 * @param {jsts.geom.Coordinate}
 *          p0 a coordinate.
 * @param {jsts.geom.Coordinate}
 *          p1 another coordinate.
 * @return {jsts.triangulate.quadedge.QuadEdge}
 *          the edge joining the coordinates, if present, null if no such edge exists.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinates = function(p0, p1) {
  var e, base, locEdge;
  // find an edge containing one of the points
  var e = this.locator.locate(new jsts.triangulate.quadedge.Vertex(p0));
  if (e === null) {
    return null;
  }

  // normalize so that p0 is origin of base edge
  base = e;
  if (e.dest().getCoordinate().equals2D(p0)) {
    base = e.sym();
  }

  // check all edges around origin of base edge
  locEdge = base;
  do {
    if (locEdge.dest().getCoordinate().equals2D(p1)) {
      return locEdge;
    }
    locEdge = locEdge.oNext();
  } while (locEdge != base);
  return null;
};

/**
 * Inserts a new site into the Subdivision, connecting it to the vertices of
 * the containing triangle (or quadrilateral, if the split point falls on an
 * existing edge).
 * <p>
 * This method does NOT maintain the Delaunay condition. If desired, this must
 * be checked and enforced by the caller.
 * <p>
 * This method does NOT check if the inserted vertex falls on an edge. This
 * must be checked by the caller, since this situation may cause erroneous
 * triangulation
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v the vertex to insert.
 * @return {jsts.triangulate.quadedge.QuadEdge}
 *          a new quad edge terminating in v.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.insertSite = function(v) {
  var e, base, startEdge;

  e = this.locate(v);

  if ((v.equals(e.orig(), this.tolerance)) || (v.equals(e.dest(), this.tolerance))) {
    return e; // point already in subdivision.
  }

  // Connect the new point to the vertices of the containing
  // triangle (or quadrilateral, if the new point fell on an
  // existing edge.)
  base = this.makeEdge(e.orig(), v);
  jsts.triangulate.quadedge.QuadEdge.splice(base, e);
  startEdge = base;
  do {
    base = this.connect(e, base.sym());
    e = base.oPrev();
  } while (e.lNext() != startEdge);

  return startEdge;
};

/**
 * Tests whether a QuadEdge is an edge incident on a frame triangle vertex.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          e the edge to test.
 * @return {boolean}
 *          true if the edge is connected to the frame triangle.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameEdge = function(e) {
  if (this.isFrameVertex(e.orig()) || this.isFrameVertex(e.dest())) {
    return true;
  }
  return false;
};

/**
 * Tests whether a QuadEdge is an edge on the border of the frame facets and
 * the internal facets. E.g. an edge which does not itself touch a frame
 * vertex, but which touches an edge which does.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *        e the edge to test.
 * @return {boolean}
 *          true if the edge is on the border of the frame.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameBorderEdge = function(e) {
  // MD debugging
  var leftTri, rightTri, vLeftTriOther, vRightTriOther;

  leftTri = new Array(3);
  this.getTriangleEdges(e, leftTri);

  rightTri = new Array(3);
  this.getTriangleEdges(e.sym(), rightTri);

  // check other vertex of triangle to left of edge
  vLeftTriOther = e.lNext().dest();

  if (this.isFrameVertex(vLeftTriOther)) {
    return true;
  }

  // check other vertex of triangle to right of edge
  vRightTriOther = e.sym().lNext().dest();
  if (this.isFrameVertex(vRightTriOther)) {
    return true;
  }

  return false;
};

/**
 * Tests whether a vertex is a vertex of the outer triangle.
 *
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v the vertex to test.
 * @return {boolean}
 *          true if the vertex is an outer triangle vertex.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameVertex = function(v) {
  if (v.equals(this.frameVertex[0])) {
    return true;
  }
  if (v.equals(this.frameVertex[1])) {
    return true;
  }
  if (v.equals(this.frameVertex[2])) {
    return true;
  }
  return false;
};

/**
 * Tests whether a {@link Coordinate} lies on a {@link QuadEdge}, up to a
 * tolerance determined by the subdivision tolerance.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          e a QuadEdge.
 * @param {jsts.geom.Coordinate}
 *          p a point.
 * @return {boolean}
 *          true if the vertex lies on the edge.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isOnEdge = function(e, p) {
  this.seg.setCoordinates(e.orig().getCoordinate(), e.dest().getCoordinate());
  var dist = this.seg.distance(p);

  // heuristic (hack?)
  return dist < this.edgeCoincidenceTolerance;
};

/**
 * Tests whether a {@link Vertex} is the start or end vertex of a
 * {@link QuadEdge}, up to the subdivision tolerance distance.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          e the quadedge to test.
 * @param {jsts.triangulate.quadedge.Vertex}
 *          v the vertex to test.
 *
 * @return {boolean}
 *          true if the vertex is a endpoint of the edge.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isVertexOfEdge = function(e, v) {
  if ((v.equals(e.orig(), this.tolerance)) || (v.equals(e.dest(), this.tolerance))) {
    return true;
  }
  return false;
};

/**
 * Gets the unique {@link Vertex}es in the subdivision, including the frame
 * vertices if desired.
 *
 * @param {boolean}
 *          includeFrame true if the frame vertices should be included.
 * @return {jsts.triangulate.quadedge.Vertex[]} an array of the subdivision vertices.
 *
 * @see #getVertexUniqueEdges
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertices = function(includeFrame) 
{
  var vertices = [], i, il, qe, v, vd;

  i = 0, il = this.quadEdges.length;

  for (i; i < il; i++) {
    qe = this.quadEdges[i];
    v = qe.orig();

    if (includeFrame || !this.isFrameVertex(v)) {
      vertices.push(v);
    }

    /**
     * Inspect the sym edge as well, since it is possible that a vertex is
     * only at the dest of all tracked quadedges.
     */

    vd = qe.dest();
    if (includeFrame || !this.isFrameVertex(vd)) {
      vertices.push(vd);
    }
  }

  return vertices;
};

/**
 * Gets a collection of {@link QuadEdge}s whose origin vertices are a unique
 * set which includes all vertices in the subdivision. The frame vertices can
 * be included if required.
 * <p>
 * This is useful for algorithms which require traversing the subdivision
 * starting at all vertices. Returning a quadedge for each vertex is more
 * efficient than the alternative of finding the actual vertices using
 * {@link #getVertices) and then locating  quadedges attached to them.
 *
 * @param {boolean}
 *          includeFrame true if the frame vertices should be included.
 * @return {jsts.triangulate.quadedge.QuadEdge[]}
 *          a collection of QuadEdge with the vertices of the subdivision as
 *            their origins.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertexUniqueEdges = function(includeFrame) 
{
  var edges, visitedVertices, i, il, qe, v, qd, vd;

  edges = [];
  visitedVertices = [];

  i = 0, il = this.quadEdges.length;
  for (i; i < il; i++) {
    qe = this.quadEdges[i];
    v = qe.orig();

    if (visitedVertices.indexOf(v) === -1) {
      visitedVertices.push(v);
      if (includeFrame || ! this.isFrameVertex(v)) {
        edges.push(qe);
      }
    }

    /**
     * Inspect the sym edge as well, since it is possible that a vertex is
     * only at the dest of all tracked quadedges.
     */
    qd = qe.sym();
    vd = qd.orig();

    if (visitedVertices.indexOf(vd) === -1) {
      visitedVertices.push(vd);
      if (includeFrame || ! this.isFrameVertex(vd)) {
        edges.push(qd);
      }
    }
  }

  return edges;
};

/**
 * Gets all primary quadedges in the subdivision. A primary edge is a
 * {@link QuadEdge} which occupies the 0'th position in its array of
 * associated quadedges. These provide the unique geometric edges of the
 * triangulation.
 *
 * @param {boolean}
 *          includeFrame true if the frame edges are to be included.
 *
 * @return {jsts.triangulate.quadedge.QuadEdge[]}
 *          a List of QuadEdges.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getPrimaryEdges = function(includeFrame) {
  this.visitedKey++;

  var edges, edgeStack, visitedEdges, edge, priQE;

  edges = [];
  edgeStack = [];
  edgeStack.push(this.startingEdge);

  visitedEdges = [];

  while (edgeStack.length > 0) {
    edge = edgeStack.pop();
    if (visitedEdges.indexOf(edge) === -1) {
      priQE = edge.getPrimary();

      if (includeFrame || !this.isFrameEdge(priQE)) {
        edges.push(priQE);
      }

      edgeStack.push(edge.oNext());
      edgeStack.push(edge.sym().oNext());

      visitedEdges.push(edge);
      visitedEdges.push(edge.sym());
    }
  }
  return edges;
};



/*****************************************************************************
 * Visitors
 ****************************************************************************/

/**
 * Visits all quadedges with the specified visitor.
 *
 * @param {jsts.triangulate.TriangleVisitor}
 *          triVisitor the visitor to use.
 *
 * @param {boolean}
 *          includeFrame true to include frame-edges.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.visitTriangles = function(triVisitor, includeFrame) {
  this.visitedKey++;

  // visited flag is used to record visited edges of triangles
  // setVisitedAll(false);
  var edgeStack, visitedEdges, edge, triEdges;

  edgeStack = [];
  edgeStack.push(this.startingEdge);

  visitedEdges = [];

  while (edgeStack.length > 0) {
    edge = edgeStack.pop();
    if (visitedEdges.indexOf(edge) === -1) {
      triEdges = this.fetchTriangleToVisit(edge, edgeStack, includeFrame, visitedEdges);
      if (triEdges !== null)
        triVisitor.visit(triEdges);
    }
  }
};

/**
 * Stores the edges for a visited triangle. Also pushes sym (neighbour) edges
 * on stack to visit later.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          edge the quadedge.
 * @param {jsts.triangulate.quadedge.QuadEdge[]}
 *          edgeStack an array used as a stack.
 * @param {boolean}
 *          includeFrame true to include frame.
 * @param {jsts.traingulate.quadedge.QuadEdge[]}
 *          visitedEdges the edges that are already visited.
 * @return {jsts.triangulate.quadedge.QuadEdge[]}
 *          the visited triangle edges or null if the triangle should not be visited.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.fetchTriangleToVisit = function(edge, edgeStack, includeFrame, visitedEdges) {
  var curr, edgeCount, isFrame, sym;

  curr = edge;
  edgeCount = 0;
  isFrame = false;

  do {
    this.triEdges[edgeCount] = curr;

    if (this.isFrameEdge(curr)) {
      isFrame = true;
    }
    // push sym edges to visit next
    sym = curr.sym();
    if (visitedEdges.indexOf(sym) === -1) {
      edgeStack.push(sym);
    }
    // mark this edge as visited
    visitedEdges.push(curr);

    edgeCount++;
    curr = curr.lNext();
  } while (curr !== edge);

  if (isFrame && !includeFrame) {
    return null;
  }
  return this.triEdges;
};

/**
 * Gets a list of the triangles in the subdivision, specified as an array of
 * the primary quadedges around the triangle.
 *
 * @param includeFrame
 *          true if the frame triangles should be included.
 * @return {jsts.triangulate.quadedge.QuadEdge[]}
 *          a List of QuadEdge[3] arrays.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleEdges = function(includeFrame) {
  var visitor = new jsts.triangulate.quadedge.TriangleEdgesListVisitor();
  this.visitTriangles(visitor, includeFrame);
  return visitor.getTriangleEdges();
};

/**
 * Gets a list of the triangles in the subdivision, specified as an array of
 * the triangle {@link Vertex}es.
 *
 * @param {boolean}
 *          includeFrame true if the frame triangles should be included.
 * @return {jsts.triangulate.quadedge.Vertex[][]} a List of Vertex[3] arrays.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleVertices = function(includeFrame) {
  var visitor = new TriangleVertexListVisitor();
  this.visitTriangles(visitor, includeFrame);

  return visitor.getTriangleVertices();
};

/**
 * Gets the coordinates for each triangle in the subdivision as an array.
 *
 * @param {boolean}
 *          includeFrame true if the frame triangles should be included.
 * @return {jsts.geom.Coordinate[][]}
 *          a list of Coordinate[4] representing each triangle.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleCoordinates = function(includeFrame) {
  var visitor = new jsts.triangulate.quadedge.TriangleCoordinatesVisitor();
  this.visitTriangles(visitor, includeFrame);
  return visitor.getTriangles();
};



/**
 * Gets the geometry for the edges in the subdivision as a
 * {@link MultiLineString} containing 2-point lines.
 *
 * @param {jsts.geom.GeometryFactory}
 *          geomFact the GeometryFactory to use.
 * @return {jsts.geom.Geometry}
 *           a MultiLineString.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdgesByFactory = function(geomFact) {
  var quadEdges, edges, i, il, qe, coords;

  quadEdges = this.getPrimaryEdges(false);
  edges = [];

  i = 0;
  il = quadEdges.length;

  for (i; i < il; i++) {
    qe = quadEdges[i];
    coords = [];
    coords[0] = (qe.orig().getCoordinate());
    coords[1] = (qe.dest().getCoordinate());
    edges[i] = geomFact.createLineString(coords);
  }

  return geomFact.createMultiLineString(edges);
};

/**
 * Gets the geometry for the triangles in a triangulated subdivision as a
 * {@link GeometryCollection} of triangular {@link Polygon}s.
 *
 * @param {jsts.geom.GeometryFactory}
 *          geomFact the GeometryFactory to use.
 * @return {jsts.geom.Geometry}
 *          a GeometryCollection of triangular Polygons.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangles = function(geomFact) {
  var triPtsList, tris, triPt, i, il;
  triPtsList = this.getTriangleCoordinates(false);
  tris = new Array(triPtsList.length);

  i = 0, il = triPtsList.length;
  for (i; i < il; i++) {
    triPt = triPtsList[i];
    tris[i] = geomFact.createPolygon(geomFact.createLinearRing(triPt, null));
  }

  return geomFact.createGeometryCollection(tris);
};

/**
 * Gets the cells in the Voronoi diagram for this triangulation. The cells are
 * returned as a {@link GeometryCollection} of {@link Polygon}s
 * <p>
 * The userData of each polygon is set to be the {@link Coordinate) of the
 * cell site. This allows easily associating external data associated with the
 * sites to the cells.
 *
 * @param {jsts.geom.GeometryFactory}
 *          geomFact a geometry factory.
 * @return {jsts.geom.Geometry}
 *          a GeometryCollection of Polygons.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiDiagram = function(geomFact)
{
  var vorCells = this.getVoronoiCellPolygons(geomFact);
  return geomFact.createGeometryCollection(vorCells);
};

/**
 * Gets a List of {@link Polygon}s for the Voronoi cells of this
 * triangulation.
 * <p>
 * The userData of each polygon is set to be the {@link Coordinate) of the
 * cell site. This allows easily associating external data associated with the
 * sites to the cells.
 *
 * @param {jsts.geom.GeometryFactory}
 *          geomFact a geometry factory.
 * @return {jsts.geom.Polygon[]}
 *          an array of Polygons.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygons = function(geomFact)
{
  /*
   * Compute circumcentres of triangles as vertices for dual edges.
   * Precomputing the circumcentres is more efficient,
   * and more importantly ensures that the computed centres
   * are consistent across the Voronoi cells.
   */
  this.visitTriangles(new jsts.triangulate.quadedge.TriangleCircumcentreVisitor(), true);

  var cells, edges, i, il, qe;
  cells = [];
  edges = this.getVertexUniqueEdges(false);

  i = 0, il = edges.length;
  for (i; i < il; i++) {
    qe = edges[i];
    cells.push(this.getVoronoiCellPolygon(qe, geomFact));
  }

  return cells;
};

/**
 * Gets the Voronoi cell around a site specified by the origin of a QuadEdge.
 * <p>
 * The userData of the polygon is set to be the {@link Coordinate) of the
 * site. This allows attaching external data associated with the site to this
 * cell polygon.
 *
 * @param {jsts.triangulate.quadedge.QuadEdge}
 *          qe a quadedge originating at the cell site.
 * @param {jsts.geom.GeometryFactory}
 *          geomFact a factory for building the polygon.
 * @return {jsts.geom.Polygon}
 *          a polygon indicating the cell extent.
 */
jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygon = function(qe, geomFact)
{
  var cellPts, startQe, cc, coordList, cellPoly, v;

  cellPts = [];
  startQE = qe;
  do {
    // Coordinate cc = circumcentre(qe);
    // use previously computed circumcentre
    cc = qe.rot.orig().getCoordinate();
    cellPts.push(cc);

    // move to next triangle CW around vertex
    qe = qe.oPrev();
  } while (qe !== startQE);

  coordList = new jsts.geom.CoordinateList([], false);
  coordList.add(cellPts, false);
  coordList.closeRing();

  if (coordList.size() < 4) {
    //System.out.println(coordList);
    coordList.add(coordList.get(coordList.size() - 1), true);
  }

  cellPoly = geomFact.createPolygon(geomFact.createLinearRing(coordList.toArray()), null);

  v = startQE.orig();
  //cellPoly.setUserData(v.getCoordinate());
  return cellPoly;
};



/**
 * A TriangleVisitor which computes and sets the circumcentre as the origin of
 * the dual edges originating in each triangle.
 *
 * @author mbdavis
 *
 */
jsts.triangulate.quadedge.TriangleCircumcentreVisitor = function() {
};

/**
 * Visits all the edges
 *
 * @param {jsts.triangulate.quadedge.QuadEdge[]}
 *          triEdges the edges to visit.
 */
jsts.triangulate.quadedge.TriangleCircumcentreVisitor.prototype.visit = function(triEdges) {
  var a, b, c, cc, ccVertex, i;

  a = triEdges[0].orig().getCoordinate();
  b = triEdges[1].orig().getCoordinate();
  c = triEdges[2].orig().getCoordinate();

  //TODO: choose the most accurate circumcentre based on the edges
  cc = jsts.geom.Triangle.circumcentre(a, b, c);
  ccVertex = new jsts.triangulate.quadedge.Vertex(cc);

  //save the circumcentre as the origin for the dual edges originating in
  // this triangle
  i = 0;

  for (i; i < 3; i++) {
    triEdges[i].rot.setOrig(ccVertex);
  }
};

jsts.triangulate.quadedge.TriangleEdgesListVisitor = function() {
  this.triList = [];
};

jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.visit = function(triEdges) {
  var clone = triEdges.concat(); //concat without arguments returns a copy of the array
  this.triList.push(clone);
};

jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.getTriangleEdges = function() {
  return this.triList;
};

jsts.triangulate.quadedge.TriangleVertexListVisitor = function() {
  this.triList = [];
};

jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.visit = function(triEdges) {
  var vertices = [];
  vertices.push(trieEdges[0].orig());
  vertices.push(trieEdges[1].orig());
  vertices.push(trieEdges[2].orig());
  this.triList.push(vertices);
};

jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.getTriangleVertices = function() {
  return this.triList;
};

jsts.triangulate.quadedge.TriangleCoordinatesVisitor = function() {
  this.coordList = new jsts.geom.CoordinateList([], false);
  this.triCoords = [];
};

jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.visit = function(triEdges) {
  this.coordList = new jsts.geom.CoordinateList([], false);

  var i = 0, v, pts;

  for (i; i < 3; i++) {
    v = triEdges[i].orig();
    this.coordList.add(v.getCoordinate());
  }

  if (this.coordList.size() > 0) {
    this.coordList.closeRing();
    pts = this.coordList.toArray();
    if (pts.length !== 4) {
      return;
    }

    this.triCoords.push(pts);
  }
};

jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.getTriangles = function() {
  return this.triCoords;
};
