/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Location.js
 */



/**
 * A EdgeEndStar is an ordered list of EdgeEnds around a node. They are
 * maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.geomgraph.EdgeEndStar = function() {
  this.edgeMap = new javascript.util.TreeMap();
  this.edgeList = null;
  this.ptInAreaLocation = [jsts.geom.Location.NONE, jsts.geom.Location.NONE];
};


/**
 * A map which maintains the edges in sorted order around the node
 *
 * NOTE: In In JSTS a JS object replaces TreeMap. Sorting is done when needed.
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeMap = null;


/**
 * A list of all outgoing edges in the result, in CCW order
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeList = null;


/**
 * The location of the point for this star in Geometry i Areas
 *
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.ptInAreaLocation = null;


/**
 * Insert a EdgeEnd into this EdgeEndStar
 */
jsts.geomgraph.EdgeEndStar.prototype.insert = function(e) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Insert an EdgeEnd into the map, and clear the edgeList cache, since the list
 * of edges has now changed
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.insertEdgeEnd = function(e, obj) {
  this.edgeMap.put(e, obj);
  this.edgeList = null; // edge list has changed - clear the cache
};


/**
 * @return the coordinate for the node this star is based at.
 */
jsts.geomgraph.EdgeEndStar.prototype.getCoordinate = function() {
  var it = this.iterator();
  if (!it.hasNext())
    return null;
  var e = it.next();
  return e.getCoordinate();
};
jsts.geomgraph.EdgeEndStar.prototype.getDegree = function() {
  return this.edgeMap.size();
};


/**
 * Iterator access to the ordered list of edges is optimized by copying the map
 * collection to a list. (This assumes that once an iterator is requested, it is
 * likely that insertion into the map is complete).
 */
jsts.geomgraph.EdgeEndStar.prototype.iterator = function() {
  return this.getEdges().iterator();
};

jsts.geomgraph.EdgeEndStar.prototype.getEdges = function() {
  if (this.edgeList === null) {
    this.edgeList = new javascript.util.ArrayList(this.edgeMap.values());
  }
  return this.edgeList;
};

jsts.geomgraph.EdgeEndStar.prototype.getNextCW = function(ee) {
  this.getEdges();
  var i = this.edgeList.indexOf(ee);
  var iNextCW = i - 1;
  if (i === 0)
    iNextCW = this.edgeList.length - 1;
  return this.edgeList[iNextCW];
};

