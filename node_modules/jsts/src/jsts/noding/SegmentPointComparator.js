/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Implements a robust method of comparing the relative position of two points
 * along the same segment. The coordinates are assumed to lie "near" the
 * segment. This means that this algorithm will only return correct results if
 * the input coordinates have the same precision and correspond to rounded
 * values of exact coordinates lying on the segment.
 *
 */
jsts.noding.SegmentPointComparator = function() {
};

/**
 * Compares two {@link Coordinate}s for their relative position along a segment
 * lying in the specified {@link Octant}.
 *
 * @return -1 node0 occurs first.
 * @return 0 the two nodes are equal.
 * @return 1 node1 occurs first.
 */
jsts.noding.SegmentPointComparator.compare = function(octant, p0, p1) {
  // nodes can only be equal if their coordinates are equal
  if (p0.equals2D(p1))
    return 0;

  var xSign = jsts.noding.SegmentPointComparator.relativeSign(p0.x, p1.x);
  var ySign = jsts.noding.SegmentPointComparator.relativeSign(p0.y, p1.y);

  switch (octant) {
  case 0:
    return jsts.noding.SegmentPointComparator.compareValue(xSign, ySign);
  case 1:
    return jsts.noding.SegmentPointComparator.compareValue(ySign, xSign);
  case 2:
    return jsts.noding.SegmentPointComparator.compareValue(ySign, -xSign);
  case 3:
    return jsts.noding.SegmentPointComparator.compareValue(-xSign, ySign);
  case 4:
    return jsts.noding.SegmentPointComparator.compareValue(-xSign, -ySign);
  case 5:
    return jsts.noding.SegmentPointComparator.compareValue(-ySign, -xSign);
  case 6:
    return jsts.noding.SegmentPointComparator.compareValue(-ySign, xSign);
  case 7:
    return jsts.noding.SegmentPointComparator.compareValue(xSign, -ySign);
  }
  // TODO: Assert.shouldNeverReachHere("invalid octant value");
  return 0;
};
jsts.noding.SegmentPointComparator.relativeSign = function(x0, x1) {
  if (x0 < x1)
    return -1;
  if (x0 > x1)
    return 1;
  return 0;
};

/**
 * @private
 */
jsts.noding.SegmentPointComparator.compareValue = function(compareSign0,
    compareSign1) {
  if (compareSign0 < 0)
    return -1;
  if (compareSign0 > 0)
    return 1;
  if (compareSign1 < 0)
    return -1;
  if (compareSign1 > 0)
    return 1;
  return 0;

};
