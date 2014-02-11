/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Generates segments which form an offset curve. Supports all end cap and join
 * options provided for buffering. Implements various heuristics to produce
 * smoother, simpler curves which are still within a reasonable tolerance of the
 * true curve.
 * @constructor
 */
jsts.operation.buffer.OffsetSegmentGenerator = function(precisionModel,
    bufParams, distance) {
  this.seg0 = new jsts.geom.LineSegment();
  this.seg1 = new jsts.geom.LineSegment();
  this.offset0 = new jsts.geom.LineSegment();
  this.offset1 = new jsts.geom.LineSegment();

  this.precisionModel = precisionModel;
  this.bufParams = bufParams;

  // compute intersections in full precision, to provide accuracy
  // the points are rounded as they are inserted into the curve line
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.filletAngleQuantum = Math.PI / 2.0 / bufParams.getQuadrantSegments();

  /**
   * Non-round joins cause issues with short closing segments, so don't use
   * them. In any case, non-round joins only really make sense for relatively
   * small buffer distances.
   */
  if (this.bufParams.getQuadrantSegments() >= 8 &&
      this.bufParams.getJoinStyle() === jsts.operation.buffer.BufferParameters.JOIN_ROUND) {
    this.closingSegLengthFactor = jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR;
  }
  this.init(distance);
};


/**
 * Factor which controls how close offset segments can be to skip adding a
 * filler or mitre.
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR = 1.0E-3;


/**
 * Factor which controls how close curve vertices on inside turns can be to be
 * snapped
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR = 1.0E-3;


/**
 * Factor which controls how close curve vertices can be to be snapped
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR = 1.0E-6;


/**
 * Factor which determines how short closing segs can be for round buffers *
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR = 80;


/**
 * the max error of approximation (distance) between a quad segment and the true
 * fillet curve
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.maxCurveSegmentError = 0.0;


/**
 * The angle quantum with which to approximate a fillet curve (based on the
 * input # of quadrant segments)
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.filletAngleQuantum = null;


/**
 * The Closing Segment Length Factor controls how long "closing segments" are.
 * Closing segments are added at the middle of inside corners to ensure a
 * smoother boundary for the buffer offset curve. In some cases (particularly
 * for round joins with default-or-better quantization) the closing segments can
 * be made quite short. This substantially improves performance (due to fewer
 * intersections being created).
 *
 * A closingSegFactor of 0 results in lines to the corner vertex A
 * closingSegFactor of 1 results in lines halfway to the corner vertex A
 * closingSegFactor of 80 results in lines 1/81 of the way to the corner vertex
 * (this option is reasonable for the very common default situation of round
 * joins and quadrantSegs >= 8)
 *
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.closingSegLengthFactor = 1;


/**
 * @type {OffsetSegmentString}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.segList = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.distance = 0.0;


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.precisionModel = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.bufParams = null;


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.li = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.s0 = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.s1 = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.s2 = null;


/**
 * @type {LineSegment}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg0 = null;


/**
 * @type {LineSegment}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg1 = null;


/**
 * @type {LineSegment}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset0 = null;


/**
 * @type {LineSegment}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset1 = null;


/**
 * @type {number}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.side = 0;


/**
 * @type {boolean}
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle = false;


/**
 * Tests whether the input has a narrow concave angle (relative to the offset
 * distance). In this case the generated offset curve will contain
 * self-intersections and heuristic closing segments. This is expected behaviour
 * in the case of buffer curves. For pure offset curves, the output needs to be
 * further treated before it can be used.
 *
 * @return true if the input has a narrow concave angle.
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle = function() {
  return this.hasNarrowConcaveAngle;
};


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.init = function(distance) {
  this.distance = distance;
  this.maxCurveSegmentError = this.distance *
      (1 - Math.cos(this.filletAngleQuantum / 2.0));
  this.segList = new jsts.operation.buffer.OffsetSegmentString();
  this.segList.setPrecisionModel(this.precisionModel);
  /**
   * Choose the min vertex separation as a small fraction of the offset
   * distance.
   */
  this.segList
      .setMinimumVertexDistance(this.distance *
          jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR);
};


