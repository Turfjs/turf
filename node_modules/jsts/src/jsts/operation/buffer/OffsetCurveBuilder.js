/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the raw offset curve for a single {@link Geometry} component (ring,
 * line or point). A raw offset curve line is not noded - it may contain
 * self-intersections (and usually will). The final buffer polygon is computed
 * by forming a topological graph of all the noded raw curves and tracing
 * outside contours. The points in the raw curve are rounded to a given
 * {@link PrecisionModel}.
 *
 * @constructor
 */
jsts.operation.buffer.OffsetCurveBuilder = function(precisionModel, bufParams) {
  this.precisionModel = precisionModel;
  this.bufParams = bufParams;
};


/**
 * @type {double}
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.distance = 0.0;


/**
 * @type {PrecisionModel}
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.precisionModel = null;


/**
 * @type {BufferParameters}
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.bufParams = null;


/**
 * Gets the buffer parameters being used to generate the curve.
 *
 * @return the buffer parameters being used.
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.getBufferParameters = function() {
  return this.bufParams;
};


/**
 * This method handles single points as well as LineStrings. LineStrings are
 * assumed <b>not</b> to be closed (the function will not fail for closed
 * lines, but will generate superfluous line caps).
 *
 * @param inputPts
 *          the vertices of the line to offset.
 * @param distance
 *          the offset distance.
 *
 * @return a Coordinate array representing the curve.
 * @return null if the curve is empty.
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.getLineCurve = function(
    inputPts, distance) {
  this.distance = distance;

  // a zero or negative width buffer of a line/point is empty
  if (this.distance < 0.0 && !this.bufParams.isSingleSided())
    return null;
  if (this.distance == 0.0)
    return null;

  var posDistance = Math.abs(this.distance);
  var segGen = this.getSegGen(posDistance);
  if (inputPts.length <= 1) {
    this.computePointCurve(inputPts[0], segGen);
  } else {
    if (this.bufParams.isSingleSided()) {
      var isRightSide = distance < 0.0;
      this.computeSingleSidedBufferCurve(inputPts, isRightSide, segGen);
    } else
      this.computeLineBufferCurve(inputPts, segGen);
  }

  var lineCoord = segGen.getCoordinates();
  return lineCoord;
};


/**
 * This method handles the degenerate cases of single points and lines, as well
 * as rings.
 *
 * @return a Coordinate array representing the curve.
 * @return null if the curve is empty.
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.getRingCurve = function(
    inputPts, side, distance) {
  this.distance = distance;
  if (inputPts.length <= 2)
    return this.getLineCurve(inputPts, distance);

  // optimize creating ring for for zero distance
  if (this.distance == 0.0) {
    return jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates(inputPts);
  }
  var segGen = this.getSegGen(this.distance);
  this.computeRingBufferCurve(inputPts, side, segGen);
  return segGen.getCoordinates();
};

jsts.operation.buffer.OffsetCurveBuilder.prototype.getOffsetCurve = function(
    inputPts, distance) {
  this.distance = distance;

  // a zero width offset curve is empty
  if (this.distance === 0.0)
    return null;

  var isRightSide = this.distance < 0.0;
  var posDistance = Math.abs(this.distance);
  var segGen = this.getSegGen(posDistance);
  if (inputPts.length <= 1) {
    this.computePointCurve(inputPts[0], segGen);
  } else {
    this.computeOffsetCurve(inputPts, isRightSide, segGen);
  }
  var curvePts = segGen.getCoordinates();
  // for right side line is traversed in reverse direction, so have to reverse
  // generated line
  if (isRightSide)
    curvePts.reverse();
  return curvePts;
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates = function(pts) {
  var copy = [];
  for (var i = 0; i < pts.length; i++) {
    copy.push(pts[i].clone());
  }
  return copy;
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.getSegGen = function(
    distance) {
  return new jsts.operation.buffer.OffsetSegmentGenerator(this.precisionModel,
      this.bufParams, distance);
};


/**
 * Use a value which results in a potential distance error which is
 * significantly less than the error due to the quadrant segment discretization.
 * For QS = 8 a value of 100 is reasonable. This should produce a maximum of 1%
 * distance error.
 *
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR = 100.0;


/**
 * Computes the distance tolerance to use during input line simplification.
 *
 * @param distance
 *          the buffer distance.
 * @return the simplification tolerance.
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance = function(
    bufDistance) {
  return bufDistance / jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR;
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.computePointCurve = function(
    pt, segGen) {
  switch (this.bufParams.getEndCapStyle()) {
  case jsts.operation.buffer.BufferParameters.CAP_ROUND:
    segGen.createCircle(pt);
    break;
  case jsts.operation.buffer.BufferParameters.CAP_SQUARE:
    segGen.createSquare(pt);
    break;
  // otherwise curve is empty (e.g. for a butt cap);
  }
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.computeLineBufferCurve = function(
    inputPts, segGen) {
  var distTol = jsts.operation.buffer.OffsetCurveBuilder
      .simplifyTolerance(this.distance);

  // --------- compute points for left side of line
  // Simplify the appropriate side of the line before generating
  var simp1 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
      inputPts, distTol);
  // MD - used for testing only (to eliminate simplification)
  // Coordinate[] simp1 = inputPts;

  var n1 = simp1.length - 1;
  segGen.initSideSegments(simp1[0], simp1[1], jsts.geomgraph.Position.LEFT);
  for (var i = 2; i <= n1; i++) {
    segGen.addNextSegment(simp1[i], true);
  }
  segGen.addLastSegment();
  // add line cap for end of line
  segGen.addLineEndCap(simp1[n1 - 1], simp1[n1]);

  // ---------- compute points for right side of line
  // Simplify the appropriate side of the line before generating
  var simp2 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
      inputPts, -distTol);
  // MD - used for testing only (to eliminate simplification)
  // Coordinate[] simp2 = inputPts;
  var n2 = simp2.length - 1;

  // since we are traversing line in opposite order, offset position is still
  // LEFT
  segGen.initSideSegments(simp2[n2], simp2[n2 - 1], jsts.geomgraph.Position.LEFT);
  for (var i = n2 - 2; i >= 0; i--) {
    segGen.addNextSegment(simp2[i], true);
  }
  segGen.addLastSegment();
  // add line cap for start of line
  segGen.addLineEndCap(simp2[1], simp2[0]);

  segGen.closeRing();
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.computeSingleSidedBufferCurve = function(
    inputPts, isRightSide, segGen) {
  var distTol = jsts.operation.buffer.OffsetCurveBuilder
      .simplifyTolerance(this.distance);

  if (isRightSide) {
    // add original line
    segGen.addSegments(inputPts, true);

    // ---------- compute points for right side of line
    // Simplify the appropriate side of the line before generating
    var simp2 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
        inputPts, -distTol);
    // MD - used for testing only (to eliminate simplification)
    // Coordinate[] simp2 = inputPts;
    var n2 = simp2.length - 1;

    // since we are traversing line in opposite order, offset position is still
    // LEFT
    segGen.initSideSegments(simp2[n2], simp2[n2 - 1],
        jsts.geomgraph.Position.LEFT);
    segGen.addFirstSegment();
    for (var i = n2 - 2; i >= 0; i--) {
      segGen.addNextSegment(simp2[i], true);
    }
  } else {
    // add original line
    segGen.addSegments(inputPts, false);

    // --------- compute points for left side of line
    // Simplify the appropriate side of the line before generating
    var simp1 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
        inputPts, distTol);
    // MD - used for testing only (to eliminate simplification)
    // Coordinate[] simp1 = inputPts;

    var n1 = simp1.length - 1;
    segGen.initSideSegments(simp1[0], simp1[1], jsts.geomgraph.Position.LEFT);
    segGen.addFirstSegment();
    for (var i = 2; i <= n1; i++) {
      segGen.addNextSegment(simp1[i], true);
    }
  }
  segGen.addLastSegment();
  segGen.closeRing();
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.computeOffsetCurve = function(
    inputPts, isRightSide, segGen) {
  var distTol = jsts.operation.buffer.OffsetCurveBuilder
      .simplifyTolerance(this.distance);

  if (isRightSide) {
    // ---------- compute points for right side of line
    // Simplify the appropriate side of the line before generating
    var simp2 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
        inputPts, -distTol);
    // MD - used for testing only (to eliminate simplification)
    // Coordinate[] simp2 = inputPts;
    var n2 = simp2.length - 1;

    // since we are traversing line in opposite order, offset position is still
    // LEFT
    segGen.initSideSegments(simp2[n2], simp2[n2 - 1],
        jsts.geomgraph.Position.LEFT);
    segGen.addFirstSegment();
    for (var i = n2 - 2; i >= 0; i--) {
      segGen.addNextSegment(simp2[i], true);
    }
  } else {
    // --------- compute points for left side of line
    // Simplify the appropriate side of the line before generating
    var simp1 = jsts.operation.buffer.BufferInputLineSimplifier.simplify(
        inputPts, distTol);
    // MD - used for testing only (to eliminate simplification)
    // Coordinate[] simp1 = inputPts;

    var n1 = simp1.length - 1;
    segGen.initSideSegments(simp1[0], simp1[1], jsts.geomgraph.Position.LEFT);
    segGen.addFirstSegment();
    for (var i = 2; i <= n1; i++) {
      segGen.addNextSegment(simp1[i], true);
    }
  }
  segGen.addLastSegment();
};


/**
 * @private
 */
jsts.operation.buffer.OffsetCurveBuilder.prototype.computeRingBufferCurve = function(
    inputPts, side, segGen) {
  // simplify input line to improve performance
  var distTol = jsts.operation.buffer.OffsetCurveBuilder
      .simplifyTolerance(this.distance);
  // ensure that correct side is simplified
  if (side === jsts.geomgraph.Position.RIGHT)
    distTol = -distTol;
  var simp = jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,
      distTol);

  var n = simp.length - 1;
  segGen.initSideSegments(simp[n - 1], simp[0], side);
  for (var i = 1; i <= n; i++) {
    var addStartPoint = i !== 1;
    segGen.addNextSegment(simp[i], addStartPoint);
  }
  segGen.closeRing();
};
