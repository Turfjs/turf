/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Label.js
 */

/**
 * Port source: com.vividsolutions.jts.geomgraph.EdgeRing r6
 *
 * @constructor
 */
jsts.geomgraph.EdgeRing = function(start, geometryFactory) {
  this.edges = [];
  this.pts = [];
  this.holes = [];
  this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE);

  this.geometryFactory = geometryFactory;

  if (start) {
    this.computePoints(start);
    this.computeRing();
  }
};

jsts.geomgraph.EdgeRing.prototype.startDe = null; // the directed edge which
                                                  // starts the list of edges
                                                  // for this EdgeRing
jsts.geomgraph.EdgeRing.prototype.maxNodeDegree = -1;
jsts.geomgraph.EdgeRing.prototype.edges = null; // the DirectedEdges making up
                                                // this EdgeRing
jsts.geomgraph.EdgeRing.prototype.pts = null;
jsts.geomgraph.EdgeRing.prototype.label = null; // label stores the locations of
                                                // each geometry on the face
                                                // surrounded by this ring
jsts.geomgraph.EdgeRing.prototype.ring = null; // the ring created for this
                                                // EdgeRing
jsts.geomgraph.EdgeRing.prototype._isHole = null;
jsts.geomgraph.EdgeRing.prototype.shell = null; // if non-null, the ring is a
                                                // hole and this EdgeRing is its
                                                // containing shell
jsts.geomgraph.EdgeRing.prototype.holes = null; // a list of EdgeRings which are
                                                // holes in this EdgeRing

jsts.geomgraph.EdgeRing.prototype.geometryFactory = null;

jsts.geomgraph.EdgeRing.prototype.isIsolated = function() {
  return (this.label.getGeometryCount() == 1);
};
jsts.geomgraph.EdgeRing.prototype.isHole = function() {
  return this._isHole;
};

jsts.geomgraph.EdgeRing.prototype.getCoordinate = function(i) {
  return this.pts[i];
};
jsts.geomgraph.EdgeRing.prototype.getLinearRing = function() { return this.ring; };
jsts.geomgraph.EdgeRing.prototype.getLabel = function() {
  return this.label;
};
jsts.geomgraph.EdgeRing.prototype.isShell = function() {
  return this.shell === null;
};
jsts.geomgraph.EdgeRing.prototype.getShell = function() {
  return this.shell;
};
jsts.geomgraph.EdgeRing.prototype.setShell = function(shell) {
  this.shell = shell;
  if (shell !== null)
    shell.addHole(this);
};
jsts.geomgraph.EdgeRing.prototype.addHole = function(ring) {
  this.holes.push(ring);
};

jsts.geomgraph.EdgeRing.prototype.toPolygon = function(geometryFactory) {
  var holeLR = [];
  for (var i = 0; i < this.holes.length; i++) {
    holeLR[i] = this.holes[i].getLinearRing();
  }
  var poly = this.geometryFactory.createPolygon(this.getLinearRing(), holeLR);
  return poly;
};
/**
 * Compute a LinearRing from the point list previously collected. Test if the
 * ring is a hole (i.e. if it is CCW) and set the hole flag accordingly.
 */
jsts.geomgraph.EdgeRing.prototype.computeRing = function() {
  if (this.ring !== null)
    return; // don't compute more than once
  var coord = [];
  for (var i = 0; i < this.pts.length; i++) {
    coord[i] = this.pts[i];
  }
  this.ring = this.geometryFactory.createLinearRing(coord);
  this._isHole = jsts.algorithm.CGAlgorithms.isCCW(this.ring.getCoordinates());
};
jsts.geomgraph.EdgeRing.prototype.getNext = function(de) {
  throw new jsts.error.AbstractInvocationError();
};
jsts.geomgraph.EdgeRing.prototype.setEdgeRing = function(de, er) {
  throw new jsts.error.AbstractInvocationError();
};
/**
 * Returns the list of DirectedEdges that make up this EdgeRing
 */
jsts.geomgraph.EdgeRing.prototype.getEdges = function() {
  return this.edges;
};

