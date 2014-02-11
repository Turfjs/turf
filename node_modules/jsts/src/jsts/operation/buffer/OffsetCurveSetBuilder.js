/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Creates all the raw offset curves for a buffer of a {@link Geometry}. Raw
 * curves need to be noded together and polygonized to form the final buffer
 * area.
 *
 * @constructor
 */
jsts.operation.buffer.OffsetCurveSetBuilder = function(inputGeom, distance,
    curveBuilder) {
  this.inputGeom = inputGeom;
  this.distance = distance;
  this.curveBuilder = curveBuilder;

  this.curveList = new javascript.util.ArrayList();
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.inputGeom = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.distance = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveBuilder = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveList = null;


/**
 * Computes the set of raw offset curves for the buffer. Each offset curve has
 * an attached {@link Label} indicating its left and right location.
 *
 * @return a Collection of SegmentStrings representing the raw buffer curves.
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.getCurves = function() {
  this.add(this.inputGeom);
  return this.curveList;
};


/**
 * Creates a {@link SegmentString} for a coordinate list which is a raw offset
 * curve, and adds it to the list of buffer curves. The SegmentString is tagged
 * with a Label giving the topology of the curve. The curve may be oriented in
 * either direction. If the curve is oriented CW, the locations will be: <br>
 * Left: Location.EXTERIOR <br>
 * Right: Location.INTERIOR
 *
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCurve = function(
    coord, leftLoc, rightLoc) {
  // don't add null or trivial curves
  if (coord == null || coord.length < 2)
    return;
  // add the edge for a coordinate list which is a raw offset curve
  var e = new jsts.noding.NodedSegmentString(coord, new jsts.geomgraph.Label(0,
      jsts.geom.Location.BOUNDARY, leftLoc, rightLoc));
  this.curveList.add(e);
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.add = function(g) {
  if (g.isEmpty())
    return;

  if (g instanceof jsts.geom.Polygon)
    this.addPolygon(g);
  // LineString also handles LinearRings
  else if (g instanceof jsts.geom.LineString)
    this.addLineString(g);
  else if (g instanceof jsts.geom.Point)
    this.addPoint(g);
  else if (g instanceof jsts.geom.MultiPoint)
    this.addCollection(g);
  else if (g instanceof jsts.geom.MultiLineString)
    this.addCollection(g);
  else if (g instanceof jsts.geom.MultiPolygon)
    this.addCollection(g);
  else if (g instanceof jsts.geom.GeometryCollection)
    this.addCollection(g);
  else
    throw new jsts.error.IllegalArgumentError();
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCollection = function(
    gc) {
  for (var i = 0; i < gc.getNumGeometries(); i++) {
    var g = gc.getGeometryN(i);
    this.add(g);
  }
};


/**
 * Add a Point to the graph.
 *
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPoint = function(p) {
  // a zero or negative width buffer of a line/point is empty
  if (this.distance <= 0.0)
    return;
  var coord = p.getCoordinates();
  var curve = this.curveBuilder.getLineCurve(coord, this.distance);
  this
      .addCurve(curve, jsts.geom.Location.EXTERIOR, jsts.geom.Location.INTERIOR);
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addLineString = function(
    line) {
  // a zero or negative width buffer of a line/point is empty
  if (this.distance <= 0.0 &&
      !this.curveBuilder.getBufferParameters().isSingleSided())
    return;
  var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(line
      .getCoordinates());
  var curve = this.curveBuilder.getLineCurve(coord, this.distance);
  this
      .addCurve(curve, jsts.geom.Location.EXTERIOR, jsts.geom.Location.INTERIOR);
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygon = function(p) {
  var offsetDistance = this.distance;
  var offsetSide = jsts.geomgraph.Position.LEFT;
  if (this.distance < 0.0) {
    offsetDistance = -this.distance;
    offsetSide = jsts.geomgraph.Position.RIGHT;
  }

  var shell = p.getExteriorRing();
  var shellCoord = jsts.geom.CoordinateArrays.removeRepeatedPoints(shell
      .getCoordinates());
  // optimization - don't bother computing buffer
  // if the polygon would be completely eroded
  if (this.distance < 0.0 && this.isErodedCompletely(shell, this.distance))
    return;
  // don't attemtp to buffer a polygon with too few distinct vertices
  if (this.distance <= 0.0 && shellCoord.length < 3)
    return;

  this.addPolygonRing(shellCoord, offsetDistance, offsetSide,
      jsts.geom.Location.EXTERIOR, jsts.geom.Location.INTERIOR);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {

    var hole = p.getInteriorRingN(i);
    var holeCoord = jsts.geom.CoordinateArrays.removeRepeatedPoints(hole
        .getCoordinates());

    // optimization - don't bother computing buffer for this hole
    // if the hole would be completely covered
    if (this.distance > 0.0 && this.isErodedCompletely(hole, -this.distance))
      continue;

    // Holes are topologically labelled opposite to the shell, since
    // the interior of the polygon lies on their opposite side
    // (on the left, if the hole is oriented CCW)
    this.addPolygonRing(holeCoord, offsetDistance, jsts.geomgraph.Position
        .opposite(offsetSide), jsts.geom.Location.INTERIOR,
        jsts.geom.Location.EXTERIOR);
  }
};


/**
 * Adds an offset curve for a polygon ring. The side and left and right
 * topological location arguments assume that the ring is oriented CW. If the
 * ring is in the opposite orientation, the left and right locations must be
 * interchanged and the side flipped.
 *
 * @param coord
 *          the coordinates of the ring (must not contain repeated points).
 * @param offsetDistance
 *          the distance at which to create the buffer.
 * @param side
 *          the side of the ring on which to construct the buffer line.
 * @param cwLeftLoc
 *          the location on the L side of the ring (if it is CW).
 * @param cwRightLoc
 *          the location on the R side of the ring (if it is CW).
 */
/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygonRing = function(
    coord, offsetDistance, side, cwLeftLoc, cwRightLoc) {
  // don't bother adding ring if it is "flat" and will disappear in the output
  if (offsetDistance == 0.0 &&
      coord.length < jsts.geom.LinearRing.MINIMUM_VALID_SIZE)
    return;

  var leftLoc = cwLeftLoc;
  var rightLoc = cwRightLoc;
  if (coord.length >= jsts.geom.LinearRing.MINIMUM_VALID_SIZE &&
      jsts.algorithm.CGAlgorithms.isCCW(coord)) {
    leftLoc = cwRightLoc;
    rightLoc = cwLeftLoc;
    side = jsts.geomgraph.Position.opposite(side);
  }
  var curve = this.curveBuilder.getRingCurve(coord, side, offsetDistance);
  this.addCurve(curve, leftLoc, rightLoc);
};


/**
 * The ringCoord is assumed to contain no repeated points. It may be degenerate
 * (i.e. contain only 1, 2, or 3 points). In this case it has no area, and hence
 * has a minimum diameter of 0.
 *
 * @param ringCoord
 * @param offsetDistance
 * @return
 */
/**
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isErodedCompletely = function(
    ring, bufferDistance) {
  var ringCoord = ring.getCoordinates();
  var minDiam = 0.0;
  // degenerate ring has no area
  if (ringCoord.length < 4)
    return bufferDistance < 0;

  // important test to eliminate inverted triangle bug
  // also optimizes erosion test for triangles
  if (ringCoord.length == 4)
    return this.isTriangleErodedCompletely(ringCoord, bufferDistance);

  // if envelope is narrower than twice the buffer distance, ring is eroded
  var env = ring.getEnvelopeInternal();
  var envMinDimension = Math.min(env.getHeight(), env.getWidth());
  if (bufferDistance < 0.0 && 2 * Math.abs(bufferDistance) > envMinDimension)
    return true;

  return false;
};


/**
 * Tests whether a triangular ring would be eroded completely by the given
 * buffer distance. This is a precise test. It uses the fact that the inner
 * buffer of a triangle converges on the inCentre of the triangle (the point
 * equidistant from all sides). If the buffer distance is greater than the
 * distance of the inCentre from a side, the triangle will be eroded completely.
 *
 * This test is important, since it removes a problematic case where the buffer
 * distance is slightly larger than the inCentre distance. In this case the
 * triangle buffer curve "inverts" with incorrect topology, producing an
 * incorrect hole in the buffer.
 *
 * @param triangleCoord
 * @param bufferDistance
 * @return
 *
 * @private
 */
jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isTriangleErodedCompletely = function(
    triangleCoord, bufferDistance) {
  var tri = new jsts.geom.Triangle(triangleCoord[0], triangleCoord[1], triangleCoord[2]);
  var inCentre = tri.inCentre();
  var distToCentre = jsts.algorithm.CGAlgorithms.distancePointLine(inCentre,
      tri.p0, tri.p1);
  return distToCentre < Math.abs(bufferDistance);
};
