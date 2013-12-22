/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * The base class for operations that require {@link GeometryGraph}s.
 *
 * @param {Geometry}
 *          g0
 * @param {Geometry}
 *          g1
 * @param {BoundaryNodeRule}
 *          boundaryNodeRule
 * @constructor
 */
jsts.operation.GeometryGraphOperation = function(g0, g1, boundaryNodeRule) {
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.arg = [];

  if (g0 === undefined) {
    return;
  }

  if (g1 === undefined) {
    this.setComputationPrecision(g0.getPrecisionModel());

    this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0);
    return;
  }

  boundaryNodeRule = boundaryNodeRule ||
      jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;

  // use the most precise model for the result
  if (g0.getPrecisionModel().compareTo(g1.getPrecisionModel()) >= 0)
    this.setComputationPrecision(g0.getPrecisionModel());
  else
    this.setComputationPrecision(g1.getPrecisionModel());

  this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0, boundaryNodeRule);
  this.arg[1] = new jsts.geomgraph.GeometryGraph(1, g1, boundaryNodeRule);
};


/**
 * @type {LineIntersector}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.li = null;


/**
 * @type {PrecisionModel}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.resultPrecisionModel = null;


/**
 * The operation args into an array so they can be accessed by index
 *
 * @type {GeometryGraph[]}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.arg = null;


/**
 * @param {int}
 *          i
 * @return {Geometry}
 */
jsts.operation.GeometryGraphOperation.prototype.getArgGeometry = function(i) {
  return arg[i].getGeometry();
};


/**
 * @param {PrecisionModel}
 *          pm
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.setComputationPrecision = function(pm) {
  this.resultPrecisionModel = pm;
  this.li.setPrecisionModel(this.resultPrecisionModel);
};
