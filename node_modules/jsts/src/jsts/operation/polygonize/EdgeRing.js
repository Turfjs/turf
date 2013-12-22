/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/EdgeRing.java
 * Revision: 109
 */

(function() {

  /**
   * Represents a ring of {@link PolygonizeDirectedEdge}s which form a ring of
   * a polygon. The ring may be either an outer shell or a hole.
   */
  var EdgeRing = function(factory) {
    this.deList = new javascript.util.ArrayList();

    this.factory = factory;
  };



  /**
   * Find the innermost enclosing shell EdgeRing containing the argument
   * EdgeRing, if any. The innermost enclosing ring is the <i>smallest</i>
   * enclosing ring. The algorithm used depends on the fact that: <br>
   * ring A contains ring B iff envelope(ring A) contains envelope(ring B) <br>
   * This routine is only safe to use if the chosen point of the hole is known
   * to be properly contained in a shell (which is guaranteed to be the case if
   * the hole does not touch its shell)
   *
   * @param {EdgeRing}
   *          testEr
   * @param {List}
   *          shellList
   *
   * @return containing EdgeRing, if there is one.
   * @return null if no containing EdgeRing is found.
   */
  EdgeRing.findEdgeRingContaining = function(testEr, shellList) {
    var testRing = testEr.getRing();
    var testEnv = testRing.getEnvelopeInternal();
    var testPt = testRing.getCoordinateN(0);

    var minShell = null;
    var minEnv = null;
    for (var it = shellList.iterator(); it.hasNext();) {
      var tryShell = it.next();
      var tryRing = tryShell.getRing();
      var tryEnv = tryRing.getEnvelopeInternal();
      if (minShell != null)
        minEnv = minShell.getRing().getEnvelopeInternal();
      var isContained = false;
      // the hole envelope cannot equal the shell envelope
      if (tryEnv.equals(testEnv))
        continue;

      testPt = jsts.geom.CoordinateArrays.ptNotInList(
          testRing.getCoordinates(), tryRing.getCoordinates());
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
   * Finds a point in a list of points which is not contained in another list of
   * points
   *
   * @param {Coordinate[]}
   *          testPts the {@link Coordinate}s to test.
   * @param {Coordinate[]}
   *          pts an array of {@link Coordinate}s to test the input points
   *          against.
   * @return a {@link Coordinate} from <code>testPts</code> which is not in
   *         <code>pts</code>,.
   * @return null if there is no coordinate not in the list.
   */
  EdgeRing.ptNotInList = function(testPts, pts) {
    for (var i = 0; i < testPts.length; i++) {
      var testPt = testPts[i];
      if (!isInList(testPt, pts))
        return testPt;
    }
    return null;
  };

  /**
   * Tests whether a given point is in an array of points. Uses a value-based
   * test.
   *
   * @param {Coordinate}
   *          pt a {@link Coordinate} for the test point.
   * @param {Coordinate[]}
   *          pts an array of {@link Coordinate}s to test.
   * @return <code>true</code> if the point is in the array.
   */
  EdgeRing.isInList = function(pt, pts) {
    for (var i = 0; i < pts.length; i++) {
      if (pt.equals(pts[i]))
        return true;
    }
    return false;
  }

  EdgeRing.prototype.factory = null;

  EdgeRing.prototype.deList = null;

  // cache the following data for efficiency
  EdgeRing.prototype.ring = null;

  EdgeRing.prototype.ringPts = null;
  EdgeRing.prototype.holes = null;

  /**
   * Adds a {@link DirectedEdge} which is known to form part of this ring.
   *
   * @param de
   *          the {@link DirectedEdge} to add.
   */
  EdgeRing.prototype.add = function(de) {
    this.deList.add(de);
  };

  /**
   * Tests whether this ring is a hole. Due to the way the edges in the
   * polyongization graph are linked, a ring is a hole if it is oriented
   * counter-clockwise.
   *
   * @return <code>true</code> if this ring is a hole.
   */
  EdgeRing.prototype.isHole = function() {
    var ring = this.getRing();
    return jsts.algorithm.CGAlgorithms.isCCW(ring.getCoordinates());
  };

  /**
   * Adds a hole to the polygon formed by this ring.
   *
   * @param hole
   *          the {@link LinearRing} forming the hole.
   */
  EdgeRing.prototype.addHole = function(hole) {
    if (this.holes == null)
      this.holes = new javascript.util.ArrayList();
    this.holes.add(hole);
  };

  /**
   * Computes the {@link Polygon} formed by this ring and any contained holes.
   *
   * @return the {@link Polygon} formed by this ring and its holes.
   */
  EdgeRing.prototype.getPolygon = function() {
    var holeLR = null;
    if (this.holes != null) {
      holeLR = [];
      for (var i = 0; i < this.holes.size(); i++) {
        holeLR[i] = this.holes.get(i);
      }
    }
    var poly = this.factory.createPolygon(this.ring, holeLR);
    return poly;
  };

  /**
   * Tests if the {@link LinearRing} ring formed by this edge ring is
   * topologically valid.
   *
   * @return true if the ring is valid.
   */
  EdgeRing.prototype.isValid = function() {
    this.getCoordinates();
    if (this.ringPts.length <= 3)
      return false;
    this.getRing();
    return this.ring.isValid();
  };

  /**
   * Computes the list of coordinates which are contained in this ring. The
   * coordinatea are computed once only and cached.
   *
   * @return an array of the {@link Coordinate} s in this ring.
   */
  EdgeRing.prototype.getCoordinates = function() {
    if (this.ringPts == null) {
      var coordList = new jsts.geom.CoordinateList();
      for (var i = this.deList.iterator(); i.hasNext();) {
        var de = i.next();
        var edge = de.getEdge();
        EdgeRing.addEdge(edge.getLine().getCoordinates(), de.getEdgeDirection(),
            coordList);
      }
      this.ringPts = coordList.toCoordinateArray();
    }
    return this.ringPts;
  };

  /**
   * Gets the coordinates for this ring as a {@link LineString}. Used to return
   * the coordinates in this ring as a valid geometry, when it has been detected
   * that the ring is topologically invalid.
   *
   * @return a {@link LineString} containing the coordinates in this ring.
   */
  EdgeRing.prototype.getLineString = function() {
    this.getCoordinates();
    return this.factory.createLineString(this.ringPts);
  };

  /**
   * Returns this ring as a {@link LinearRing}, or null if an Exception occurs
   * while creating it (such as a topology problem). Details of problems are
   * written to standard output.
   */
  EdgeRing.prototype.getRing = function() {
    if (this.ring != null)
      return this.ring;
    this.getCoordinates();
    if (this.ringPts.length < 3)
      console.log(this.ringPts);
    try {
      this.ring = this.factory.createLinearRing(this.ringPts);
    } catch (ex) {
      console.log(this.ringPts);
    }
    return this.ring;
  };

  EdgeRing.addEdge = function(coords, isForward, coordList) {
    if (isForward) {
      for (var i = 0; i < coords.length; i++) {
        coordList.add(coords[i], false);
      }
    } else {
      for (var i = coords.length - 1; i >= 0; i--) {
        coordList.add(coords[i], false);
      }
    }
  };

  jsts.operation.polygonize.EdgeRing = EdgeRing;

})();
