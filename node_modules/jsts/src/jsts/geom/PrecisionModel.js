/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies the precision model of the {@link Coordinate}s in a
 * {@link Geometry}. In other words, specifies the grid of allowable points for
 * all <code>Geometry</code>s.
 * <p>
 * The {@link makePrecise} method allows rounding a coordinate to a "precise"
 * value; that is, one whose precision is known exactly.
 * <p>
 * Coordinates are assumed to be precise in geometries. That is, the coordinates
 * are assumed to be rounded to the precision model given for the geometry. JTS
 * input routines automatically round coordinates to the precision model before
 * creating Geometries. All internal operations assume that coordinates are
 * rounded to the precision model. Constructive methods (such as boolean
 * operations) always round computed coordinates to the appropriate precision
 * model.
 * <p>
 * Currently one type of precision model are supported:
 * <ul>
 * <li>FLOATING - represents full double precision floating point.
 * <p>
 * Coordinates are represented internally as Java double-precision values. Since
 * Java uses the IEEE-754 floating point standard, this provides 53 bits of
 * precision.
 * <p>
 * JSTS methods currently do not handle inputs with different precision models.
 *
 * @constructor
 */
jsts.geom.PrecisionModel = function(modelType) {
  if (typeof modelType === 'number') {
    this.modelType = jsts.geom.PrecisionModel.FIXED;
    this.scale = modelType;
    return;
  }

  this.modelType = modelType || jsts.geom.PrecisionModel.FLOATING;

  if (this.modelType === jsts.geom.PrecisionModel.FIXED) {
    this.scale = 1.0;
  }
};


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FLOATING = 'FLOATING';


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FIXED = 'FIXED';


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FLOATING_SINGLE = 'FLOATING_SINGLE';

jsts.geom.PrecisionModel.prototype.scale = null;
jsts.geom.PrecisionModel.prototype.modelType = null;


/**
 * Tests whether the precision model supports floating point
 *
 * @return {boolean} if the precision model supports floating point.
 */
jsts.geom.PrecisionModel.prototype.isFloating = function() {
  return this.modelType === jsts.geom.PrecisionModel.FLOATING ||
      this.modelType === jsts.geom.PrecisionModel.FLOATING_SINLGE;
};

/**
 * Returns the scale factor used to specify a fixed precision model. The number
 * of decimal places of precision is equal to the base-10 logarithm of the scale
 * factor. Non-integral and negative scale factors are supported. Negative scale
 * factors indicate that the places of precision is to the left of the decimal
 * point.
 *
 * @return the scale factor for the fixed precision model.
 */
jsts.geom.PrecisionModel.prototype.getScale = function() {
  return this.scale;
};

/**
 * @return {string} always jsts.geom.PrecisionModel.FLOATING.
 */
jsts.geom.PrecisionModel.prototype.getType = function() {
  return this.modelType;
};

jsts.geom.PrecisionModel.prototype.equals = function(other) {
  return true;

  if (!(other instanceof jsts.geom.PrecisionModel)) {
    return false;
  }
  var otherPrecisionModel = other;
  return this.modelType === otherPrecisionModel.modelType &&
      this.scale === otherPrecisionModel.scale;
};


/**
 * Rounds a numeric value to the PrecisionModel grid. Asymmetric Arithmetic
 * Rounding is used, to provide uniform rounding behaviour no matter where the
 * number is on the number line.
 * <p>
 * This method has no effect on NaN values.
 * <p>
 * <b>Note:</b> Java's <code>Math#rint</code> uses the "Banker's Rounding"
 * algorithm, which is not suitable for precision operations elsewhere in JTS.
 */
jsts.geom.PrecisionModel.prototype.makePrecise = function(val) {
  if (val instanceof jsts.geom.Coordinate) {
    this.makePrecise2(val);
    return;
  }

  // don't change NaN values
  if (isNaN(val))
    return val;

  // TODO: support single precision?
  /*if (this.modelType == FLOATING_SINGLE) {
    float floatSingleVal = (float) val;
    return (double) floatSingleVal;
  }*/
  if (this.modelType === jsts.geom.PrecisionModel.FIXED) {
    return Math.round(val * this.scale) / this.scale;
  }
  // modelType == FLOATING - no rounding necessary
  return val;
};


/**
 * Rounds a Coordinate to the PrecisionModel grid.
 */
jsts.geom.PrecisionModel.prototype.makePrecise2 = function(coord) {
  // optimization for full precision
  if (this.modelType === jsts.geom.PrecisionModel.FLOATING)
    return;

  coord.x = this.makePrecise(coord.x);
  coord.y = this.makePrecise(coord.y);
  // MD says it's OK that we're not makePrecise'ing the z [Jon Aquino]
};


/**
 * Compares this {@link PrecisionModel} object with the specified object for
 * order. A PrecisionModel is greater than another if it provides greater
 * precision. The comparison is based on the value returned by the
 * {@link #getMaximumSignificantDigits} method. This comparison is not strictly
 * accurate when comparing floating precision models to fixed models; however,
 * it is correct when both models are either floating or fixed.
 *
 * @param o
 *          the <code>PrecisionModel</code> with which this
 *          <code>PrecisionModel</code> is being compared.
 * @return a negative integer, zero, or a positive integer as this
 *         <code>PrecisionModel</code> is less than, equal to, or greater than
 *         the specified <code>PrecisionModel.</code>
 */
jsts.geom.PrecisionModel.prototype.compareTo = function(o) {
  var other = o;

  // TODO: needs to be ported for fixed precision

  // var sigDigits = this.getMaximumSignificantDigits();
  // var otherSigDigits = other.getMaximumSignificantDigits();
  // return (new Integer(sigDigits)).compareTo(new Integer(otherSigDigits));

  return 0;
};
