
/**
 * A {@link ResultMatcher} which compares the results of buffer operations for
 * equality, up to the given tolerance. All other operations are delagated to
 * the standard {@link EqualityResultMatcher} algorithm.
 */
BufferResultMatcher = function() {

};

/**
 * Tests whether the two results are equal within the given tolerance. The input
 * parameters are not considered.
 * 
 * @return true if the actual and expected results are considered equal
 */
BufferResultMatcher.prototype.isMatch = function(geom, distance, actualResult,
    expectedResult, tolerance) {
  return this.isBufferResultMatch(actualResult, expectedResult, distance);
};

BufferResultMatcher.MAX_RELATIVE_AREA_DIFFERENCE = 1.0E-3;
BufferResultMatcher.MAX_HAUSDORFF_DISTANCE_FACTOR = 100;
/**
 * The minimum distance tolerance which will be used. This is required because
 * densified vertices do no lie precisely on their parent segment.
 */
BufferResultMatcher.MIN_DISTANCE_TOLERANCE = 1.0e-8;

BufferResultMatcher.prototype.isBufferResultMatch = function(actualBuffer,
    expectedBuffer, distance) {
  if (actualBuffer.isEmpty() && expectedBuffer.isEmpty())
    return true;

  /**
   * MD - need some more checks here - symDiffArea won't catch very small holes
   * ("tears") near the edge of computed buffers (which can happen in current
   * version of JTS (1.8)). This can probably be handled by testing that every
   * point of the actual buffer is at least a certain distance away from the
   * geometry boundary.
   */
  if (!this.isSymDiffAreaInTolerance(actualBuffer, expectedBuffer))
    return false;

  if (!this.isBoundaryHausdorffDistanceInTolerance(actualBuffer,
      expectedBuffer, distance))
    return false;

  return true;
};

BufferResultMatcher.prototype.isSymDiffAreaInTolerance = function(actualBuffer,
    expectedBuffer) {
  var area = expectedBuffer.getArea();
  var diff = actualBuffer.symDifference(expectedBuffer);
  var areaDiff = diff.getArea();

  // can't get closer than difference area = 0 ! This also handles case when
  // symDiff is empty
  if (areaDiff <= 0.0)
    return true;

  var frac = Number.POSITIVE_INFINITY;
  if (area > 0.0)
    frac = areaDiff / area;

  return frac < BufferResultMatcher.MAX_RELATIVE_AREA_DIFFERENCE;
};

BufferResultMatcher.prototype.isBoundaryHausdorffDistanceInTolerance = function(
    actualBuffer, expectedBuffer, distance) {
  var actualBdy = actualBuffer.getBoundary();
  var expectedBdy = expectedBuffer.getBoundary();

  var haus = new jsts.algorithm.distance.DiscreteHausdorffDistance(actualBdy, expectedBdy);
  haus.setDensifyFraction(0.25);
  var maxDistanceFound = haus.orientedDistance();
  var expectedDistanceTol = Math.abs(distance) /
      BufferResultMatcher.MAX_HAUSDORFF_DISTANCE_FACTOR;
  if (expectedDistanceTol < BufferResultMatcher.MIN_DISTANCE_TOLERANCE)
    expectedDistanceTol = BufferResultMatcher.MIN_DISTANCE_TOLERANCE;
  if (maxDistanceFound > expectedDistanceTol)
    return false;
  return true;
};
