/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/algorithm/CGAlgorithms.js
   * @requires jsts/util/UniqueCoordinateArrayFilter.js
   * @requires jsts/util/Assert.js
   */

  var CGAlgorithms = jsts.algorithm.CGAlgorithms;
  var UniqueCoordinateArrayFilter = jsts.util.UniqueCoordinateArrayFilter;
  var Assert = jsts.util.Assert;
  var Stack = javascript.util.Stack;
  var ArrayList = javascript.util.ArrayList;
  var Arrays = javascript.util.Arrays;

  /**
   * Compares {@link Coordinate}s for their angle and distance relative to an
   * origin.
   *
   * @private
   */
  var RadialComparator = function(origin) {
    this.origin = origin;
  };

  RadialComparator.prototype.origin = null;

  RadialComparator.prototype.compare = function(o1, o2) {
    var p1 = o1;
    var p2 = o2;
    return RadialComparator.polarCompare(this.origin, p1, p2);
  };

  /**
   * Given two points p and q compare them with respect to their radial ordering
   * about point o. First checks radial ordering. If points are collinear, the
   * comparison is based on their distance to the origin.
   * <p>
   * p < q iff
   * <ul>
   * <li>ang(o-p) < ang(o-q) (e.g. o-p-q is CCW)
   * <li>or ang(o-p) == ang(o-q) && dist(o,p) < dist(o,q)
   * </ul>
   *
   * @param o
   *          the origin.
   * @param p
   *          a point.
   * @param q
   *          another point.
   * @return -1, 0 or 1 depending on whether p is less than, equal to or greater
   *         than q.
   */
  RadialComparator.polarCompare = function(o, p, q) {
    var dxp = p.x - o.x;
    var dyp = p.y - o.y;
    var dxq = q.x - o.x;
    var dyq = q.y - o.y;

    var orient = CGAlgorithms.computeOrientation(o, p, q);

    if (orient == CGAlgorithms.COUNTERCLOCKWISE)
      return 1;
    if (orient == CGAlgorithms.CLOCKWISE)
      return -1;

    // points are collinear - check distance
    var op = dxp * dxp + dyp * dyp;
    var oq = dxq * dxq + dyq * dyq;
    if (op < oq) {
      return -1;
    }
    if (op > oq) {
      return 1;
    }
    return 0;
  };

  /**
   * Computes the convex hull of a {@link Geometry}. The convex hull is the
   * smallest convex Geometry that contains all the points in the input
   * Geometry.
   * <p>
   * Uses the Graham Scan algorithm.
   *
   * @constructor
   */
  jsts.algorithm.ConvexHull = function() {
    if (arguments.length === 1) {
      var geometry = arguments[0];

      this.inputPts = jsts.algorithm.ConvexHull.extractCoordinates(geometry);
      this.geomFactory = geometry.getFactory();
    } else {
      this.pts = arguments[0];
      this.geomFactory = arguments[1];
    }
  };
  jsts.algorithm.ConvexHull.prototype.geomFactory = null;
  jsts.algorithm.ConvexHull.prototype.inputPts = null;

  /**
   * @private
   */
  jsts.algorithm.ConvexHull.extractCoordinates = function(geom) {
    var filter = new UniqueCoordinateArrayFilter();
    geom.apply(filter);
    return filter.getCoordinates();
  };

  /**
   * Returns a {@link Geometry} that represents the convex hull of the input
   * geometry. The returned geometry contains the minimal number of points
   * needed to represent the convex hull. In particular, no more than two
   * consecutive points will be collinear.
   *
   * @return if the convex hull contains 3 or more points, a {@link Polygon} ; 2
   *         points, a {@link LineString}; 1 point, a {@link Point}; 0 points,
   *         an empty {@link GeometryCollection}.
   */
  jsts.algorithm.ConvexHull.prototype.getConvexHull = function() {

    if (this.inputPts.length == 0) {
      return this.geomFactory.createGeometryCollection(null);
    }
    if (this.inputPts.length == 1) {
      return this.geomFactory.createPoint(this.inputPts[0]);
    }
    if (this.inputPts.length == 2) {
      return this.geomFactory.createLineString(this.inputPts);
    }

    var reducedPts = this.inputPts;
    // use heuristic to reduce points, if large
    if (this.inputPts.length > 50) {
      reducedPts = this.reduce(this.inputPts);
    }
    // sort points for Graham scan.
    var sortedPts = this.preSort(reducedPts);

    // Use Graham scan to find convex hull.
    var cHS = this.grahamScan(sortedPts);

    // Convert stack to an array.
    var cH = cHS.toArray();

    // Convert array to appropriate output geometry.
    return this.lineOrPolygon(cH);
  };


  /**
   * Uses a heuristic to reduce the number of points scanned to compute the
   * hull. The heuristic is to find a polygon guaranteed to be in (or on) the
   * hull, and eliminate all points inside it. A quadrilateral defined by the
   * extremal points in the four orthogonal directions can be used, but even
   * more inclusive is to use an octilateral defined by the points in the 8
   * cardinal directions.
   * <p>
   * Note that even if the method used to determine the polygon vertices is not
   * 100% robust, this does not affect the robustness of the convex hull.
   * <p>
   * To satisfy the requirements of the Graham Scan algorithm, the returned
   * array has at least 3 entries.
   *
   * @param pts
   *          the points to reduce.
   * @return the reduced list of points (at least 3).
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.reduce = function(inputPts) {
    var polyPts = this.computeOctRing(inputPts);

    // unable to compute interior polygon for some reason
    if (polyPts == null)
      return this.inputPts;

    // add points defining polygon
    var reducedSet = new javascript.util.TreeSet();
    for (var i = 0; i < polyPts.length; i++) {
      reducedSet.add(polyPts[i]);
    }
    /**
     * Add all unique points not in the interior poly.
     * CGAlgorithms.isPointInRing is not defined for points actually on the
     * ring, but this doesn't matter since the points of the interior polygon
     * are forced to be in the reduced set.
     */
    for (var i = 0; i < inputPts.length; i++) {
      if (!CGAlgorithms.isPointInRing(inputPts[i], polyPts)) {
        reducedSet.add(inputPts[i]);
      }
    }
    var reducedPts = reducedSet.toArray();

    // ensure that computed array has at least 3 points (not necessarily unique)
    if (reducedPts.length < 3)
      return this.padArray3(reducedPts);
    return reducedPts;
  };

  /**
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.padArray3 = function(pts) {
    var pad = [];
    for (var i = 0; i < pad.length; i++) {
      if (i < pts.length) {
        pad[i] = pts[i];
      } else
        pad[i] = pts[0];
    }
    return pad;
  };

  /**
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.preSort = function(pts) {
    var t;

    // find the lowest point in the set. If two or more points have
    // the same minimum y coordinate choose the one with the minimu x.
    // This focal point is put in array location pts[0].
    for (var i = 1; i < pts.length; i++) {
      if ((pts[i].y < pts[0].y) ||
          ((pts[i].y == pts[0].y) && (pts[i].x < pts[0].x))) {
        t = pts[0];
        pts[0] = pts[i];
        pts[i] = t;
      }
    }

    // sort the points radially around the focal point.
    Arrays.sort(pts, 1, pts.length, new RadialComparator(pts[0]));

    return pts;
  };

  /**
   * Uses the Graham Scan algorithm to compute the convex hull vertices.
   *
   * @param c
   *          a list of points, with at least 3 entries.
   * @return a Stack containing the ordered points of the convex hull ring.
   */
  /**
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.grahamScan = function(c) {
    var p;
    var ps = new Stack();
    p = ps.push(c[0]);
    p = ps.push(c[1]);
    p = ps.push(c[2]);
    for (var i = 3; i < c.length; i++) {
      p = ps.pop();
      // check for empty stack to guard against robustness problems
      while (!ps.empty() &&
          CGAlgorithms.computeOrientation(ps.peek(), p, c[i]) > 0) {
        p = ps.pop();
      }
      p = ps.push(p);
      p = ps.push(c[i]);
    }
    p = ps.push(c[0]);
    return ps;
  };

  /**
   * @return whether the three coordinates are collinear and c2 lies between c1
   *         and c3 inclusive.
   *
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.isBetween = function(c1, c2, c3) {
    if (CGAlgorithms.computeOrientation(c1, c2, c3) !== 0) {
      return false;
    }
    if (c1.x != c3.x) {
      if (c1.x <= c2.x && c2.x <= c3.x) {
        return true;
      }
      if (c3.x <= c2.x && c2.x <= c1.x) {
        return true;
      }
    }
    if (c1.y != c3.y) {
      if (c1.y <= c2.y && c2.y <= c3.y) {
        return true;
      }
      if (c3.y <= c2.y && c2.y <= c1.y) {
        return true;
      }
    }
    return false;
  };

  /**
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.computeOctRing = function(inputPts) {
    var octPts = this.computeOctPts(inputPts);
    var coordList = new jsts.geom.CoordinateList();
    coordList.add(octPts, false);

    // points must all lie in a line
    if (coordList.size() < 3) {
      return null;
    }
    coordList.closeRing();
    return coordList.toCoordinateArray();
  };

  /**
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.computeOctPts = function(inputPts) {
    var pts = [];
    for (var j = 0; j < 8; j++) {
      pts[j] = inputPts[0];
    }
    for (var i = 1; i < inputPts.length; i++) {
      if (inputPts[i].x < pts[0].x) {
        pts[0] = inputPts[i];
      }
      if (inputPts[i].x - inputPts[i].y < pts[1].x - pts[1].y) {
        pts[1] = inputPts[i];
      }
      if (inputPts[i].y > pts[2].y) {
        pts[2] = inputPts[i];
      }
      if (inputPts[i].x + inputPts[i].y > pts[3].x + pts[3].y) {
        pts[3] = inputPts[i];
      }
      if (inputPts[i].x > pts[4].x) {
        pts[4] = inputPts[i];
      }
      if (inputPts[i].x - inputPts[i].y > pts[5].x - pts[5].y) {
        pts[5] = inputPts[i];
      }
      if (inputPts[i].y < pts[6].y) {
        pts[6] = inputPts[i];
      }
      if (inputPts[i].x + inputPts[i].y < pts[7].x + pts[7].y) {
        pts[7] = inputPts[i];
      }
    }
    return pts;

  };


  /**
   * @param vertices
   *          the vertices of a linear ring, which may or may not be flattened
   *          (i.e. vertices collinear).
   * @return a 2-vertex <code>LineString</code> if the vertices are collinear;
   *         otherwise, a <code>Polygon</code> with unnecessary (collinear)
   *         vertices removed.
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.lineOrPolygon = function(coordinates) {
    coordinates = this.cleanRing(coordinates);
    if (coordinates.length == 3) {
      return this.geomFactory
          .createLineString([coordinates[0], coordinates[1]]);
    }
    var linearRing = this.geomFactory.createLinearRing(coordinates);
    return this.geomFactory.createPolygon(linearRing, null);
  };

  /**
   * @param vertices
   *          the vertices of a linear ring, which may or may not be flattened
   *          (i.e. vertices collinear).
   * @return the coordinates with unnecessary (collinear) vertices removed.
   * @private
   */
  jsts.algorithm.ConvexHull.prototype.cleanRing = function(original) {
    Assert.equals(original[0], original[original.length - 1]);
    var cleanedRing = new ArrayList();
    var previousDistinctCoordinate = null;
    for (var i = 0; i <= original.length - 2; i++) {
      var currentCoordinate = original[i];
      var nextCoordinate = original[i + 1];
      if (currentCoordinate.equals(nextCoordinate)) {
        continue;
      }
      if (previousDistinctCoordinate != null &&
          this.isBetween(previousDistinctCoordinate, currentCoordinate,
              nextCoordinate)) {
        continue;
      }
      cleanedRing.add(currentCoordinate);
      previousDistinctCoordinate = currentCoordinate;
    }
    cleanedRing.add(original[original.length - 1]);
    var cleanedRingCoordinates = [];
    return cleanedRing.toArray(cleanedRingCoordinates);
  };

})();
