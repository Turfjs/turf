/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Implements the SFS <tt>relate()</tt> operation on two {@link Geometry}s.
 * This class supports specifying a custom {@link BoundaryNodeRule} to be used
 * during the relate computation.
 * <p>
 * <b>Note:</b> custom Boundary Node Rules do not (currently) affect the
 * results of other Geometry methods (such as {@link Geometry#getBoundary}. The
 * results of these methods may not be consistent with the relationship computed
 * by a custom Boundary Node Rule.
 *
 * Creates a new Relate operation with a specified Boundary Node Rule.
 *
 * @param g0
 *          a Geometry to relate.
 * @param g1
 *          another Geometry to relate.
 * @param boundaryNodeRule
 *          the Boundary Node Rule to use.
 *
 * @extends {jsts.operation.GeometryGraphOperation}
 * @constructor
 */
jsts.operation.relate.RelateOp = function() {
  jsts.operation.GeometryGraphOperation.apply(this, arguments);
  this._relate = new jsts.operation.relate.RelateComputer(this.arg);
};

jsts.operation.relate.RelateOp.prototype = new jsts.operation.GeometryGraphOperation();


/**
 * Computes the {@link IntersectionMatrix} for the spatial relationship between
 * two {@link Geometry}s using a specified Boundary Node Rule.
 *
 * @param a
 *          a Geometry to test.
 * @param b
 *          a Geometry to test.
 * @param boundaryNodeRule
 *          the Boundary Node Rule to use.
 * @return the IntersectonMatrix for the spatial relationship between the input
 *         geometries.
 */
jsts.operation.relate.RelateOp.relate = function(a, b, boundaryNodeRule) {
  var relOp = new jsts.operation.relate.RelateOp(a, b, boundaryNodeRule);
  var im = relOp.getIntersectionMatrix();
  return im;
};


/**
 * @type {RelateComputer}
 * @private
 */
jsts.operation.relate.RelateOp.prototype._relate = null;


/**
 * Gets the IntersectionMatrix for the spatial relationship between the input
 * geometries.
 *
 * @return the IntersectonMatrix for the spatial relationship between the input
 *         geometries.
 */
jsts.operation.relate.RelateOp.prototype.getIntersectionMatrix = function() {
  return this._relate.computeIM();
};
