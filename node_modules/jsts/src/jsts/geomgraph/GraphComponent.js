/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;

  /**
   * A GraphComponent is the parent class for the objects' that form a graph.
   * Each GraphComponent can carry a Label.
   *
   * @constructor
   */
  jsts.geomgraph.GraphComponent = function(label) {
    this.label = label;
  };


  /**
   * @type {Label}
   * @protected
   */
  jsts.geomgraph.GraphComponent.prototype.label = null;


  /**
   * isInResult indicates if this component has already been included in the
   * result
   *
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isInResult = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isCovered = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isCoveredSet = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isVisited = false;

  jsts.geomgraph.GraphComponent.prototype.getLabel = function() {
    return this.label;
  };
  jsts.geomgraph.GraphComponent.prototype.setLabel = function(label) {
    if (arguments.length === 2) {
      this.setLabel2.apply(this, arguments);
      return;
    }

    this.label = label;
  };


  /**
   * @param {boolean}
   *          isInResult
   */
  jsts.geomgraph.GraphComponent.prototype.setInResult = function(isInResult) {
    this._isInResult = isInResult;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isInResult = function() {
    return this._isInResult;
  };


  /**
   * @param {boolean}
   *          isCovered
   */
  jsts.geomgraph.GraphComponent.prototype.setCovered = function(isCovered) {
    this._isCovered = isCovered;
    this._isCoveredSet = true;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isCovered = function() {
    return this._isCovered;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isCoveredSet = function() {
    return this._isCoveredSet;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isVisited = function() {
    return this._isVisited;
  };


  /**
   * @param {boolean}
   *          isVisited
   */
  jsts.geomgraph.GraphComponent.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };


  /**
   * @return {Coordinate} a coordinate in this component (or null, if there are
   *         none).
   */
  jsts.geomgraph.GraphComponent.prototype.getCoordinate = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * compute the contribution to an IM for this component
   *
   * @param {IntersectionMatrix}
   *          im
   * @protected
   */
  jsts.geomgraph.GraphComponent.prototype.computeIM = function(im) {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * An isolated component is one that does not intersect or touch any other
   * component. This is the case if the label has valid locations for only a
   * single Geometry.
   *
   * @return true if this component is isolated.
   */
  jsts.geomgraph.GraphComponent.prototype.isIsolated = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * Update the IM with the contribution for this component. A component only
   * contributes if it has a labelling for both parent geometries
   *
   * @param {IntersectionMatrix}
   *          im
   */
  jsts.geomgraph.GraphComponent.prototype.updateIM = function(im) {
    Assert.isTrue(this.label.getGeometryCount() >= 2, 'found partial label');
    this.computeIM(im);
  };

})();
