/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * Provides a test for whether an interval is so small it should be considered
 * as zero for the purposes of inserting it into a binary tree. The reason this
 * check is necessary is that round-off error can cause the algorithm used to
 * subdivide an interval to fail, by computing a midpoint value which does not
 * lie strictly between the endpoints.
 *
 * @constructor
 */
jsts.index.IntervalSize = function() {

};


/**
 * This value is chosen to be a few powers of 2 less than the number of bits
 * available in the double representation (i.e. 53). This should allow enough
 * extra precision for simple computations to be correct, at least for
 * comparison purposes.
 */
jsts.index.IntervalSize.MIN_BINARY_EXPONENT = -50;


/**
 * Computes whether the interval [min, max] is effectively zero width. I.e. the
 * width of the interval is so much less than the location of the interval that
 * the midpoint of the interval cannot be represented precisely.
 *
 * @param {Number}
 *          min the min-value in the interval.
 * @param {Number}
 *          max the max-value in the interval.
 * @return {Boolean} true if the interval should be considered zero.
 */
jsts.index.IntervalSize.isZeroWidth = function(min, max) {
  var width = max - min;
  if (width === 0.0) {
    return true;
  }

  var maxAbs, scaledInterval, level;
  maxAbs = Math.max(Math.abs(min), Math.abs(max));
  scaledInterval = width / maxAbs;

  level = jsts.index.DoubleBits.exponent(scaledInterval);
  return level <= jsts.index.IntervalSize.MIN_BINARY_EXPONENT;
};
