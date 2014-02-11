/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Find two points on two {@link Geometry}s which lie
 * within a given distance, or else are the nearest points
 * on the geometries (in which case this also
 * provides the distance between the geometries).
 * <p>
 * The distance computation also finds a pair of points in the input geometries
 * which have the minimum distance between them.
 * If a point lies in the interior of a line segment,
 * the coordinate computed is a close
 * approximation to the exact point.
 * <p>
 * The algorithms used are straightforward O(n^2)
 * comparisons.  This worst-case performance could be improved on
 * by using Voronoi techniques or spatial indexes.
 *
 */



/**
 * Constructs a DistanceOp that computes the distance and nearest points
 * between the two specified geometries.
 *
 * @param {Geometry}
 *          g0 a Geometry.
 * @param {Geometry}
 *          g1 a Geometry.
 * @param {double}
 *          terminateDistance the distance on which to terminate the search.
 * @constructor
 */
jsts.operation.distance.DistanceOp = function(g0, g1, terminateDistance) {
  this.ptLocator = new jsts.algorithm.PointLocator();

  this.geom = [];
  this.geom[0] = g0;
  this.geom[1] = g1;
  this.terminateDistance = terminateDistance;
};


/**
 * @type {Geometry[]}
 */
jsts.operation.distance.DistanceOp.prototype.geom = null;


/**
 * @type {double}
 */
jsts.operation.distance.DistanceOp.prototype.terminateDistance = 0.0;


/**
 * @type {PointLocator}
 */
jsts.operation.distance.DistanceOp.prototype.ptLocator = null;


/**
 * @type {GeometryLocation[]}
 */
jsts.operation.distance.DistanceOp.prototype.minDistanceLocation = null;


/**
 * @type {double}
 */
jsts.operation.distance.DistanceOp.prototype.minDistance = Number.MAX_VALUE;


/**
 * Compute the distance between the nearest points of two geometries.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @return {double} the distance between the geometries.
 */
jsts.operation.distance.DistanceOp.distance = function(g0, g1) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, 0.0);
  return distOp.distance();
};


/**
 * Test whether two geometries lie within a given distance of each other.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @param {double}
 *          distance the distance to test.
 * @return {boolean} true if g0.distance(g1) <= distance.
 */
jsts.operation.distance.DistanceOp.isWithinDistance = function(g0, g1,
    distance) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, distance);
  return distOp.distance() <= distance;
};


/**
 * Compute the the nearest points of two geometries. The points are presented
 * in the same order as the input Geometries.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @return {Coordinate[]} the nearest points in the geometries.
 */
jsts.operation.distance.DistanceOp.nearestPoints = function(g0, g1) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, 0.0);
  return distOp.nearestPoints();
};


/**
 * Report the distance between the nearest points on the input geometries.
 *
 * @return {double} the distance between the geometries.
 * @return {double} 0 if either input geometry is empty.
 * @throws IllegalArgumentException
 *           if either input geometry is null
 */
jsts.operation.distance.DistanceOp.prototype.distance = function() {
  if (this.geom[0] === null || this.geom[1] === null)
    throw new jsts.error.IllegalArgumentError('null geometries are not supported');
  if (this.geom[0].isEmpty() || this.geom[1].isEmpty())
    return 0.0;

  this.computeMinDistance();
  return this.minDistance;
};


/**
 * Report the coordinates of the nearest points in the input geometries. The
 * points are presented in the same order as the input Geometries.
 *
 * @return {Coordinate[] } a pair of {@link Coordinate} s of the nearest
 *         points.
 */
jsts.operation.distance.DistanceOp.prototype.nearestPoints = function() {
  this.computeMinDistance();
  var nearestPts = [this.minDistanceLocation[0].getCoordinate(),
                    this.minDistanceLocation[1].getCoordinate()];
  return nearestPts;
};


/**
 * Report the locations of the nearest points in the input geometries. The
 * locations are presented in the same order as the input Geometries.
 *
 * @return {GeometryLocation[] } a pair of {@link GeometryLocation} s for the
 *         nearest points.
 */
jsts.operation.distance.DistanceOp.prototype.nearestLocations = function() {
  this.computeMinDistance();
  return this.minDistanceLocation;
};


