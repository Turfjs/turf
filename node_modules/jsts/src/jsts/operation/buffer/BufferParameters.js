/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Contains the parameters which describe how a buffer should be constructed.
 *
 * @constructor
 */
jsts.operation.buffer.BufferParameters = function(quadrantSegments,
    endCapStyle, joinStyle, mitreLimit) {
  if (quadrantSegments)
    this.setQuadrantSegments(quadrantSegments);
  if (endCapStyle)
    this.setEndCapStyle(endCapStyle);
  if (joinStyle)
    this.setJoinStyle(joinStyle);
  if (mitreLimit)
    this.setMitreLimit(mitreLimit);
};


/**
 * Specifies a round line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_ROUND = 1;


/**
 * Specifies a flat line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_FLAT = 2;


/**
 * Specifies a square line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_SQUARE = 3;


/**
 * Specifies a round join style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.JOIN_ROUND = 1;


/**
 * Specifies a mitre join style.
 */
jsts.operation.buffer.BufferParameters.JOIN_MITRE = 2;


/**
 * Specifies a bevel join style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.JOIN_BEVEL = 3;


/**
 * The default number of facets into which to divide a fillet of 90 degrees. A
 * value of 8 gives less than 2% max error in the buffer distance. For a max
 * error of < 1%, use QS = 12. For a max error of < 0.1%, use QS = 18.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS = 8;


/**
 * The default mitre limit Allows fairly pointy mitres.
 *
 * @type {double}
 */
jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT = 5.0;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.quadrantSegments = jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.endCapStyle = jsts.operation.buffer.BufferParameters.CAP_ROUND;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.joinStyle = jsts.operation.buffer.BufferParameters.JOIN_ROUND;


/**
 * @type {double}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.mitreLimit = jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT;

/**
 * @type {boolean}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype._isSingleSided = false;

/**
 * Gets the number of quadrant segments which will be used
 *
 * @return the number of quadrant segments.
 */
jsts.operation.buffer.BufferParameters.prototype.getQuadrantSegments = function() {
  return this.quadrantSegments;
};


/**
 * Sets the number of segments used to approximate a angle fillet
 *
 * @param {int}
 *          quadrantSegments the number of segments in a fillet for a quadrant.
 */
jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments = function(
    quadrantSegments) {
  this.quadrantSegments = quadrantSegments;
};


/**
 * Sets the number of line segments used to approximate an angle fillet.
 * <ul>
 * <li>If <tt>quadSegs</tt> >= 1, joins are round, and <tt>quadSegs</tt>
 * indicates the number of segments to use to approximate a quarter-circle.
 * <li>If <tt>quadSegs</tt> = 0, joins are bevelled (flat)
 * <li>If <tt>quadSegs</tt> < 0, joins are mitred, and the value of qs
 * indicates the mitre ration limit as
 *
 * <pre>
 * mitreLimit= |
 * <tt>
 * quadSegs
 * </tt>
 * |
 * </pre>
 *
 * </ul>
 * For round joins, <tt>quadSegs</tt> determines the maximum error in the
 * approximation to the true buffer curve. The default value of 8 gives less
 * than 2% max error in the buffer distance. For a max error of < 1%, use QS =
 * 12. For a max error of < 0.1%, use QS = 18. The error is always less than the
 * buffer distance (in other words, the computed buffer curve is always inside
 * the true curve).
 *
 * @param quadrantSegments
 *          the number of segments in a fillet for a quadrant.
 */
jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments = function(
    quadSegs) {
  this.quadrantSegments = quadSegs;

  /**
   * Indicates how to construct fillets. If qs >= 1, fillet is round, and qs
   * indicates number of segments to use to approximate a quarter-circle. If qs =
   * 0, fillet is bevelled flat (i.e. no filleting is performed) If qs < 0,
   * fillet is mitred, and absolute value of qs indicates maximum length of
   * mitre according to
   *
   * mitreLimit = |qs|
   */
  if (this.quadrantSegments === 0)
    this.joinStyle = jsts.operation.buffer.BufferParameters.JOIN_BEVEL;
  if (this.quadrantSegments < 0) {
    this.joinStyle = jsts.operation.buffer.BufferParameters.JOIN_MITRE;
    this.mitreLimit = Math.abs(this.quadrantSegments);
  }

  if (quadSegs <= 0) {
    this.quadrantSegments = 1;
  }

  /**
   * If join style was set by the quadSegs value, use the default for the actual
   * quadrantSegments value.
   */
  if (this.joinStyle !== jsts.operation.buffer.BufferParameters.JOIN_ROUND) {
    this.quadrantSegments = jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS;
  }
};


