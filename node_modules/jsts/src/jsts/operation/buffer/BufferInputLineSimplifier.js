/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Simplifies a buffer input line to remove concavities with shallow depth.
 * <p>
 * The most important benefit of doing this is to reduce the number of points
 * and the complexity of shape which will be buffered. It also reduces the risk
 * of gores created by the quantized fillet arcs (although this issue should be
 * eliminated in any case by the offset curve generation logic).
 * <p>
 * A key aspect of the simplification is that it affects inside (concave or
 * inward) corners only. Convex (outward) corners are preserved, since they are
 * required to ensure that the generated buffer curve lies at the correct
 * distance from the input geometry.
 * <p>
 * Another important heuristic used is that the end segments of the input are
 * never simplified. This ensures that the client buffer code is able to
 * generate end caps faithfully.
 * <p>
 * No attempt is made to avoid self-intersections in the output. This is
 * acceptable for use for generating a buffer offset curve, since the buffer
 * algorithm is insensitive to invalid polygonal geometry. However, this means
 * that this algorithm cannot be used as a general-purpose polygon
 * simplification technique.
 *
 * @constructor
 */
jsts.operation.buffer.BufferInputLineSimplifier = function(inputLine) {
  this.inputLine = inputLine;
};


/**
 * Simplify the input coordinate list. If the distance tolerance is positive,
 * concavities on the LEFT side of the line are simplified. If the supplied
 * distance tolerance is negative, concavities on the RIGHT side of the line are
 * simplified.
 *
 * @param inputLine
 *          the coordinate list to simplify.
 * @param distanceTol
 *          simplification distance tolerance to use.
 * @return the simplified coordinate list.
 */
jsts.operation.buffer.BufferInputLineSimplifier.simplify = function(inputLine,
    distanceTol) {
  var simp = new jsts.operation.buffer.BufferInputLineSimplifier(inputLine);
  return simp.simplify(distanceTol);
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.INIT = 0;


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.DELETE = 1;


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.KEEP = 1;


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.inputLine = null;


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.distanceTol = null;


/**
 * @type {Array}
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeleted = null;


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.angleOrientation = jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;


/**
 * Simplify the input coordinate list. If the distance tolerance is positive,
 * concavities on the LEFT side of the line are simplified. If the supplied
 * distance tolerance is negative, concavities on the RIGHT side of the line are
 * simplified.
 *
 * @param distanceTol
 *          simplification distance tolerance to use.
 * @return the simplified coordinate list.
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.simplify = function(
    distanceTol) {
  this.distanceTol = Math.abs(distanceTol);
  if (distanceTol < 0)
    this.angleOrientation = jsts.algorithm.CGAlgorithms.CLOCKWISE;

  // rely on fact that boolean array is filled with false value
  this.isDeleted = [];
  this.isDeleted.length = this.inputLine.length;

  var isChanged = false;
  do {
    isChanged = this.deleteShallowConcavities();
  } while (isChanged);

  return this.collapseLine();
};


/**
 * Uses a sliding window containing 3 vertices to detect shallow angles in which
 * the middle vertex can be deleted, since it does not affect the shape of the
 * resulting buffer in a significant way.
 *
 * @return
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.deleteShallowConcavities = function() {
  /**
   * Do not simplify end line segments of the line string. This ensures that end
   * caps are generated consistently.
   */
  var index = 1;
  var maxIndex = this.inputLine.length - 1;

  var midIndex = this.findNextNonDeletedIndex(index);
  var lastIndex = this.findNextNonDeletedIndex(midIndex);

  var isChanged = false;
  while (lastIndex < this.inputLine.length) {
    // test triple for shallow concavity
    var isMiddleVertexDeleted = false;
    if (this.isDeletable(index, midIndex, lastIndex, this.distanceTol)) {
      this.isDeleted[midIndex] = jsts.operation.buffer.BufferInputLineSimplifier.DELETE;
      isMiddleVertexDeleted = true;
      isChanged = true;
    }
    // move simplification window forward
    if (isMiddleVertexDeleted)
      index = lastIndex;
    else
      index = midIndex;

    midIndex = this.findNextNonDeletedIndex(index);
    lastIndex = this.findNextNonDeletedIndex(midIndex);
  }
  return isChanged;
};


/**
 * Finds the next non-deleted index, or the end of the point array if none
 *
 * @param index
 * @return the next non-deleted index, if any.
 * @return inputLine.length if there are no more non-deleted indices.
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.findNextNonDeletedIndex = function(
    index) {
  var next = index + 1;
  while (next < this.inputLine.length &&
      this.isDeleted[next] === jsts.operation.buffer.BufferInputLineSimplifier.DELETE)
    next++;
  return next;
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.collapseLine = function() {
  var coordList = [];
  for (var i = 0; i < this.inputLine.length; i++) {
    if (this.isDeleted[i] !== jsts.operation.buffer.BufferInputLineSimplifier.DELETE)
      coordList.push(this.inputLine[i]);
  }

  return coordList;
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeletable = function(
    i0, i1, i2, distanceTol) {
  var p0 = this.inputLine[i0];
  var p1 = this.inputLine[i1];
  var p2 = this.inputLine[i2];

  if (!this.isConcave(p0, p1, p2))
    return false;
  if (!this.isShallow(p0, p1, p2, distanceTol))
    return false;

  return this.isShallowSampled(p0, p1, i0, i2, distanceTol);
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowConcavity = function(
    p0, p1, p2, distanceTol) {
  var orientation = jsts.algorithm.CGAlgorithms.computeOrientation(p0, p1, p2);
  var isAngleToSimplify = (orientation === this.angleOrientation);
  if (!isAngleToSimplify)
    return false;

  var dist = jsts.algorithm.CGAlgorithms.distancePointLine(p1, p0, p2);
  return dist < distanceTol;
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK = 10;


/**
 * Checks for shallowness over a sample of points in the given section. This
 * helps prevents the siplification from incrementally "skipping" over points
 * which are in fact non-shallow.
 *
 * @param p0
 *          start coordinate of section.
 * @param p2
 *          end coordinate of section.
 * @param i0
 *          start index of section.
 * @param i2
 *          end index of section.
 * @param distanceTol
 *          distance tolerance.
 * @return
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowSampled = function(
    p0, p2, i0, i2, distanceTol) {
  // check every n'th point to see if it is within tolerance
  var inc = parseInt((i2 - i0) /
      jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK);
  if (inc <= 0)
    inc = 1;

  for (var i = i0; i < i2; i += inc) {
    if (!this.isShallow(p0, p2, this.inputLine[i], distanceTol))
      return false;
  }
  return true;
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallow = function(
    p0, p1, p2, distanceTol) {
  var dist = jsts.algorithm.CGAlgorithms.distancePointLine(p1, p0, p2);
  return dist < distanceTol;
};


/**
 * @private
 */
jsts.operation.buffer.BufferInputLineSimplifier.prototype.isConcave = function(
    p0, p1, p2) {
  var orientation = jsts.algorithm.CGAlgorithms.computeOrientation(p0, p1, p2);
  var isConcave = (orientation === this.angleOrientation);
  return isConcave;
};