/**
 * @param {GeometryLocation[]}
 *          locGeom locations.
 * @param {boolean}
 *          flip if locations should be flipped.
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.updateMinDistance = function(
    locGeom, flip) {
  // if not set then don't update
  if (locGeom[0] === null)
    return;

  if (flip) {
    this.minDistanceLocation[0] = locGeom[1];
    this.minDistanceLocation[1] = locGeom[0];
  } else {
    this.minDistanceLocation[0] = locGeom[0];
    this.minDistanceLocation[1] = locGeom[1];
  }
};


/**
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance = function() {
  // overloaded variant
  if (arguments.length > 0) {
    this.computeMinDistance2.apply(this, arguments);
    return;
  }

  // only compute once!
  if (this.minDistanceLocation !== null)
    return;

  this.minDistanceLocation = [];
  this.computeContainmentDistance();
  if (this.minDistance <= this.terminateDistance)
    return;
  this.computeFacetDistance();
};


/**
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance = function() {
  if (arguments.length === 2) {
    this.computeContainmentDistance2.apply(this, arguments);
    return;
  } else if (arguments.length === 3 && (!arguments[0] instanceof jsts.operation.distance.GeometryLocation)) {
    this.computeContainmentDistance3.apply(this, arguments);
    return;
  } else if (arguments.length === 3) {
    this.computeContainmentDistance4.apply(this, arguments);
    return;
  }

  var locPtPoly = [];
  // test if either geometry has a vertex inside the other
  this.computeContainmentDistance2(0, locPtPoly);
  if (this.minDistance <= this.terminateDistance)
    return;
  this.computeContainmentDistance2(1, locPtPoly);
};


/**
 * @param {int}
 *          polyGeomIndex
 * @param {GeometryLocation[]}
 *          locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance2 = function(
    polyGeomIndex, locPtPoly) {

  var locationsIndex = 1 - polyGeomIndex;
  var polys = jsts.geom.util.PolygonExtracter.getPolygons(this.geom[polyGeomIndex]);
  if (polys.length > 0) {
    var insideLocs = jsts.operation.distance.ConnectedElementLocationFilter
        .getLocations(this.geom[locationsIndex]);
    this.computeContainmentDistance3(insideLocs, polys, locPtPoly);
    if (this.minDistance <= this.terminateDistance) {
      // this assigment is determined by the order of the args in the
      // computeInside call above
      this.minDistanceLocation[locationsIndex] = locPtPoly[0];
      this.minDistanceLocation[polyGeomIndex] = locPtPoly[1];
      return;
    }
  }
};


/**
 * @param {[]}
 *          locs
 * @param {[]}
 *          polys
 * @param {GeometryLocation[] }
 *          locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance3 = function(
    locs, polys, locPtPoly) {

  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    for (var j = 0; j < polys.length; j++) {
      this.computeContainmentDistance4(loc, polys[j], locPtPoly);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {GeometryLocation}
 *          ptLoc
 * @param {Polygon}
 *          poly
 * @param {GeometryLocation[]} locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance4 = function(
    ptLoc, poly, locPtPoly) {
  var pt = ptLoc.getCoordinate();
  // if pt is not in exterior, distance to geom is 0
  if (jsts.geom.Location.EXTERIOR !== this.ptLocator.locate(pt, poly)) {
    this.minDistance = 0.0;
    locPtPoly[0] = ptLoc;
    locPtPoly[1] = new jsts.operation.distance.GeometryLocation(poly, pt);
    return;
  }
};


/**
 * Computes distance between facets (lines and points) of input geometries.
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeFacetDistance = function() {
  var locGeom = [];

  /**
   * Geometries are not wholely inside, so compute distance from lines and
   * points of one to lines and points of the other
   */
  var lines0 = jsts.geom.util.LinearComponentExtracter.getLines(this.geom[0]);
  var lines1 = jsts.geom.util.LinearComponentExtracter.getLines(this.geom[1]);

  var pts0 = jsts.geom.util.PointExtracter.getPoints(this.geom[0]);
  var pts1 = jsts.geom.util.PointExtracter.getPoints(this.geom[1]);

  // exit whenever minDistance goes LE than terminateDistance
  this.computeMinDistanceLines(lines0, lines1, locGeom);
  this.updateMinDistance(locGeom, false);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistanceLinesPoints(lines0, pts1, locGeom);
  this.updateMinDistance(locGeom, false);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistanceLinesPoints(lines1, pts0, locGeom);
  this.updateMinDistance(locGeom, true);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistancePoints(pts0, pts1, locGeom);
  this.updateMinDistance(locGeom, false);
};


