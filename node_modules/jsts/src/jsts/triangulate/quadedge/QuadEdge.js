/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


(function() {
  /**
   * A class that represents the edge data structure which implements the quadedge algebra.
   * The quadedge algebra was described in a well-known paper by Guibas and Stolfi,
   * "Primitives for the manipulation of general subdivisions and the computation of Voronoi diagrams",
   * <i>ACM Transactions on Graphics</i>, 4(2), 1985, 75-123.
   * <p>
   * Each edge object is part of a quartet of 4 edges,
   * linked via their <tt>rot</tt> references.
   * Any edge in the group may be accessed using a series of {@link #rot} operations.
   * Quadedges in a subdivision are linked together via their <tt>next</tt> references.
   * The linkage between the quadedge quartets determines the topology
   * of the subdivision.
   * <p>
   * The edge class does not contain separate information for vertice or faces; a vertex is implicitly
   * defined as a ring of edges (created using the <tt>next</tt> field).
   *
   * @author David Skea
   * @author Martin Davis
   */

  /**
   * Quadedges must be made using {@link makeEdge},
   * to ensure proper construction.
   *
   * @constructor
   */
  jsts.triangulate.quadedge.QuadEdge = function() {
    // the dual of this edge, directed from right to left
    this.rot = null;
    this.vertex = null;            // The vertex that this edge represents
    this.next = null;              // A reference to a connected edge
    this.data = null;
  };

  var QuadEdge = jsts.triangulate.quadedge.QuadEdge;

  /**
   * Creates a new QuadEdge quartet from {@link Vertex} o to {@link Vertex} d.
   *
   * @param {jsts.triangulate.quadedge.Vertex}
   *        o the origin Vertex.
   * @param {jsts.triangulate.quadedge.Vertex}
   *        d the destination Vertex.
   * @return the new QuadEdge quartet.
   */
  jsts.triangulate.quadedge.QuadEdge.makeEdge = function(o, d) {
    var q0, q1, q2, q3, base;

    q0 = new QuadEdge();
    q1 = new QuadEdge();
    q2 = new QuadEdge();
    q3 = new QuadEdge();

    q0.rot = q1;
    q1.rot = q2;
    q2.rot = q3;
    q3.rot = q0;

    q0.setNext(q0);
    q1.setNext(q3);
    q2.setNext(q2);
    q3.setNext(q1);

    base = q0;
    base.setOrig(o);
    base.setDest(d);
    return base;
  };

  /**
   * Creates a new QuadEdge connecting the destination of a to the origin of
   * b, in such a way that all three have the same left face after the
   * connection is complete. Additionally, the data pointers of the new edge
   * are set.
   *
   * @param  {jsts.triangulate.quadedge.QuadEdge}
   *          a the first edge to connect.
   * @param  {jsts.triangulate.quadedge.QuadEdge}
   *          b the second edge to connect.
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the connected edge.
   */
  jsts.triangulate.quadedge.QuadEdge.connect = function(a, b) {
      var e = QuadEdge.makeEdge(a.dest(), b.orig());
      QuadEdge.splice(e, a.lNext());
      QuadEdge.splice(e.sym(), b);
      return e;
  };

  /**
   * Splices two edges together or apart.
   * Splice affects the two edge rings around the origins of a and b, and, independently, the two
   * edge rings around the left faces of <tt>a</tt> and <tt>b</tt>.
   * In each case, (i) if the two rings are distinct,
   * Splice will combine them into one, or (ii) if the two are the same ring, Splice will break it
   * into two separate pieces. Thus, Splice can be used both to attach the two edges together, and
   * to break them apart.
   *
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          a an edge to splice.
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          b an edge to splice.
   */
  jsts.triangulate.quadedge.QuadEdge.splice = function(a, b) {
      var alpha, beta, t1, t2, t3, t4;
      alpha = a.oNext().rot;
      beta = b.oNext().rot;

      t1 = b.oNext();
      t2 = a.oNext();
      t3 = beta.oNext();
      t4 = alpha.oNext();

      a.setNext(t1);
      b.setNext(t2);
      alpha.setNext(t3);
      beta.setNext(t4);
  };

  /**
   * Turns an edge counterclockwise inside its enclosing quadrilateral.
   *
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          e the quadedge to turn.
   */
  jsts.triangulate.quadedge.QuadEdge.swap = function(e) {
    var a, b;
    a = e.oPrev();
    b = e.sym().oPrev();
    QuadEdge.splice(e, a);
    QuadEdge.splice(e.sym(), b);
    QuadEdge.splice(e, a.lNext());
    QuadEdge.splice(e.sym(), b.lNext());
    e.setOrig(a.dest());
    e.setDest(b.dest());
  };

  /**
   * Gets the primary edge of this quadedge and its <tt>sym</tt>.
   * The primary edge is the one for which the origin
   * and destination coordinates are ordered
   * according to the standard {@link Coordinate} ordering
   *
   * @return the primary quadedge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.getPrimary = function() {
    if (this.orig().getCoordinate().compareTo(this.dest().getCoordinate()) <= 0) {
      return this;
    }
    else {
      return this.sym();
    }
  };

  /**
   * Sets the external data value for this edge.
   *
   * @param {Object}
   *          data an object containing external data.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.setData = function(data) {
      this.data = data;
  };

  /**
   * Gets the external data value for this edge.
   *
   * @return {Object}
   *          the data object.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.getData = function() {
      return this.data;
  };

  /**
   * Marks this quadedge as being deleted.
   * This does not free the memory used by
   * this quadedge quartet, but indicates
   * that this edge no longer participates
   * in a subdivision.
   *
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.delete_jsts = function() {
    this.rot = null;
  };

  /**
   * Tests whether this edge has been deleted.
   *
   * @return {boolean}
   *          true if this edge has not been deleted.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.isLive = function() {
    return this.rot !== null;
  };


  /**
   * Sets the connected edge
   *
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          next next-edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.setNext = function(next) {
      this.next = next;
  };

  /***************************************************************************
   * QuadEdge Algebra
   ***************************************************************************
   */

  /**
   * Gets the dual of this edge, directed from its left to its right.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the inverse rotated edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.invRot = function() {
    return this.rot.sym();
  };

  /**
   * Gets the edge from the destination to the origin of this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the sym of the edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.sym = function() {
    return this.rot.rot;
  };

  /**
   * Gets the next CCW edge around the origin of this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the next linked edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.oNext = function() {
      return this.next;
  };

  /**
   * Gets the next CW edge around (from) the origin of this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the previous edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.oPrev = function() {
      return this.rot.next.rot;
  };

  /**
   * Gets the next CCW edge around (into) the destination of this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the next destination edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.dNext = function() {
      return this.sym().oNext().sym();
  };

  /**
   * Gets the next CW edge around (into) the destination of this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the previous destination edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.dPrev = function() {
      return this.invRot().oNext().invRot();
  };

  /**
   * Gets the CCW edge around the left face following this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the next left face edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.lNext = function() {
      return this.invRot().oNext().rot;
  };

  /**
   * Gets the CCW edge around the left face before this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the previous left face edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.lPrev = function() {
      return this.next.sym();
  };

  /**
   * Gets the edge around the right face ccw following this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the next right face edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.rNext = function() {
      return this.rot.next.invRot();
  };

  /**
   * Gets the edge around the right face ccw before this edge.
   *
   * @return {jsts.triangulate.quadedge.QuadEdge}
   *          the previous right face edge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.rPrev = function() {
      return this.sym().oNext();
  };

  /***********************************************************************************************
   * Data Access
   **********************************************************************************************/
  /**
   * Sets the vertex for this edge's origin
   *
   * @param {jsts.triangulate.quadedge.Vertex}
   *          o the origin vertex.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.setOrig = function(o) {
      this.vertex = o;
  };

  /**
   * Sets the vertex for this edge's destination
   *
   * @param {jsts.triangulate.quadedge.Vertex}
   *          d the destination vertex.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.setDest = function(d) {
      this.sym().setOrig(d);
  };

  /**
   * Gets the vertex for the edge's origin
   *
   * @return {jsts.triangulate.quadedge.Vertex}
   *          the origin vertex.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.orig = function() {
      return this.vertex;
  };

  /**
   * Gets the vertex for the edge's destination
   *
   * @return {jsts.triangulate.quadedge.Vertex}
   *          the destination vertex.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.dest = function() {
      return this.sym().orig();
  };

  /**
   * Gets the length of the geometry of this quadedge.
   *
   * @return {number}
   *          the length of the quadedge.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.getLength = function() {
      return this.orig().getCoordinate().distance(dest().getCoordinate());
  };

  /**
   * Tests if this quadedge and another have the same line segment geometry,
   * regardless of orientation.
   *
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          qe a quadege.
   * @return {boolean}
   *          true if the quadedges are based on the same line segment regardless of orientation.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.equalsNonOriented = function(qe) {
      if (this.equalsOriented(qe)) {
          return true;
      }

      if (this.equalsOriented(qe.sym())) {
          return true;
      }

      return false;
  };

  /**
   * Tests if this quadedge and another have the same line segment geometry
   * with the same orientation.
   *
   * @param {jsts.triangulate.quadedge.QuadEdge}
   *          qe a quadege.
   * @return {boolean}
   *          true if the quadedges are based on the same line segment.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.equalsOriented = function(qe) {
      if (this.orig().getCoordinate().equals2D(qe.orig().getCoordinate())
              && this.dest().getCoordinate().equals2D(qe.dest().getCoordinate())) {
          return true;
      }
      return false;
  };

  /**
   * Creates a {@link LineSegment} representing the
   * geometry of this edge.
   *
   * @return {jsts.geom.LineSegment}
   *          a LineSegment.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.toLineSegment = function()
  {
    return new jsts.geom.LineSegment(this.vertex.getCoordinate(), this.dest().getCoordinate());
  };

  /**
   * Converts this edge to a WKT two-point <tt>LINESTRING</tt> indicating
   * the geometry of this edge.
   *
   * @return {String}
   *          a String representing this edge's geometry.
   */
  jsts.triangulate.quadedge.QuadEdge.prototype.toString = function() {
    var p0, p1;
    p0 = this.vertex.getCoordinate();
    p1 = this.dest().getCoordinate();
    return jsts.io.WKTWriter.toLineString(p0, p1);
  };
})();
