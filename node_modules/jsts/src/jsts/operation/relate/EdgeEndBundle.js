/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEnd.js
 */



/**
 * A collection of {@link EdgeEnd}s which obey the following invariant:
 * They originate at the same node and have the same direction.
 *
 * @augments {jsts.geomgraph.EdgeEnd}
 * @constructor
 */
jsts.operation.relate.EdgeEndBundle = function() {
  this.edgeEnds = [];

  var e = arguments[0] instanceof jsts.geomgraph.EdgeEnd ? arguments[0] : arguments[1];

  var edge = e.getEdge();
  var coord = e.getCoordinate();
  var dirCoord = e.getDirectedCoordinate();
  var label = new jsts.geomgraph.Label(e.getLabel());

  jsts.geomgraph.EdgeEnd.call(this, edge, coord,
      dirCoord, label);

  this.insert(e);
};

jsts.operation.relate.EdgeEndBundle.prototype = new jsts.geomgraph.EdgeEnd();


/**
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.edgeEnds = null;



jsts.operation.relate.EdgeEndBundle.prototype.getLabel = function() {
  return this.label;
};
jsts.operation.relate.EdgeEndBundle.prototype.getEdgeEnds = function() {
  return this.edgeEnds;
};

jsts.operation.relate.EdgeEndBundle.prototype.insert = function(e) {
  // Assert: start point is the same
  // Assert: direction is the same
  this.edgeEnds.push(e);
};


/**
 * This computes the overall edge label for the set of edges in this
 * EdgeStubBundle. It essentially merges the ON and side labels for each edge.
 * These labels must be compatible
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabel = function(
    boundaryNodeRule) {
  // create the label. If any of the edges belong to areas,
  // the label must be an area label
  var isArea = false;
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea())
      isArea = true;
  }
  if (isArea)
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE, jsts.geom.Location.NONE,
        jsts.geom.Location.NONE);
  else
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE);

  // compute the On label, and the side labels if present
  for (var i = 0; i < 2; i++) {
    this.computeLabelOn(i, boundaryNodeRule);
    if (isArea)
      this.computeLabelSides(i);
  }
};


/**
 * Compute the overall ON location for the list of EdgeStubs. (This is
 * essentially equivalent to computing the self-overlay of a single Geometry)
 * edgeStubs can be either on the boundary (eg Polygon edge) OR in the interior
 * (e.g. segment of a LineString) of their parent Geometry. In addition,
 * GeometryCollections use a {@link BoundaryNodeRule} to determine whether a
 * segment is on the boundary or not. Finally, in GeometryCollections it can
 * occur that an edge is both on the boundary and in the interior (e.g. a
 * LineString segment lying on top of a Polygon edge.) In this case the Boundary
 * is given precendence. <br>
 * These observations result in the following rules for computing the ON
 * location:
 * <ul>
 * <li> if there are an odd number of Bdy edges, the attribute is Bdy
 * <li> if there are an even number >= 2 of Bdy edges, the attribute is Int
 * <li> if there are any Int edges, the attribute is Int
 * <li> otherwise, the attribute is NULL.
 * </ul>
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelOn = function(
    geomIndex, boundaryNodeRule) {
  // compute the ON location value
  var boundaryCount = 0;
  var foundInterior = false;

  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    var loc = e.getLabel().getLocation(geomIndex);
    if (loc == jsts.geom.Location.BOUNDARY)
      boundaryCount++;
    if (loc == jsts.geom.Location.INTERIOR)
      foundInterior = true;
  }
  var loc = jsts.geom.Location.NONE;
  if (foundInterior)
    loc = jsts.geom.Location.INTERIOR;
  if (boundaryCount > 0) {
    loc = jsts.geomgraph.GeometryGraph.determineBoundary(boundaryNodeRule,
        boundaryCount);
  }
  this.label.setLocation(geomIndex, loc);

};


/**
 * Compute the labelling for each side
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSides = function(
    geomIndex) {
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.LEFT);
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.RIGHT);
};


/**
 * To compute the summary label for a side, the algorithm is: FOR all edges IF
 * any edge's location is INTERIOR for the side, side location = INTERIOR ELSE
 * IF there is at least one EXTERIOR attribute, side location = EXTERIOR ELSE
 * side location = NULL <br>
 * Note that it is possible for two sides to have apparently contradictory
 * information i.e. one edge side may indicate that it is in the interior of a
 * geometry, while another edge side may indicate the exterior of the same
 * geometry. This is not an incompatibility - GeometryCollections may contain
 * two Polygons that touch along an edge. This is the reason for
 * Interior-primacy rule above - it results in the summary label having the
 * Geometry interior on <b>both</b> sides.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSide = function(
    geomIndex, side) {
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea()) {
      var loc = e.getLabel().getLocation(geomIndex, side);
      if (loc === jsts.geom.Location.INTERIOR) {
        this.label.setLocation(geomIndex, side, jsts.geom.Location.INTERIOR);
        return;
      } else if (loc === jsts.geom.Location.EXTERIOR)
        this.label.setLocation(geomIndex, side, jsts.geom.Location.EXTERIOR);
    }
  }
};


/**
 * Update the IM with the contribution for the computed label for the EdgeStubs.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.updateIM = function(im) {
  jsts.geomgraph.Edge.updateIM(this.label, im);
};
