/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeEndStar.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var EdgeEndStar = jsts.geomgraph.EdgeEndStar;
  var Assert = jsts.util.Assert;


  /**
   * A DirectedEdgeStar is an ordered list of <b>outgoing</b> DirectedEdges
   * around a node. It supports labelling the edges as well as linking the edges
   * to form both MaximalEdgeRings and MinimalEdgeRings.
   *
   * @constructor
   * @extends jsts.geomgraph.EdgeEnd
   */
  jsts.geomgraph.DirectedEdgeStar = function() {
    jsts.geomgraph.EdgeEndStar.call(this);
  };
  jsts.geomgraph.DirectedEdgeStar.prototype = new EdgeEndStar();
  jsts.geomgraph.DirectedEdgeStar.constructor = jsts.geomgraph.DirectedEdgeStar;


  /**
   * A list of all outgoing edges in the result, in CCW order
   *
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.resultAreaEdgeList = null;
  jsts.geomgraph.DirectedEdgeStar.prototype.label = null;

  /**
   * Insert a directed edge in the list
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.insert = function(ee) {
    var de = ee;
    this.insertEdgeEnd(de, de);
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getLabel = function() {
    return this.label;
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree = function() {
    var degree = 0;
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.isInResult())
        degree++;
    }
    return degree;
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree = function(er) {
    var degree = 0;
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.getEdgeRing() === er)
        degree++;
    }
    return degree;
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getRightmostEdge = function() {
    var edges = this.getEdges();
    var size = edges.size();
    if (size < 1)
      return null;
    var de0 = edges.get(0);
    if (size == 1)
      return de0;
    var deLast = edges.get(size - 1);

    var quad0 = de0.getQuadrant();
    var quad1 = deLast.getQuadrant();
    if (jsts.geomgraph.Quadrant.isNorthern(quad0) &&
        jsts.geomgraph.Quadrant.isNorthern(quad1))
      return de0;
    else if (!jsts.geomgraph.Quadrant.isNorthern(quad0) &&
        !jsts.geomgraph.Quadrant.isNorthern(quad1))
      return deLast;
    else {
      // edges are in different hemispheres - make sure we return one that is
      // non-horizontal
      var nonHorizontalEdge = null;
      if (de0.getDy() != 0)
        return de0;
      else if (deLast.getDy() != 0)
        return deLast;
    }
    Assert.shouldNeverReachHere('found two horizontal edges incident on node');
    return null;
  };
  /**
   * Compute the labelling for all dirEdges in this star, as well as the overall
   * labelling
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.computeLabelling = function(geom) {
    EdgeEndStar.prototype.computeLabelling.call(this, geom);

    // determine the overall labelling for this DirectedEdgeStar
    // (i.e. for the node it is based at)
    this.label = new jsts.geomgraph.Label(Location.NONE);
    for (var it = this.iterator(); it.hasNext();) {
      var ee = it.next();
      var e = ee.getEdge();
      var eLabel = e.getLabel();
      for (var i = 0; i < 2; i++) {
        var eLoc = eLabel.getLocation(i);
        if (eLoc === Location.INTERIOR || eLoc === Location.BOUNDARY)
          this.label.setLocation(i, Location.INTERIOR);
      }
    }
  };

  /**
   * For each dirEdge in the star, merge the label from the sym dirEdge into the
   * label
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.mergeSymLabels = function() {
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      var label = de.getLabel();
      label.merge(de.getSym().getLabel());
    }
  };

  /**
   * Update incomplete dirEdge labels from the labelling for the node
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.updateLabelling = function(nodeLabel) {
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      var label = de.getLabel();
      label.setAllLocationsIfNull(0, nodeLabel.getLocation(0));
      label.setAllLocationsIfNull(1, nodeLabel.getLocation(1));
    }
  };

  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.getResultAreaEdges = function() {
    if (this.resultAreaEdgeList !== null)
      return this.resultAreaEdgeList;
    this.resultAreaEdgeList = new javascript.util.ArrayList();
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.isInResult() || de.getSym().isInResult())
        this.resultAreaEdgeList.add(de);
    }
    return this.resultAreaEdgeList;

  };

  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.SCANNING_FOR_INCOMING = 1;
  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.LINKING_TO_OUTGOING = 2;
  /**
   * Traverse the star of DirectedEdges, linking the included edges together. To
   * link two dirEdges, the <next> pointer for an incoming dirEdge is set to the
   * next outgoing edge.
   * <p>
   * DirEdges are only linked if:
   * <ul>
   * <li>they belong to an area (i.e. they have sides)
   * <li>they are marked as being in the result
   * </ul>
   * <p>
   * Edges are linked in CCW order (the order they are stored). This means that
   * rings have their face on the Right (in other words, the topological
   * location of the face is given by the RHS label of the DirectedEdge)
   * <p>
   * PRECONDITION: No pair of dirEdges are both marked as being in the result
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.linkResultDirectedEdges = function() {
    // make sure edges are copied to resultAreaEdges list
    this.getResultAreaEdges();
    // find first area edge (if any) to start linking at
    var firstOut = null;
    var incoming = null;
    var state = this.SCANNING_FOR_INCOMING;
    // link edges in CCW order
    for (var i = 0; i < this.resultAreaEdgeList.size(); i++) {
      var nextOut = this.resultAreaEdgeList.get(i);
      var nextIn = nextOut.getSym();

      // skip de's that we're not interested in
      if (!nextOut.getLabel().isArea())
        continue;

      // record first outgoing edge, in order to link the last incoming edge
      if (firstOut === null && nextOut.isInResult())
        firstOut = nextOut;
      // assert: sym.isInResult() == false, since pairs of dirEdges should have
      // been removed already

      switch (state) {
      case this.SCANNING_FOR_INCOMING:
        if (!nextIn.isInResult())
          continue;
        incoming = nextIn;
        state = this.LINKING_TO_OUTGOING;
        break;
      case this.LINKING_TO_OUTGOING:
        if (!nextOut.isInResult())
          continue;
        incoming.setNext(nextOut);
        state = this.SCANNING_FOR_INCOMING;
        break;
      }
    }
    if (state === this.LINKING_TO_OUTGOING) {
      if (firstOut === null)
        throw new jsts.error.TopologyError('no outgoing dirEdge found', this
            .getCoordinate());
      Assert.isTrue(firstOut.isInResult(),
          'unable to link last incoming dirEdge');
      incoming.setNext(firstOut);
    }
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.linkMinimalDirectedEdges = function(er) {
    // find first area edge (if any) to start linking at
    var firstOut = null;
    var incoming = null;
    var state = this.SCANNING_FOR_INCOMING;
    // link edges in CW order
    for (var i = this.resultAreaEdgeList.size() - 1; i >= 0; i--) {
      var nextOut = this.resultAreaEdgeList.get(i);
      var nextIn = nextOut.getSym();

      // record first outgoing edge, in order to link the last incoming edge
      if (firstOut === null && nextOut.getEdgeRing() === er)
        firstOut = nextOut;

      switch (state) {
      case this.SCANNING_FOR_INCOMING:
        if (nextIn.getEdgeRing() != er)
          continue;
        incoming = nextIn;
        state = this.LINKING_TO_OUTGOING;
        break;
      case this.LINKING_TO_OUTGOING:
        if (nextOut.getEdgeRing() !== er)
          continue;
        incoming.setNextMin(nextOut);
        state = this.SCANNING_FOR_INCOMING;
        break;
      }
    }
    if (state === this.LINKING_TO_OUTGOING) {
      Assert.isTrue(firstOut !== null, 'found null for first outgoing dirEdge');
      Assert.isTrue(firstOut.getEdgeRing() === er,
          'unable to link last incoming dirEdge');
      incoming.setNextMin(firstOut);
    }
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.linkAllDirectedEdges = function() {
    this.getEdges();
    // find first area edge (if any) to start linking at
    var prevOut = null;
    var firstIn = null;
    // link edges in CW order
    for (var i = this.edgeList.size() - 1; i >= 0; i--) {
      var nextOut = this.edgeList.get(i);
      var nextIn = nextOut.getSym();
      if (firstIn === null)
        firstIn = nextIn;
      if (prevOut !== null)
        nextIn.setNext(prevOut);
      // record outgoing edge, in order to link the last incoming edge
      prevOut = nextOut;
    }
    firstIn.setNext(prevOut);
  };

  /**
   * Traverse the star of edges, maintaing the current location in the result
   * area at this node (if any). If any L edges are found in the interior of the
   * result, mark them as covered.
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.findCoveredLineEdges = function() {
    // Since edges are stored in CCW order around the node,
    // as we move around the ring we move from the right to the left side of the
    // edge

    /**
     * Find first DirectedEdge of result area (if any). The interior of the
     * result is on the RHS of the edge, so the start location will be: -
     * INTERIOR if the edge is outgoing - EXTERIOR if the edge is incoming
     */
    var startLoc = Location.NONE;
    for (var it = this.iterator(); it.hasNext();) {
      var nextOut = it.next();
      var nextIn = nextOut.getSym();
      if (!nextOut.isLineEdge()) {
        if (nextOut.isInResult()) {
          startLoc = Location.INTERIOR;
          break;
        }
        if (nextIn.isInResult()) {
          startLoc = Location.EXTERIOR;
          break;
        }
      }
    }
    // no A edges found, so can't determine if L edges are covered or not
    if (startLoc === Location.NONE)
      return;

    /**
     * move around ring, keeping track of the current location (Interior or
     * Exterior) for the result area. If L edges are found, mark them as covered
     * if they are in the interior
     */
    var currLoc = startLoc;

    for (var it = this.iterator(); it.hasNext();) {
      var nextOut = it.next();
      var nextIn = nextOut.getSym();
      if (nextOut.isLineEdge()) {
        nextOut.getEdge().setCovered(currLoc === Location.INTERIOR);
      } else { // edge is an Area edge
        if (nextOut.isInResult())
          currLoc = Location.EXTERIOR;
        if (nextIn.isInResult())
          currLoc = Location.INTERIOR;
      }
    }
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths = function(de) {
    if (arguments.length === 2) {
      this.computeDepths2.apply(this, arguments);
      // NOTE: intentional, this function returns void
      return;
    }

    var edgeIndex = this.findIndex(de);
    var label = de.getLabel();
    var startDepth = de.getDepth(Position.LEFT);
    var targetLastDepth = de.getDepth(Position.RIGHT);
    // compute the depths from this edge up to the end of the edge array
    var nextDepth = this.computeDepths2(edgeIndex + 1, this.edgeList.size(),
        startDepth);
    // compute the depths for the initial part of the array
    var lastDepth = this.computeDepths2(0, edgeIndex, nextDepth);
    if (lastDepth != targetLastDepth)
      throw new jsts.error.TopologyError('depth mismatch at ' +
          de.getCoordinate());
  };

  /**
   * Compute the DirectedEdge depths for a subsequence of the edge array.
   *
   * @return the last depth assigned (from the R side of the last edge visited).
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths2 = function(startIndex, endIndex,
      startDepth) {
    var currDepth = startDepth;
    for (var i = startIndex; i < endIndex; i++) {
      var nextDe = this.edgeList.get(i);
      var label = nextDe.getLabel();
      nextDe.setEdgeDepths(Position.RIGHT, currDepth);
      currDepth = nextDe.getDepth(Position.LEFT);
    }
    return currDepth;
  };

})();
