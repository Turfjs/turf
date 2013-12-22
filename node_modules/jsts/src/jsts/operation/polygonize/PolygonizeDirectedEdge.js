/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeDirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/DirectedEdge.js
 */

(function() {

  var DirectedEdge = jsts.planargraph.DirectedEdge;

  /**
   * A {@link DirectedEdge} of a {@link PolygonizeGraph}, which represents an
   * edge of a polygon formed by the graph. May be logically deleted from the
   * graph by setting the <code>marked</code> flag.
   *
   * Constructs a directed edge connecting the <code>from</code> node to the
   * <code>to</code> node.
   *
   * @param directionPt
   *          specifies this DirectedEdge's direction (given by an imaginary
   *          line from the <code>from</code> node to <code>directionPt</code>).
   * @param edgeDirection
   *          whether this DirectedEdge's direction is the same as or opposite
   *          to that of the parent Edge (if any).
   */
  var PolygonizeDirectedEdge = function(from, to, directionPt, edgeDirection) {
    DirectedEdge.apply(this, arguments);
  };

  PolygonizeDirectedEdge.prototype = new DirectedEdge();

  PolygonizeDirectedEdge.prototype.edgeRing = null;
  PolygonizeDirectedEdge.prototype.next = null;
  PolygonizeDirectedEdge.prototype.label = -1;

  /**
   * Returns the identifier attached to this directed edge.
   */
  PolygonizeDirectedEdge.prototype.getLabel = function() {
    return this.label;
  };
  /**
   * Attaches an identifier to this directed edge.
   */
  PolygonizeDirectedEdge.prototype.setLabel = function(label) {
    this.label = label;
  };

  /**
   * Returns the next directed edge in the EdgeRing that this directed edge is a
   * member of.
   */
  PolygonizeDirectedEdge.prototype.getNext = function() {
    return this.next;
  };

  /**
   * Sets the next directed edge in the EdgeRing that this directed edge is a
   * member of.
   */
  PolygonizeDirectedEdge.prototype.setNext = function(next) {
    this.next = next;
  };

  /**
   * Returns the ring of directed edges that this directed edge is a member of,
   * or null if the ring has not been set.
   *
   * @see #setRing(EdgeRing)
   */
  PolygonizeDirectedEdge.prototype.isInRing = function() {
    return this.edgeRing != null;
  };

  /**
   * Sets the ring of directed edges that this directed edge is a member of.
   */
  PolygonizeDirectedEdge.prototype.setRing = function(edgeRing) {
    this.edgeRing = edgeRing;
  };

  jsts.operation.polygonize.PolygonizeDirectedEdge = PolygonizeDirectedEdge;

})();