jsts.operation.buffer.OffsetSegmentGenerator.prototype.initSideSegments = function(
    s1, s2, side) {
  this.s1 = s1;
  this.s2 = s2;
  this.side = side;
  this.seg1.setCoordinates(this.s1, this.s2);
  this.computeOffsetSegment(this.seg1, this.side, this.distance, this.offset1);
};

jsts.operation.buffer.OffsetSegmentGenerator.prototype.getCoordinates = function() {
  return this.segList.getCoordinates();
};

jsts.operation.buffer.OffsetSegmentGenerator.prototype.closeRing = function() {
  this.segList.closeRing();
};

jsts.operation.buffer.OffsetSegmentGenerator.prototype.addSegments = function(
    pt, isForward) {
  this.segList.addPts(pt, isForward);
};

jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFirstSegment = function() {
  this.segList.addPt(this.offset1.p0);
};


/**
 * Add last offset point
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLastSegment = function() {
  this.segList.addPt(this.offset1.p1);
};

jsts.operation.buffer.OffsetSegmentGenerator.prototype.addNextSegment = function(
    p, addStartPoint) {
  // s0-s1-s2 are the coordinates of the previous segment and the current one
  this.s0 = this.s1;
  this.s1 = this.s2;
  this.s2 = p;
  this.seg0.setCoordinates(this.s0, this.s1);
  this.computeOffsetSegment(this.seg0, this.side, this.distance, this.offset0);
  this.seg1.setCoordinates(this.s1, this.s2);
  this.computeOffsetSegment(this.seg1, this.side, this.distance, this.offset1);

  // do nothing if points are equal
  if (this.s1.equals(this.s2))
    return;

  var orientation = jsts.algorithm.CGAlgorithms.computeOrientation(this.s0,
      this.s1, this.s2);
  var outsideTurn = (orientation === jsts.algorithm.CGAlgorithms.CLOCKWISE && this.side === jsts.geomgraph.Position.LEFT) ||
      (orientation === jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE && this.side === jsts.geomgraph.Position.RIGHT);

  if (orientation == 0) { // lines are collinear
    this.addCollinear(addStartPoint);
  } else if (outsideTurn) {
    this.addOutsideTurn(orientation, addStartPoint);
  } else { // inside turn
    this.addInsideTurn(orientation, addStartPoint);
  }
};


/**
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addCollinear = function(
    addStartPoint) {
  /**
   * This test could probably be done more efficiently, but the situation of
   * exact collinearity should be fairly rare.
   */
  this.li.computeIntersection(this.s0, this.s1, this.s1, this.s2);
  var numInt = this.li.getIntersectionNum();
  /**
   * if numInt is < 2, the lines are parallel and in the same direction. In this
   * case the point can be ignored, since the offset lines will also be
   * parallel.
   */
  if (numInt >= 2) {
    /**
     * segments are collinear but reversing. Add an "end-cap" fillet all the way
     * around to other direction This case should ONLY happen for LineStrings,
     * so the orientation is always CW. (Polygons can never have two consecutive
     * segments which are parallel but reversed, because that would be a self
     * intersection.
     *
     */
    if (this.bufParams.getJoinStyle() === jsts.operation.buffer.BufferParameters.JOIN_BEVEL ||
        this.bufParams.getJoinStyle() === jsts.operation.buffer.BufferParameters.JOIN_MITRE) {
      if (addStartPoint)
        this.segList.addPt(this.offset0.p1);
      this.segList.addPt(this.offset1.p0);
    } else {
      this.addFillet(this.s1, this.offset0.p1, this.offset1.p0,
          jsts.algorithm.CGAlgorithms.CLOCKWISE, this.distance);
    }
  }
};


