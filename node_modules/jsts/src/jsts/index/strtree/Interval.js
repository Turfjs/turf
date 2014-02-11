/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A contiguous portion of 1D-space. Used internally by SIRtree.
 *
 * @param {jsts.index.strtree.Interval}
 *          [other].
 * @param {number}
 *          [min].
 * @param {number}
 *          [max].
 * @see SIRtree
 * @constructor
 */
jsts.index.strtree.Interval = function() {
  var other;
  if (arguments.length === 1) {
    other = arguments[0];
    return jsts.index.strtree.Interval(other.min, other.max);
  } else if (arguments.length === 2) {
    jsts.util.Assert.isTrue(this.min <= this.max);
    this.min = arguments[0];
    this.max = arguments[1];
  }
};


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.Interval.prototype.min = null;


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.Interval.prototype.max = null;


/**
 * @return {number}
 * @public
 */
jsts.index.strtree.Interval.prototype.getCentre = function() {
  return (this.min + this.max) / 2;
};


/**
 *
 * @param {jsts.index.strtree.Interval}
 *          other
 * @return {jsts.index.strtree.Interval} this.
 * @public
 */
jsts.index.strtree.Interval.prototype.expandToInclude = function(other) {
  this.max = Math.max(this.max, other.max);
  this.min = Math.min(this.min, other.min);
  return this;
};


/**
 *
 * @param {jsts.index.strtree.Interval}
 *          other
 * @return {boolean}
 * @public
 */
jsts.index.strtree.Interval.prototype.intersects = function(other) {
  return !(other.min > this.max || other.max < this.min);
};


/**
 *
 * @param {Object}
 *          o
 * @return {boolean}
 * @public
 */
jsts.index.strtree.Interval.prototype.equals = function(o) {
  if (!(o instanceof jsts.index.strtree.Interval)) {
    return false;
  }
  other = o;
  return this.min === other.min && this.max === other.max;
};
