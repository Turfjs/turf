/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Represents an (1-dimensional) closed interval on the Real number line.
 *
 */
(function() {
  /**
   * Constructs a new Interval and initializes it if arguments is provided
   *
   * @constructor
   * @param {None}
   *          If no argument is specified, it will be initialized with 0.0, 0.0.
   * @param {Number},
   *          { Number } min, max It can be initialized with min <-> max.
   * @param {jsts.index.bintree.Interval}
   *          It can also be initialized with another interval.
   */
  var Interval = function() {
    this.min = 0.0;
    this.max = 0.0;

    if (arguments.length === 1) {
      var interval = arguments[0];
      this.init(interval.min, interval.max);
    }else if (arguments.length === 2) {
      this.init(arguments[0], arguments[1]);
    }
  };

  /**
   * Initializes the interval
   *
   * @param {Number}
   *          min
   * @param {Number}
   *          max
   */
  Interval.prototype.init = function(min, max) {
    this.min = min;
    this.max = max;
    if (min > max) {
      this.min = max;
      this.max = min;
    }
  };

  Interval.prototype.getMin = function() {
    return this.min;
  };

  Interval.prototype.getMax = function() {
    return this.max;
  };

  Interval.prototype.getWidth = function() {
    return (this.max - this.min);
  };

  /**
   * Expands this interval to include another interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to include.
   */
  Interval.prototype.expandToInclude = function(interval) {
    if (interval.max > this.max) {
      this.max = interval.max;
    }
    if (interval.min < this.min) {
      this.min = interval.min;
    }
  };

  /**
   * Checks if this interval overlaps. Calls correct overlaps- function based on
   * arguments
   *
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlaps = function() {
    if (arguments.length === 1) {
      return this.overlapsInterval.apply(this, arguments);
    }else {
      return this.overlapsMinMax.apply(this, arguments);
    }
  };

  /**
   * Checks if this inteval overlaps another interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to check.
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlapsInterval = function(interval) {
    return this.overlaps(interval.min, interval.max);
  };

  /**
   * Checks if this inteval overlaps the specified min/max values
   *
   * @param {Number}
   *          min minimum.
   * @param {Number}
   *          max maximum.
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlapsMinMax = function(min, max) {
    if (this.min > max || this.max < min) {
      return false;
    }
    return true;
  };

  /**
   * Checks if this interval contains an interval, min -max pair or a point
   *
   * @return {Boolean} true if this interval contains the specified argument.
   */
  Interval.prototype.contains = function() {
    var interval;
    if (arguments[0] instanceof jsts.index.bintree.Interval) {
      interval = arguments[0];
      return this.containsMinMax(interval.min, interval.max);
    }else if (arguments.length === 1) {
      return this.containsPoint(arguments[0]);
    }else {
      return this.containsMinMax(arguments[0], arguments[1]);
    }
  };

  /**
   * Checks if this interval contains the min- and max-point provided
   *
   * @param {Number}
   *          min the minpoint.
   * @param {Number}
   *          max the maxpoint.
   */
  Interval.prototype.containsMinMax = function(min, max) {
    return (min >= this.min && max <= this.max);
  };

  /**
   * Checks if this interval contains the specified point
   *
   * @param {Number}
   *          p the point to check.
   */
  Interval.prototype.containsPoint = function(p) {
    return (p >= this.min && p <= this.max);
  };

  jsts.index.bintree.Interval = Interval;
})();