/**
 * Adds the offset points for an outside (convex) turn
 *
 * @param orientation
 * @param addStartPoint
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addOutsideTurn = function(
    orientation, addStartPoint) {
  /**
   * Heuristic: If offset endpoints are very close together, just use one of
   * them as the corner vertex. This avoids problems with computing mitre
   * corners in the case where the two segments are almost parallel (which is
   * hard to compute a robust intersection for).
   */
  if (this.offset0.p1.distance(this.offset1.p0) < this.distance *
      jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR) {
    this.segList.addPt(this.offset0.p1);
    return;
  }

  if (this.bufParams.getJoinStyle() === jsts.operation.buffer.BufferParameters.JOIN_MITRE) {
    this.addMitreJoin(this.s1, this.offset0, this.offset1, this.distance);
  } else if (this.bufParams.getJoinStyle() === jsts.operation.buffer.BufferParameters.JOIN_BEVEL) {
    this.addBevelJoin(this.offset0, this.offset1);
  } else {
    // add a circular fillet connecting the endpoints of the offset segments
    if (addStartPoint)
      this.segList.addPt(this.offset0.p1);
    // TESTING - comment out to produce beveled joins
    this.addFillet(this.s1, this.offset0.p1, this.offset1.p0, orientation,
        this.distance);
    this.segList.addPt(this.offset1.p0);
  }
};


/**
 * Adds the offset points for an inside (concave) turn.
 *
 * @param orientation
 * @param addStartPoint
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addInsideTurn = function(
    orientation, addStartPoint) {
  /**
   * add intersection point of offset segments (if any)
   */
  this.li.computeIntersection(this.offset0.p0, this.offset0.p1, this.offset1.p0, this.offset1.p1);
  if (this.li.hasIntersection()) {
    this.segList.addPt(this.li.getIntersection(0));
  } else {
    /**
     * If no intersection is detected, it means the angle is so small and/or the
     * offset so large that the offsets segments don't intersect. In this case
     * we must add a "closing segment" to make sure the buffer curve is
     * continuous, fairly smooth (e.g. no sharp reversals in direction) and
     * tracks the buffer correctly around the corner. The curve connects the
     * endpoints of the segment offsets to points which lie toward the centre
     * point of the corner. The joining curve will not appear in the final
     * buffer outline, since it is completely internal to the buffer polygon.
     *
     * In complex buffer cases the closing segment may cut across many other
     * segments in the generated offset curve. In order to improve the
     * performance of the noding, the closing segment should be kept as short as
     * possible. (But not too short, since that would defeat its purpose). This
     * is the purpose of the closingSegFactor heuristic value.
     */

    /**
     * The intersection test above is vulnerable to robustness errors; i.e. it
     * may be that the offsets should intersect very close to their endpoints,
     * but aren't reported as such due to rounding. To handle this situation
     * appropriately, we use the following test: If the offset points are very
     * close, don't add closing segments but simply use one of the offset points
     */
    this.hasNarrowConcaveAngle = true;
    // System.out.println("NARROW ANGLE - distance = " + distance);
    if (this.offset0.p1.distance(this.offset1.p0) < this.distance *
        jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR) {
      this.segList.addPt(this.offset0.p1);
    } else {
      // add endpoint of this segment offset
      this.segList.addPt(this.offset0.p1);

      /**
       * Add "closing segment" of required length.
       */
      if (this.closingSegLengthFactor > 0) {
        var mid0 = new jsts.geom.Coordinate((this.closingSegLengthFactor *
            this.offset0.p1.x + this.s1.x) /
            (this.closingSegLengthFactor + 1), (this.closingSegLengthFactor *
            this.offset0.p1.y + this.s1.y) /
            (this.closingSegLengthFactor + 1));
        this.segList.addPt(mid0);
        var mid1 = new jsts.geom.Coordinate((this.closingSegLengthFactor *
            this.offset1.p0.x + this.s1.x) /
            (this.closingSegLengthFactor + 1), (this.closingSegLengthFactor *
            this.offset1.p0.y + this.s1.y) /
            (this.closingSegLengthFactor + 1));
        this.segList.addPt(mid1);
      } else {
        /**
         * This branch is not expected to be used except for testing purposes.
         * It is equivalent to the JTS 1.9 logic for closing segments (which
         * results in very poor performance for large buffer distances)
         */
        this.segList.addPt(this.s1);
      }

      // */
      // add start point of next segment offset
      this.segList.addPt(this.offset1.p0);
    }
  }
};


