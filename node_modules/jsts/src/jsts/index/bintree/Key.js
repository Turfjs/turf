/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A Key is a unique identifier for a node in a tree. It contains a lower-left
 * point and a level number. The level number is the power of two for the size
 * of the node envelope
 */
(function() {

  /**
   * @requires jsts/index/bintree/Interval.js
   * @requires jsts/index/DoubleBits.js
   */

  var DoubleBits = jsts.index.DoubleBits;
  var Interval = jsts.index.bintree.Interval;

  /**
   * Constructs a new Key
   *
   * @constructor
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to compute the key from.
   */
  var Key = function(interval) {
    this.pt = 0.0;
    this.level = 0;

    this.computeKey(interval);
  };

  /**
   * Computes the level for an interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval.
   * @results {Number} the calculated level
   */
  Key.computeLevel = function(interval) {
    var dx = interval.getWidth(), level;

    level = DoubleBits.exponent(dx) + 1;
    return level;
  };

  /**
   * Returns the point
   *
   * @return {Number} point.
   */
  Key.prototype.getPoint = function() {
    return this.pt;
  };

  /**
   * Returns the level
   *
   * @return {Number} level.
   */
  Key.prototype.getLevel = function() {
    return this.level;
  };

  /**
   * Returns the interval
   *
   * @return {jsts.index.bintree.Interval}
   */
  Key.prototype.getInterval = function() {
    return this.interval;
  };

  /**
   * Calculates the key
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   */
  Key.prototype.computeKey = function(itemInterval) {
    this.level = Key.computeLevel(itemInterval);
    this.interval = new Interval();
    this.computeInterval(this.level, itemInterval);
    // MD - would be nice to have a non-iterative form of this algorithm
    while (!this.interval.contains(itemInterval)) {
      this.level += 1;
      this.computeInterval(this.level, itemInterval);
    }
  };

  /**
   * Computes the interval
   *
   * @param {Number}
   *          level the level.
   * @param {jsts.index.bintree.Interval}
   *          itemInterval an interval.
   */
  Key.prototype.computeInterval = function(level, itemInterval) {
    var size = DoubleBits.powerOf2(level);

    this.pt = Math.floor(itemInterval.getMin() / size) * size;
    this.interval.init(this.pt, this.pt + size);
  };

  jsts.index.bintree.Key = Key;
})();
