/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeEnd.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var EdgeEnd = jsts.geomgraph.EdgeEnd;


  /**
   * @constructor
   * @extends jsts.geomgraph.EdgeEnd
   */
  jsts.geomgraph.DirectedEdge = function(edge, isForward) {
    EdgeEnd.call(this, edge);

    this.depth = [0, -999, -999];

    this._isForward = isForward;
    if (isForward) {
      this.init(edge.getCoordinate(0), edge.getCoordinate(1));
    } else {
      var n = edge.getNumPoints() - 1;
      this.init(edge.getCoordinate(n), edge.getCoordinate(n - 1));
    }
    this.computeDirectedLabel();

  };
  jsts.geomgraph.DirectedEdge.prototype = new EdgeEnd();
  jsts.geomgraph.DirectedEdge.constructor = jsts.geomgraph.DirectedEdge;


  /**
   * Computes the factor for the change in depth when moving from one location
   * to another. E.g. if crossing from the INTERIOR to the EXTERIOR the depth
   * decreases, so the factor is -1
   */
  jsts.geomgraph.DirectedEdge.depthFactor = function(currLocation, nextLocation) {
    if (currLocation === Location.EXTERIOR &&
        nextLocation === Location.INTERIOR)
      return 1;
    else if (currLocation === Location.INTERIOR &&
        nextLocation === Location.EXTERIOR)
      return -1;
    return 0;
  };

  /**
   * @type {boolean}
   * @protected
   */
  jsts.geomgraph.DirectedEdge.prototype._isForward = null;
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype._isInResult = false;
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype._isVisited = false;

  /**
   * the symmetric edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.sym = null;
  /**
   * the next edge in the edge ring for the polygon containing this edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.next = null;
  /**
   * the next edge in the MinimalEdgeRing that contains this edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.nextMin = null;
  /**
   * the EdgeRing that this edge is part of
   *
   * @type {EdgeRing}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.edgeRing = null;
  /**
   * the MinimalEdgeRing that this edge is part of
   *
   * @type {EdgeRing}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.minEdgeRing = null;
  /**
   * The depth of each side (position) of this edge. The 0 element of the array
   * is never used.
   *
   * @type {Array.<number>}
   */
  jsts.geomgraph.DirectedEdge.prototype.depth = null;

  jsts.geomgraph.DirectedEdge.prototype.getEdge = function() {
    return this.edge;
  };
  jsts.geomgraph.DirectedEdge.prototype.setInResult = function(isInResult) {
    this._isInResult = isInResult;
  };
  jsts.geomgraph.DirectedEdge.prototype.isInResult = function() {
    return this._isInResult;
  };
  jsts.geomgraph.DirectedEdge.prototype.isVisited = function() {
    return this._isVisited;
  };
  jsts.geomgraph.DirectedEdge.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };
  jsts.geomgraph.DirectedEdge.prototype.setEdgeRing = function(edgeRing) {
    this.edgeRing = edgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.getEdgeRing = function() {
    return this.edgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.setMinEdgeRing = function(minEdgeRing) {
    this.minEdgeRing = minEdgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.getMinEdgeRing = function() { return this.minEdgeRing; };
  jsts.geomgraph.DirectedEdge.prototype.getDepth = function(position) {
    return this.depth[position];
  };

  jsts.geomgraph.DirectedEdge.prototype.setDepth = function(position, depthVal) {
    if (this.depth[position] !== -999) {
      if (this.depth[position] !== depthVal)
        throw new jsts.error.TopologyError('assigned depths do not match', this
            .getCoordinate());
    }
    this.depth[position] = depthVal;
  };

  jsts.geomgraph.DirectedEdge.prototype.getDepthDelta = function() {
    var depthDelta = this.edge.getDepthDelta();
    if (!this._isForward)
      depthDelta = -depthDelta;
    return depthDelta;
  };

  /**
   * setVisitedEdge marks both DirectedEdges attached to a given Edge. This is
   * used for edges corresponding to lines, which will only appear oriented in a
   * single direction in the result.
   */
  jsts.geomgraph.DirectedEdge.prototype.setVisitedEdge = function(isVisited) {
    this.setVisited(isVisited);
    this.sym.setVisited(isVisited);
  };
  /**
   * Each Edge gives rise to a pair of symmetric DirectedEdges, in opposite
   * directions.
   *
   * @return the DirectedEdge for the same Edge but in the opposite direction.
   */
  jsts.geomgraph.DirectedEdge.prototype.getSym = function() {
    return this.sym;
  };
  jsts.geomgraph.DirectedEdge.prototype.isForward = function() {
    return this._isForward;
  };
  jsts.geomgraph.DirectedEdge.prototype.setSym = function(de) {
    this.sym = de;
  };
  jsts.geomgraph.DirectedEdge.prototype.getNext = function() {
    return this.next;
  };
  jsts.geomgraph.DirectedEdge.prototype.setNext = function(next) {
    this.next = next;
  };
  jsts.geomgraph.DirectedEdge.prototype.getNextMin = function() {
    return this.nextMin;
  };
  jsts.geomgraph.DirectedEdge.prototype.setNextMin = function(nextMin) {
    this.nextMin = nextMin;
  };

  /**
   * This edge is a line edge if
   * <ul>
   * <li> at least one of the labels is a line label
   * <li> any labels which are not line labels have all Locations = EXTERIOR
   * </ul>
   */
  jsts.geomgraph.DirectedEdge.prototype.isLineEdge = function() {
    var isLine = this.label.isLine(0) || this.label.isLine(1);
    var isExteriorIfArea0 = !this.label.isArea(0) ||
        this.label.allPositionsEqual(0, Location.EXTERIOR);
    var isExteriorIfArea1 = !this.label.isArea(1) ||
        this.label.allPositionsEqual(1, Location.EXTERIOR);

    return isLine && isExteriorIfArea0 && isExteriorIfArea1;
  };
  /**
   * This is an interior Area edge if
   * <ul>
   * <li> its label is an Area label for both Geometries
   * <li> and for each Geometry both sides are in the interior.
   * </ul>
   *
   * @return true if this is an interior Area edge.
   */
  jsts.geomgraph.DirectedEdge.prototype.isInteriorAreaEdge = function() {
    var isInteriorAreaEdge = true;
    for (var i = 0; i < 2; i++) {
      if (!(this.label.isArea(i) &&
          this.label.getLocation(i, Position.LEFT) === Location.INTERIOR && this.label
          .getLocation(i, Position.RIGHT) === Location.INTERIOR)) {
        isInteriorAreaEdge = false;
      }
    }
    return isInteriorAreaEdge;
  };

  /**
   * Compute the label in the appropriate orientation for this DirEdge
   *
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.computeDirectedLabel = function() {
    this.label = new jsts.geomgraph.Label(this.edge.getLabel());
    if (!this._isForward)
      this.label.flip();
  };

  /**
   * Set both edge depths. One depth for a given side is provided. The other is
   * computed depending on the Location transition and the depthDelta of the
   * edge.
   */
  jsts.geomgraph.DirectedEdge.prototype.setEdgeDepths = function(position, depth) {
    // get the depth transition delta from R to L for this directed Edge
    var depthDelta = this.getEdge().getDepthDelta();
    if (!this._isForward)
      depthDelta = -depthDelta;

    // if moving from L to R instead of R to L must change sign of delta
    var directionFactor = 1;
    if (position === Position.LEFT)
      directionFactor = -1;

    var oppositePos = Position.opposite(position);
    var delta = depthDelta * directionFactor;
    var oppositeDepth = depth + delta;
    this.setDepth(position, depth);
    this.setDepth(oppositePos, oppositeDepth);
  };

})();
