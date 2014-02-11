/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Forms {@link Polygon}s out of a graph of {@link DirectedEdge}s. The edges
 * to use are marked as being in the result Area.
 * <p>
 */
jsts.operation.overlay.PolygonBuilder = function(geometryFactory) {
  this.shellList = [];
  this.geometryFactory = geometryFactory;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.geometryFactory = null;

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.shellList = null;


/**
 * Add a complete graph. The graph is assumed to contain one or more polygons,
 * possibly with holes.
 *
 * @param {jsts.geomgraph.PlanarGraph}
 *          graph
 */
jsts.operation.overlay.PolygonBuilder.prototype.add = function(graph) {
  if (arguments.length === 2) {
    this.add2.apply(this, arguments);
    return;
  }

  this.add2(graph.getEdgeEnds(), graph.getNodes());
};

/**
 * Add a set of edges and nodes, which form a graph. The graph is assumed to
 * contain one or more polygons, possibly with holes.
 */
jsts.operation.overlay.PolygonBuilder.prototype.add2 = function(dirEdges, nodes) {
  jsts.geomgraph.PlanarGraph.linkResultDirectedEdges(nodes);
  var maxEdgeRings = this.buildMaximalEdgeRings(dirEdges);
  var freeHoleList = [];
  var edgeRings = this.buildMinimalEdgeRings(maxEdgeRings, this.shellList,
      freeHoleList);
  this.sortShellsAndHoles(edgeRings, this.shellList, freeHoleList);
  this.placeFreeHoles(this.shellList, freeHoleList);
};

jsts.operation.overlay.PolygonBuilder.prototype.getPolygons = function() {
  var resultPolyList = this.computePolygons(this.shellList);
  return resultPolyList;
};


/**
 * for all DirectedEdges in result, form them into MaximalEdgeRings
 *
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.buildMaximalEdgeRings = function(
    dirEdges) {
  var maxEdgeRings = [];
  for (var it = dirEdges.iterator(); it.hasNext(); ) {
    var de = it.next();
    if (de.isInResult() && de.getLabel().isArea()) {
      // if this edge has not yet been processed
      if (de.getEdgeRing() == null) {
        var er = new jsts.operation.overlay.MaximalEdgeRing(de, this.geometryFactory);
        maxEdgeRings.push(er);
        er.setInResult();
        // System.out.println("max node degree = " + er.getMaxDegree());
      }
    }
  }
  return maxEdgeRings;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.buildMinimalEdgeRings = function(
    maxEdgeRings, shellList, freeHoleList) {
  var edgeRings = [];
  for (var i = 0; i < maxEdgeRings.length; i++) {
    var er = maxEdgeRings[i];
    if (er.getMaxNodeDegree() > 2) {
      er.linkDirectedEdgesForMinimalEdgeRings();
      var minEdgeRings = er.buildMinimalRings();
      // at this point we can go ahead and attempt to place holes, if this
      // EdgeRing is a polygon
      var shell = this.findShell(minEdgeRings);
      if (shell !== null) {
        this.placePolygonHoles(shell, minEdgeRings);
        shellList.push(shell);
      } else {
        freeHoleList = freeHoleList.concat(minEdgeRings);
      }
    } else {
      edgeRings.push(er);
    }
  }
  return edgeRings;
};

/**
 * This method takes a list of MinimalEdgeRings derived from a MaximalEdgeRing,
 * and tests whether they form a Polygon. This is the case if there is a single
 * shell in the list. In this case the shell is returned. The other possibility
 * is that they are a series of connected holes, in which case no shell is
 * returned.
 *
 * @return {EdgeRing} the shell EdgeRing, if there is one or null, if all the
 *         rings are holes.
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.findShell = function(
    minEdgeRings) {
  var shellCount = 0;
  var shell = null;
  for (var i = 0; i < minEdgeRings.length; i++) {
    var er = minEdgeRings[i];
    if (!er.isHole()) {
      shell = er;
      shellCount++;
    }
  }
  jsts.util.Assert.isTrue(shellCount <= 1, 'found two shells in MinimalEdgeRing list');
  return shell;
};
/**
 * This method assigns the holes for a Polygon (formed from a list of
 * MinimalEdgeRings) to its shell. Determining the holes for a MinimalEdgeRing
 * polygon serves two purposes:
 * <ul>
 * <li>it is faster than using a point-in-polygon check later on.
 * <li>it ensures correctness, since if the PIP test was used the point chosen
 * might lie on the shell, which might return an incorrect result from the PIP
 * test
 * </ul>
 *
 * @param {EdgeRing}
 *          shell
 * @param {Array}
 *          minEdgeRings
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.placePolygonHoles = function(
    shell, minEdgeRings) {
  for (var i = 0; i < minEdgeRings.length; i++) {
    var er = minEdgeRings[i];
    if (er.isHole()) {
      er.setShell(shell);
    }
  }
};
/**
 * For all rings in the input list, determine whether the ring is a shell or a
 * hole and add it to the appropriate list. Due to the way the DirectedEdges
 * were linked, a ring is a shell if it is oriented CW, a hole otherwise.
 *
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.sortShellsAndHoles = function(
    edgeRings, shellList, freeHoleList) {
  for (var i = 0; i < edgeRings.length; i++) {
    var er = edgeRings[i];
    if (er.isHole()) {
      freeHoleList.push(er);
    } else {
      shellList.push(er);
    }
  }
};
/**
 * This method determines finds a containing shell for all holes which have not
 * yet been assigned to a shell. These "free" holes should all be <b>properly</b>
 * contained in their parent shells, so it is safe to use the
 * <code>findEdgeRingContaining</code> method. (This is the case because any
 * holes which are NOT properly contained (i.e. are connected to their parent
 * shell) would have formed part of a MaximalEdgeRing and been handled in a
 * previous step).
 *
 * @throws TopologyException
 *           if a hole cannot be assigned to a shell
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.placeFreeHoles = function(
    shellList, freeHoleList) {
  for (var i = 0; i < freeHoleList.length; i++) {
    var hole = freeHoleList[i];
    // only place this hole if it doesn't yet have a shell
    if (hole.getShell() == null) {
      var shell = this.findEdgeRingContaining(hole, shellList);
      if (shell === null)
        throw new jsts.error.TopologyError('unable to assign hole to a shell',
            hole.getCoordinate(0));
      hole.setShell(shell);
    }
  }
};

/**
 * Find the innermost enclosing shell EdgeRing containing the argument EdgeRing,
 * if any. The innermost enclosing ring is the <i>smallest</i> enclosing ring.
 * The algorithm used depends on the fact that: <br>
 * ring A contains ring B iff envelope(ring A) contains envelope(ring B) <br>
 * This routine is only safe to use if the chosen point of the hole is known to
 * be properly contained in a shell (which is guaranteed to be the case if the
 * hole does not touch its shell)
 *
 * @return containing EdgeRing, if there is one.
 * @return null if no containing EdgeRing is found.
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.findEdgeRingContaining = function(
    testEr, shellList) {
  var testRing = testEr.getLinearRing();
  var testEnv = testRing.getEnvelopeInternal();
  var testPt = testRing.getCoordinateN(0);

  var minShell = null;
  var minEnv = null;
  for (var i = 0; i < shellList.length; i++) {
    var tryShell = shellList[i];
    var tryRing = tryShell.getLinearRing();
    var tryEnv = tryRing.getEnvelopeInternal();
    if (minShell !== null)
      minEnv = minShell.getLinearRing().getEnvelopeInternal();
    var isContained = false;
    if (tryEnv.contains(testEnv) &&
        jsts.algorithm.CGAlgorithms.isPointInRing(testPt, tryRing
            .getCoordinates()))
      isContained = true;
    // check if this new containing ring is smaller than the current minimum
    // ring
    if (isContained) {
      if (minShell == null || minEnv.contains(tryEnv)) {
        minShell = tryShell;
      }
    }
  }
  return minShell;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.computePolygons = function(
    shellList) {
  var resultPolyList = new javascript.util.ArrayList();
  // add Polygons for all shells
  for (var i = 0; i < shellList.length; i++) {
    var er = shellList[i];
    var poly = er.toPolygon(this.geometryFactory);
    resultPolyList.add(poly);
  }
  return resultPolyList;
};

/**
 * Checks the current set of shells (with their associated holes) to see if any
 * of them contain the point.
 *
 * @return {boolean}
 */
jsts.operation.overlay.PolygonBuilder.prototype.containsPoint = function(p) {
  for (var i = 0; i < this.shellList.length; i++) {
    var er = this.shellList[i];
    if (er.containsPoint(p))
      return true;
  }
  return false;
};