/**
 * Compute an offset segment for an input segment on a given side and at a given
 * distance. The offset points are computed in full double precision, for
 * accuracy.
 *
 * @param seg
 *          the segment to offset.
 * @param side
 *          the side of the segment ( {@link Position} ) the offset lies on.
 * @param distance
 *          the offset distance.
 * @param offset
 *          the points computed for the offset segment.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.computeOffsetSegment = function(
    seg, side, distance, offset) {
  var sideSign = side === jsts.geomgraph.Position.LEFT ? 1 : -1;
  var dx = seg.p1.x - seg.p0.x;
  var dy = seg.p1.y - seg.p0.y;
  var len = Math.sqrt(dx * dx + dy * dy);
  // u is the vector that is the length of the offset, in the direction of the
  // segment
  var ux = sideSign * distance * dx / len;
  var uy = sideSign * distance * dy / len;
  offset.p0.x = seg.p0.x - uy;
  offset.p0.y = seg.p0.y + ux;
  offset.p1.x = seg.p1.x - uy;
  offset.p1.y = seg.p1.y + ux;
};


/**
 * Add an end cap around point p1, terminating a line segment coming from p0
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLineEndCap = function(
    p0, p1) {
  var seg = new jsts.geom.LineSegment(p0, p1);

  var offsetL = new jsts.geom.LineSegment();
  this.computeOffsetSegment(seg, jsts.geomgraph.Position.LEFT, this.distance,
      offsetL);
  var offsetR = new jsts.geom.LineSegment();
  this.computeOffsetSegment(seg, jsts.geomgraph.Position.RIGHT, this.distance,
      offsetR);

  var dx = p1.x - p0.x;
  var dy = p1.y - p0.y;
  var angle = Math.atan2(dy, dx);

  switch (this.bufParams.getEndCapStyle()) {
    case jsts.operation.buffer.BufferParameters.CAP_ROUND:
      // add offset seg points with a fillet between them
      this.segList.addPt(offsetL.p1);
      this.addFillet(p1, angle + Math.PI / 2, angle - Math.PI / 2,
          jsts.algorithm.CGAlgorithms.CLOCKWISE, this.distance);
      this.segList.addPt(offsetR.p1);
      break;
    case jsts.operation.buffer.BufferParameters.CAP_FLAT:
      // only offset segment points are added
      this.segList.addPt(offsetL.p1);
      this.segList.addPt(offsetR.p1);
      break;
    case jsts.operation.buffer.BufferParameters.CAP_SQUARE:
      // add a square defined by extensions of the offset segment endpoints
      var squareCapSideOffset = new jsts.geom.Coordinate();
      squareCapSideOffset.x = Math.abs(this.distance) * Math.cos(angle);
      squareCapSideOffset.y = Math.abs(this.distance) * Math.sin(angle);

      var squareCapLOffset = new jsts.geom.Coordinate(offsetL.p1.x +
          squareCapSideOffset.x, offsetL.p1.y + squareCapSideOffset.y);
      var squareCapROffset = new jsts.geom.Coordinate(offsetR.p1.x +
          squareCapSideOffset.x, offsetR.p1.y + squareCapSideOffset.y);
      this.segList.addPt(squareCapLOffset);
      this.segList.addPt(squareCapROffset);
      break;

  }
};


/**
 * Adds a mitre join connecting the two reflex offset segments. The mitre will
 * be beveled if it exceeds the mitre ratio limit.
 *
 * @param offset0
 *          the first offset segment.
 * @param offset1
 *          the second offset segment.
 * @param distance
 *          the offset distance.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addMitreJoin = function(
    p, offset0, offset1, distance) {
  var isMitreWithinLimit = true;
  var intPt = null;

  /**
   * This computation is unstable if the offset segments are nearly collinear.
   * Howver, this situation should have been eliminated earlier by the check for
   * whether the offset segment endpoints are almost coincident
   */
  try {
    intPt = jsts.algorithm.HCoordinate.intersection(offset0.p0, offset0.p1,
        offset1.p0, offset1.p1);

    var mitreRatio = distance <= 0.0 ? 1.0 : intPt.distance(p) /
        Math.abs(distance);

    if (mitreRatio > this.bufParams.getMitreLimit())
      this.isMitreWithinLimit = false;
  } catch (e) {
    if (e instanceof jsts.error.NotRepresentableError) {
      intPt = new jsts.geom.Coordinate(0, 0);
      this.isMitreWithinLimit = false;
    }
  }

  if (isMitreWithinLimit) {
    this.segList.addPt(intPt);
  } else {
    this.addLimitedMitreJoin(offset0, offset1, distance, bufParams
        .getMitreLimit());
    // addBevelJoin(offset0, offset1);
  }
};