/**
 * Computes the maximum distance error due to a given level of approximation to
 * a true arc.
 *
 * @param quadSegs
 *          the number of segments used to approximate a quarter-circle.
 * @return the error of approximation.
 */
jsts.operation.buffer.BufferParameters.bufferDistanceError = function(quadSegs) {
  var alpha = Math.PI / 2.0 / quadSegs;
  return 1 - Math.cos(alpha / 2.0);
};


/**
 * Gets the end cap style.
 *
 * @return the end cap style.
 */
jsts.operation.buffer.BufferParameters.prototype.getEndCapStyle = function() {
  return this.endCapStyle;
};


/**
 * Specifies the end cap style of the generated buffer. The styles supported are
 * {@link #CAP_ROUND}, {@link #CAP_BUTT}, and {@link #CAP_SQUARE}. The
 * default is CAP_ROUND.
 *
 * @param {int}
 *          endCapStyle the end cap style to specify.
 */
jsts.operation.buffer.BufferParameters.prototype.setEndCapStyle = function(
    endCapStyle) {
  this.endCapStyle = endCapStyle;
};


/**
 * Gets the join style
 *
 * @return the join style code.
 */
jsts.operation.buffer.BufferParameters.prototype.getJoinStyle = function() {
  return this.joinStyle;
};


/**
 * Sets the join style for outside (reflex) corners between line segments.
 * Allowable values are {@link JOIN_ROUND} (which is the default),
 * {@link JOIN_MITRE} and {link JOIN_BEVEL}.
 *
 * @param joinStyle
 *          the code for the join style.
 */
jsts.operation.buffer.BufferParameters.prototype.setJoinStyle = function(
    joinStyle) {
  this.joinStyle = joinStyle;
};


/**
 * Gets the mitre ratio limit.
 *
 * @return the limit value.
 */
jsts.operation.buffer.BufferParameters.prototype.getMitreLimit = function() {
  return this.mitreLimit;
};


/**
 * Sets the limit on the mitre ratio used for very sharp corners. The mitre
 * ratio is the ratio of the distance from the corner to the end of the mitred
 * offset corner. When two line segments meet at a sharp angle, a miter join
 * will extend far beyond the original geometry. (and in the extreme case will
 * be infinitely far.) To prevent unreasonable geometry, the mitre limit allows
 * controlling the maximum length of the join corner. Corners with a ratio which
 * exceed the limit will be beveled.
 *
 * @param mitreLimit
 *          the mitre ratio limit.
 */
jsts.operation.buffer.BufferParameters.prototype.setMitreLimit = function(
    mitreLimit) {
  this.mitreLimit = mitreLimit;
};


/**
 * Sets whether the computed buffer should be single-sided. A single-sided
 * buffer is constructed on only one side of each input line.
 * <p>
 * The side used is determined by the sign of the buffer distance:
 * <ul>
 * <li>a positive distance indicates the left-hand side
 * <li>a negative distance indicates the right-hand side
 * </ul>
 * The single-sided buffer of point geometries is the same as the regular
 * buffer.
 * <p>
 * The End Cap Style for single-sided buffers is always ignored, and forced to
 * the equivalent of <tt>CAP_FLAT</tt>.
 *
 * @param isSingleSided
 *          true if a single-sided buffer should be constructed.
 */
jsts.operation.buffer.BufferParameters.prototype.setSingleSided = function(
    isSingleSided) {
  this._isSingleSided = isSingleSided;
};


/**
 * Tests whether the buffer is to be generated on a single side only.
 *
 * @return true if the generated buffer is to be single-sided.
 */
jsts.operation.buffer.BufferParameters.prototype.isSingleSided = function() {
  return this._isSingleSided;
};