jsts.geomgraph.EdgeEndStar.prototype.computeLabelling = function(geomGraph) {
  this.computeEdgeEndLabels(geomGraph[0].getBoundaryNodeRule());
  this.propagateSideLabels(0);
  this.propagateSideLabels(1);

  /**
   * If there are edges that still have null labels for a geometry this must be
   * because there are no area edges for that geometry incident on this node. In
   * this case, to label the edge for that geometry we must test whether the
   * edge is in the interior of the geometry. To do this it suffices to
   * determine whether the node for the edge is in the interior of an area. If
   * so, the edge has location INTERIOR for the geometry. In all other cases
   * (e.g. the node is on a line, on a point, or not on the geometry at all) the
   * edge has the location EXTERIOR for the geometry.
   * <p>
   * Note that the edge cannot be on the BOUNDARY of the geometry, since then
   * there would have been a parallel edge from the Geometry at this node also
   * labelled BOUNDARY and this edge would have been labelled in the previous
   * step.
   * <p>
   * This code causes a problem when dimensional collapses are present, since it
   * may try and determine the location of a node where a dimensional collapse
   * has occurred. The point should be considered to be on the EXTERIOR of the
   * polygon, but locate() will return INTERIOR, since it is passed the original
   * Geometry, not the collapsed version.
   *
   * If there are incident edges which are Line edges labelled BOUNDARY, then
   * they must be edges resulting from dimensional collapses. In this case the
   * other edges can be labelled EXTERIOR for this Geometry.
   *
   * MD 8/11/01 - NOT TRUE! The collapsed edges may in fact be in the interior
   * of the Geometry, which means the other edges should be labelled INTERIOR
   * for this Geometry. Not sure how solve this... Possibly labelling needs to
   * be split into several phases: area label propagation, symLabel merging,
   * then finally null label resolution.
   */
  var hasDimensionalCollapseEdge = [false, false];
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isLine(geomi) &&
          label.getLocation(geomi) === jsts.geom.Location.BOUNDARY)
        hasDimensionalCollapseEdge[geomi] = true;
    }
  }
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isAnyNull(geomi)) {
        var loc = jsts.geom.Location.NONE;
        if (hasDimensionalCollapseEdge[geomi]) {
          loc = jsts.geom.Location.EXTERIOR;
        } else {
          var p = e.getCoordinate();
          loc = this.getLocation(geomi, p, geomGraph);
        }
        label.setAllLocationsIfNull(geomi, loc);
      }
    }
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.computeEdgeEndLabels = function(
    boundaryNodeRule) {
  // Compute edge label for each EdgeEnd
  for (var it = this.iterator(); it.hasNext();) {
    var ee = it.next();
    ee.computeLabel(boundaryNodeRule);
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.getLocation = function(geomIndex, p, geom) {
  // compute location only on demand
  if (this.ptInAreaLocation[geomIndex] === jsts.geom.Location.NONE) {
    this.ptInAreaLocation[geomIndex] = jsts.algorithm.locate.SimplePointInAreaLocator
        .locate(p, geom[geomIndex].getGeometry());
  }
  return this.ptInAreaLocation[geomIndex];
};

jsts.geomgraph.EdgeEndStar.prototype.isAreaLabelsConsistent = function(
    geomGraph) {
  this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());
  return this.checkAreaLabelsConsistent(0);
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.checkAreaLabelsConsistent = function(
    geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  var edges = this.getEdges();
  // if no edges, trivially consistent
  if (edges.size() <= 0)
    return true;
  // initialize startLoc to location of last L side (if any)
  var lastEdgeIndex = edges.size() - 1;
  var startLabel = edges.get(lastEdgeIndex).getLabel();
  var startLoc = startLabel
      .getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
  jsts.util.Assert.isTrue(startLoc != jsts.geom.Location.NONE,
      'Found unlabelled area edge');

  var currLoc = startLoc;
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    // we assume that we are only checking a area
    jsts.util.Assert.isTrue(label.isArea(geomIndex), 'Found non-area edge');
    var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
    var rightLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
    // check that edge is really a boundary between inside and outside!
    if (leftLoc === rightLoc) {
      return false;
    }

    if (rightLoc !== currLoc) {
      return false;
    }
    currLoc = leftLoc;
  }
  return true;
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.propagateSideLabels = function(geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  var startLoc = jsts.geom.Location.NONE;

  // initialize loc to location of last L side (if any)
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    if (label.isArea(geomIndex) &&
        label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT) !== jsts.geom.Location.NONE)
      startLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
  }

  // no labelled sides found, so no labels to propagate
  if (startLoc === jsts.geom.Location.NONE)
    return;

  var currLoc = startLoc;
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    // set null ON values to be in current location
    if (label.getLocation(geomIndex, jsts.geomgraph.Position.ON) === jsts.geom.Location.NONE)
      label.setLocation(geomIndex, jsts.geomgraph.Position.ON, currLoc);
    // set side labels (if any)
    if (label.isArea(geomIndex)) {
      var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
      var rightLoc = label
          .getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
      // if there is a right location, that is the next location to propagate
      if (rightLoc !== jsts.geom.Location.NONE) {
        if (rightLoc !== currLoc)
          throw new jsts.error.TopologyError('side location conflict', e
              .getCoordinate());
        if (leftLoc === jsts.geom.Location.NONE) {
          jsts.util.Assert.shouldNeverReachHere('found single null side (at ' +
              e.getCoordinate() + ')');
        }
        currLoc = leftLoc;
      } else {
        /**
         * RHS is null - LHS must be null too. This must be an edge from the
         * other geometry, which has no location labelling for this geometry.
         * This edge must lie wholly inside or outside the other geometry (which
         * is determined by the current location). Assign both sides to be the
         * current location.
         */
        jsts.util.Assert.isTrue(label.getLocation(geomIndex,
            jsts.geomgraph.Position.LEFT) === jsts.geom.Location.NONE,
            'found single null side');
        label.setLocation(geomIndex, jsts.geomgraph.Position.RIGHT, currLoc);
        label.setLocation(geomIndex, jsts.geomgraph.Position.LEFT, currLoc);
      }
    }
  }
};

jsts.geomgraph.EdgeEndStar.prototype.findIndex = function(eSearch) {
  this.iterator(); // force edgelist to be computed
  for (var i = 0; i < this.edgeList.size(); i++) {
    var e = this.edgeList.get(i);
    if (e === eSearch)
      return i;
  }
  return -1;
};
