/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiLineString = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.MultiLineString.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiLineString.constructor = jsts.geom.MultiLineString;

  jsts.geom.MultiLineString.prototype.getBoundary = function() {
    return (new jsts.operation.BoundaryOp(this)).getBoundary();
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiLineString.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiLineString.prototype.CLASS_NAME = 'jsts.geom.MultiLineString';

})();