/**
 * @param {[]}
 *          lines0.
 * @param {[]}
 *          lines1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLines = function(
    lines0, lines1, locGeom) {
  for (var i = 0; i < lines0.length; i++) {
    var line0 = lines0[i];
    for (var j = 0; j < lines1.length; j++) {
      var line1 = lines1[j];
      this.computeMinDistance(line0, line1, locGeom);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {[]}
 *          points0
 * @param {[]}
 *          points1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistancePoints = function(
    points0, points1, locGeom) {
  for (var i = 0; i < points0.length; i++) {
    var pt0 = points0[i];
    for (var j = 0; j < points1.length; j++) {
      var pt1 = points1[j];
      var dist = pt0.getCoordinate().distance(pt1.getCoordinate());
      if (dist < this.minDistance) {
        this.minDistance = dist;
        locGeom[0] = new jsts.operation.distance.GeometryLocation(pt0, 0, pt0.getCoordinate());
        locGeom[1] = new jsts.operation.distance.GeometryLocation(pt1, 0, pt1.getCoordinate());
      }
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {[]}
 *          lines
 * @param {[]}
 *          points
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLinesPoints = function(
    lines, points, locGeom) {
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    for (var j = 0; j < points.length; j++) {
      var pt = points[j];
      this.computeMinDistance(line, pt, locGeom);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {LineString}
 *          line0
 * @param {Point}
 *          line1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance2 = function(
    line0, line1, locGeom) {

  // overloaded variant
  if (line1 instanceof jsts.geom.Point) {
    this.computeMinDistance3(line0, line1, locGeom);
    return;
  }

  if (line0.getEnvelopeInternal().distance(line1.getEnvelopeInternal()) > this.minDistance) {
    return;
  }
  var coord0 = line0.getCoordinates();
  var coord1 = line1.getCoordinates();
  // brute force approach!
  for (var i = 0; i < coord0.length - 1; i++) {
    for (var j = 0; j < coord1.length - 1; j++) {
      var dist = jsts.algorithm.CGAlgorithms.distanceLineLine(coord0[i], coord0[i + 1],
          coord1[j], coord1[j + 1]);
      if (dist < this.minDistance) {
        this.minDistance = dist;
        var seg0 = new jsts.geom.LineSegment(coord0[i], coord0[i + 1]);
        var seg1 = new jsts.geom.LineSegment(coord1[j], coord1[j + 1]);
        var closestPt = seg0.closestPoints(seg1);
        locGeom[0] = new jsts.operation.distance.GeometryLocation(line0, i, closestPt[0]);
        locGeom[1] = new jsts.operation.distance.GeometryLocation(line1, j, closestPt[1]);
      }
      if (this.minDistance <= this.terminateDistance) {
        return;
      }
    }
  }
};


/**
 * @param {LineString}
 *          line
 * @param {Point}
 *          pt
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance3 = function(
    line, pt, locGeom) {
  if (line.getEnvelopeInternal().distance(pt.getEnvelopeInternal()) > this.minDistance) {
    return;
  }
  var coord0 = line.getCoordinates();
  var coord = pt.getCoordinate();
  // brute force approach!
  for (var i = 0; i < coord0.length - 1; i++) {
    var dist = jsts.algorithm.CGAlgorithms.distancePointLine(coord, coord0[i], coord0[i + 1]);
    if (dist < this.minDistance) {
      this.minDistance = dist;
      var seg = new jsts.geom.LineSegment(coord0[i], coord0[i + 1]);
      var segClosestPoint = seg.closestPoint(coord);
      locGeom[0] = new jsts.operation.distance.GeometryLocation(line, i, segClosestPoint);
      locGeom[1] = new jsts.operation.distance.GeometryLocation(pt, 0, coord);
    }
    if (this.minDistance <= this.terminateDistance) {
      return;
    }
  }
};
