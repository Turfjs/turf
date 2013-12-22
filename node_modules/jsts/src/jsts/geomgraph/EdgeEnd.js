/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;

  /**
   * Models the end of an edge incident on a node. EdgeEnds have a direction
   * determined by the direction of the ray from the initial point to the next
   * point. EdgeEnds are comparable under the ordering "a has a greater angle
   * with the x-axis than b". This ordering is used to sort EdgeEnds around a
   * node.
   *
   * @param {Edge}
   *          edge
   * @param {Coordinate}
   *          p0
   * @param {Coordinate}
   *          p1
   * @param {Label}
   *          label
   * @constructor
   */
  jsts.geomgraph.EdgeEnd = function(edge, p0, p1, label) {
    this.edge = edge;
    if (p0 && p1) {
      this.init(p0, p1);
    }
    if (label) {
      this.label = label || null;
    }
  };

  /**
   * the parent edge of this edge end
   *
   * @type {Edge}
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.edge = null;


  /**
   * @type {Label}
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.label = null;


  /**
   * the node this edge end originates at
   *
   * @type {Node}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.node = null;


  /**
   * points of initial line segment
   *
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.p0 = null;
  jsts.geomgraph.EdgeEnd.prototype.p1 = null;


  /**
   * the direction vector for this edge from its starting point
   *
   * @type {double}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.dx = null;
  jsts.geomgraph.EdgeEnd.prototype.dy = null;


  /**
   * @type {int}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.quadrant = null;


  /**
   * @param {Coordinate}
   *          p0
   * @param {Coordinate}
   *          p1
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.init = function(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.dx = p1.x - p0.x;
    this.dy = p1.y - p0.y;
    this.quadrant = jsts.geomgraph.Quadrant.quadrant(this.dx, this.dy);
    Assert.isTrue(!(this.dx === 0 && this.dy === 0),
        'EdgeEnd with identical endpoints found');
  };

  jsts.geomgraph.EdgeEnd.prototype.getEdge = function() {
    return this.edge;
  };

  jsts.geomgraph.EdgeEnd.prototype.getLabel = function() {
    return this.label;
  };

  jsts.geomgraph.EdgeEnd.prototype.getCoordinate = function() {
    return this.p0;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDirectedCoordinate = function() {
    return this.p1;
  };

  jsts.geomgraph.EdgeEnd.prototype.getQuadrant = function() {
    return this.quadrant;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDx = function() {
    return this.dx;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDy = function() {
    return this.dy;
  };


  jsts.geomgraph.EdgeEnd.prototype.setNode = function(node) {
    this.node = node;
  };

  jsts.geomgraph.EdgeEnd.prototype.getNode = function() {
    return this.node;
  };

  jsts.geomgraph.EdgeEnd.prototype.compareTo = function(e) {
    return this.compareDirection(e);
  };


  /**
   * Implements the total order relation:
   * <p>
   * a has a greater angle with the positive x-axis than b
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is obviously susceptible to roundoff. A robust
   * algorithm is: - first compare the quadrant. If the quadrants are different,
   * it it trivial to determine which vector is "greater". - if the vectors lie
   * in the same quadrant, the computeOrientation function can be used to decide
   * the relative orientation of the vectors.
   *
   * @param {EdgeEnd}
   *          e
   * @return {number}
   */
  jsts.geomgraph.EdgeEnd.prototype.compareDirection = function(e) {
    if (this.dx === e.dx && this.dy === e.dy)
      return 0;
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

  jsts.geomgraph.EdgeEnd.prototype.computeLabel = function(boundaryNodeRule) {
  // subclasses should override this if they are using labels
  };

})();
