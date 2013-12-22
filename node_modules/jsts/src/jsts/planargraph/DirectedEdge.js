/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/DirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var GraphComponent = jsts.planargraph.GraphComponent;

  /**
   * Represents a directed edge in a {@link PlanarGraph}. A DirectedEdge may or
   * may not have a reference to a parent {@link Edge} (some applications of
   * planar graphs may not require explicit Edge objects to be created). Usually
   * a client using a <code>PlanarGraph</code> will subclass
   * <code>DirectedEdge</code> to add its own application-specific data and
   * methods.
   *
   * Constructs a DirectedEdge connecting the <code>from</code> node to the
   * <code>to</code> node.
   *
   * @param directionPt
   *          specifies this DirectedEdge's direction vector (determined by the
   *          vector from the <code>from</code> node to
   *          <code>directionPt</code>).
   * @param edgeDirection
   *          whether this DirectedEdge's direction is the same as or opposite
   *          to that of the parent Edge (if any).
   */
  var DirectedEdge = function(from, to, directionPt, edgeDirection) {
    if (from === undefined) {
      return;
    }

    this.from = from;
    this.to = to;
    this.edgeDirection = edgeDirection;
    this.p0 = from.getCoordinate();
    this.p1 = directionPt;
    var dx = this.p1.x - this.p0.x;
    var dy = this.p1.y - this.p0.y;
    this.quadrant = jsts.geomgraph.Quadrant.quadrant(dx, dy);
    this.angle = Math.atan2(dy, dx);
  };

  DirectedEdge.prototype = new GraphComponent();

  /**
   * Returns a List containing the parent Edge (possibly null) for each of the
   * given DirectedEdges.
   */
  DirectedEdge.toEdges = function(dirEdges) {
    var edges = new ArrayList();
    for (var i = dirEdges.iterator(); i.hasNext();) {
      edges.add((i.next()).parentEdge);
    }
    return edges;
  };

  DirectedEdge.prototype.parentEdge = null;
  DirectedEdge.prototype.from = null;
  DirectedEdge.prototype.to = null;
  DirectedEdge.prototype.p0 = null;
  DirectedEdge.prototype.p1 = null;
  DirectedEdge.prototype.sym = null; // optional
  DirectedEdge.prototype.edgeDirection = null;
  DirectedEdge.prototype.quadrant = null;
  DirectedEdge.prototype.angle = null;

  /**
   * Returns this DirectedEdge's parent Edge, or null if it has none.
   */
  DirectedEdge.prototype.getEdge = function() {
    return this.parentEdge;
  };

  /**
   * Associates this DirectedEdge with an Edge (possibly null, indicating no
   * associated Edge).
   */
  DirectedEdge.prototype.setEdge = function(parentEdge) {
    this.parentEdge = parentEdge;
  };

  /**
   * Returns 0, 1, 2, or 3, indicating the quadrant in which this DirectedEdge's
   * orientation lies.
   */
  DirectedEdge.prototype.getQuadrant = function() {
    return this.quadrant;
  };

  /**
   * Returns a point to which an imaginary line is drawn from the from-node to
   * specify this DirectedEdge's orientation.
   */
  DirectedEdge.prototype.getDirectionPt = function() {
    return this.p1;
  };

  /**
   * Returns whether the direction of the parent Edge (if any) is the same as
   * that of this Directed Edge.
   */
  DirectedEdge.prototype.getEdgeDirection = function() {
    return this.edgeDirection;
  };

  /**
   * Returns the node from which this DirectedEdge leaves.
   */
  DirectedEdge.prototype.getFromNode = function() {
    return this.from;
  };

  /**
   * Returns the node to which this DirectedEdge goes.
   */
  DirectedEdge.prototype.getToNode = function() {
    return this.to;
  };

  /**
   * Returns the coordinate of the from-node.
   */
  DirectedEdge.prototype.getCoordinate = function() {
    return this.from.getCoordinate();
  };

  /**
   * Returns the angle that the start of this DirectedEdge makes with the
   * positive x-axis, in radians.
   */
  DirectedEdge.prototype.getAngle = function() {
    return this.angle;
  };

  /**
   * Returns the symmetric DirectedEdge -- the other DirectedEdge associated
   * with this DirectedEdge's parent Edge.
   */
  DirectedEdge.prototype.getSym = function() {
    return this.sym;
  };

  /**
   * Sets this DirectedEdge's symmetric DirectedEdge, which runs in the opposite
   * direction.
   */
  DirectedEdge.prototype.setSym = function(sym) {
    this.sym = sym;
  };

  /**
   * Removes this directed edge from its containing graph.
   */
  DirectedEdge.prototype.remove = function() {
    this.sym = null;
    this.parentEdge = null;
  };

  /**
   * Tests whether this directed edge has been removed from its containing graph
   *
   * @return <code>true</code> if this directed edge is removed.
   */
  DirectedEdge.prototype.isRemoved = function() {
    return this.parentEdge == null;
  };

  /**
   * Returns 1 if this DirectedEdge has a greater angle with the positive x-axis
   * than b", 0 if the DirectedEdges are collinear, and -1 otherwise.
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is susceptible to roundoff. A robust algorithm
   * is:
   * <ul>
   * <li>first compare the quadrants. If the quadrants are different, it it
   * trivial to determine which vector is "greater".
   * <li>if the vectors lie in the same quadrant, the robust
   * {@link CGAlgorithms#computeOrientation(Coordinate, Coordinate, Coordinate)}
   * function can be used to decide the relative orientation of the vectors.
   * </ul>
   */
  DirectedEdge.prototype.compareTo = function(obj) {
    var de = obj;
    return this.compareDirection(de);
  };

  /**
   * Returns 1 if this DirectedEdge has a greater angle with the positive x-axis
   * than b", 0 if the DirectedEdges are collinear, and -1 otherwise.
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is susceptible to roundoff. A robust algorithm
   * is:
   * <ul>
   * <li>first compare the quadrants. If the quadrants are different, it it
   * trivial to determine which vector is "greater".
   * <li>if the vectors lie in the same quadrant, the robust
   * {@link CGAlgorithms#computeOrientation(Coordinate, Coordinate, Coordinate)}
   * function can be used to decide the relative orientation of the vectors.
   * </ul>
   */
  DirectedEdge.prototype.compareDirection = function(e) {
    // if the rays are in different quadrants, determining the ordering is
    // trivial
    if (this.quadrant > e.quadrant)
      return 1;
    if (this.quadrant < e.quadrant)
      return -1;
    // vectors are in the same quadrant - check relative orientation of
    // direction vectors
    // this is > e if it is CCW of e
    return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
  };

  jsts.planargraph.DirectedEdge = DirectedEdge;

})();
