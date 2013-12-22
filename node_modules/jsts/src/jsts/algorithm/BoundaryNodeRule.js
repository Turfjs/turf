/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An interface for rules which determine whether node points which are in
 * boundaries of {@link Lineal} geometry components are in the boundary of the
 * parent geometry collection. The SFS specifies a single kind of boundary node
 * rule, the {@link Mod2BoundaryNodeRule} rule. However, other kinds of Boundary
 * Node Rules are appropriate in specific situations (for instance, linear
 * network topology usually follows the {@link EndPointBoundaryNodeRule}.) Some
 * JTS operations allow the BoundaryNodeRule to be specified, and respect this
 * rule when computing the results of the operation.
 *
 * @see RelateOp
 * @see IsSimpleOp
 * @see PointLocator
 * @constructor
 */
jsts.algorithm.BoundaryNodeRule = function() {

};


/**
 * Tests whether a point that lies in <tt>boundaryCount</tt> geometry
 * component boundaries is considered to form part of the boundary of the parent
 * geometry.
 *
 * @param {int}
 *          boundaryCount the number of component boundaries that this point
 *          occurs in.
 * @return {boolean} true if points in this number of boundaries lie in the
 *         parent boundary.
 */
jsts.algorithm.BoundaryNodeRule.prototype.isInBoundary = function(boundaryCount) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * A {@link BoundaryNodeRule} specifies that points are in the boundary of a
 * lineal geometry iff the point lies on the boundary of an odd number of
 * components. Under this rule {@link LinearRing}s and closed
 * {@link LineString}s have an empty boundary.
 * <p>
 * This is the rule specified by the <i>OGC SFS</i>, and is the default rule
 * used in JTS.
 */
jsts.algorithm.Mod2BoundaryNodeRule = function() {

};

jsts.algorithm.Mod2BoundaryNodeRule.prototype = new jsts.algorithm.BoundaryNodeRule();

jsts.algorithm.Mod2BoundaryNodeRule.prototype.isInBoundary = function(
    boundaryCount) {
  // the "Mod-2 Rule"
  return boundaryCount % 2 === 1;
};

jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE = new jsts.algorithm.Mod2BoundaryNodeRule();
jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE = jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;