/**
 * Adds a limited mitre join connecting the two reflex offset segments. A
 * limited mitre is a mitre which is beveled at the distance determined by the
 * mitre ratio limit.
 *
 * @param offset0
 *          the first offset segment.
 * @param offset1
 *          the second offset segment.
 * @param distance
 *          the offset distance.
 * @param mitreLimit
 *          the mitre limit ratio.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLimitedMitreJoin = function(
    offset0, offset1, distance, mitreLimit) {
  var basePt = this.seg0.p1;

  var ang0 = jsts.algorithm.Angle.angle(basePt, this.seg0.p0);
  var ang1 = jsts.algorithm.Angle.angle(basePt, this.seg1.p1);

  // oriented angle between segments
  var angDiff = jsts.algorithm.Angle.angleBetweenOriented(this.seg0.p0, basePt,
      this.seg1.p1);
  // half of the interior angle
  var angDiffHalf = angDiff / 2;

  // angle for bisector of the interior angle between the segments
  var midAng = jsts.algorithm.Angle.normalize(ang0 + angDiffHalf);
  // rotating this by PI gives the bisector of the reflex angle
  var mitreMidAng = jsts.algorithm.Angle.normalize(midAng + Math.PI);

  // the miterLimit determines the distance to the mitre bevel
  var mitreDist = mitreLimit * distance;
  // the bevel delta is the difference between the buffer distance
  // and half of the length of the bevel segment
  var bevelDelta = mitreDist * Math.abs(Math.sin(angDiffHalf));
  var bevelHalfLen = distance - bevelDelta;

  // compute the midpoint of the bevel segment
  var bevelMidX = basePt.x + mitreDist * Math.cos(mitreMidAng);
  var bevelMidY = basePt.y + mitreDist * Math.sin(mitreMidAng);
  var bevelMidPt = new jsts.geom.Coordinate(bevelMidX, bevelMidY);

  // compute the mitre midline segment from the corner point to the bevel
  // segment midpoint
  var mitreMidLine = new jsts.geom.LineSegment(basePt, bevelMidPt);

  // finally the bevel segment endpoints are computed as offsets from
  // the mitre midline
  var bevelEndLeft = mitreMidLine.pointAlongOffset(1.0, bevelHalfLen);
  var bevelEndRight = mitreMidLine.pointAlongOffset(1.0, -bevelHalfLen);

  if (this.side == jsts.geomgraph.Position.LEFT) {
    this.segList.addPt(bevelEndLeft);
    this.segList.addPt(bevelEndRight);
  } else {
    this.segList.addPt(bevelEndRight);
    this.segList.addPt(bevelEndLeft);
  }
};


/**
 * Adds a bevel join connecting the two offset segments around a reflex corner.
 *
 * @param {LineSegment}
 *          offset0 the first offset segment.
 * @param {LineSegment}
 *          offset1 the second offset segment.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addBevelJoin = function(
    offset0, offset1) {
  this.segList.addPt(offset0.p1);
  this.segList.addPt(offset1.p0);
};


/**
 * Add points for a circular fillet around a reflex corner. Adds the start and
 * end points
 *
 * @param p
 *          base point of curve.
 * @param p0
 *          start point of fillet curve.
 * @param p1
 *          endpoint of fillet curve.
 * @param direction
 *          the orientation of the fillet.
 * @param radius
 *          the radius of the fillet.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet = function(p,
    p0, p1, direction, radius) {
  if (!(p1 instanceof jsts.geom.Coordinate)) {
    this.addFillet2.apply(this, arguments);
    return;
  }

  var dx0 = p0.x - p.x;
  var dy0 = p0.y - p.y;
  var startAngle = Math.atan2(dy0, dx0);
  var dx1 = p1.x - p.x;
  var dy1 = p1.y - p.y;
  var endAngle = Math.atan2(dy1, dx1);

  if (direction === jsts.algorithm.CGAlgorithms.CLOCKWISE) {
    if (startAngle <= endAngle)
      startAngle += 2.0 * Math.PI;
  } else { // direction == COUNTERCLOCKWISE
    if (startAngle >= endAngle)
      startAngle -= 2.0 * Math.PI;
  }
  this.segList.addPt(p0);
  this.addFillet(p, startAngle, endAngle, direction, radius);
  this.segList.addPt(p1);
};


/**
 * Adds points for a circular fillet arc between two specified angles. The start
 * and end point for the fillet are not added - the caller must add them if
 * required.
 *
 * @param direction
 *          is -1 for a CW angle, 1 for a CCW angle.
 * @param radius
 *          the radius of the fillet.
 * @private
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet2 = function(p,
    startAngle, endAngle, direction, radius) {
  var directionFactor = direction === jsts.algorithm.CGAlgorithms.CLOCKWISE ? -1
      : 1;

  var totalAngle = Math.abs(startAngle - endAngle);
  var nSegs = parseInt((totalAngle / this.filletAngleQuantum + 0.5));

  if (nSegs < 1)
    return; // no segments because angle is less than increment - nothing to do!

  var initAngle, currAngleInc;

  // choose angle increment so that each segment has equal length
  initAngle = 0.0;
  currAngleInc = totalAngle / nSegs;

  var currAngle = initAngle;
  var pt = new jsts.geom.Coordinate();
  while (currAngle < totalAngle) {
    var angle = startAngle + directionFactor * currAngle;
    pt.x = p.x + radius * Math.cos(angle);
    pt.y = p.y + radius * Math.sin(angle);
    this.segList.addPt(pt);
    currAngle += currAngleInc;
  }
};


/**
 * Creates a CW circle around a point
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.createCircle = function(
    p) {
  // add start point
  var pt = new jsts.geom.Coordinate(p.x + this.distance, p.y);
  this.segList.addPt(pt);
  this.addFillet(p, 0.0, 2.0 * Math.PI, -1, this.distance);
  this.segList.closeRing();
};


/**
 * Creates a CW square around a point
 */
jsts.operation.buffer.OffsetSegmentGenerator.prototype.createSquare = function(
    p) {
  this.segList.addPt(new jsts.geom.Coordinate(p.x + distance, p.y + distance));
  this.segList.addPt(new jsts.geom.Coordinate(p.x + distance, p.y - distance));
  this.segList.addPt(new jsts.geom.Coordinate(p.x - distance, p.y - distance));
  this.segList.addPt(new jsts.geom.Coordinate(p.x - distance, p.y + distance));
  this.segList.closeRing();
};
