/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryCollection.js
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiPoint = function(points, factory) {
    this.geometries = points || [];
    this.factory = factory;
  };

  jsts.geom.MultiPoint.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiPoint.constructor = jsts.geom.MultiPoint;



  /**
   * Gets the boundary of this geometry. Zero-dimensional geometries have no
   * boundary by definition, so an empty GeometryCollection is returned.
   *
   * @return {Geometry} an empty GeometryCollection.
   * @see Geometry#getBoundary
   */
  jsts.geom.MultiPoint.prototype.getBoundary = function() {
    return this.getFactory().createGeometryCollection(null);
  };

  jsts.geom.MultiPoint.prototype.getGeometryN = function(n) {
    return this.geometries[n];
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiPoint.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiPoint.prototype.CLASS_NAME = 'jsts.geom.MultiPoint';

})();
