/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Computes the buffer of a geometry, for both positive and negative buffer
 * distances.
 *
 * In GIS, the positive buffer of a geometry is defined as
 * the Minkowski sum or difference of the geometry
 * with a circle of radius equal to the absolute value of the buffer distance.
 * In the CAD/CAM world buffers are known as </i>offset curves</i>.
 * In morphological analysis they are known as <i>erosion</i> and
 * <i>dilation</i>
 *
 * The buffer operation always returns a polygonal result.
 * The negative or zero-distance buffer of lines and points is always an empty
 * {@link Polygon}.
 *
 * Since true buffer curves may contain circular arcs,
 * computed buffer polygons can only be approximations to the true geometry.
 * The user can control the accuracy of the curve approximation by specifying
 * the number of linear segments used to approximate curves.
 *
 * The <b>end cap style</b> of a linear buffer may be specified. The
 * following end cap styles are supported:
 * <ul
 * <li>{@link #CAP_ROUND} - the usual round end caps
 * <li>{@link #CAP_BUTT} - end caps are truncated flat at the line ends
 * <li>{@link #CAP_SQUARE} - end caps are squared off at the buffer distance
 * beyond the line ends
 * </ul>
 *
 */



/**
 * Initializes a buffer computation for the given geometry with the given set of
 * parameters.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {BufferParameters}
 *          bufParams the buffer parameters to use.
 * @constructor
 */
jsts.operation.buffer.BufferOp = function(g, bufParams) {
  this.argGeom = g;
  this.bufParams = bufParams ? bufParams
      : new jsts.operation.buffer.BufferParameters();
};


/**
 * A number of digits of precision which leaves some computational "headroom"
 * for floating point operations.
 *
 * This value should be less than the decimal precision of double-precision
 * values (16).
 *
 * @type {int}
 */
jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS = 12;


/**
 * Compute a scale factor to limit the precision of a given combination of
 * Geometry and buffer distance. The scale factor is determined by a combination
 * of the number of digits of precision in the (geometry + buffer distance),
 * limited by the supplied <code>maxPrecisionDigits</code> value.
 *
 * @param {Geometry}
 *          g the Geometry being buffered.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          maxPrecisionDigits the max # of digits that should be allowed by the
 *          precision determined by the computed scale factor.
 *
 * @return {double} a scale factor for the buffer computation.
 */
jsts.operation.buffer.BufferOp.precisionScaleFactor = function(g, distance,
    maxPrecisionDigits) {
  var env = g.getEnvelopeInternal();
  var envSize = Math.max(env.getHeight(), env.getWidth());
  var expandByDistance = distance > 0.0 ? distance : 0.0;
  var bufEnvSize = envSize + 2 * expandByDistance;

  // the smallest power of 10 greater than the buffer envelope
  var bufEnvLog10 = (Math.log(bufEnvSize) / Math.log(10) + 1.0);
  var minUnitLog10 = bufEnvLog10 - maxPrecisionDigits;
  // scale factor is inverse of min Unit size, so flip sign of exponent
  var scaleFactor = Math.pow(10.0, -minUnitLog10);
  return scaleFactor;
};


/**
 * Computes the buffer of a geometry for a given buffer distance.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @return {Geometry} the buffer of the input geometry.
 */
jsts.operation.buffer.BufferOp.bufferOp = function(g, distance) {
  if (arguments.length > 2) {
    return jsts.operation.buffer.BufferOp.bufferOp2.apply(this, arguments);
  }

  var gBuf = new jsts.operation.buffer.BufferOp(g);
  var geomBuf = gBuf.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {BufferParameters}
 *          params the buffer parameters to use.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp2 = function(g, distance, params) {
  if (arguments.length > 3) {
    return jsts.operation.buffer.BufferOp.bufferOp3.apply(this, arguments);
  }

  var bufOp = new jsts.operation.buffer.BufferOp(g, params);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          quadrantSegments the number of segments used to approximate a
 *          quarter circle.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp3 = function(g, distance,
    quadrantSegments) {
  if (arguments.length > 4) {
    return jsts.operation.buffer.BufferOp.bufferOp4.apply(this, arguments);
  }

  var bufOp = new jsts.operation.buffer.BufferOp(g);
  bufOp.setQuadrantSegments(quadrantSegments);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          quadrantSegments the number of segments used to approximate a
 *          quarter circle.
 * @param {int}
 *          endCapStyle the end cap style to use.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp4 = function(g, distance,
    quadrantSegments, endCapStyle) {
  var bufOp = new jsts.operation.buffer.BufferOp(g);
  bufOp.setQuadrantSegments(quadrantSegments);
  bufOp.setEndCapStyle(endCapStyle);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * @type {Geometry}
 */
jsts.operation.buffer.BufferOp.prototype.argGeom = null;


/**
 * @type {double}
 */
jsts.operation.buffer.BufferOp.prototype.distance = null;


/**
 * @type {BufferParameters}
 */
jsts.operation.buffer.BufferOp.prototype.bufParams = null;


/**
 * @type {Geometry}
 */
jsts.operation.buffer.BufferOp.prototype.resultGeometry = null;


/**
 * Specifies the end cap style of the generated buffer. The styles supported are
 * {@link #CAP_ROUND}, {@link #CAP_BUTT}, and {@link #CAP_SQUARE}. The
 * default is CAP_ROUND.
 *
 * @param {int}
 *          endCapStyle the end cap style to specify.
 */
jsts.operation.buffer.BufferOp.prototype.setEndCapStyle = function(endCapStyle) {
  this.bufParams.setEndCapStyle(endCapStyle);
};


/**
 * Sets the number of segments used to approximate a angle fillet
 *
 * @param {int}
 *          quadrantSegments the number of segments in a fillet for a quadrant.
 */
jsts.operation.buffer.BufferOp.prototype.setQuadrantSegments = function(
    quadrantSegments) {
  this.bufParams.setQuadrantSegments(quadrantSegments);
};


/**
 * Returns the buffer computed for a geometry for a given buffer distance.
 *
 * @param {double}
 *          dist the buffer distance.
 * @return {Geometry} the buffer of the input geometry.
 */
jsts.operation.buffer.BufferOp.prototype.getResultGeometry = function(dist) {
  this.distance = dist;
  this.computeGeometry();
  return this.resultGeometry;
};

jsts.operation.buffer.BufferOp.prototype.computeGeometry = function() {
  this.bufferOriginalPrecision();
  if (this.resultGeometry !== null) {
    return;
  }

  var argPM = this.argGeom.getPrecisionModel();
  if (argPM.getType() === jsts.geom.PrecisionModel.FIXED) {
    this.bufferFixedPrecision(argPM);
  } else {
    this.bufferReducedPrecision();
  }
};


jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision = function() {
  var precDigits;
  var saveException = null;

  // try and compute with decreasing precision
  for (precDigits = jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS; precDigits >= 0; precDigits--) {
    try {
      this.bufferReducedPrecision2(precDigits);
    } catch (/* TopologyException */ex) {
      saveException = ex;
      // don't propagate the exception - it will be detected by fact that
      // resultGeometry is null
    }
    if (this.resultGeometry !== null) {
      return;
    }
  }

  // tried everything - have to bail
  throw saveException;
};


jsts.operation.buffer.BufferOp.prototype.bufferOriginalPrecision = function() {
  try {
    // use fast noding by default
    var bufBuilder = new jsts.operation.buffer.BufferBuilder(this.bufParams);
    this.resultGeometry = bufBuilder.buffer(this.argGeom, this.distance);
  } catch (e) {
    // don't propagate the exception - it will be detected by fact that
    // resultGeometry is null
  }
};


/**
 * @param {int}
 *          precisionDigits
 */
jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision2 = function(
    precisionDigits) {

  var sizeBasedScaleFactor = jsts.operation.buffer.BufferOp
      .precisionScaleFactor(this.argGeom, this.distance, precisionDigits);

  var fixedPM = new jsts.geom.PrecisionModel(sizeBasedScaleFactor);
  this.bufferFixedPrecision(fixedPM);
};


/**
 * @param {PrecisionModel}
 *          fixedPM
 */
jsts.operation.buffer.BufferOp.prototype.bufferFixedPrecision = function(
    fixedPM) {
  var noder = new jsts.noding.ScaledNoder(
      new jsts.noding.snapround.MCIndexSnapRounder(
          new jsts.geom.PrecisionModel(1.0)), fixedPM.getScale());

  var bufBuilder = new jsts.operation.buffer.BufferBuilder(this.bufParams);
  bufBuilder.setWorkingPrecisionModel(fixedPM);
  bufBuilder.setNoder(noder);
  // this may throw an exception, if robustness errors are encountered
  this.resultGeometry = bufBuilder.buffer(this.argGeom, this.distance);
};