/**
 * Collect all the points from the DirectedEdges of this ring into a contiguous
 * list
 */
jsts.geomgraph.EdgeRing.prototype.computePoints = function(start) {
  this.startDe = start;
  var de = start;
  var isFirstEdge = true;
  do {
    if (de === null)
      throw new jsts.error.TopologyError('Found null DirectedEdge');
    if (de.getEdgeRing() === this)
      throw new jsts.error.TopologyError(
          'Directed Edge visited twice during ring-building at ' +
              de.getCoordinate());

    this.edges.push(de);
    var label = de.getLabel();
    jsts.util.Assert.isTrue(label.isArea());
    this.mergeLabel(label);
    this.addPoints(de.getEdge(), de.isForward(), isFirstEdge);
    isFirstEdge = false;
    this.setEdgeRing(de, this);
    de = this.getNext(de);
  } while (de !== this.startDe);
};

jsts.geomgraph.EdgeRing.prototype.getMaxNodeDegree = function() {
  if (this.maxNodeDegree < 0)
    this.computeMaxNodeDegree();
  return this.maxNodeDegree;
};

jsts.geomgraph.EdgeRing.prototype.computeMaxNodeDegree = function() {
  this.maxNodeDegree = 0;
  var de = this.startDe;
  do {
    var node = de.getNode();
    var degree = node.getEdges().getOutgoingDegree(this);
    if (degree > this.maxNodeDegree)
      this.maxNodeDegree = degree;
    de = this.getNext(de);
  } while (de !== this.startDe);
  this.maxNodeDegree *= 2;
};


jsts.geomgraph.EdgeRing.prototype.setInResult = function() {
  var de = this.startDe;
  do {
    de.getEdge().setInResult(true);
    de = de.getNext();
  } while (de != this.startDe);
};

jsts.geomgraph.EdgeRing.prototype.mergeLabel = function(deLabel) {
  this.mergeLabel2(deLabel, 0);
  this.mergeLabel2(deLabel, 1);
};
/**
 * Merge the RHS label from a DirectedEdge into the label for this EdgeRing. The
 * DirectedEdge label may be null. This is acceptable - it results from a node
 * which is NOT an intersection node between the Geometries (e.g. the end node
 * of a LinearRing). In this case the DirectedEdge label does not contribute any
 * information to the overall labelling, and is simply skipped.
 */
jsts.geomgraph.EdgeRing.prototype.mergeLabel2 = function(deLabel, geomIndex) {
  var loc = deLabel.getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
  // no information to be had from this label
  if (loc == jsts.geom.Location.NONE)
    return;
  // if there is no current RHS value, set it
  if (this.label.getLocation(geomIndex) === jsts.geom.Location.NONE) {
    this.label.setLocation(geomIndex, loc);
    return;
  }
};
jsts.geomgraph.EdgeRing.prototype.addPoints = function(edge, isForward,
    isFirstEdge) {
  var edgePts = edge.getCoordinates();
  if (isForward) {
    var startIndex = 1;
    if (isFirstEdge)
      startIndex = 0;
    for (var i = startIndex; i < edgePts.length; i++) {
      this.pts.push(edgePts[i]);
    }
  } else { // is backward
    var startIndex = edgePts.length - 2;
    if (isFirstEdge)
      startIndex = edgePts.length - 1;
    for (var i = startIndex; i >= 0; i--) {
      this.pts.push(edgePts[i]);
    }
  }
};

/**
 * This method will cause the ring to be computed. It will also check any holes,
 * if they have been assigned.
 */
jsts.geomgraph.EdgeRing.prototype.containsPoint = function(p) {
  var shell = this.getLinearRing();
  var env = shell.getEnvelopeInternal();
  if (!env.contains(p))
    return false;
  if (!jsts.algorithm.CGAlgorithms.isPointInRing(p, shell.getCoordinates()))
    return false;

  for (var i = 0; i < this.holes.length; i++) {
    var hole = this.holes[i];
    if (hole.containsPoint(p))
      return false;
  }
  return true;
};
